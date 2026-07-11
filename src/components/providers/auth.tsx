/* eslint-disable react-refresh/only-export-components */
import {
  fetchAuthSession,
  getCurrentUser,
  signIn,
  signOut,
} from "aws-amplify/auth"
import { Hub } from "aws-amplify/utils"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

interface AuthUser {
  username: string
  userId: string
}

interface IAuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  signIn: (username: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function checkAuthState() {
      try {
        const currentUser = await getCurrentUser()
        await fetchAuthSession()
        setUser({
          username: currentUser.username,
          userId: currentUser.userId,
        })
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthState()

    const hubListener = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
          checkAuthState()
          break
        case "signedOut":
          setUser(null)
          break
        case "tokenRefresh_failure":
          setUser(null)
          break
      }
    })

    return () => hubListener()
  }, [])

  const handleSignIn = useCallback(
    async (username: string, password: string) => {
      try {
        setIsLoading(true)
        const res = await signIn({ username, password })

        if (res.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
          navigate("/confirm-account")
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Sign in failed")
      } finally {
        setIsLoading(false)
      }
    },
    [navigate]
  )

  const handleSignOut = useCallback(async () => {
    await signOut()
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: !!user,
      isLoading,
      user,
      signIn: handleSignIn,
      signOut: handleSignOut,
    }),
    [user, isLoading, handleSignIn, handleSignOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}
