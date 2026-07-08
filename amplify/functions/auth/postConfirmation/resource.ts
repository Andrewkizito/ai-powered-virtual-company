import { defineFunction } from "@aws-amplify/backend"
import { app_name, dynamodb_table_name, envSuffix } from "../../../utils"

export const postConfirmation = defineFunction({
  name: `${app_name}-postConfirmation${envSuffix}`,
  entry: "./index.ts",
  environment: {
    STORAGE_DATABASE_NAME: dynamodb_table_name,
  },
  resourceGroupName: "auth",
})
