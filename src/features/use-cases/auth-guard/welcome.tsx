import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { useAuth } from "react-oidc-context"
import { CgSpinner } from "react-icons/cg"

const Welcome = () => {
  const auth = useAuth()

  return (
    <Card className="w-full max-w-md shadow-lg max-sm:shadow-none!">
      <CardHeader className="items-center space-y-4 text-center">
        <img src="/logo.svg" alt="Logo" className="mx-auto size-14" />

        <div className="space-y-2">
          <CardTitle className="text-2xl">Welcome</CardTitle>

          <CardDescription>
            Your virtual workspace for autonomous agents.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-lg border bg-muted/50 p-4 text-center text-sm text-muted-foreground">
          Sign in to access your workspace and manage your agents.
        </div>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          size="lg"
          disabled={auth.isLoading}
          onClick={() => auth.signinRedirect()}
        >
          {auth.isLoading ? (
            <>
              <CgSpinner className="size-5 animate-spin" strokeWidth={1} />
              <span>Loading...</span>
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default Welcome
