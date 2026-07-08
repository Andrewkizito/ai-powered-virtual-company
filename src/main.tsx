import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { AuthProvider } from "react-oidc-context"
import { Amplify } from "aws-amplify"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router"
import { cognitoAuthConfig, onSignIn } from "./lib/auth.ts"
import outputs from "../amplify_outputs.json"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: outputs.auth.user_pool_id,
      userPoolClientId: outputs.auth.user_pool_client_id,
      loginWith: {
        email: true,
      },
    },
  },
  Storage: {
    S3: {
      bucket: outputs.storage.bucket_name,
      region: outputs.auth.aws_region,
    },
  },
  API: {
    REST: {
      main: {
        endpoint: outputs.custom.API.main.endpoint,
        region: outputs.custom.API.main.region,
      },
    },
  },
})

console.log(Amplify.getConfig())

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider {...cognitoAuthConfig} onSigninCallback={onSignIn}>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
