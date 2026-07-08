import { Navigate, Route, Routes } from "react-router"
import AuthGuard from "./features/ui/auth-guard"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthGuard />} />
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </Routes>
  )
}
