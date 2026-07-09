import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { cognitoAuthConfig } from "@/lib/auth"
import { GoSignOut } from "react-icons/go"
import { IoNotificationsOutline } from "react-icons/io5"
import { useAuth } from "react-oidc-context"
import amplify_config from "../../../../amplify_outputs.json"

const SignOut = () => {
  const auth = useAuth()
  const signOutRedirect = async () => {
    const clientId = cognitoAuthConfig.client_id
    const logoutUri = window.origin
    const cognitoDomain = amplify_config.custom.cognito_auth_domain
    const idToken = auth.user?.id_token

    await auth.removeUser()

    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&id_token_hint=${encodeURIComponent(idToken || "")}`
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="outline" size="icon">
            <GoSignOut />
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign Out</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to sign out?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant={"destructive"} onClick={signOutRedirect}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

const Header = () => {
  return (
    <div className="fixed top-0 right-0 z-50 flex h-16 w-[calc(100vw-288px)] items-center justify-between border-b bg-background px-5">
      <div />
      <div className="flex items-center gap-8">
        <Button variant="ghost" size="icon" className="relative">
          <IoNotificationsOutline className="size-5" />
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </Button>
        <SignOut />
      </div>
    </div>
  )
}

export default Header
