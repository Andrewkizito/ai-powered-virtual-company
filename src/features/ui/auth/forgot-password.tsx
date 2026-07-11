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
import { Link } from "react-router"

const ForgotPassword = () => {
  const auth = useAuth()

  return (
    <Card className="w-full max-w-105 shadow-lg max-sm:shadow-none!">
      <CardHeader className="items-center space-y-4">
        <img src="/logo.svg" alt="Logo" className="mx-auto size-14" />

        <div className="space-y-2">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>

          <CardDescription>
            Enter your email and we'll send you a verification code.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            auth.forgotPassword()
          }}
        >
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={auth.credentials.email}
              onChange={(e) => auth.setCredentials("email", e.target.value)}
              required
            />
          </Field>

          <Button
            type="submit"
            className="mt-6 w-full"
            size="lg"
            disabled={auth.isLoading}
          >
            {auth.isLoading ? (
              <>
                <CgSpinner className="size-5 animate-spin" strokeWidth={1} />
                <span>Sending code...</span>
              </>
            ) : (
              "Send Code"
            )}
          </Button>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              to="/"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default ForgotPassword
