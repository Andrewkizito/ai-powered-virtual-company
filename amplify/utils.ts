export const app_name = "virtual-company"

export const isSandbox = !process.env.AWS_BRANCH

export const aws_branch = isSandbox ? "local" : process.env.AWS_BRANCH

export const envSuffix = aws_branch

export const dynamodb_table_name = `${app_name}-${envSuffix}`
export const dynamodb_table_index_01 = "index-01"

export const custom_group_resources_name = "Custom-Resources"

export const app_domain = isSandbox
  ? "http://localhost:5173"
  : `https://${aws_branch}.${process.env.AWS_APP_ID}.amplifyapp.com/`

export const auth_domain_prefix = `${app_name}-${envSuffix}`

export const AuthGroups = {
  Admin: "admin",
  User: "user",
} as const
