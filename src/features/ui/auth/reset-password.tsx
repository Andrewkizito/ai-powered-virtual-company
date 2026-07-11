import { useState } from "react"
import { useAuth } from "@/components/providers/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { CgSpinner } from "react-icons/cg"
import { Link, Navigate } from "react-router"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function maskEmail(email: string) {
  const [local, domain] = email.split("@")
  if (!local || !domain) return email
  return `${local[0]}${"*".repeat(local.length - 1)}@${domain}`
}

const ResetPassword = () => {
  const auth = useAuth()
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const maskedEmail = maskEmail(auth.pendingUsername ?? "")

  if (!auth.pendingUsername) {
    return <Navigate to="/" replace />
  }

  return (
    <Card className="w-full max-w-105 shadow-lg max-sm:shadow-none!">
      <CardHeader className="items-center space-y-4">
        <img src="/logo.svg" alt="Logo" className="mx-auto size-14" />

        <div className="space-y-2">
          <CardTitle className="text-2xl">Reset Password</CardTitle>

          <CardDescription>
            <CardDescription>
              Enter the verification code sent to{" "}
              <span className="font-medium text-primary">{maskedEmail}</span>.
              Code expires in 5 minutes.
            </CardDescription>
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (code.length === 6 && newPassword) {
              auth.confirmResetPassword(code, newPassword)
            }
          }}
        >
          <div className="flex justify-center">
            <InputOTP maxLength={6} value={code} onChange={setCode}>
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

          <div className="mt-6 flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="new-password">New Password</FieldLabel>
              <Input
                id="new-password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="my-3">
            <label
              htmlFor="show-password"
              className="flex items-center gap-2 text-sm font-normal text-muted-foreground"
            >
              <input
                type="checkbox"
                id="show-password"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="size-4 rounded border-input"
              />
              Show password
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={auth.isLoading || code.length < 6 || !newPassword}
          >
            {auth.isLoading ? (
              <>
                <CgSpinner className="size-5 animate-spin" strokeWidth={1} />
                <span>Resetting password...</span>
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

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

export default ResetPassword
