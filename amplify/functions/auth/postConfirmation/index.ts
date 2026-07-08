import type { PostConfirmationTriggerHandler } from "aws-lambda"
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import {
  DynamoDBDocumentClient,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb"
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider"
import { AuthGroups } from "../../../utils"
import { type CartItem, type UserItem, Partitions } from "../../shared/types"

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

  const userItem: UserItem = {
    PK: `${Partitions.Users}#${sub}`,
    SK: "User",
    details: {
      sub,
      email,
      emailVerified: email_verified ?? "false",
      name: name ?? "",
      phoneNumber: phone_number ?? "",
    },
  }

  const cartItem: CartItem = {
    PK: `${Partitions.Users}#${sub}`,
    SK: "Cart",
    details: {
      items: [],
    },
  }

  try {
    await db.send(
      new TransactWriteCommand({
        TransactItems: [
          {
            Put: {
              TableName: tableName,
              Item: userItem,
              ConditionExpression: "attribute_not_exists(PK)",
            },
          },
          {
            Put: {
              TableName: tableName,
              Item: cartItem,
              ConditionExpression: "attribute_not_exists(PK)",
            },
          },
        ],
      })
    )
  } catch (error) {
    console.error("Failed to create user and cart records:", error)
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
