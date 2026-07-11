import { defineStorage } from "@aws-amplify/backend"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"
import {
  app_name,
  dynamodb_table_index_01,
  dynamodb_table_name,
  envSuffix,
} from "../utils"
import { RemovalPolicy } from "aws-cdk-lib"
import { onUpload, onDelete, uploadFile } from "../functions/index"

export const s3Storage = defineStorage({
  name: `${app_name}-media-files${envSuffix}`,
  access: (allow) => ({
    "public/*": [
      allow.guest.to(["read"]),
      allow.authenticated.to(["read", "write", "delete"]),
      allow.resource(uploadFile).to(["write"]),
    ],
    "protected/{entity_id}/*": [
      allow.authenticated.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
      allow.resource(uploadFile).to(["write"]),
    ],
    "private/{entity_id}/*": [
      allow.entity("identity").to(["read", "write", "delete"]),
      allow.resource(uploadFile).to(["write"]),
    ],
  }),
  keepOnDelete: false,
  isDefault: true,
  triggers: {
    onUpload,
    onDelete,
  },
})

export const initDynamoDb = (scope: Construct): dynamodb.Table => {
  const table = new dynamodb.Table(scope, "dynamo-db-storage", {
    tableName: dynamodb_table_name,
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    partitionKey: {
      name: "PK",
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "SK",
      type: dynamodb.AttributeType.STRING,
    },
    timeToLiveAttribute: "TTL",
    removalPolicy: RemovalPolicy.DESTROY,
  })

  table.addGlobalSecondaryIndex({
    indexName: dynamodb_table_index_01,
    partitionKey: {
      name: "SK",
      type: dynamodb.AttributeType.STRING,
    },
    sortKey: {
      name: "PK",
      type: dynamodb.AttributeType.STRING,
    },
    projectionType: dynamodb.ProjectionType.ALL,
  })

  return table
}
