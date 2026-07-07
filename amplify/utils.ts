export const app_name = "virtual-company";

export const isSandbox = !process.env.AWS_BRANCH;

export const envSuffix = isSandbox ? "-dev" : "";

export const dynamodb_table_name = `${app_name}${envSuffix}`;

export const custom_group_resources_name = "Custom-Resources";

export const app_domain = isSandbox
  ? "http://localhost:5173"
  : "https://main.d3tm84kkwwupqg.amplifyapp.com/";

export const auth_domain_prefix = `${app_name}${envSuffix}`;
