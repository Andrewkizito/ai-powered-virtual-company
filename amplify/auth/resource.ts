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
    email: true,
  },
  triggers: {
    postConfirmation: postConfirmation,
  },
  groups: [AuthGroups.Admin, AuthGroups.User],
  access: (allow) => [allow.resource(postConfirmation).to(["addUserToGroup"])],
})

export const initAuth = (params: {
  userPool: CfnUserPool
  userPoolClient: CfnUserPoolClient
}) => {
  params.userPool.adminCreateUserConfig = {
    allowAdminCreateUserOnly: true,
    inviteMessageTemplate: {
      emailSubject: inviteEmailSubject,
      emailMessage: inviteEmailMessage,
    },
  }

  params.userPool.autoVerifiedAttributes = ["email"]

  params.userPool.emailVerificationSubject = verificationEmailSubject
  params.userPool.emailVerificationMessage = verificationEmailMessage

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
