import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { Construct } from "constructs"
import { app_domain, app_name } from "../utils"
import { IUserPool } from "aws-cdk-lib/aws-cognito"
import { initAuthApiResource, type AuthApiLambdas } from "./auth"
import { initInventoryApiResource, type InventoryApiLambdas } from "./inventory"

export const initRestApi = (
  params: {
    scope: Construct
    userPool: IUserPool
    dbTable: dynamodb.Table
  } & InventoryApiLambdas & AuthApiLambdas
) => {
  const { scope, userPool, dbTable, ...domainLambdas } = params
  const restApi = new apigateway.RestApi(scope, "api", {
    restApiName: `${app_name}`,
    description: "Rest api for this ecommerce site",
    defaultCorsPreflightOptions: {
      allowOrigins: [app_domain],
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
    },
  })

  const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
    restApi,
    "cognitoAuthorizer",
    {
      cognitoUserPools: [userPool],
      authorizerName: "cognito",
      identitySource: apigateway.IdentitySource.header("Authorization"),
    }
  )

  initInventoryApiResource({ restApi, dbTable, cognitoAuthorizer, ...domainLambdas })
  initAuthApiResource({ restApi, dbTable, cognitoAuthorizer, ...domainLambdas })

  return restApi
}
