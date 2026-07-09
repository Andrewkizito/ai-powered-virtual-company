import type { AttributeValue } from "@aws-sdk/client-dynamodb"

export const decodeNextKey = (
  raw: string | undefined
): Record<string, AttributeValue> | undefined => {
  if (!raw) return undefined
  try {
    return JSON.parse(Buffer.from(raw, "base64url").toString("utf-8"))
  } catch {
    return undefined
  }
}

export const encodeNextKey = (
  key: Record<string, AttributeValue> | undefined
): string | null => {
  if (!key) return null
  return Buffer.from(JSON.stringify(key)).toString("base64url")
}
