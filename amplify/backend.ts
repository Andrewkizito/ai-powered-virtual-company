import { defineBackend } from "@aws-amplify/backend"
import { auth, initAuth } from "./auth/resource"
import { initDynamoDb, s3Storage } from "./storage/resource"
import {
  addInventory,
  deleteInventory,
  getInventory,
  getProfile,
  postConfirmation,
  onUpload,
  onDelete,
  uploadFile,
} from "./functions"
import { app_name, auth_domain_prefix, envSuffix } from "./utils"
import { initRestApi } from "./api/resource"
import { Stack } from "aws-cdk-lib"

const backend = defineBackend({
  auth,
  storage: s3Storage,
  postConfirmation,
  addInventory,
  deleteInventory,
  getInventory,
  getProfile,
  onUpload,
  onDelete,
  uploadFile,
})

initAuth({
  scope: backend.auth.stack,
  userPool: backend.auth.resources.cfnResources.cfnUserPool,
  userPoolClient: backend.auth.resources.cfnResources.cfnUserPoolClient,
})

// Database
const databaseStack = backend.createStack("Database")
const dbTable = initDynamoDb(databaseStack)

// Enforce bucket name to avoid auto generated names
backend.storage.resources.cfnResources.cfnBucket.bucketName = `${app_name}-media-files-${envSuffix}`
dbTable.grantWriteData(backend.postConfirmation.resources.lambda)
dbTable.grantReadWriteData(backend.onUpload.resources.lambda)
dbTable.grantReadWriteData(backend.onDelete.resources.lambda)

backend.uploadFile.addEnvironment(
  "COGNITO_IDENTITY_POOL_ID",
  backend.auth.resources.identityPoolId
)
backend.uploadFile.addEnvironment(
  "COGNITO_USER_POOL_ID",
  backend.auth.resources.userPool.userPoolId
)

// Rest API
const restApiStack = backend.createStack("restApi")

const restApi = initRestApi({
  scope: restApiStack,
  userPool: backend.auth.resources.userPool,
  dbTable,
  addInventoryLambda: backend.addInventory.resources.lambda,
  deleteInventoryLambda: backend.deleteInventory.resources.lambda,
  getInventoryLambda: backend.getInventory.resources.lambda,
  getProfileLambda: backend.getProfile.resources.lambda,
  uploadFileLambda: backend.uploadFile.resources.lambda,
})

backend.addOutput({
  custom: {
    cognito_auth_domain: `https://${auth_domain_prefix}.auth.${Stack.of(backend.stack).region}.amazoncognito.com`,
    API: {
      main: {
        endpoint: restApi.url,
        region: Stack.of(restApiStack).region,
        apiName: restApi.restApiName,
      },
    },
  },
})
