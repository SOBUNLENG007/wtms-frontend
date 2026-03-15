"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-store";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardCheck,
  Users,
  Bell,
  BarChart3,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const trainerAdminLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    href: "/dashboard/sessions",
    label: "Training Sessions",
    icon: GraduationCap,
  },
  { href: "/dashboard/materials", label: "Materials", icon: BookOpen },
  {
    href: "/dashboard/assignments",
    label: "Assignments",
    icon: ClipboardCheck,
  },
  { href: "/dashboard/users", label: "Users", icon: Users },
  { href: "/dashboard/attendance", label: "Attendance", icon: FileText },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
];

const employeeLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-sessions", label: "My Sessions", icon: GraduationCap },
  { href: "/dashboard/materials", label: "Materials", icon: BookOpen },
  {
    href: "/dashboard/assignments",
    label: "Assignments",
    icon: ClipboardCheck,
  },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
];

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout: doLogout } = useAuth();

  const links = user?.role === "trainer" ? employeeLinks : trainerAdminLinks;

  const isActiveRoute = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  function handleLogout() {
    doLogout();
    router.push("/");
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 flex h-screen border-r border-white/10 bg-[#081121] text-white transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="flex h-full w-full flex-col">
        {/* Top brand */}
        <div className="border-b border-white/10 px-4 py-4">
          <div
            className={cn(
              "flex items-center gap-4",
              collapsed && "justify-center",
            )}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#1f6fff] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-[18px] font-bold leading-5">WTMS</p>
                <p className="truncate text-sm text-white/60">
                  Wing Training System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main nav */}
        <nav className="flex-1 px-4 py-4 ">
          <ul className="space-y-0.5">
            {links.map((link) => {
              const active = isActiveRoute(link.href);
              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    title={collapsed ? link.label : undefined}
                    className={cn(
                      "flex items-center rounded-2xl transition-all duration-200",

                      collapsed
                        ? cn(
                            "justify-center p-2 h-11 w-11",
                            active
                              ? "bg-[#1f6fff] text-white shadow-[0_8px_24px_rgba(31,111,255,0.28)]"
                              : "text-white/80 hover:bg-white/5",
                          )
                        : cn(
                            "gap-4 px-4 py-2.5 text-[15px] font-medium",
                            active
                              ? "bg-[#1f6fff] text-white shadow-[0_8px_24px_rgba(31,111,255,0.28)]"
                              : "text-white/80 hover:bg-white/5 hover:text-white",
                          ),
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {!collapsed && (
                      <span className="truncate text-[16px]">{link.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom actions */}
        <div className="border-t border-white/10 px-4 py-4">
          <div className="space-y-2">
            <button
              type="button"
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl px-4 py-2.5 text-left text-[15px] font-medium text-white/80 transition-all hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-0",
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-[16px]">Settings</span>}
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className={cn(
                "flex w-full items-center gap-4 rounded-2xl px-4 py-3.5 text-left text-[15px] font-medium text-white/80 transition-all hover:bg-white/5 hover:text-white",
                collapsed && "justify-center px-0",
              )}
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-[16px]">Logout</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Floating toggle button */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-4 top-26 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:text-slate-700"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </aside>
  );
}
