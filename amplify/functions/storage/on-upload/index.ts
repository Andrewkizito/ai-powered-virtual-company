import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  TransactGetCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb"
import { S3CreateEvent } from "aws-lambda"
import { FileItem, FilesLedgerItem, Partitions } from "../../shared/types"
import moment from "moment-timezone"

const dbClient = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(dbClient)

export const handler = async (event: S3CreateEvent) => {
  const tableName = process.env.STORAGE_DATABASE_NAME

  if (!tableName) {
    console.error("Missing STORAGE_DATABASE_NAME")
    return
  }

  for (const record of event.Records) {
    const uploadedObj = record.s3.object

    const filename = decodeURIComponent(uploadedObj.key.split("/").at(-1) ?? "")

    const parts = filename.split(".")
    const fileId = parts[0]

    const fileType =
      parts.length > 1 ? `.${parts.at(-1)?.toLowerCase()}` : "unknown"

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
     * Fetch file + ledger in one request
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

    const isNewFile = !storedFile

    const previousSize = storedFile?.details?.size ?? 0
    const sizeDelta = uploadedObj.size - previousSize

    if (storedFile && uploadedObj.eTag === storedFile?.details?.etag) {
      console.log("File already exists and has the same etag")
      return null
    }

    const newFile: FileItem = {
      PK: Partitions.Files,
      SK: `File#${fileId}`,
      details: {
        id: fileId,
        name: filename,
        type: fileType,
        path: uploadedObj.key,
        size: uploadedObj.size,
        createdAt: now,
        updatedAt: null,
        etag: uploadedObj.eTag,
      },
    }

    const ledgerUpdate = storedLedger
      ? {
          Update: {
            TableName: tableName,
            Key: ledgerKey,
            UpdateExpression: isNewFile
              ? "SET #updatedAt = :updatedAt ADD #totalFiles :files, #totalSize :size"
              : "SET #updatedAt = :updatedAt ADD #totalSize :size",
            ExpressionAttributeNames: {
              "#updatedAt": "updatedAt",
              "#totalFiles": "totalFiles",
              "#totalSize": "totalSize",
            },
            ExpressionAttributeValues: {
              ":updatedAt": now,
              ":files": 1,
              ":size": sizeDelta,
            },
          },
        }
      : {
          Put: {
            TableName: tableName,
            Item: {
              PK: Partitions.Files,
              SK: "Details",
              details: {
                totalFiles: 1,
                totalSize: uploadedObj.size,
                updatedAt: now,
              },
            } satisfies FilesLedgerItem,
          },
        }

    const fileOperation = storedFile
      ? {
          Update: {
            TableName: tableName,
            Key: fileKey,
            UpdateExpression:
              "SET #details.#size = :size, #details.#updatedAt = :updatedAt",
            ExpressionAttributeNames: {
              "#details": "details",
              "#size": "size",
              "#updatedAt": "updatedAt",
            },
            ExpressionAttributeValues: {
              ":size": uploadedObj.size,
              ":updatedAt": now,
            },
          },
        }
      : {
          Put: {
            TableName: tableName,
            Item: newFile,
          },
        }

    /**
     * Commit file + ledger atomically
     */
    await db.send(
      new TransactWriteCommand({
        TransactItems: [fileOperation, ledgerUpdate],
      })
    )

    console.log(
      JSON.stringify({
        message: "Processed file",
        fileId,
        newFile: isNewFile,
        sizeDelta,
      })
    )
  }

  return "Processed files"
}
