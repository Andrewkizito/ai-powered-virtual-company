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

Amplify.configure(outputs)

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
