// Hooks
import { useAuth } from "@/components/providers/auth"

// UI Components
import { Navigate, Route, Routes } from "react-router"
import DashboardLayout from "./components/layout/dashboard/main"
import AuthLayout from "./components/layout/auth/main"

// Pages
import Dashboard from "./features/ui/admin/Dashboard"
import AddInventory from "./features/ui/admin/inventory/AddInventory"
import Inventory from "./features/ui/admin/inventory/Inventory"
import SignIn from "./features/ui/auth/signin"
import SignUp from "./features/ui/auth/signup"
import ConfirmAccount from "./features/ui/auth/confirm-account"
import ForgotPassword from "./features/ui/auth/forgot-password"
import ResetPassword from "./features/ui/auth/reset-password"

export default function App() {
  const auth = useAuth()

  return (
    <Routes>
      {auth.isAuthenticated ? (
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventory/add" element={<AddInventory />} />
          <Route
            path="*"
            element={<Navigate to="/dashboard" replace={true} />}
          />
        </Route>
      ) : (
        <Route element={<AuthLayout />}>
          <Route path="/" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/confirm-account" element={<ConfirmAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Route>
      )}
    </Routes>
  )
}
