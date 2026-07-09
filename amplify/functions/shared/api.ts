import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda"
import { app_name, AuthGroups } from "../../utils"

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
