import { useAuth } from "react-oidc-context"
import Welcome from "../../use-cases/auth/auth-guard/welcome"

const AuthGuard = () => {
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return null
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
      <Welcome />
    </main>
  )
}

export default AuthGuard
