// lib/types/notification.ts
export type NotificationType =
  | "material"
  | "deadline"
  | "session"
  | "grade"
  | "announcement";

export interface Notification {
  id: string;
  type:      NotificationType;
  title:     string;
  message:   string;
  read:      boolean;
  timestamp: string;
  link?:     string;   // optional deep link
}

export interface NotificationApiResponse {
  success: boolean;
  message: string;
  payload: {
    content:       Notification[];
    totalElements: number;
    totalPages:    number;
    number:        number;
  };
}