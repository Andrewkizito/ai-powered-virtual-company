import { defineAuth } from "@aws-amplify/backend"
import { CfnUserPool, CfnUserPoolClient } from "aws-cdk-lib/aws-cognito"
import { Construct } from "constructs"
import { postConfirmation } from "../functions/index"
import { app_name, AuthGroups, envSuffix } from "../utils"
import {
  inviteEmailMessage,
  inviteEmailSubject,
  verificationEmailMessage,
  verificationEmailSubject,
} from "./messaging"

export const auth = defineAuth({
  name: `${app_name}-auth-${envSuffix}`,
  loginWith: {
    email: {
      verificationEmailSubject,
      verificationEmailBody(createCode: () => string) {
        const code = createCode()
        return verificationEmailMessage.replace("{####}", code)
      },
    },
  },
  triggers: {
    postConfirmation: postConfirmation,
  },
  groups: [AuthGroups.Admin, AuthGroups.User],
  userAttributes: {
    fullname: {
      mutable: true,
      required: true,
    },
  },
  multifactor: {
    mode: "OPTIONAL",
    totp: true,
  },
  access: (allow) => [allow.resource(postConfirmation).to(["addUserToGroup"])],
})

export const initAuth = (params: {
  scope: Construct
  userPool: CfnUserPool
  userPoolClient: CfnUserPoolClient
}) => {
  params.userPool.adminCreateUserConfig = {
    inviteMessageTemplate: {
      emailSubject: inviteEmailSubject,
      emailMessage: inviteEmailMessage,
    },
  }

  params.userPool.autoVerifiedAttributes = ["email"]
}
