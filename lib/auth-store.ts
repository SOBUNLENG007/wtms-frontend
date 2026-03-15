"use client"

import { useSyncExternalStore } from "react"
import type { User, Role } from "./mock-data"
import { mockUsers } from "./mock-data"

let _user: User | null = null
const _listeners = new Set<() => void>()

function notify() {
  _listeners.forEach((l) => l())
}

export function getUser(): User | null {
  return _user
}

export function login(email: string, _password: string): { success: boolean; error?: string } {
  const found = mockUsers.find((u) => u.email === email)
  if (found) {
    _user = found
    if (typeof window !== "undefined") {
      sessionStorage.setItem("wtms_user", JSON.stringify(found))
    }
    notify()
    return { success: true }
  }
  const role: Role = email.includes("admin") ? "admin" : email.includes("trainer") ? "trainer" : "employee"
  const newUser: User = {
    id: Math.random().toString(36).slice(2),
    name: email.split("@")[0],
    email,
    role,
    department: "General",
  }
  _user = newUser
  if (typeof window !== "undefined") {
    sessionStorage.setItem("wtms_user", JSON.stringify(newUser))
  }
  notify()
  return { success: true }
}

export function register(name: string, email: string, _password: string, role: Role): { success: boolean; error?: string } {
  const newUser: User = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    role,
    department: "General",
  }
  _user = newUser
  if (typeof window !== "undefined") {
    sessionStorage.setItem("wtms_user", JSON.stringify(newUser))
  }
  notify()
  return { success: true }
}

export function logout() {
  _user = null
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("wtms_user")
  }
  notify()
}

export function switchRole(role: Role) {
  if (_user) {
    _user = { ..._user, role }
    if (typeof window !== "undefined") {
      sessionStorage.setItem("wtms_user", JSON.stringify(_user))
    }
    notify()
  }
}

export function restoreSession(): User | null {
  if (typeof window !== "undefined") {
    const stored = sessionStorage.getItem("wtms_user")
    if (stored) {
      _user = JSON.parse(stored)
      return _user
    }
  }
  return null
}

function subscribe(listener: () => void) {
  _listeners.add(listener)
  return () => { _listeners.delete(listener) }
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getUser, () => null)
  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    switchRole,
    restoreSession,
  }
}
