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

export default function App() {
  const auth = useAuth()

  console.log(auth)

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
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Route>
      )}
    </Routes>
  )
}
