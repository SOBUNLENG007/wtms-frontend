 

"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-store";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "@/lib/notification-service";
import type { Notification, NotificationType } from "@/lib/types/notification";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  FileText,
  Calendar,
  BookOpen,
  Star,
  Megaphone,
  CheckCheck,
  Mail,
  MailOpen,
  Trash2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const typeConfig: Record<
  NotificationType,
  {
    icon: React.ElementType;
    label: string;
    color: string;
  }
> = {
  material: {
    icon: FileText,
    label: "Material",
    color: "bg-blue-100 text-blue-600",
  },
  deadline: {
    icon: Calendar,
    label: "Deadline",
    color: "bg-red-100 text-red-600",
  },
  session: {
    icon: BookOpen,
    label: "Session",
    color: "bg-teal-100 text-teal-600",
  },
  grade: {
    icon: Star,
    label: "Grade",
    color: "bg-orange-100 text-orange-600",
  },
  announcement: {
    icon: Megaphone,
    label: "Announcement",
    color: "bg-green-100 text-green-600",
  },
};

function NotificationSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function NotificationCard({
  notification,
  onMarkRead,
  onDelete,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const cfg = typeConfig[notification.type];
  const TypeIcon = cfg.icon;

  return (
    <Card
      className={`group cursor-pointer transition-all hover:shadow-md ${
        !notification.read ? "border-blue-200 bg-blue-50/30" : "border-slate-100"
      }`}
      onClick={() => !notification.read && onMarkRead(notification.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
            <TypeIcon className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-2">
                <p
                  className={`truncate text-sm font-semibold ${
                    !notification.read ? "text-slate-900" : "text-slate-500"
                  }`}
                >
                  {notification.title}
                </p>
                {!notification.read && <span className="size-2 shrink-0 rounded-full bg-blue-500" />}
              </div>

              <Badge className={`shrink-0 border-0 px-2 py-0 text-[10px] ${cfg.color}`}>
                {cfg.label}
              </Badge>
            </div>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {notification.message}
            </p>

            <p className="mt-2 text-[10px] text-slate-400">
              {new Date(notification.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-2">
            {notification.read ? (
              <MailOpen className="size-4 text-slate-300" />
            ) : (
              <Mail className="size-4 text-blue-500" />
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(notification.id);
              }}
              className="opacity-0 transition-opacity group-hover:opacity-100"
              aria-label="Delete notification"
            >
              <Trash2 className="size-4 text-slate-300 transition-colors hover:text-red-400" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-slate-100">
        <CheckCheck className="size-8 text-slate-400" />
      </div>
      <p className="mt-4 text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-1 text-xs text-slate-400">You're all caught up!</p>
    </div>
  );
}

export default function NotificationsPage() {
  const { user, restoreSession } = useAuth();
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("unread");

  useEffect(() => {
    restoreSession();
    setReady(true);
  }, [restoreSession]);

  useEffect(() => {
    if (ready && !user) {
      router.replace("/");
    }
  }, [ready, user, router]);

  const isAdmin = user?.role === "admin";
  const isTrainer = user?.role === "trainer";
  const isEmployee = user?.role === "employee";
  const canManageNotifications = isAdmin || isTrainer;

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await getNotifications(0, 50);
      const data: Notification[] = res?.payload?.content ?? res?.payload ?? res ?? [];
      setNotifications(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, fetchNotifications]);

  const unread = useMemo(() => notifications.filter((n) => !n.read), [notifications]);
  const read = useMemo(() => notifications.filter((n) => n.read), [notifications]);

  async function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await markNotificationRead(id);
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
    }
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await markAllNotificationsRead();
    } catch {
      fetchNotifications();
    }
  }

  async function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await deleteNotification(id);
    } catch {
      fetchNotifications();
    }
  }

  if (!ready || !user) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-[#1f6fff] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex size-9 items-center justify-center rounded-lg border border-slate-200 transition-colors hover:bg-slate-50"
          >
            <ArrowLeft className="size-4 text-slate-500" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isEmployee ? "Inbox" : "Notifications"}
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              {isEmployee
                ? "Your notifications and announcements"
                : "Manage alerts for materials, deadlines and sessions"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={fetchNotifications}
            disabled={loading}
          >
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          {unread.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="size-4" />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchNotifications}>
            Retry
          </Button>
        </div>
      )}

      {canManageNotifications && !loading && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-700">
            Notification & Reminder System
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "New Material Alert",
                detail: "Push to Employees",
                icon: FileText,
                color: "bg-blue-100 text-blue-600",
                action: "Send Now",
              },
              {
                title: "Assignment Reminder",
                detail: "Auto Before Deadline",
                icon: Calendar,
                color: "bg-red-100 text-red-600",
                action: "Configure",
              },
              {
                title: "Session Start Alert",
                detail: "Auto Notification",
                icon: BookOpen,
                color: "bg-teal-100 text-teal-600",
                action: "Configure",
              },
              {
                title: "Performance Report",
                detail: "Notify Trainer / HR",
                icon: Star,
                color: "bg-orange-100 text-orange-600",
                action: "Send Now",
              },
            ].map((trigger) => (
              <Card key={trigger.title} className="transition-shadow hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${trigger.color}`}>
                      <trigger.icon className="size-4" />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800">{trigger.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{trigger.detail}</p>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 h-7 px-2 text-xs text-blue-600 hover:text-blue-700"
                      >
                        {trigger.action}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="border border-slate-200 bg-slate-50">
          <TabsTrigger value="unread" className="gap-1.5 data-[state=active]:bg-white">
            <Mail className="size-3.5" />
            Unread
            {unread.length > 0 && (
              <Badge className="ml-1 h-5 border-0 bg-blue-500 px-1.5 text-[10px] text-white">
                {unread.length}
              </Badge>
            )}
          </TabsTrigger>

          <TabsTrigger value="read" className="gap-1.5 data-[state=active]:bg-white">
            <MailOpen className="size-3.5" />
            Read ({read.length})
          </TabsTrigger>

          <TabsTrigger value="all" className="gap-1.5 data-[state=active]:bg-white">
            <Bell className="size-3.5" />
            All ({notifications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="mt-4 space-y-3">
          {loading ? (
            <NotificationSkeleton />
          ) : unread.length === 0 ? (
            <EmptyState label="No unread notifications" />
          ) : (
            unread.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="read" className="mt-4 space-y-3">
          {loading ? (
            <NotificationSkeleton />
          ) : read.length === 0 ? (
            <EmptyState label="No read notifications yet" />
          ) : (
            read.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-4 space-y-3">
          {loading ? (
            <NotificationSkeleton />
          ) : notifications.length === 0 ? (
            <EmptyState label="No notifications yet" />
          ) : (
            notifications.map((n) => (
              <NotificationCard
                key={n.id}
                notification={n}
                onMarkRead={handleMarkRead}
                onDelete={handleDelete}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}