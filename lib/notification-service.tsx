// lib/notification-service.ts
import { fetchApi } from "./api";
import type { Notification } from "./types/notification";

// ── Get all notifications (paginated) ─────────────────────────────────────
export async function getNotifications(page = 0, size = 20) {
  return fetchApi(`/api/v1/notifications?page=${page}&size=${size}`);
}

// ── Mark one as read ───────────────────────────────────────────────────────
export async function markNotificationRead(id: string) {
  return fetchApi(`/api/v1/notifications/${id}/read`, { method: "PATCH" });
}

// ── Mark all as read ───────────────────────────────────────────────────────
export async function markAllNotificationsRead() {
  return fetchApi("/api/v1/notifications/read-all", { method: "PATCH" });
}

// ── Delete one notification ────────────────────────────────────────────────
export async function deleteNotification(id: string) {
  return fetchApi(`/api/v1/notifications/${id}`, { method: "DELETE" });
}

// ── Get unread count (for bell badge) ─────────────────────────────────────
export async function getUnreadCount(): Promise<number> {
  const res = await fetchApi("/api/v1/notifications/unread-count");
  return res?.payload ?? 0;
}