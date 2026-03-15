"use client"

import { useAuth } from "@/lib/auth-store"
import { mockSessions, mockAssignments, mockNotifications, mockProgress, mockAttendance } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  ClipboardCheck,
  Bell,
  Users,
  BarChart3,
  Calendar,
  TrendingUp,
  Clock,
  FileText,
  GraduationCap,
  Plus,
  Upload,
  UserPlus,
  Download,
  Settings,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
} from "lucide-react"
import Link from "next/link"

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  href,
}: {
  label: string
  value: string | number
  icon: React.ComponentType<{ className?: string }>
  color: string
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="flex items-center gap-4 p-5">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
            <Icon className="size-6 text-card" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  color,
  href,
  actions,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  href: string
  actions: { label: string; icon: React.ComponentType<{ className?: string }> }[]
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
            <Icon className="size-5 text-card" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {actions.map((action) => (
            <Badge key={action.label} variant="outline" className="gap-1 text-[10px] py-1 px-2 cursor-default">
              <action.icon className="size-3" />
              {action.label}
            </Badge>
          ))}
        </div>
        <Link href={href}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs w-full justify-between">
            Go to Management
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

/* ================================================
   TRAINER / ADMIN DASHBOARD
   ================================================ */
function TrainerDashboard({ userName }: { userName: string }) {
  const ongoingSessions = mockSessions.filter((s) => s.status === "ongoing")
  const upcomingSessions = mockSessions.filter((s) => s.status === "upcoming")
  const pendingAssignments = mockAssignments.filter((a) => a.status === "pending")
  const submittedAssignments = mockAssignments.filter((a) => a.status === "submitted")
  const unreadNotifications = mockNotifications.filter((n) => !n.read)
  const totalEnrolled = mockSessions.reduce((a, s) => a + s.enrolledCount, 0)
  const totalPresent = mockAttendance.filter((r) => r.status === "present" || r.status === "late").length
  const participationRate = mockAttendance.length > 0 ? Math.round((totalPresent / mockAttendance.length) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Welcome back, {userName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is an overview of your training management system.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ongoing Sessions" value={ongoingSessions.length} icon={BookOpen} color="bg-primary" href="/dashboard/sessions" />
        <StatCard label="Total Enrolled" value={totalEnrolled} icon={Users} color="bg-wtms-teal" href="/dashboard/attendance" />
        <StatCard label="Pending Reviews" value={submittedAssignments.length} icon={ClipboardCheck} color="bg-wtms-orange" href="/dashboard/assignments" />
        <StatCard label="Participation Rate" value={`${participationRate}%`} icon={BarChart3} color="bg-wtms-green" href="/dashboard/progress" />
      </div>

      {/* Management Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Training Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <QuickActionCard
            title="Session Management"
            description="Create and manage training programs"
            icon={BookOpen}
            color="bg-primary"
            href="/dashboard/sessions"
            actions={[
              { label: "Create Program", icon: Plus },
              { label: "Assign Employees", icon: UserPlus },
              { label: "Set Schedule", icon: Calendar },
              { label: "Enable / Disable", icon: Settings },
            ]}
          />
          <QuickActionCard
            title="Material Management"
            description="Upload and organize training materials"
            icon={FileText}
            color="bg-wtms-teal"
            href="/dashboard/materials"
            actions={[
              { label: "Upload Documents", icon: Upload },
              { label: "Organize by Dept.", icon: Settings },
              { label: "Control Access", icon: Users },
              { label: "PDF / Slides / Video", icon: FileText },
            ]}
          />
          <QuickActionCard
            title="Assessment Management"
            description="Create quizzes, assignments, and grade work"
            icon={ClipboardCheck}
            color="bg-wtms-orange"
            href="/dashboard/assignments"
            actions={[
              { label: "Create Quiz", icon: Plus },
              { label: "Set Deadline", icon: Calendar },
              { label: "Grade Work", icon: CheckCircle2 },
              { label: "View Submissions", icon: FileText },
            ]}
          />
          <QuickActionCard
            title="Progress Tracking"
            description="Monitor individual employee progress"
            icon={BarChart3}
            color="bg-wtms-green"
            href="/dashboard/progress"
            actions={[
              { label: "Per Employee", icon: Users },
              { label: "Per Session", icon: BookOpen },
              { label: "Export PDF", icon: Download },
              { label: "Analytics View", icon: TrendingUp },
            ]}
          />
          <QuickActionCard
            title="Attendance Tracking"
            description="Record and monitor attendance per session"
            icon={Users}
            color="bg-primary"
            href="/dashboard/attendance"
            actions={[
              { label: "Record Attendance", icon: CheckCircle2 },
              { label: "Participation Rate", icon: BarChart3 },
              { label: "Export Report", icon: Download },
              { label: "View History", icon: Clock },
            ]}
          />
          <QuickActionCard
            title="Notifications & Reminders"
            description="Manage automated alerts and reminders"
            icon={Bell}
            color="bg-wtms-teal"
            href="/dashboard/notifications"
            actions={[
              { label: "Material Alert", icon: FileText },
              { label: "Deadline Reminder", icon: AlertTriangle },
              { label: "Session Reminder", icon: Calendar },
              { label: "Performance Report", icon: Megaphone },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ongoing Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Ongoing Sessions</CardTitle>
            <Link href="/dashboard/sessions" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {ongoingSessions.map((session) => (
              <div key={session.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{session.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {session.trainer} &middot; {session.department}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={(session.enrolledCount / session.maxCapacity) * 100} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {session.enrolledCount}/{session.maxCapacity}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px] bg-wtms-teal/10 text-wtms-teal border-0">
                  <Clock className="size-3 mr-1" />
                  Ongoing
                </Badge>
              </div>
            ))}
            {ongoingSessions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No ongoing sessions.</p>
            )}
          </CardContent>
        </Card>

        {/* Submissions Needing Review */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Submitted Work to Review</CardTitle>
            <Link href="/dashboard/assignments" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {submittedAssignments.length > 0 ? (
              submittedAssignments.map((a) => (
                <div key={a.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-wtms-orange/10">
                    <ClipboardCheck className="size-5 text-wtms-orange" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.sessionTitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-[10px] capitalize">{a.type}</Badge>
                      <span className="text-xs text-muted-foreground">Max: {a.maxScore} pts</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs shrink-0">
                    Grade
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle2 className="size-8 mx-auto text-wtms-green/40" />
                <p className="text-sm text-muted-foreground mt-2">All submissions reviewed!</p>
              </div>
            )}
            {/* Also show pending assignments needing attention */}
            {pendingAssignments.length > 0 && (
              <div className="rounded-lg bg-wtms-orange/5 border border-wtms-orange/20 p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-wtms-orange" />
                  <p className="text-xs font-medium text-foreground">{pendingAssignments.length} assignments with upcoming deadlines</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Upcoming Sessions</CardTitle>
            <Link href="/dashboard/sessions" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{session.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{session.department}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="size-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      Starts {new Date(session.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px] bg-primary/10 text-primary border-0">
                  <Clock className="size-3 mr-1" />
                  Upcoming
                </Badge>
              </div>
            ))}
            {upcomingSessions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No upcoming sessions.</p>
            )}
          </CardContent>
        </Card>

        {/* Announcements / Recent Notifications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Recent Notifications</CardTitle>
            <Link href="/dashboard/notifications" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg p-3 bg-muted/50">
                <div className={`mt-0.5 size-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(n.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ================================================
   EMPLOYEE DASHBOARD
   ================================================ */
function EmployeeDashboard({ userName }: { userName: string }) {
  const ongoingSessions = mockSessions.filter((s) => s.status === "ongoing")
  const pendingAssignments = mockAssignments.filter((a) => a.status === "pending")
  const unreadNotifications = mockNotifications.filter((n) => !n.read)
  const inProgressCourses = mockProgress.filter((p) => p.status === "in-progress")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Welcome back, {userName.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          Here is your training overview for today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Ongoing Sessions" value={ongoingSessions.length} icon={BookOpen} color="bg-primary" href="/dashboard/my-sessions" />
        <StatCard label="Upcoming Deadlines" value={pendingAssignments.length} icon={ClipboardCheck} color="bg-wtms-teal" href="/dashboard/assignments" />
        <StatCard label="Unread Notifications" value={unreadNotifications.length} icon={Bell} color="bg-wtms-orange" href="/dashboard/notifications" />
        <StatCard label="Courses In Progress" value={inProgressCourses.length} icon={BarChart3} color="bg-wtms-green" href="/dashboard/my-progress" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ongoing Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Ongoing Sessions</CardTitle>
            <Link href="/dashboard/my-sessions" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {ongoingSessions.map((session) => (
              <div key={session.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{session.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{session.trainer} &middot; {session.department}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={(session.enrolledCount / session.maxCapacity) * 100} className="h-1.5 flex-1" />
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">{session.enrolledCount}/{session.maxCapacity}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0 text-[10px] bg-wtms-teal/10 text-wtms-teal border-0">
                  <Clock className="size-3 mr-1" />
                  Ongoing
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Upcoming Deadlines</CardTitle>
            <Link href="/dashboard/assignments" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${assignment.type === "quiz" ? "bg-wtms-orange/10" : "bg-wtms-green/10"}`}>
                  <ClipboardCheck className={`size-5 ${assignment.type === "quiz" ? "text-wtms-orange" : "text-wtms-green"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{assignment.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{assignment.sessionTitle}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="size-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Due: {new Date(assignment.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
                <Badge variant="outline" className="shrink-0 text-[10px] capitalize">{assignment.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Progress */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">My Progress</CardTitle>
            <Link href="/dashboard/my-progress" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockProgress.filter((p) => p.status !== "not-started").map((progress) => (
              <div key={progress.sessionTitle} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{progress.sessionTitle}</p>
                  <span className="text-xs text-muted-foreground">{progress.completionRate}%</span>
                </div>
                <Progress value={progress.completionRate} className="h-2" />
                {progress.score > 0 && (
                  <div className="flex items-center gap-1">
                    <TrendingUp className="size-3 text-wtms-green" />
                    <span className="text-xs text-muted-foreground">Score: {progress.score}%</span>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Announcements</CardTitle>
            <Link href="/dashboard/notifications" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotifications.slice(0, 4).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg p-3 bg-muted/50">
                <div className={`mt-0.5 size-2 shrink-0 rounded-full ${n.read ? "bg-muted-foreground/30" : "bg-primary"}`} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    {new Date(n.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ================================================
   MAIN PAGE ROUTER
   ================================================ */
export default function DashboardPage() {
  const { user } = useAuth()
  if (!user) return null

  const isTrainerOrAdmin = user.role === "trainer" || user.role === "admin"

  return isTrainerOrAdmin ? (
    <TrainerDashboard userName={user.name} />
  ) : (
    <EmployeeDashboard userName={user.name} />
  )
}
