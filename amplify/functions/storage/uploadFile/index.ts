import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers"
import { APIGatewayProxyHandler } from "aws-lambda"
import { err, ok, parseJwt } from "../../shared/api"

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!process.env.COGNITO_IDENTITY_POOL_ID) {
    return err("Cognito Identity Pool ID is not set")
  }

  if (!process.env.COGNITO_USER_POOL_ID) {
    return err("Cognito User Pool ID is not set")
  }

  const token = event.headers["Authorization"]
  if (!token) {
    return err("Authorization token is missing")
  }

  console.log(token)

  if (!parseJwt(token)) {
    return err("Invalid token")
  }

  const credentialsProvider = fromCognitoIdentityPool({
    clientConfig: { region: process.env.AWS_REGION },
    identityPoolId: process.env.COGNITO_IDENTITY_POOL_ID || "",
    logins: {
      [`cognito-idp.us-east-1.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}`]:
        token,
    },
  })

  const awsCredentials = await credentialsProvider()
  console.log({ awsCredentials })

  return ok("Credentials are set successfully")
}
