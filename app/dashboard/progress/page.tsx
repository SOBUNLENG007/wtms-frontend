"use client"

import { useAuth } from "@/lib/auth-store"
import { mockProgress, mockSessions } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  Users,
  TrendingUp,
  Download,
  CheckCircle2,
  Clock,
  AlertCircle,
  PieChart,
} from "lucide-react"

const statusCfg = {
  completed: { label: "Complete", icon: CheckCircle2, color: "bg-wtms-green/10 text-wtms-green border-0" },
  "in-progress": { label: "In Progress", icon: Clock, color: "bg-wtms-orange/10 text-wtms-orange border-0" },
  "not-started": { label: "Not Started", icon: AlertCircle, color: "bg-muted text-muted-foreground border-0" },
}

export default function ProgressPage() {
  const { user } = useAuth()

  const completedCount = mockProgress.filter((p) => p.status === "completed").length
  const inProgressCount = mockProgress.filter((p) => p.status === "in-progress").length
  const avgScore = mockProgress.filter((p) => p.score > 0).reduce((a, p) => a + p.score, 0) / (mockProgress.filter((p) => p.score > 0).length || 1)
  const avgCompletion = mockProgress.reduce((a, p) => a + p.completionRate, 0) / mockProgress.length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progress & Performance Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor employee progress, generate performance reports, and view analytics.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2 text-sm">
            <Users className="size-4" />
            Per Employee
          </Button>
          <Button variant="outline" className="gap-2 text-sm">
            <BarChart3 className="size-4" />
            Per Session / Per Dept.
          </Button>
          <Button variant="outline" className="gap-2 text-sm">
            <Download className="size-4" />
            Export PDF
          </Button>
          <Button className="gap-2 text-sm">
            <PieChart className="size-4" />
            Export for Mgmt. Review
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-wtms-green">
              <CheckCircle2 className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-wtms-orange">
              <Clock className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{inProgressCount}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary">
              <TrendingUp className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Math.round(avgScore)}%</p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-wtms-teal">
              <BarChart3 className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{Math.round(avgCompletion)}%</p>
              <p className="text-sm text-muted-foreground">Avg Completion</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-employee progress table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">Training Completion Status</CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              <Users className="size-3 mr-1" />
              Per Employee / Per Session
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Training Session</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Completion</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Score</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockProgress.map((p) => {
                  const cfg = statusCfg[p.status]
                  const StatusIcon = cfg.icon
                  return (
                    <tr key={p.sessionTitle} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4">
                        <p className="font-medium text-foreground">{p.sessionTitle}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Progress value={p.completionRate} className="h-2 w-24" />
                          <span className="text-xs text-muted-foreground w-10">{p.completionRate}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm font-medium ${p.score > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                          {p.score > 0 ? `${p.score}%` : "-"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${cfg.color}`}>
                          <StatusIcon className="size-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Session breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">Session Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {mockSessions.map((session) => (
              <div key={session.id} className="rounded-lg border border-border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{session.title}</p>
                  <Badge variant="outline" className="text-[10px] capitalize">{session.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Enrollment</span>
                    <span>{session.enrolledCount}/{session.maxCapacity}</span>
                  </div>
                  <Progress value={(session.enrolledCount / session.maxCapacity) * 100} className="h-1.5" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{session.department}</span>
                  <span>&middot;</span>
                  <span>{session.trainer}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
