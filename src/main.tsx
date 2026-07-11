import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/components/providers/theme.tsx"
import { Amplify } from "aws-amplify"
import { BrowserRouter } from "react-router"
import { Toaster } from "sonner"
import outputs from "../amplify_outputs.json"
import App from "./App.tsx"
import "./index.css"
import { AuthProvider } from "@/components/providers/auth"

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: outputs.auth.user_pool_id,
      userPoolClientId: outputs.auth.user_pool_client_id,
      identityPoolId: outputs.auth.identity_pool_id,
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <App />
          <Toaster richColors />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
