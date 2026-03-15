"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-store"
import { mockNotifications } from "@/lib/mock-data"
import type { Notification } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"

const typeConfig = {
  material: { icon: FileText, label: "Material", color: "bg-primary/10 text-primary" },
  deadline: { icon: Calendar, label: "Deadline", color: "bg-destructive/10 text-destructive" },
  session: { icon: BookOpen, label: "Session", color: "bg-wtms-teal/10 text-wtms-teal" },
  grade: { icon: Star, label: "Grade", color: "bg-wtms-orange/10 text-wtms-orange" },
  announcement: { icon: Megaphone, label: "Announcement", color: "bg-wtms-green/10 text-wtms-green" },
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const isEmployee = user?.role === "employee"
  const unread = notifications.filter((n) => !n.read)
  const read = notifications.filter((n) => n.read)

  function markRead(id: string) {
    setNotifications(notifications.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  function NotificationCard({ notification }: { notification: Notification }) {
    const cfg = typeConfig[notification.type]
    const TypeIcon = cfg.icon
    return (
      <Card
        className={`hover:shadow-md transition-shadow cursor-pointer ${!notification.read ? "border-primary/20 bg-primary/[0.02]" : ""}`}
        onClick={() => markRead(notification.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}>
              <TypeIcon className="size-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notification.title}
                  </p>
                  {!notification.read && <div className="size-2 rounded-full bg-primary shrink-0" />}
                </div>
                <Badge className={`shrink-0 text-[10px] ${cfg.color} border-0`}>{cfg.label}</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
              <p className="text-[10px] text-muted-foreground/60 mt-2">
                {new Date(notification.timestamp).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="shrink-0">
              {notification.read ? (
                <MailOpen className="size-4 text-muted-foreground/40" />
              ) : (
                <Mail className="size-4 text-primary" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isEmployee ? "Inbox" : "Notifications & Reminders"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isEmployee
              ? "View notifications, announcements, and reply to messages."
              : "Manage automated alerts for materials, deadlines, sessions, and grades."}
          </p>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" className="gap-2 text-sm" onClick={markAllRead}>
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Alert trigger types for Trainer/Admin */}
      {!isEmployee && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Notification & Reminder System</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: "New Training Material Alert", detail: "Push to Employees", icon: FileText, color: "bg-primary/10 text-primary", action: "Send Now" },
              { title: "Assignment Due Reminder", detail: "Auto Before Deadline", icon: Calendar, color: "bg-destructive/10 text-destructive", action: "Configure" },
              { title: "Session Start Reminder", detail: "Auto Notification", icon: BookOpen, color: "bg-wtms-teal/10 text-wtms-teal", action: "Configure" },
              { title: "Performance Report Ready", detail: "Notify Trainer / HR", icon: Star, color: "bg-wtms-orange/10 text-wtms-orange", action: "Send Now" },
            ].map((trigger) => (
              <Card key={trigger.title} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${trigger.color}`}>
                      <trigger.icon className="size-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{trigger.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{trigger.detail}</p>
                      <Button variant="ghost" size="sm" className="text-xs mt-2 h-7 px-2">{trigger.action}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="unread">
        <TabsList>
          <TabsTrigger value="unread" className="gap-1.5">
            <Mail className="size-3.5" />
            Unread ({unread.length})
          </TabsTrigger>
          <TabsTrigger value="read" className="gap-1.5">
            <MailOpen className="size-3.5" />
            Read ({read.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-1.5">
            <Bell className="size-3.5" />
            All ({notifications.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="unread" className="space-y-3 mt-4">
          {unread.map((n) => <NotificationCard key={n.id} notification={n} />)}
          {unread.length === 0 && (
            <div className="text-center py-12">
              <CheckCheck className="size-10 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mt-3">All caught up!</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="read" className="space-y-3 mt-4">
          {read.map((n) => <NotificationCard key={n.id} notification={n} />)}
        </TabsContent>
        <TabsContent value="all" className="space-y-3 mt-4">
          {notifications.map((n) => <NotificationCard key={n.id} notification={n} />)}
        </TabsContent>
      </Tabs>
    </div>
  )
}
