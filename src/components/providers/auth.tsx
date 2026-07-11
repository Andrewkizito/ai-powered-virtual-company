/* eslint-disable react-refresh/only-export-components */
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth"
import { Hub } from "aws-amplify/utils"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"

interface AuthUser {
  username: string
  userId: string
}

interface IAuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  signIn: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleSignIn = useCallback(() => {}, [])

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
