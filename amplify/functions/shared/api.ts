import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { app_name, AuthGroups } from "../../utils"
import jwt from "jsonwebtoken"

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": app_name,
}

export function ok<T>(data: T, statusCode = 200): APIGatewayProxyResult {
  return {
    statusCode,
    headers,
    body: JSON.stringify(data),
  }
}

export function err(
  message: string,
  statusCode = 500,
  extra?: Record<string, unknown>
): APIGatewayProxyResult {
  return {
    statusCode,
    headers,
    body: JSON.stringify({ message, ...extra }),
  }
}

export const requireAdmin = (event: APIGatewayProxyEvent) => {
  const groups = event.requestContext.authorizer?.claims?.["cognito:groups"]

  if (!groups) {
    return err("Forbidden", 403)
  }

  const groupList = typeof groups === "string" ? groups.split(",") : groups

  if (!groupList.includes(AuthGroups.Admin)) {
    return err("Forbidden", 403)
  }

  return null
}
export interface CognitoIdTokenPayload {
  sub: string
  email: string
  email_verified: boolean
  name: string
  "cognito:username": string
  "cognito:groups"?: string[]
  "cognito:roles"?: string[]
  "cognito:preferred_role"?: string
  iss: string
  aud: string
  token_use: "id"
  auth_time: number
  iat: number
  exp: number
  jti: string
  origin_jti: string
  event_id: string
  at_hash: string
}

export const parseJwt = (token: string): CognitoIdTokenPayload => {
  const decoded = jwt.decode(token) as CognitoIdTokenPayload | null

  console.log(JSON.stringify({ decoded }, null, 2))

  if (!decoded) {
    throw new Error("Invalid token")
  }

  return decoded
}
