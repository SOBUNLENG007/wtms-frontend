 

"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-store"
import { RoleGuard } from "@/components/auth/role-guard"
import { mockSessions } from "@/lib/mock-data"
import type { TrainingSession } from "@/lib/mock-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  Plus,
  Search,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Play,
  Filter,
} from "lucide-react"

const statusConfig = {
  ongoing: { label: "Ongoing", color: "bg-wtms-teal/10 text-wtms-teal border-0" },
  upcoming: { label: "Upcoming", color: "bg-primary/10 text-primary border-0" },
  completed: { label: "Completed", color: "bg-wtms-green/10 text-wtms-green border-0" },
}

const statusIcons = {
  ongoing: Play,
  upcoming: Clock,
  completed: CheckCircle2,
}

function SessionsPageContent() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<TrainingSession[]>(mockSessions)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "ongoing" | "upcoming" | "completed">("all")
  const [showCreate, setShowCreate] = useState(false)
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null)

  const isAdmin = user?.role === "admin"
  const isTrainer = user?.role === "trainer"
  const canManageSessions = isAdmin || isTrainer

  const filtered = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase())

    const matchesFilter = filter === "all" || s.status === filter
    return matchesSearch && matchesFilter
  })

  function handleCreateSession(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!canManageSessions) return

    const fd = new FormData(e.currentTarget)

    const newSession: TrainingSession = {
      id: `s${Date.now()}`,
      title: fd.get("title") as string,
      description: fd.get("description") as string,
      trainer: user?.name || "",
      department: fd.get("department") as string,
      startDate: fd.get("startDate") as string,
      endDate: fd.get("endDate") as string,
      status: "upcoming",
      enrolledCount: 0,
      maxCapacity: Number(fd.get("capacity")) || 30,
    }

    setSessions([newSession, ...sessions])
    setShowCreate(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Sessions</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage training programs by department or team. Assign employees, set schedules, and control session status.
          </p>
        </div>

        {canManageSessions && (
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="size-4" />
            Create Session
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sessions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          {(["all", "ongoing", "upcoming", "completed"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className="capitalize text-xs"
            >
              {f}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((session) => {
          const StatusIcon = statusIcons[session.status]
          const cfg = statusConfig[session.status]

          return (
            <Card
              key={session.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => setSelectedSession(session)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold leading-tight text-foreground">
                        {session.title}
                      </CardTitle>
                      <p className="mt-0.5 text-xs text-muted-foreground">{session.department}</p>
                    </div>
                  </div>

                  <Badge className={`shrink-0 text-[10px] ${cfg.color}`}>
                    <StatusIcon className="mr-1 size-3" />
                    {cfg.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="line-clamp-2 text-xs text-muted-foreground">{session.description}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(session.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(session.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {session.enrolledCount}/{session.maxCapacity}
                  </span>
                </div>

                <Progress
                  value={(session.enrolledCount / session.maxCapacity) * 100}
                  className="h-1.5"
                />

                <p className="text-[10px] text-muted-foreground">Trainer: {session.trainer}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <BookOpen className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No sessions found.</p>
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Training Session</DialogTitle>
            <DialogDescription>Set up a new training program for your team.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateSession} className="mt-2 space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground">Title</Label>
              <Input name="title" required placeholder="e.g. Cybersecurity Fundamentals" />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Description</Label>
              <Textarea
                name="description"
                required
                placeholder="Brief description of the training..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground">Department</Label>
                <Input name="department" required placeholder="e.g. IT" />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Max Capacity</Label>
                <Input name="capacity" type="number" required defaultValue={30} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground">Start Date</Label>
                <Input name="startDate" type="date" required />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">End Date</Label>
                <Input name="endDate" type="date" required />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Session</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="sm:max-w-lg">
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">{selectedSession.title}</DialogTitle>
                <DialogDescription>{selectedSession.department} Department</DialogDescription>
              </DialogHeader>

              <div className="mt-2 space-y-4">
                <p className="text-sm text-muted-foreground">{selectedSession.description}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                    <p className="mt-0.5 text-sm font-medium capitalize text-foreground">
                      {selectedSession.status}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Trainer</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {selectedSession.trainer}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Duration</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {new Date(selectedSession.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      -{" "}
                      {new Date(selectedSession.endDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Enrollment</p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {selectedSession.enrolledCount} / {selectedSession.maxCapacity}
                    </p>
                  </div>
                </div>

                {canManageSessions && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Users className="size-3.5" />
                        Assign Employees
                      </Button>

                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Calendar className="size-3.5" />
                        Set Start & End Date
                      </Button>

                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Play className="size-3.5" />
                        {selectedSession.status === "upcoming" ? "Enable" : "Disable"}
                      </Button>

                      <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                        <Clock className="size-3.5" />
                        Schedule Session
                      </Button>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button variant="secondary" size="sm" className="flex-1 text-xs">
                        Update
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex-1 text-xs"
                        onClick={() => {
                          setSessions(sessions.filter((s) => s.id !== selectedSession.id))
                          setSelectedSession(null)
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function SessionsPage() {
  return (
    <RoleGuard allowed={["admin", "trainer"]}>
      <SessionsPageContent />
    </RoleGuard>
  )
}