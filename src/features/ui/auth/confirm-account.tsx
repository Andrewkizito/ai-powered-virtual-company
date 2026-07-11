import { useState, useEffect, useCallback, useMemo } from "react"
import { useAuth } from "@/components/providers/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { CgSpinner } from "react-icons/cg"
import { Link, Navigate } from "react-router"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

const RESEND_COOLDOWN = 60

function maskEmail(email: string) {
  const [local, domain] = email.split("@")
  if (!local || !domain) return email
  return `${local[0]}***@${domain}`
}

const ConfirmAccount = () => {
  const auth = useAuth()
  const [code, setCode] = useState("")
  const [cooldown, setCooldown] = useState(0)
  const maskedEmail = useMemo(
    () => maskEmail(auth.pendingUsername ?? ""),
    [auth.pendingUsername]
  )

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const handleResend = useCallback(async () => {
    await auth.resendSignUpCode()
    setCooldown(RESEND_COOLDOWN)
    setCode("")
  }, [auth])

  if (!auth.pendingUsername) {
    return <Navigate to="/" replace />
  }

  return (
    <Card className="w-full max-w-105 shadow-lg max-sm:shadow-none!">
      <CardHeader className="items-center space-y-4">
        <img src="/logo.svg" alt="Logo" className="mx-auto size-14" />

        <div className="space-y-2 text-center">
          <CardTitle className="text-2xl">Confirm Account</CardTitle>

          <CardDescription>
            Enter the verification code sent to{" "}
            <span className="font-medium text-primary">{maskedEmail}</span>.
            Code expires in 5 minutes.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (code.length === 6) auth.confirmSignUp(code)
          }}
        >
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              onComplete={(value) => auth.confirmSignUp(value)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            type="submit"
            className="mt-6 w-full"
            size="lg"
            disabled={auth.isLoading || code.length < 6}
          >
            {auth.isLoading ? (
              <>
                <CgSpinner className="size-5 animate-spin" strokeWidth={1} />
                <span>Confirming...</span>
              </>
            ) : (
              "Confirm"
            )}
          </Button>

          <p className="mt-3 text-center text-sm text-muted-foreground">
            Didn't receive a code?{" "}
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0}
              className="font-medium text-primary underline-offset-4 hover:underline disabled:pointer-events-none disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
            </button>
          </p>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            <Link
              to="/"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Back to sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default ConfirmAccount
