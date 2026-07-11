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

Amplify.configure(outputs)

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
