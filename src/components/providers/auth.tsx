/* eslint-disable react-refresh/only-export-components */
import {
  confirmSignUp,
  confirmResetPassword,
  fetchAuthSession,
  resetPassword,
  getCurrentUser,
  resendSignUpCode,
  signIn,
  signOut,
  signUp,
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
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setAuthenticated } from "@/store/auth/slice"

interface AuthUser {
  username: string
  userId: string
}

type Credentials = {
  email: string
  password: string
  showPassword: boolean
}

interface IAuthContext {
  isAuthenticated: boolean
  isLoading: boolean
  user: AuthUser | null
  pendingUsername: string | null
  credentials: Credentials
  setCredentials: (
    key: keyof Credentials,
    value: Credentials[keyof Credentials]
  ) => void
  signIn: () => Promise<void>
  signUp: (fullname: string) => Promise<void>
  confirmSignUp: (code: string) => Promise<void>
  resendSignUpCode: () => Promise<void>
  forgotPassword: () => Promise<void>
  confirmResetPassword: (code: string, newPassword: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<IAuthContext | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const persistedAuth = useAppSelector((state) => state.auth.isAuthenticated)
  const [isAuthenticated, setIsAuthenticated] = useState(persistedAuth)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [pendingUsername, setPendingUsername] = useState<string | null>(null)
  const [credentials, setCredentialsState] = useState<Credentials>({
    email: "",
    password: "",
    showPassword: false,
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const setCredentials = useCallback(
    (key: keyof Credentials, value: Credentials[keyof Credentials]) => {
      setCredentialsState((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  useEffect(() => {
    async function checkAuthState() {
      try {
        const currentUser = await getCurrentUser()
        console.log(JSON.stringify(currentUser, null, 2))
        await fetchAuthSession()
        setUser({
          username: currentUser.username,
          userId: currentUser.userId,
        })
        setIsAuthenticated(true)
        dispatch(setAuthenticated(true))
      } catch {
        setUser(null)
        setIsAuthenticated(false)
        dispatch(setAuthenticated(false))
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
          setIsAuthenticated(false)
          dispatch(setAuthenticated(false))
          break
        case "tokenRefresh_failure":
          setUser(null)
          setIsAuthenticated(false)
          dispatch(setAuthenticated(false))
          break
      }
    })

    return () => hubListener()
  }, [dispatch])

  const handleSignIn = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await signIn({
        username: credentials.email,
        password: credentials.password,
      })

      if (res.nextStep?.signInStep === "CONFIRM_SIGN_UP") {
        setPendingUsername(credentials.email)
        navigate("/confirm-account")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign in failed")
    } finally {
      setIsLoading(false)
    }
  }, [credentials.email, credentials.password, navigate])

  const handleSignOut = useCallback(async () => {
    await signOut()
  }, [])

  const handleConfirmSignUp = useCallback(
    async (code: string) => {
      if (!pendingUsername) return
      try {
        setIsLoading(true)
        await confirmSignUp({
          username: pendingUsername,
          confirmationCode: code,
        })

        if (credentials.password) {
          await signIn({
            username: pendingUsername,
            password: credentials.password,
          })
          setCredentialsState({ email: "", password: "", showPassword: false })
        } else {
          navigate("/")
        }
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Confirmation failed"
        )
      } finally {
        setIsLoading(false)
      }
    },
    [pendingUsername, credentials.password, navigate]
  )

  const handleResendSignUpCode = useCallback(async () => {
    if (!pendingUsername) return
    try {
      await resendSignUpCode({ username: pendingUsername })
      toast.success("Verification code sent")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend code"
      )
    }
  }, [pendingUsername])

  const handleSignUp = useCallback(
    async (fullname: string) => {
      try {
        setIsLoading(true)
        await signUp({
          username: credentials.email,
          password: credentials.password,
          options: {
            userAttributes: {
              email: credentials.email,
              name: fullname,
            },
          },
        })
        setPendingUsername(credentials.email)
        navigate("/confirm-account")
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Sign up failed")
      } finally {
        setIsLoading(false)
      }
    },
    [credentials.email, credentials.password, navigate]
  )

  const handleForgotPassword = useCallback(async () => {
    try {
      setIsLoading(true)
      await resetPassword({ username: credentials.email })
      setPendingUsername(credentials.email)
      navigate("/reset-password")
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to send reset code"
      )
    } finally {
      setIsLoading(false)
    }
  }, [credentials.email, navigate])

  const handleConfirmResetPassword = useCallback(
    async (code: string, newPassword: string) => {
      if (!pendingUsername) return
      try {
        setIsLoading(true)
        await confirmResetPassword({
          username: pendingUsername,
          confirmationCode: code,
          newPassword,
        })
        toast.success("Password reset successful")
        navigate("/")
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Password reset failed"
        )
      } finally {
        setIsLoading(false)
      }
    },
    [pendingUsername, navigate]
  )

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      pendingUsername,
      credentials,
      setCredentials,
      signIn: handleSignIn,
      signUp: handleSignUp,
      confirmSignUp: handleConfirmSignUp,
      resendSignUpCode: handleResendSignUpCode,
      forgotPassword: handleForgotPassword,
      confirmResetPassword: handleConfirmResetPassword,
      signOut: handleSignOut,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      pendingUsername,
      credentials,
      setCredentials,
      handleSignIn,
      handleSignUp,
      handleConfirmSignUp,
      handleResendSignUpCode,
      handleForgotPassword,
      handleConfirmResetPassword,
      handleSignOut,
    ]
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
