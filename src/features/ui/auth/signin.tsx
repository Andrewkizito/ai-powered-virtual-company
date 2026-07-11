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
import { Checkbox } from "@/components/ui/checkbox"
import { CgSpinner } from "react-icons/cg"
import { Link } from "react-router"

const SignIn = () => {
  const auth = useAuth()

  return (
    <Card className="w-full max-w-105 shadow-lg max-sm:shadow-none!">
      <CardHeader className="items-center space-y-4">
        <img src="/logo.svg" alt="Logo" className="mx-auto size-14" />

        <div className="space-y-2">
          <CardTitle className="text-2xl">Sign In</CardTitle>

          <CardDescription>
            Enter your credentials to access your workspace.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            auth.signIn()
          }}
        >
          <div className="flex flex-col gap-4">
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

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type={auth.credentials.showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={auth.credentials.password}
                onChange={(e) => auth.setCredentials("password", e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="my-3 flex items-center justify-between">
            <label
              htmlFor="show-password"
              className="flex items-center gap-2 text-sm font-normal text-muted-foreground"
            >
              <Checkbox
                id="show-password"
                checked={auth.credentials.showPassword}
                onCheckedChange={(checked) =>
                  auth.setCredentials("showPassword", !!checked)
                }
              />
              Show password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-primary underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={auth.isLoading}
          >
            {auth.isLoading ? (
              <>
                <CgSpinner className="size-5 animate-spin" strokeWidth={1} />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </Button>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            New user?{" "}
            <Link
              to="/signup"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

export default SignIn
