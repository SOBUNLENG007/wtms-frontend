"use client"

import { useState } from "react"
import { mockAttendance, mockSessions } from "@/lib/mock-data"
import type { AttendanceRecord } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Download,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  Calendar,
  Percent,
} from "lucide-react"

const attendanceCfg = {
  present: { label: "Present", icon: CheckCircle2, color: "bg-wtms-green/10 text-wtms-green border-0" },
  absent: { label: "Absent", icon: XCircle, color: "bg-destructive/10 text-destructive border-0" },
  late: { label: "Late", icon: Clock, color: "bg-wtms-orange/10 text-wtms-orange border-0" },
}

export default function AttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance)
  const [sessionFilter, setSessionFilter] = useState("all")

  const filtered = sessionFilter === "all" ? records : records.filter((r) => r.sessionTitle === sessionFilter)

  const totalPresent = filtered.filter((r) => r.status === "present").length
  const totalAbsent = filtered.filter((r) => r.status === "absent").length
  const totalLate = filtered.filter((r) => r.status === "late").length
  const participationRate = filtered.length > 0 ? Math.round(((totalPresent + totalLate) / filtered.length) * 100) : 0

  const sessions = [...new Set(records.map((r) => r.sessionTitle))]

  function toggleAttendance(id: string) {
    setRecords(
      records.map((r) => {
        if (r.id !== id) return r
        const next = r.status === "present" ? "absent" : r.status === "absent" ? "late" : "present"
        return { ...r, status: next as AttendanceRecord["status"] }
      })
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Record attendance per session, monitor participation rate, export attendance reports, and view history per employee/session.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 text-sm">
            <Download className="size-4" />
            CSV Export
          </Button>
          <Button variant="outline" className="gap-2 text-sm">
            <Download className="size-4" />
            PDF Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-wtms-green">
              <CheckCircle2 className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalPresent}</p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-destructive">
              <XCircle className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalAbsent}</p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-wtms-orange">
              <Clock className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalLate}</p>
              <p className="text-sm text-muted-foreground">Late</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary">
              <Percent className="size-6 text-card" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{participationRate}%</p>
              <p className="text-sm text-muted-foreground">Participation</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <BarChart3 className="size-4 text-muted-foreground" />
        <Select value={sessionFilter} onValueChange={setSessionFilter}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by session" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sessions</SelectItem>
            {sessions.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold text-foreground">Attendance Records</CardTitle>
            <Badge variant="secondary" className="text-[10px]">
              <Users className="size-3 mr-1" />
              Per Employee / Session
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record) => {
                  const cfg = attendanceCfg[record.status]
                  const StatusIcon = cfg.icon
                  return (
                    <tr key={record.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-foreground">{record.employee}</td>
                      <td className="py-3 px-4 text-muted-foreground">{record.sessionTitle}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {new Date(record.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={`text-[10px] ${cfg.color}`}>
                          <StatusIcon className="size-3 mr-1" />
                          {cfg.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => toggleAttendance(record.id)}
                        >
                          Toggle
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Per-session summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-foreground">Per-Session Participation Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sessions.map((session) => {
              const sessionRecords = records.filter((r) => r.sessionTitle === session)
              const present = sessionRecords.filter((r) => r.status === "present" || r.status === "late").length
              const rate = sessionRecords.length > 0 ? Math.round((present / sessionRecords.length) * 100) : 0
              return (
                <div key={session} className="rounded-lg border border-border p-4 space-y-2">
                  <p className="text-sm font-medium text-foreground">{session}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{sessionRecords.length} records</span>
                    <span className="font-semibold text-foreground">{rate}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-wtms-green transition-all" style={{ width: `${rate}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
