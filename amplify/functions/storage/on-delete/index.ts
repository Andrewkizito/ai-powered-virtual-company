import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  TransactGetCommand,
  TransactWriteCommand,
  TransactWriteCommandInput,
} from "@aws-sdk/lib-dynamodb"
import { S3Event } from "aws-lambda"
import { Partitions } from "../../shared/types"
import moment from "moment-timezone"

const dbClient = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(dbClient)

export const handler = async (event: S3Event) => {
  const tableName = process.env.STORAGE_DATABASE_NAME

  if (!tableName) {
    console.error("Missing STORAGE_DATABASE_NAME")
    return
  }

  for (const record of event.Records) {
    const objectKey = decodeURIComponent(record.s3.object.key)

    const filename = objectKey.split("/").at(-1) ?? ""
    const fileId = filename.split(".")[0]

    const now = moment().utc().toISOString()

    const fileKey = {
      PK: Partitions.Files,
      SK: `File#${fileId}`,
    }

    const ledgerKey = {
      PK: Partitions.Files,
      SK: "Details",
    }

    /**
     * Get file + ledger in one request
     */
    const result = await db.send(
      new TransactGetCommand({
        TransactItems: [
          {
            Get: {
              TableName: tableName,
              Key: fileKey,
            },
          },
          {
            Get: {
              TableName: tableName,
              Key: ledgerKey,
            },
          },
        ],
      })
    )

    const storedFile = result.Responses?.[0]?.Item
    const storedLedger = result.Responses?.[1]?.Item

    /**
     * Already deleted / duplicate event
     */
    if (!storedFile) {
      console.log(`File ${fileId} does not exist, skipping`)
      continue
    }

    const deletedSize = storedFile.details.size

    /**
     * Delete file + update ledger atomically
     */
    const transactItems: TransactWriteCommandInput["TransactItems"] = [
      {
        Delete: {
          TableName: tableName,
          Key: fileKey,
        },
      },
    ]

    if (storedLedger) {
      transactItems.push({
        Update: {
          TableName: tableName,
          Key: ledgerKey,
          UpdateExpression:
            "SET #details.#updatedAt = :updatedAt ADD #details.#totalFiles :files, #details.#totalSize :size",
          ExpressionAttributeNames: {
            "#details": "details",
            "#updatedAt": "updatedAt",
            "#totalFiles": "totalFiles",
            "#totalSize": "totalSize",
          },
          ExpressionAttributeValues: {
            ":updatedAt": now,
            ":files": -1,
            ":size": -deletedSize,
          },
        },
      })
    }

    await db.send(
      new TransactWriteCommand({
        TransactItems: transactItems,
      })
    )

    console.log(
      JSON.stringify({
        message: "Deleted file",
        fileId,
        sizeRemoved: deletedSize,
      })
    )
  }

  return "Processed deletes"
}
