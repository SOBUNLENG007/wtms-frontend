"use client"

import { mockProgress, mockAssignments } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  Award,
  BookOpen,
} from "lucide-react"

const statusCfg = {
  completed: { label: "Complete", icon: CheckCircle2, color: "bg-wtms-green/10 text-wtms-green border-0", ringColor: "ring-wtms-green/30" },
  "in-progress": { label: "In Progress", icon: Clock, color: "bg-wtms-orange/10 text-wtms-orange border-0", ringColor: "ring-wtms-orange/30" },
  "not-started": { label: "Not Started", icon: AlertCircle, color: "bg-muted text-muted-foreground border-0", ringColor: "ring-border" },
}

export default function MyProgressPage() {
  const completedCount = mockProgress.filter((p) => p.status === "completed").length
  const inProgressCount = mockProgress.filter((p) => p.status === "in-progress").length
  const totalCourses = mockProgress.length
  const avgCompletion = Math.round(mockProgress.reduce((a, p) => a + p.completionRate, 0) / totalCourses)
  const avgScore = mockProgress.filter((p) => p.score > 0).length > 0
    ? Math.round(mockProgress.filter((p) => p.score > 0).reduce((a, p) => a + p.score, 0) / mockProgress.filter((p) => p.score > 0).length)
    : 0

  const gradedAssignments = mockAssignments.filter((a) => a.status === "graded")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your training progress, completion rate, and performance scores.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
              <Target className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgCompletion}%</p>
              <p className="text-sm text-muted-foreground">Avg Completion</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-wtms-teal">
              <Award className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
              <p className="text-sm text-muted-foreground">Avg Score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Training Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockProgress.map((p) => {
            const cfg = statusCfg[p.status]
            const StatusIcon = cfg.icon
            return (
              <Card key={p.sessionTitle} className={`ring-1 ${cfg.ringColor}`}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="size-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{p.sessionTitle}</p>
                        <Badge className={`mt-1 text-[10px] ${cfg.color}`}>
                          <StatusIcon className="size-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-semibold text-foreground">{p.completionRate}%</span>
                    </div>
                    <Progress value={p.completionRate} className="h-2" />
                  </div>
                  {p.score > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-muted/50 p-2">
                      <TrendingUp className="size-4 text-wtms-green" />
                      <span className="text-xs text-muted-foreground">Performance Score:</span>
                      <span className="text-xs font-bold text-foreground">{p.score}%</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Scores & Feedback */}
      {gradedAssignments.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">Scores & Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gradedAssignments.map((a) => (
              <div key={a.id} className="flex items-center gap-4 rounded-lg border border-border p-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-wtms-green/10">
                  <Award className="size-5 text-wtms-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.sessionTitle}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{a.score}<span className="text-sm text-muted-foreground">/{a.maxScore}</span></p>
                  <p className="text-[10px] text-muted-foreground">{a.score && a.maxScore ? Math.round((a.score / a.maxScore) * 100) : 0}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
