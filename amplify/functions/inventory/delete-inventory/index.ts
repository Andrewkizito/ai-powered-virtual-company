import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  DeleteCommand,
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

  try {
    const result = await db.send(
      new DeleteCommand({
        TableName: tableName,
        Key: {
          PK: `${Partitions.Inventory}#${id}`,
          SK: "Inventory",
        },
        ReturnValues: "ALL_OLD",
      })
    )

    if (!result.Attributes) {
      return err(`Inventory item with id '${id}' not found`, 404)
    }

    return ok({ message: `Inventory item '${id}' deleted` })
  } catch (error) {
    console.error("Error in handler:", error)
    return err("Internal Server Error")
  }
}
