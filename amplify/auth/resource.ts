import { defineAuth } from "@aws-amplify/backend"
import {
  CfnUserPool,
  CfnUserPoolClient,
  ManagedLoginVersion,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito"
import { postConfirmation } from "../functions/postConfirmation/resource"
import {
  app_domain,
  app_name,
  auth_domain_prefix,
  AuthGroups,
  envSuffix,
} from "../utils"
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

  params.userPoolClient.callbackUrLs = [app_domain]
  params.userPoolClient.logoutUrLs = [app_domain]

  new UserPoolDomain(params.userPool, "userpool-domain", {
    userPool: params.userPool,
    cognitoDomain: {
      domainPrefix: auth_domain_prefix,
    },
    managedLoginVersion: ManagedLoginVersion.NEWER_MANAGED_LOGIN,
  })
}
