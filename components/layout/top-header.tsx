// "use client"

// import { useAuth, switchRole } from "@/lib/auth-store"
// import type { Role } from "@/lib/mock-data"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
//   DropdownMenuSeparator,
//   DropdownMenuLabel,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Bell, ChevronDown, Shield, GraduationCap, UserCircle } from "lucide-react"
// import { mockNotifications } from "@/lib/mock-data"

// const roleConfig: Record<Role, { label: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
//   admin: { label: "Administrator", icon: Shield, color: "bg-destructive/10 text-destructive" },
//   trainer: { label: "Trainer", icon: GraduationCap, color: "bg-wtms-teal/10 text-wtms-teal" },
//   employee: { label: "Employee", icon: UserCircle, color: "bg-primary/10 text-primary" },
// }

// export function TopHeader() {
//   const { user } = useAuth()
//   if (!user) return null

//   const unreadCount = mockNotifications.filter((n) => !n.read).length
//   const cfg = roleConfig[user.role]
//   const RoleIcon = cfg.icon

//   return (
//     <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
//       <div className="flex items-center gap-3">
//         <Badge className={`gap-1.5 text-xs font-medium px-3 py-1 ${cfg.color} border-0`}>
//           <RoleIcon className="size-3.5" />
//           {cfg.label}
//         </Badge>
//         <span className="text-xs text-muted-foreground hidden sm:inline">
//           {user.department} Department
//         </span>
//       </div>

//       <div className="flex items-center gap-2">
//         {/* Role Switcher (for demo) */}
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-muted-foreground">
//               Switch Role
//               <ChevronDown className="size-3" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel className="text-xs">Demo Role Switcher</DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             {(["admin", "trainer", "employee"] as Role[]).map((role) => {
//               const rc = roleConfig[role]
//               const Icon = rc.icon
//               return (
//                 <DropdownMenuItem
//                   key={role}
//                   onClick={() => switchRole(role)}
//                   className={user.role === role ? "bg-muted" : ""}
//                 >
//                   <Icon className="size-4 mr-2" />
//                   {rc.label}
//                   {user.role === role && (
//                     <Badge variant="secondary" className="ml-auto text-[10px]">Current</Badge>
//                   )}
//                 </DropdownMenuItem>
//               )
//             })}
//           </DropdownMenuContent>
//         </DropdownMenu>

//         {/* Notification bell */}
//         <Button variant="ghost" size="icon" className="relative size-8">
//           <Bell className="size-4" />
//           {unreadCount > 0 && (
//             <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
//               {unreadCount}
//             </span>
//           )}
//           <span className="sr-only">Notifications</span>
//         </Button>

//         {/* User avatar */}
//         <Avatar className="size-8">
//           <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
//             {user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
//           </AvatarFallback>
//         </Avatar>
//       </div>
//     </header>
//   )
// }


"use client";

import { Bell, Search, ChevronDown } from "lucide-react";

import { useAuth } from "@/lib/auth-store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export function TopHeader() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[74px] items-center justify-between border-b border-slate-200 bg-white px-7">
      <div className="relative w-full max-w-[370px]">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <Input
          type="text"
          placeholder="Search training, materials, users..."
          className="h-11 rounded-xl border-0 bg-slate-100 pl-12 pr-4 text-[15px] text-slate-700 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-slate-300"
        />
      </div>

      <div className="ml-6 flex items-center gap-6">
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-slate-600" />
          <span className="absolute right-2.5 top-2 h-2.5 w-2.5 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-3 rounded-xl px-1 py-1 transition-colors hover:bg-slate-50"
        >
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-600 text-sm font-semibold text-white">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="hidden text-left sm:block">
            <p className="text-[18px] font-medium leading-5 text-slate-900">
              {user.name}
            </p>
            <p className="text-[14px] leading-5 text-slate-500">
              Administrator
            </p>
          </div>

          <ChevronDown className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </header>
  );
}