import { defineAuth } from "@aws-amplify/backend";
import {
  CfnUserPool,
  CfnUserPoolClient,
  ManagedLoginVersion,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";
import { postConfirmation } from "../functions/postConfirmation/resource";
import { app_domain, app_name, auth_domain_prefix, envSuffix } from "../utils";
import {
  inviteEmailMessage,
  inviteEmailSubject,
  verificationEmailMessage,
  verificationEmailSubject,
} from "./messaging";

export const AuthGroup = {
  SuperAdmin: `super-admin${envSuffix}`,
  SeoManager: `seo-manager${envSuffix}`,
  Editors: `editors${envSuffix}`,
} as const;

export const auth = defineAuth({
  name: `${app_name}-cms-auth${envSuffix}`,
  loginWith: {
    email: true,
  },
  triggers: {
    postConfirmation: postConfirmation,
  },
});

export const initAuth = (params: {
  userPool: CfnUserPool;
  userPoolClient: CfnUserPoolClient;
}) => {
  params.userPool.adminCreateUserConfig = {
    allowAdminCreateUserOnly: true,
    inviteMessageTemplate: {
      emailSubject: inviteEmailSubject,
      emailMessage: inviteEmailMessage,
    },
  };

  params.userPool.autoVerifiedAttributes = ["email"];

  params.userPool.emailVerificationSubject = verificationEmailSubject;
  params.userPool.emailVerificationMessage = verificationEmailMessage;

  params.userPoolClient.callbackUrLs = [app_domain];
  params.userPoolClient.logoutUrLs = [app_domain];

  new UserPoolDomain(params.userPool, "userpool-domain", {
    userPool: params.userPool,
    cognitoDomain: {
      domainPrefix: auth_domain_prefix,
    },
    managedLoginVersion: ManagedLoginVersion.NEWER_MANAGED_LOGIN,
  });
};
