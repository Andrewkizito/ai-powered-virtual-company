import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { IFunction } from "aws-cdk-lib/aws-lambda"

export type InventoryApiLambdas = {
  addInventoryLambda: IFunction
  deleteInventoryLambda: IFunction
  getInventoryLambda: IFunction
}

export const initInventoryApiResource = (
  params: {
    restApi: apigateway.RestApi
    dbTable: dynamodb.Table
    cognitoAuthorizer: apigateway.CognitoUserPoolsAuthorizer
  } & InventoryApiLambdas
) => {
  const {
    restApi,
    dbTable,
    cognitoAuthorizer,
    addInventoryLambda,
    deleteInventoryLambda,
    getInventoryLambda,
  } = params

  dbTable.grantWriteData(addInventoryLambda)
  dbTable.grantWriteData(deleteInventoryLambda)
  dbTable.grantReadData(getInventoryLambda)

  const rootResource = restApi.root.addResource("inventory")
  rootResource.addMethod(
    "GET",
    new apigateway.LambdaIntegration(getInventoryLambda),
    {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    }
  )
  rootResource.addMethod(
    "POST",
    new apigateway.LambdaIntegration(addInventoryLambda),
    {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    }
  )

  const inventoryItem = rootResource.addResource("{id}")
  inventoryItem.addMethod(
    "DELETE",
    new apigateway.LambdaIntegration(deleteInventoryLambda),
    {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    }
  )
}
