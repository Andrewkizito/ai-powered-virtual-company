import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { APIGatewayProxyHandler } from "aws-lambda"
import { Partitions } from "../../shared/types"
import type { InventoryLedgerDetails } from "../../shared/types"
import { err, ok, requireAdmin } from "../../shared/api"
import { decodeNextKey, encodeNextKey } from "../../shared/common"

const dbClient = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(dbClient)

const DEFAULT_PAGE_SIZE = 20
const MAX_PAGE_SIZE = 100

export const handler: APIGatewayProxyHandler = async (event) => {
  const forbidden = requireAdmin(event)
  if (forbidden) return forbidden

  const tableName = process.env.STORAGE_DATABASE_NAME

  if (!tableName) {
    return err("Missing STORAGE_DATABASE_NAME")
  }

  const query = event.queryStringParameters ?? {}

  const limit = Math.min(
    Math.max(Number(query.limit) || DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE
  )

  const nextKey = decodeNextKey(query.nextKey)

  try {
    const [itemsResult, ledgerResult] = await Promise.all([
      db.send(
        new QueryCommand({
          TableName: tableName,
          KeyConditionExpression: "PK = :pk AND begins_with(SK, :prefix)",
          ExpressionAttributeValues: {
            ":pk": Partitions.Inventory,
            ":prefix": "InventoryItem#",
          },
          Limit: limit,
          ExclusiveStartKey: nextKey,
        })
      ),
      db.send(
        new GetItemCommand({
          TableName: tableName,
          Key: {
            PK: { S: Partitions.Inventory },
            SK: { S: "Details" },
          },
        })
      ),
    ])

    const ledger = ledgerResult.Item?.details
      ? (ledgerResult.Item.details as unknown as InventoryLedgerDetails)
      : null

    return ok({
      data: itemsResult.Items ?? [],
      metadata: {
        limit,
        nextKey: encodeNextKey(itemsResult.LastEvaluatedKey),
        totalItems: ledger?.totalItems ?? 0,
      },
    })
  } catch (error) {
    console.error("Error in handler:", error)
    return err("Internal Server Error")
  }
}
