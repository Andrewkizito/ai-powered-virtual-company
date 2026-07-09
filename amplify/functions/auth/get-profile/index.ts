import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Partitions } from "../../shared/types"
import { err, ok, requireAdmin } from "../../shared/api"

const dbClient = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(dbClient)

export const handler: APIGatewayProxyHandler = async (event) => {
  const forbidden = requireAdmin(event)
  if (forbidden) return forbidden

  const tableName = process.env.STORAGE_DATABASE_NAME

  if (!tableName) {
    return err("Missing STORAGE_DATABASE_NAME")
  }

  const sub = event.requestContext.authorizer?.claims?.sub

  if (!sub) {
    return err("Unauthorized", 401)
  }

  try {
    const result = await db.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `${Partitions.User}#${sub}`,
        },
      })
    )

    const items = result.Items ?? []

    const profile = items.find((i) => i.SK === Partitions.User)
    const cart = items.find((i) => i.SK === Partitions.Cart)

    return ok({
      profile: profile?.details ?? null,
      cart: cart?.details ?? null,
    })
  } catch (error) {
    console.error("Error in handler:", error)
    return err("Internal Server Error")
  }
}
