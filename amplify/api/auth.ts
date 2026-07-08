import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { IFunction } from "aws-cdk-lib/aws-lambda"

export type AuthApiLambdas = {
  getProfileLambda: IFunction
}

export const initAuthApiResource = (
  params: {
    restApi: apigateway.RestApi
    dbTable: dynamodb.Table
    cognitoAuthorizer: apigateway.CognitoUserPoolsAuthorizer
  } & AuthApiLambdas
) => {
  const { restApi, dbTable, cognitoAuthorizer, getProfileLambda } = params

  dbTable.grantReadData(getProfileLambda)

  const profile = restApi.root.addResource("profile")
  profile.addMethod("GET", new apigateway.LambdaIntegration(getProfileLambda), {
    authorizationType: apigateway.AuthorizationType.COGNITO,
    authorizer: cognitoAuthorizer,
  })
}
