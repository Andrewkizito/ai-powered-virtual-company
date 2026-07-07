import type { PostConfirmationTriggerHandler } from "aws-lambda"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb"
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import { Partitions, type UserItem } from "../shared/types"
import { AuthGroups } from "../../utils"

const client = new DynamoDBClient({})
const db = DynamoDBDocumentClient.from(client)
const cognito = new CognitoIdentityProviderClient({})

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const tableName = process.env.STORAGE_DATABASE_NAME

  if (!tableName) {
    console.error("Missing STORAGE_DATABASE_NAME")
    return event
  }

  const { sub, email, email_verified, name, phone_number } =
    event.request.userAttributes

  const item: UserItem = {
    PK: `${Partitions.Users}#${sub}`,
    SK: "Details",
    details: {
      sub,
      email,
      emailVerified: email_verified ?? "false",
      name: name ?? "",
      phoneNumber: phone_number ?? "",
    },
  }

  try {
    await db.send(new PutCommand({ TableName: tableName, Item: item }))
  } catch (error) {
    console.error("Failed to create user record:", error)
  }

  try {
    await cognito.send(
      new AdminAddUserToGroupCommand({
        UserPoolId: event.userPoolId,
        Username: sub,
        GroupName: AuthGroups.User,
      })
    )
  } catch (error) {
    console.error("Failed to add user to group:", error)
  }

  return event
}
