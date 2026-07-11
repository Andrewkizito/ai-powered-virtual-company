import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/components/providers/theme.tsx"
import { Amplify } from "aws-amplify"
import { BrowserRouter } from "react-router"
import { Toaster } from "sonner"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
import outputs from "../amplify_outputs.json"
import App from "./App.tsx"
import "./index.css"
import { AuthProvider } from "@/components/providers/auth"
import { makeStore } from "./store"

Amplify.configure(outputs)

const store = makeStore()
const persistor = persistStore(store)

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AuthProvider>
            <ThemeProvider>
              <App />
              <Toaster richColors />
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </StrictMode>
)
