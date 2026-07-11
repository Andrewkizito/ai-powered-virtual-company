import { Outlet } from "react-router"
import Header from "./header"
import Sidebar from "./sidebar"

const DashboardLayout = () => {
  return (
    <div className="relative h-screen w-screen bg-muted">
      <Sidebar />
      <Header />
      <div className="fixed right-0 h-full w-[calc(100vw-288px)] pt-16">
        <div className="relative h-full w-full overflow-y-auto p-5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
