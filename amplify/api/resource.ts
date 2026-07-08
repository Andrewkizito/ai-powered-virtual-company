import * as apigateway from "aws-cdk-lib/aws-apigateway"
import { Construct } from "constructs"
import { app_domain, app_name } from "../utils"
import { IUserPool } from "aws-cdk-lib/aws-cognito"

export const initRestApi = (params: {
  scope: Construct
  userPool: IUserPool
}) => {
  const restApi = new apigateway.RestApi(params.scope, "api", {
    restApiName: `${app_name}`,
    description: "Rest api for this ecommerce site",
    defaultCorsPreflightOptions: {
      allowOrigins: [app_domain],
      allowMethods: apigateway.Cors.ALL_METHODS,
      allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
    },
  })

  // const cognitoAuthorizer = new apigateway.CognitoUserPoolsAuthorizer(
  //   restApi,
  //   "cognitoAuthorizer",
  //   {
  //     cognitoUserPools: [params.userPool],
  //     authorizerName: "cognito",
  //     identitySource: apigateway.IdentitySource.header("Authorization"),
  //   }
  // )

  const rootResource = restApi.root.addResource("inventory")
  rootResource.addMethod("GET", new apigateway.MockIntegration())

  return restApi
}
