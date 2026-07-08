import { defineBackend } from "@aws-amplify/backend"
import { auth, initAuth } from "./auth/resource"
import { initDynamoDb, s3Storage } from "./storage/resource"
import { postConfirmation } from "./functions/postConfirmation/resource"
import { app_name, auth_domain_prefix, envSuffix } from "./utils"

const backend = defineBackend({
  auth,
  storage: s3Storage,
  postConfirmation,
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

backend.addOutput({
  custom: {
    cognito_auth_domain: `https://${auth_domain_prefix}.auth.${process.env.AWS_REGION}.amazoncognito.com`,
  },
})
