import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"
import { z } from "zod"
import {
  type InventoryItem,
  type InventoryItemDetails,
  InventoryItemStatus,
  Partitions,
} from "../../shared/types"
import { err, ok } from "../../shared/api"
import { AddInventorySchema, type AddInventoryBody } from "./schema"

const dbClient = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(dbClient)

export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.STORAGE_DATABASE_NAME

  if (!tableName) {
    return err("Missing STORAGE_DATABASE_NAME")
  }

  let parsed: AddInventoryBody

  try {
    parsed = AddInventorySchema.parse(JSON.parse(event.body ?? "{}"))
  } catch (error) {
    if (error instanceof z.ZodError) {
      return err("Validation failed", 400, { errors: error.issues })
    }

    return err("Invalid JSON body", 400)
  }

  const { id, name, description, spec, stock, rules } = parsed

  const now = new Date().toISOString()

  const item: InventoryItem = {
    PK: `${Partitions.Inventory}#${id}`,
    SK: "Inventory",
    details: {
      id,
      name,
      description,
      spec,
      stock: stock ?? 0,
      updatedAt: now,
      createdAt: now,
      status: InventoryItemStatus.pending_inspection,
      rules: rules ?? null,
    } satisfies InventoryItemDetails,
  }

  try {
    await db.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
        ConditionExpression: "attribute_not_exists(PK)",
      })
    )

    return ok(item, 201)
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      return err(`Inventory item with id '${id}' already exists`, 409)
    }

    console.error("Error in handler:", error)

    return err("Internal Server Error")
  }
}
