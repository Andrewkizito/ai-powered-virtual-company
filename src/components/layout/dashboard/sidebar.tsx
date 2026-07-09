import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FiActivity,
  FiBox,
  FiBriefcase,
  FiCreditCard,
  FiDatabase,
  FiGrid,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiUsers,
  FiChevronRight,
  FiCpu,
  FiClipboard,
} from "react-icons/fi"
import { IoChevronDown } from "react-icons/io5"
import { useAuth } from "react-oidc-context"

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/",
        icon: FiGrid,
      },
      {
        title: "Company",
        href: "/company",
        icon: FiBriefcase,
      },
    ],
  },
  {
    title: "Agents",
    items: [
      {
        title: "Agent Fleet",
        href: "/agents",
        icon: FiCpu,
      },
      {
        title: "Tasks",
        href: "/tasks",
        icon: FiClipboard,
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        title: "Orders",
        href: "/orders",
        icon: FiShoppingCart,
      },
      {
        title: "Products",
        href: "/products",
        icon: FiPackage,
      },
      {
        title: "Inventory",
        href: "/inventory",
        icon: FiBox,
      },
      {
        title: "Customers",
        href: "/customers",
        icon: FiUsers,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        title: "Payments",
        href: "/payments",
        icon: FiCreditCard,
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: FiActivity,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        title: "Knowledge Base",
        href: "/knowledge",
        icon: FiDatabase,
      },
      {
        title: "Settings",
        href: "/settings",
        icon: FiSettings,
      },
    ],
  },
]

const Sidebar = () => {
  const auth = useAuth()

  return (
    <aside className="fixed top-0 left-0 flex h-screen w-72 flex-col border-r bg-background">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <img src="/logo.svg" alt="Logo" className="size-8" />

        <div>
          <p className="text-sm font-semibold">Virtual Company</p>
          <p className="text-xs text-muted-foreground">Autonomous Commerce</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-8">
          {navigation.map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 px-3 text-xs font-semibold tracking-wider text-muted-foreground capitalize">
                {section.title}
              </h3>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <a
                      key={item.title}
                      href={item.href}
                      className="group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="size-4 text-muted-foreground group-hover:text-foreground" />
                        <span>{item.title}</span>
                      </div>

                      <FiChevronRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="border-t p-4">
        <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent">
          <Avatar className="size-10">
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>KA</AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">
              {auth.user?.profile.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Administrator
            </p>
          </div>

          <IoChevronDown className="size-4 text-muted-foreground" />
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
