import { defineFunction } from "@aws-amplify/backend"
import { app_name, dynamodb_table_name, envSuffix } from "../../../utils"

export const addInventory = defineFunction({
  name: `${app_name}-addInventory-${envSuffix}`,
  entry: "./index.ts",
  environment: {
    STORAGE_DATABASE_NAME: dynamodb_table_name,
  },
})
