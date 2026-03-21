"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-store"

type Role = "admin" | "trainer" | "employee"

export function RoleGuard({
  allowed,
  children,
}: {
  allowed: Role[]
  children: React.ReactNode
}) {
  const { user, restoreSession } = useAuth()
  const router = useRouter()

  useEffect(() => {
    restoreSession()
  }, [restoreSession])

  useEffect(() => {
    if (!user) return
    if (!allowed.includes(user.role as Role)) {
      router.replace("/dashboard")
    }
  }, [user, allowed, router])

  if (!user) return null
  if (!allowed.includes(user.role as Role)) return null

  return <>{children}</>
}