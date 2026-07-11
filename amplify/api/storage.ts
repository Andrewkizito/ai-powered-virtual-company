import * as apigateway from "aws-cdk-lib/aws-apigateway"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import { IFunction } from "aws-cdk-lib/aws-lambda"

export type StorageApiLambdas = {
  uploadFileLambda: IFunction
}

export const initStorageApiResource = (
  params: {
    restApi: apigateway.RestApi
    dbTable: dynamodb.Table
    cognitoAuthorizer: apigateway.CognitoUserPoolsAuthorizer
  } & StorageApiLambdas
) => {
  const { restApi, dbTable, cognitoAuthorizer, uploadFileLambda } = params

  dbTable.grantWriteData(uploadFileLambda)

  const storage = restApi.root.addResource("storage")
  const upload = storage.addResource("upload")
  upload.addMethod(
    "POST",
    new apigateway.LambdaIntegration(uploadFileLambda),
    {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizer: cognitoAuthorizer,
    }
  )
}
