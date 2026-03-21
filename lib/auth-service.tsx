// lib/auth-service.ts
import { fetchApi } from "./api";

// ── Types ─────────────────────────────────────────────────────────────────
interface LoginResponse {
  success: boolean;
  message: string;
  payload: {
    accessToken: string;
    refreshToken?: string;
    user?: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

// ── Login ─────────────────────────────────────────────────────────────────
export async function loginApi(
  email: string,
  password: string,
  rememberMe: boolean = false
): Promise<LoginResponse> {
  const response: LoginResponse = await fetchApi("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.payload?.accessToken) {
    // rememberMe = true  → localStorage  (persists after tab close)
    // rememberMe = false → sessionStorage (clears when tab closes)
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("accessToken", response.payload.accessToken);

    if (response.payload.refreshToken) {
      storage.setItem("refreshToken", response.payload.refreshToken);
    }
  }

  return response;
}

// ── Register ──────────────────────────────────────────────────────────────
export async function registerApi(data: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  return fetchApi("/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Verify Email ──────────────────────────────────────────────────────────
export async function verifyEmailApi(email: string, code: string) {
  return fetchApi("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, code }),
  });
}

// ── Forgot Password ───────────────────────────────────────────────────────
export async function forgotPasswordApi(email: string) {
  return fetchApi("/api/v1/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

// ── Reset Password ────────────────────────────────────────────────────────
export async function resetPasswordApi(
  email: string,
  code: string,
  newPassword: string
) {
  return fetchApi("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, newPassword }),
  });
}

// ── Logout ────────────────────────────────────────────────────────────────
export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("refreshToken");
}

// ── Get Token (checks both storages) ─────
export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("accessToken") ||
    sessionStorage.getItem("accessToken")
  );
}