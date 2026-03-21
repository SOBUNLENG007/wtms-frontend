// "use client"

// import { useSyncExternalStore } from "react"
// import type { User, Role } from "./mock-data"
// import { mockUsers } from "./mock-data"

// let _user: User | null = null
// const _listeners = new Set<() => void>()

// function notify() {
//   _listeners.forEach((l) => l())
// }
 
// export function getUser(): User | null {
//   return _user
// }

// export function login(email: string, _password: string): { success: boolean; error?: string } {
//   const found = mockUsers.find((u) => u.email === email)
//   if (found) {
//     _user = found
//     if (typeof window !== "undefined") {
//       sessionStorage.setItem("wtms_user", JSON.stringify(found))
//     }
//     notify()
//     return { success: true }
//   }
//   const role: Role = email.includes("admin") ? "admin" : email.includes("trainer") ? "trainer" : "employee"
//   const newUser: User = {
//     id: Math.random().toString(36).slice(2),
//     name: email.split("@")[0],
//     email,
//     role,
//     department: "General",
//   }
//   _user = newUser
//   if (typeof window !== "undefined") {
//     sessionStorage.setItem("wtms_user", JSON.stringify(newUser))
//   }
//   notify()
//   return { success: true }
// }

// export function register(name: string, email: string, _password: string, role: Role): { success: boolean; error?: string } {
//   const newUser: User = {
//     id: Math.random().toString(36).slice(2),
//     name,
//     email,
//     role,
//     department: "General",
//   }
//   _user = newUser
//   if (typeof window !== "undefined") {
//     sessionStorage.setItem("wtms_user", JSON.stringify(newUser))
//   }
//   notify()
//   return { success: true }
// }

// export function logout() {
//   _user = null
//   if (typeof window !== "undefined") {
//     sessionStorage.removeItem("wtms_user")
//   }
//   notify()
// }

// export function switchRole(role: Role) {
//   if (_user) {
//     _user = { ..._user, role }
//     if (typeof window !== "undefined") {
//       sessionStorage.setItem("wtms_user", JSON.stringify(_user))
//     }
//     notify()
//   }
// }

// export function restoreSession(): User | null {
//   if (typeof window !== "undefined") {
//     const stored = sessionStorage.getItem("wtms_user")
//     if (stored) {
//       _user = JSON.parse(stored)
//       return _user
//     }
//   }
//   return null
// }

// function subscribe(listener: () => void) {
//   _listeners.add(listener)
//   return () => { _listeners.delete(listener) }
// }

// export function useAuth() {
//   const user = useSyncExternalStore(subscribe, getUser, () => null)
//   return {
//     user,
//     isAuthenticated: !!user,
//     login,
//     register,
//     logout,
//     switchRole,
//     restoreSession,
//   }
// }
"use client";

import { useSyncExternalStore } from "react";
import type { User, Role } from "./mock-data";
import { mockUsers } from "./mock-data";

let _user: User | null = null;
const _listeners = new Set<() => void>();

function notify() {
  _listeners.forEach((listener) => listener());
}

export function getUser(): User | null {
  return _user;
}

export function getUserRole(): Role | null {
  return _user?.role ?? null;
}

export function hasRole(role: Role): boolean {
  return _user?.role === role;
}

export function hasAnyRole(roles: Role[]): boolean {
  return !!_user && roles.includes(_user.role);
}

export function isAdmin(): boolean {
  return _user?.role === "admin";
}

export function isTrainer(): boolean {
  return _user?.role === "trainer";
}

export function isEmployee(): boolean {
  return _user?.role === "employee";
}

// export function login(
//   email: string,
//   _password: string
// ): { success: boolean; error?: string } {
//   const found = mockUsers.find((u) => u.email === email);

//   if (found) {
//     _user = found;

//     if (typeof window !== "undefined") {
//       sessionStorage.setItem("wtms_user", JSON.stringify(found));
//     }

//     notify();
//     return { success: true };
//   }

//   const role: Role = email.includes("admin")
//     ? "admin"
//     : email.includes("trainer")
//     ? "trainer"
//     : "employee";

//   const newUser: User = {
//     id: Math.random().toString(36).slice(2),
//     name: email.split("@")[0],
//     email,
//     role,
//     department: "General",
//   };

//   _user = newUser;

//   if (typeof window !== "undefined") {
//     sessionStorage.setItem("wtms_user", JSON.stringify(newUser));
//   }

//   notify();
//   return { success: true };
// }

export function login(
  email: string,
  _password: string
): { success: boolean; error?: string } {
  const found = mockUsers.find((u) => u.email === email);

  if (!found) {
    return { success: false, error: "Invalid email or password" };
  }

  _user = found;

  if (typeof window !== "undefined") {
    sessionStorage.setItem("wtms_user", JSON.stringify(found));
  }

  notify();
  return { success: true };
}

export function register(
  name: string,
  email: string,
  _password: string
): { success: boolean; error?: string } {
  const existing = mockUsers.find((u) => u.email === email);

  if (existing) {
    return { success: false, error: "Email already exists" };
  }

  const newUser: User = {
    id: Math.random().toString(36).slice(2),
    name,
    email,
    role: "employee",
    department: "General",
  };

  _user = newUser;

  if (typeof window !== "undefined") {
    sessionStorage.setItem("wtms_user", JSON.stringify(newUser));
  }

  notify();
  return { success: true };
}

export function logout() {
  _user = null;

  if (typeof window !== "undefined") {
    sessionStorage.removeItem("wtms_user");
  }

  notify();
}

export function switchRole(role: Role) {
  if (_user) {
    _user = { ..._user, role };

    if (typeof window !== "undefined") {
      sessionStorage.setItem("wtms_user", JSON.stringify(_user));
    }

    notify();
  }
}

export function restoreSession(): User | null {
  if (typeof window === "undefined") return null;

  const stored = sessionStorage.getItem("wtms_user");
  if (!stored) return null;

  try {
    _user = JSON.parse(stored);
    return _user;
  } catch {
    sessionStorage.removeItem("wtms_user");
    _user = null;
    return null;
  }
}

function subscribe(listener: () => void) {
  _listeners.add(listener);
  return () => {
    _listeners.delete(listener);
  };
}

export function useAuth() {
  const user = useSyncExternalStore(subscribe, getUser, () => null);

  return {
    user,
    role: user?.role ?? null,
    isAuthenticated: !!user,

    login,
    register,
    logout,
    switchRole,
    restoreSession,

    getUserRole,
    hasRole,
    hasAnyRole,
    isAdmin,
    isTrainer,
    isEmployee,
  };
}