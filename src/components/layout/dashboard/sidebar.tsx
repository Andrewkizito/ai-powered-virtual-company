import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  FiActivity,
  FiBox,
  FiBriefcase,
  FiChevronRight,
  FiClipboard,
  FiCpu,
  FiCreditCard,
  FiDatabase,
  FiGrid,
  FiPackage,
  FiSettings,
  FiShoppingCart,
  FiUsers,
} from "react-icons/fi"
import { IoChevronDown } from "react-icons/io5"
import { NavLink } from "react-router"
import { useAuth } from "@/components/providers/auth"

const navigation = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
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
    <aside className="fixed inset-y-0 left-0 flex w-72 flex-col border-r bg-background">
      {/* Header */}
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <img src="/logo.svg" alt="Logo" className="size-8 shrink-0" />

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Virtual Company</p>

          <p className="truncate text-xs text-muted-foreground">
            Autonomous Commerce
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-7">
          {navigation.map((section) => (
            <div key={section.title}>
              <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                {section.title}
              </p>

              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon

                  return (
                    <NavLink
                      key={item.title}
                      to={item.href}
                      className={({ isActive }) =>
                        [
                          "group relative flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                          isActive
                            ? [
                                "bg-primary/10 font-medium text-primary",
                                "before:absolute before:left-0 before:h-6 before:w-1 before:rounded-r before:bg-primary",
                              ].join(" ")
                            : [
                                "text-foreground/80",
                                "hover:bg-accent hover:text-accent-foreground",
                              ].join(" "),
                        ].join(" ")
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon
                              className={[
                                "size-4 shrink-0 transition-colors",
                                isActive
                                  ? "text-primary"
                                  : "text-foreground/60 group-hover:text-foreground",
                              ].join(" ")}
                            />

                            <span>{item.title}</span>
                          </div>

                          <FiChevronRight
                            className={[
                              "size-4 transition-all",
                              isActive
                                ? "text-primary opacity-100"
                                : "opacity-0 group-hover:translate-x-0.5 group-hover:opacity-100",
                            ].join(" ")}
                          />
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Profile */}
      <div className="border-t p-3">
        <button className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
          <Avatar className="size-9">
            <AvatarImage src="/avatar.png" />

            <AvatarFallback>KA</AvatarFallback>
          </Avatar>

          <div className="flex-1 overflow-hidden text-left">
            <p className="truncate text-sm font-medium">
              {auth.user?.username ?? "User"}
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
