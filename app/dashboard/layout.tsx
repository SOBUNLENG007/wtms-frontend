// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { AppSidebar } from "@/components/layout/app-sidebar"
// // import { AppSidebar } from "../../components/layout/app-sidebar"
// import { TopHeader } from "@/components/layout/top-header"
// import { restoreSession } from "@/lib/auth-store"
// import { cn } from "@/lib/utils"

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const [collapsed, setCollapsed] = useState(false)
//   const [ready, setReady] = useState(false)
//   const router = useRouter()

//   useEffect(() => {
//     const user = restoreSession()
//     if (!user) {
//       router.replace("/")
//     } else {
//       setReady(true)
//     }
//   }, [router])

//   if (!ready) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background">
//         <div className="size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
//       </div>
//     )
//   }

//   return (
//     <div className="flex min-h-screen bg-background">
//       <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
//       <div
//         className={cn(
//           "flex-1 flex flex-col transition-all duration-300",
//           collapsed ? "ml-[68px]" : "ml-[260px]"
//         )}
//       >
//         <TopHeader />
//         <main className="flex-1 p-6 lg:p-8">
//           {children}
//         </main>
//       </div>
//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { TopHeader } from "@/components/layout/top-header"
import { useAuth } from "@/lib/auth-store"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [ready, setReady] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { user, restoreSession } = useAuth()

  useEffect(() => {
    restoreSession()
    setReady(true)
  }, [restoreSession])

  useEffect(() => {
    if (ready && !user) {
      router.replace("/")
    }
  }, [ready, user, router])

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-4 border-[#1f6fff] border-t-transparent" />
      </div>
    )
  }

  const isSettingsPage = pathname === "/dashboard/settings"

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <div
        className={cn(
          "flex flex-1 flex-col transition-all duration-300",
          collapsed ? "ml-[68px]" : "ml-[260px]"
        )}
      >
        {!isSettingsPage && <TopHeader />}

        <main className={cn("flex-1", isSettingsPage ? "p-8 lg:p-10" : "p-6 lg:p-8")}>
          {children}
        </main>
      </div>
    </div>
  )
}