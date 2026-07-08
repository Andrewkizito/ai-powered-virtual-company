import type { APIGatewayProxyResult } from "aws-lambda"
import { app_name } from "../../utils"

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
