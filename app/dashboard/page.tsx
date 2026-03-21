"use client"

import { useAuth } from "@/lib/auth-store"
import {
  mockSessions,
  mockAssignments,
  mockNotifications,
  mockProgress,
  mockAttendance,
} from "@/lib/mock-data"
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
  Plus,
  Upload,
  UserPlus,
  Download,
  Settings,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Megaphone,
  ShieldCheck,
  Briefcase,
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
      <Card className="cursor-pointer transition-shadow hover:shadow-md">
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
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-4 flex items-start gap-3">
          <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${color}`}>
            <Icon className="size-5 text-card" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {actions.map((action) => (
            <Badge
              key={action.label}
              variant="outline"
              className="cursor-default gap-1 px-2 py-1 text-[10px]"
            >
              <action.icon className="size-3" />
              {action.label}
            </Badge>
          ))}
        </div>

        <Link href={href}>
          <Button variant="ghost" size="sm" className="w-full justify-between gap-1.5 text-xs">
            Go to Management
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

/* ================================================
   ADMIN DASHBOARD
   ================================================ */
function AdminDashboard({ userName }: { userName: string }) {
  const ongoingSessions = mockSessions.filter((s) => s.status === "ongoing")
  const totalUsers = 120
  const totalTrainers = 12
  const totalEmployees = 108
  const unreadNotifications = mockNotifications.filter((n) => !n.read)
  const submittedAssignments = mockAssignments.filter((a) => a.status === "submitted")
  const totalPresent = mockAttendance.filter((r) => r.status === "present" || r.status === "late").length
  const participationRate =
    mockAttendance.length > 0 ? Math.round((totalPresent / mockAttendance.length) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Welcome back, {userName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is the full administrative overview of the training system.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={totalUsers} icon={Users} color="bg-primary" href="/dashboard/users" />
        <StatCard label="Total Trainers" value={totalTrainers} icon={Briefcase} color="bg-wtms-teal" href="/dashboard/trainers" />
        <StatCard label="Ongoing Sessions" value={ongoingSessions.length} icon={BookOpen} color="bg-wtms-orange" href="/dashboard/sessions" />
        <StatCard label="Participation Rate" value={`${participationRate}%`} icon={BarChart3} color="bg-wtms-green" href="/dashboard/reports" />
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">Admin Management</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            title="User Management"
            description="Manage employees, trainers, and admins"
            icon={Users}
            color="bg-primary"
            href="/dashboard/users"
            actions={[
              { label: "Create User", icon: Plus },
              { label: "Assign Role", icon: ShieldCheck },
              { label: "Enable / Disable", icon: Settings },
              { label: "Department Setup", icon: Briefcase },
            ]}
          />
          <QuickActionCard
            title="Training Sessions"
            description="Oversee all training programs"
            icon={BookOpen}
            color="bg-wtms-teal"
            href="/dashboard/sessions"
            actions={[
              { label: "Create Session", icon: Plus },
              { label: "Assign Trainer", icon: UserPlus },
              { label: "Schedule", icon: Calendar },
              { label: "Track Status", icon: Clock },
            ]}
          />
          <QuickActionCard
            title="Reports & Analytics"
            description="Download reports and monitor performance"
            icon={BarChart3}
            color="bg-wtms-orange"
            href="/dashboard/reports"
            actions={[
              { label: "Export PDF", icon: Download },
              { label: "Attendance", icon: Users },
              { label: "Progress", icon: TrendingUp },
              { label: "Assignments", icon: ClipboardCheck },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.sessionTitle}</p>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 text-xs">
                    Review
                  </Button>
                </div>
              ))
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">No submissions waiting.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Recent Notifications</CardTitle>
            <Link href="/dashboard/notifications" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {unreadNotifications.slice(0, 5).map((n) => (
              <div key={n.id} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                <div className="mt-0.5 size-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{n.message}</p>
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
   TRAINER DASHBOARD
   ================================================ */
function TrainerDashboard({ userName }: { userName: string }) {
  const ongoingSessions = mockSessions.filter((s) => s.status === "ongoing")
  const upcomingSessions = mockSessions.filter((s) => s.status === "upcoming")
  const pendingAssignments = mockAssignments.filter((a) => a.status === "pending")
  const submittedAssignments = mockAssignments.filter((a) => a.status === "submitted")
  const totalEnrolled = mockSessions.reduce((a, s) => a + s.enrolledCount, 0)
  const totalPresent = mockAttendance.filter((r) => r.status === "present" || r.status === "late").length
  const participationRate =
    mockAttendance.length > 0 ? Math.round((totalPresent / mockAttendance.length) * 100) : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Welcome back, {userName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is your trainer overview and teaching activity summary.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ongoing Sessions" value={ongoingSessions.length} icon={BookOpen} color="bg-primary" href="/dashboard/sessions" />
        <StatCard label="Total Enrolled" value={totalEnrolled} icon={Users} color="bg-wtms-teal" href="/dashboard/attendance" />
        <StatCard label="Pending Reviews" value={submittedAssignments.length} icon={ClipboardCheck} color="bg-wtms-orange" href="/dashboard/assignments" />
        <StatCard label="Participation Rate" value={`${participationRate}%`} icon={BarChart3} color="bg-wtms-green" href="/dashboard/progress" />
      </div>

      <div>
        <h2 className="mb-4 text-base font-semibold text-foreground">Trainer Management</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <QuickActionCard
            title="Session Management"
            description="Manage assigned training sessions"
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
            description="Upload and manage learning materials"
            icon={FileText}
            color="bg-wtms-teal"
            href="/dashboard/materials"
            actions={[
              { label: "Upload Documents", icon: Upload },
              { label: "Control Access", icon: Users },
              { label: "Slides / PDF", icon: FileText },
              { label: "Organize", icon: Settings },
            ]}
          />
          <QuickActionCard
            title="Assessment Management"
            description="Create and grade assessments"
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
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{session.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{session.department}</p>
                </div>
                <Badge variant="secondary" className="border-0 bg-primary/10 text-[10px] text-primary">
                  Upcoming
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Assignments Needing Attention</CardTitle>
            <Link href="/dashboard/assignments" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((a) => (
                <div key={a.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-wtms-orange/10">
                    <AlertTriangle className="size-5 text-wtms-orange" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{a.sessionTitle}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 className="mx-auto size-8 text-wtms-green/40" />
                <p className="mt-2 text-sm text-muted-foreground">No pending assignments.</p>
              </div>
            )}
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
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">
          Welcome back, {userName.split(" ")[0]}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here is your personal training overview for today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Ongoing Sessions" value={ongoingSessions.length} icon={BookOpen} color="bg-primary" href="/dashboard/my-sessions" />
        <StatCard label="Upcoming Deadlines" value={pendingAssignments.length} icon={ClipboardCheck} color="bg-wtms-teal" href="/dashboard/assignments" />
        <StatCard label="Unread Notifications" value={unreadNotifications.length} icon={Bell} color="bg-wtms-orange" href="/dashboard/notifications" />
        <StatCard label="Courses In Progress" value={inProgressCourses.length} icon={BarChart3} color="bg-wtms-green" href="/dashboard/my-progress" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">My Sessions</CardTitle>
            <Link href="/dashboard/my-sessions" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {ongoingSessions.map((session) => (
              <div key={session.id} className="flex items-start gap-4 rounded-lg border border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{session.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {session.trainer} &middot; {session.department}
                  </p>
                </div>
                <Badge variant="secondary" className="border-0 bg-wtms-teal/10 text-[10px] text-wtms-teal">
                  Ongoing
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-foreground">My Progress</CardTitle>
            <Link href="/dashboard/my-progress" className="text-xs text-primary hover:underline">
              View all
            </Link>
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

  switch (user.role) {
    case "admin":
      return <AdminDashboard userName={user.name} />

    case "trainer":
      return <TrainerDashboard userName={user.name} />

    case "employee":
      return <EmployeeDashboard userName={user.name} />

    default:
      return (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Invalid role: {user.role}
        </div>
      )
  }
}