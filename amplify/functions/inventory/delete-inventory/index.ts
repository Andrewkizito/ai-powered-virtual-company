import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Partitions } from "../../shared/types"
import { err, ok } from "../../shared/api"

const dbClient = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(dbClient)

export const handler: APIGatewayProxyHandler = async (event) => {
  const tableName = process.env.STORAGE_DATABASE_NAME

  if (!tableName) {
    return err("Missing STORAGE_DATABASE_NAME")
  }

  const id = event.pathParameters?.id

  if (!id) {
    return err("Missing inventory item id", 400)
  }

  const now = new Date().toISOString()

  try {
    await db.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Delete: {
              TableName: tableName,
              Key: {
                PK: Partitions.Inventory,
                SK: `InventoryItem#${id}`,
              },
              ConditionExpression: "attribute_exists(PK)",
            },
          },
          {
            Update: {
              TableName: tableName,
              Key: {
                PK: Partitions.Inventory,
                SK: "Details",
              },
              UpdateExpression:
                "SET details.totalItems = if_not_exists(details.totalItems, :zero) - :dec, details.updatedAt = :now",
              ExpressionAttributeValues: {
                ":zero": 0,
                ":dec": 1,
                ":now": now,
              },
            },
          },
        ],
      })
    )

    return ok({ message: `Inventory item '${id}' deleted` })
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      return err(`Inventory item with id '${id}' not found`, 404)
    }

    console.error("Error in handler:", error)
    return err("Internal Server Error")
  }
}
