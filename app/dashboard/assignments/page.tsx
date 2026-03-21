 
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-store"
import { RoleGuard } from "@/components/auth/role-guard"
import { mockAssignments } from "@/lib/mock-data"
import type { Assignment } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ClipboardCheck,
  Plus,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Send,
  Star,
  MessageSquare,
} from "lucide-react"

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-wtms-orange/10 text-wtms-orange border-0",
  },
  submitted: {
    label: "Submitted",
    icon: Send,
    color: "bg-primary/10 text-primary border-0",
  },
  graded: {
    label: "Graded",
    icon: CheckCircle2,
    color: "bg-wtms-green/10 text-wtms-green border-0",
  },
  overdue: {
    label: "Overdue",
    icon: AlertTriangle,
    color: "bg-destructive/10 text-destructive border-0",
  },
}

function AssignmentsPageContent() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const isAdmin = user?.role === "admin"
  const isTrainer = user?.role === "trainer"
  const isEmployee = user?.role === "employee"
  const canManageAssignments = isAdmin || isTrainer

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.sessionTitle.toLowerCase().includes(search.toLowerCase())
  )

  const pending = filtered.filter((a) => a.status === "pending")
  const submitted = filtered.filter((a) => a.status === "submitted")
  const graded = filtered.filter((a) => a.status === "graded")

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canManageAssignments) return

    const fd = new FormData(e.currentTarget)

    const newAssignment: Assignment = {
      id: `a${Date.now()}`,
      title: fd.get("title") as string,
      type: ((fd.get("type") as string) || "assignment") as "assignment" | "quiz",
      sessionId: "s1",
      sessionTitle: (fd.get("session") as string) || "Cybersecurity Fundamentals",
      deadline: fd.get("deadline") as string,
      status: "pending",
      maxScore: Number(fd.get("maxScore")) || 100,
      allowLate: fd.get("allowLate") === "yes",
    }

    setAssignments([newAssignment, ...assignments])
    setShowCreate(false)
  }

  function handleSubmitWork() {
    if (!isEmployee || !selectedAssignment) return

    setAssignments(
      assignments.map((a) =>
        a.id === selectedAssignment.id ? { ...a, status: "submitted" as const } : a
      )
    )
    setShowSubmit(false)
    setSelectedAssignment(null)
  }

  function handleGradeSelected() {
    if (!canManageAssignments || !selectedAssignment) return

    setAssignments(
      assignments.map((a) =>
        a.id === selectedAssignment.id
          ? {
              ...a,
              status: "graded" as const,
              score: Math.round(a.maxScore * 0.85),
            }
          : a
      )
    )
    setSelectedAssignment(null)
  }

  function AssignmentCard({ assignment }: { assignment: Assignment }) {
    const cfg = statusConfig[assignment.status]
    const StatusIcon = cfg.icon

    return (
      <Card
        className="cursor-pointer transition-shadow hover:shadow-md"
        onClick={() => setSelectedAssignment(assignment)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                assignment.type === "quiz" ? "bg-wtms-orange/10" : "bg-primary/10"
              }`}
            >
              {assignment.type === "quiz" ? (
                <FileQuestion className="size-5 text-wtms-orange" />
              ) : (
                <ClipboardCheck className="size-5 text-primary" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-sm font-medium text-foreground">
                  {assignment.title}
                </p>
                <Badge className={`shrink-0 text-[10px] ${cfg.color}`}>
                  <StatusIcon className="mr-1 size-3" />
                  {cfg.label}
                </Badge>
              </div>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {assignment.sessionTitle}
              </p>

              <div className="mt-2 flex items-center gap-4">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  Due:{" "}
                  {new Date(assignment.deadline).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3" />
                  {assignment.score !== undefined ? `${assignment.score}/` : ""}
                  {assignment.maxScore} pts
                </span>

                <Badge variant="outline" className="text-[10px] capitalize">
                  {assignment.type}
                </Badge>

                {assignment.allowLate && (
                  <Badge
                    variant="outline"
                    className="border-wtms-teal/30 text-[10px] text-wtms-teal"
                  >
                    Late OK
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {canManageAssignments ? "Assignment & Assessment Management" : "My Assignments"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {canManageAssignments
              ? "Create quizzes, assignments, set deadlines, and grade submitted work."
              : "View, submit, and track your assignments and quizzes."}
          </p>
        </div>

        {canManageAssignments && (
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="size-4" />
            Create Assignment
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search assignments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="size-3.5" />
            Pending ({pending.length})
          </TabsTrigger>
          <TabsTrigger value="submitted" className="gap-1.5">
            <Send className="size-3.5" />
            Submitted ({submitted.length})
          </TabsTrigger>
          <TabsTrigger value="graded" className="gap-1.5">
            <CheckCircle2 className="size-3.5" />
            Graded ({graded.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4 space-y-3">
          {pending.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
          {pending.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No pending assignments.
            </p>
          )}
        </TabsContent>

        <TabsContent value="submitted" className="mt-4 space-y-3">
          {submitted.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
          {submitted.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No submitted assignments.
            </p>
          )}
        </TabsContent>

        <TabsContent value="graded" className="mt-4 space-y-3">
          {graded.map((a) => (
            <AssignmentCard key={a.id} assignment={a} />
          ))}
          {graded.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No graded assignments.
            </p>
          )}
        </TabsContent>
      </Tabs>

      {/* Detail / Submit Dialog */}
      <Dialog
        open={!!selectedAssignment && !showSubmit}
        onOpenChange={() => setSelectedAssignment(null)}
      >
        <DialogContent className="sm:max-w-md">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  {selectedAssignment.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedAssignment.sessionTitle}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-2 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Type
                    </p>
                    <p className="mt-0.5 text-sm font-medium capitalize text-foreground">
                      {selectedAssignment.type}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Deadline
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {new Date(selectedAssignment.deadline).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Max Score
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-foreground">
                      {selectedAssignment.maxScore} points
                    </p>
                  </div>

                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Status
                    </p>
                    <p className="mt-0.5 text-sm font-medium capitalize text-foreground">
                      {selectedAssignment.status}
                    </p>
                  </div>
                </div>

                {selectedAssignment.score !== undefined && (
                  <div className="rounded-lg border border-wtms-green/20 bg-wtms-green/5 p-4">
                    <div className="flex items-center gap-2">
                      <Star className="size-5 text-wtms-orange" />
                      <span className="text-lg font-bold text-foreground">
                        {selectedAssignment.score}/{selectedAssignment.maxScore}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Your score for this {selectedAssignment.type}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  {isEmployee && selectedAssignment.status === "pending" && (
                    <Button className="flex-1 gap-2" onClick={() => setShowSubmit(true)}>
                      <Send className="size-4" />
                      Submit Work
                    </Button>
                  )}

                  {canManageAssignments && selectedAssignment.status === "submitted" && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-foreground">
                        Grade Submission
                      </p>
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2" onClick={handleGradeSelected}>
                          <Star className="size-4" />
                          Grade
                        </Button>
                        <Button className="flex-1 gap-2" variant="outline">
                          <MessageSquare className="size-4" />
                          Comment
                        </Button>
                        <Button className="flex-1 gap-2" variant="secondary">
                          <Send className="size-4" />
                          Return
                        </Button>
                      </div>
                    </div>
                  )}

                  {canManageAssignments && selectedAssignment.status === "pending" && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">
                        Waiting for employee submissions. Deadline:{" "}
                        {new Date(selectedAssignment.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {canManageAssignments &&
                    selectedAssignment.status === "graded" &&
                    selectedAssignment.score !== undefined && (
                      <div className="rounded-lg border border-wtms-green/20 bg-wtms-green/5 p-3">
                        <p className="text-xs font-medium text-foreground">
                          Graded: {selectedAssignment.score}/{selectedAssignment.maxScore} points
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Submit Work Dialog */}
      <Dialog open={showSubmit} onOpenChange={setShowSubmit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Submit Work</DialogTitle>
            <DialogDescription>{selectedAssignment?.title}</DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            <Textarea
              placeholder="Add a comment or notes about your submission..."
              rows={4}
            />
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
              <Send className="mx-auto size-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">Attach your work files</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmit(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitWork} className="gap-2">
                <Send className="size-4" />
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog */}
      {canManageAssignments && (
        <Dialog open={showCreate} onOpenChange={setShowCreate}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Create Assignment</DialogTitle>
              <DialogDescription>
                Create a new quiz or assignment for a training session.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleCreate} className="mt-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Title</Label>
                <Input name="title" required placeholder="e.g. Module 1 Quiz" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Type</Label>
                  <select
                    name="type"
                    defaultValue="assignment"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="assignment">Assignment</option>
                    <option value="quiz">Quiz / Exam</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Max Score</Label>
                  <Input name="maxScore" type="number" required defaultValue={100} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Deadline</Label>
                  <Input name="deadline" type="date" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Allow Late?</Label>
                  <select
                    name="allowLate"
                    defaultValue="no"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Session</Label>
                <Input
                  name="session"
                  required
                  placeholder="e.g. Cybersecurity Fundamentals"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function AssignmentsPage() {
  return (
    <RoleGuard allowed={["admin", "trainer", "employee"]}>
      <AssignmentsPageContent />
    </RoleGuard>
  )
}
