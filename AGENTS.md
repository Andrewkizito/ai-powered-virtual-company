# Lambda + API Gateway Setup

## 1. Create the function

```
amplify/functions/<name>/
├── index.ts       # handler logic
├── resource.ts    # defineFunction config
└── schema.ts      # (optional) Zod schemas
```

**`resource.ts`** pattern:
```ts
import { defineFunction } from "@aws-amplify/backend";
import { app_name, dynamodb_table_name, envSuffix } from "../../utils";

export const myFunc = defineFunction({
  name: `${app_name}-myFunc${envSuffix}`,
  entry: "./index.ts",
  environment: { STORAGE_DATABASE_NAME: dynamodb_table_name },
});
```

## 2. Register in `amplify/backend.ts`

```ts
import { myFunc } from "./functions/<name>/resource"

const backend = defineBackend({
  ...
  myFunc,
})

dbTable.grantWriteData(backend.myFunc.resources.lambda)
```

## 3. Wire API Gateway in `amplify/api/resource.ts`

Add `IFunction` param to `initRestApi`, create a `LambdaIntegration`, add method:

```ts
import { IFunction } from "aws-cdk-lib/aws-lambda"

export const initRestApi = (params: {
  ...
  myFuncLambda: IFunction
}) => {
  ...
  resource.addMethod("POST", new apigateway.LambdaIntegration(params.myFuncLambda))
}
```

Pass the Lambda from `backend.ts`:
```ts
initRestApi({
  ...
  myFuncLambda: backend.myFunc.resources.lambda,
})
```

## Shared API helpers

Use `ok(data, statusCode?)` and `err(message, statusCode?, extra?)` from `shared/api.ts` for consistent responses.
