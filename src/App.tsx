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

export default function App() {
  const auth = useAuth()
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/30 p-6">
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
            onClick={() => auth.signinRedirect()}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
