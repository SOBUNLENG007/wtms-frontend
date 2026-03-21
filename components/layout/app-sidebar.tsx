"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { useAuth } from "@/lib/auth-store"
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Role = "admin" | "trainer" | "employee"

const menuItems: {
  label: string
  href: string
  roles: Role[]
  icon: React.ComponentType<{ className?: string }>
}[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    roles: ["admin", "trainer", "employee"],
    icon: LayoutDashboard,
  },
  {
    label: "Training Sessions",
    href: "/dashboard/sessions",
    roles: ["admin", "trainer"],
    icon: BookOpen,
  },
  {
    label: "My Sessions",
    href: "/dashboard/my-sessions",
    roles: ["employee"],
    icon: BookOpen,
  },
  {
    label: "Materials",
    href: "/dashboard/materials",
    roles: ["admin", "trainer", "employee"],
    icon: FileText,
  },
  {
    label: "Assignments",
    href: "/dashboard/assignments",
    roles: ["admin", "trainer", "employee"],
    icon: ClipboardList,
  },
  {
    label: "Users",
    href: "/dashboard/users",
    roles: ["admin"],
    icon: Users,
  },
  {
    label: "Attendance",
    href: "/dashboard/attendance",
    roles: ["admin", "trainer"],
    icon: CalendarCheck,
  },
  {
    label: "Progress",
    href: "/dashboard/progress",
    roles: ["admin", "trainer"],
    icon: BarChart3,
  },
  {
    label: "My Progress",
    href: "/dashboard/my-progress",
    roles: ["employee"],
    icon: BarChart3,
  },
  {
    label: "Notifications",
    href: "/dashboard/notifications",
    roles: ["admin", "trainer", "employee"],
    icon: Bell,
  },
  {
    label: "Reports",
    href: "/dashboard/reports",
    roles: ["admin", "trainer"],
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    roles: ["admin", "trainer", "employee"],
    icon: Settings,
  },
]

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: () => void
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  if (!user) return null

  const visibleItems = menuItems.filter((item) =>
    item.roles.includes(user.role as Role)
  )

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname.startsWith(href)
  }

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutConfirm(false)
    router.replace("/")
  }

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-[#06152d] text-white transition-all duration-300",
          collapsed ? "w-[68px]" : "w-[260px]"
        )}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#1f6fff]">
                <BookOpen className="size-5" />
              </div>

              {!collapsed && (
                <div className="min-w-0">
                  <p className="text-2xl font-bold leading-none">WTMS</p>
                  <p className="mt-1 truncate text-sm text-white/80">
                    Wing Training System
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={onToggle}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">
          {visibleItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 transition-colors",
                  active
                    ? "bg-[#2f6df6] text-white"
                    : "text-white/90 hover:bg-white/10"
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="size-5 shrink-0" />
                {!collapsed && <span className="font-medium">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-white/90 transition-colors hover:bg-white/10"
          >
            <LogOut className="size-5 shrink-0" />
            {!collapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Logout Confirm Dialog */}
      <Dialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout from WTMS?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowLogoutConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleLogoutConfirm}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}