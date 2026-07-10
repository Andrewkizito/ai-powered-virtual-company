// Hooks
import { useAuth } from "react-oidc-context"

// UI Components
import { Navigate, Route, Routes } from "react-router"
import DashboardLayout from "./components/layout/dashboard/main"

// Pages
import AuthGuard from "./features/ui/auth/auth-guard"
import Dashboard from "./features/ui/admin/Dashboard"
import Inventory from "./features/ui/admin/inventory/Inventory"
import AddInventory from "./features/ui/admin/inventory/AddInventory"

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
        <>
          <Route path="/" element={<AuthGuard />} />
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </>
      )}
    </Routes>
  )
}
