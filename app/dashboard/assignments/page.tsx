"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-store"
import { mockAssignments } from "@/lib/mock-data"
import type { Assignment } from "@/lib/mock-data"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  pending: { label: "Pending", icon: Clock, color: "bg-wtms-orange/10 text-wtms-orange border-0" },
  submitted: { label: "Submitted", icon: Send, color: "bg-primary/10 text-primary border-0" },
  graded: { label: "Graded", icon: CheckCircle2, color: "bg-wtms-green/10 text-wtms-green border-0" },
  overdue: { label: "Overdue", icon: AlertTriangle, color: "bg-destructive/10 text-destructive border-0" },
}

export default function AssignmentsPage() {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<Assignment[]>(mockAssignments)
  const [search, setSearch] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const isTrainerOrAdmin = user?.role === "trainer" || user?.role === "admin"

  const filtered = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) || a.sessionTitle.toLowerCase().includes(search.toLowerCase())
  )

  const pending = filtered.filter((a) => a.status === "pending")
  const submitted = filtered.filter((a) => a.status === "submitted")
  const graded = filtered.filter((a) => a.status === "graded")

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const newAssignment: Assignment = {
      id: `a${Date.now()}`,
      title: fd.get("title") as string,
      type: (fd.get("type") as "assignment" | "quiz") || "assignment",
      sessionId: "s1",
      sessionTitle: fd.get("session") as string || "Cybersecurity Fundamentals",
      deadline: fd.get("deadline") as string,
      status: "pending",
      maxScore: Number(fd.get("maxScore")) || 100,
      allowLate: fd.get("allowLate") === "yes",
    }
    setAssignments([newAssignment, ...assignments])
    setShowCreate(false)
  }

  function handleSubmitWork() {
    if (selectedAssignment) {
      setAssignments(
        assignments.map((a) => a.id === selectedAssignment.id ? { ...a, status: "submitted" as const } : a)
      )
      setShowSubmit(false)
      setSelectedAssignment(null)
    }
  }

  function AssignmentCard({ assignment }: { assignment: Assignment }) {
    const cfg = statusConfig[assignment.status]
    const StatusIcon = cfg.icon
    return (
      <Card
        className="hover:shadow-md transition-shadow cursor-pointer"
        onClick={() => setSelectedAssignment(assignment)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${assignment.type === "quiz" ? "bg-wtms-orange/10" : "bg-primary/10"}`}>
              {assignment.type === "quiz" ? (
                <FileQuestion className="size-5 text-wtms-orange" />
              ) : (
                <ClipboardCheck className="size-5 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground truncate">{assignment.title}</p>
                <Badge className={`shrink-0 text-[10px] ${cfg.color}`}>
                  <StatusIcon className="size-3 mr-1" />
                  {cfg.label}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{assignment.sessionTitle}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  Due: {new Date(assignment.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3" />
                  {assignment.score !== undefined ? `${assignment.score}/` : ""}{assignment.maxScore} pts
                </span>
                <Badge variant="outline" className="text-[10px] capitalize">{assignment.type}</Badge>
                {assignment.allowLate && (
                  <Badge variant="outline" className="text-[10px] text-wtms-teal border-wtms-teal/30">Late OK</Badge>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isTrainerOrAdmin ? "Assignment & Assessment Management" : "My Assignments"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isTrainerOrAdmin ? "Create quizzes, assignments, set deadlines, and grade submitted work." : "View, submit, and track your assignments and quizzes."}
          </p>
        </div>
        {isTrainerOrAdmin && (
          <Button onClick={() => setShowCreate(true)} className="gap-2">
            <Plus className="size-4" />
            Create Assignment
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input placeholder="Search assignments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
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
        <TabsContent value="pending" className="space-y-3 mt-4">
          {pending.map((a) => <AssignmentCard key={a.id} assignment={a} />)}
          {pending.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No pending assignments.</p>}
        </TabsContent>
        <TabsContent value="submitted" className="space-y-3 mt-4">
          {submitted.map((a) => <AssignmentCard key={a.id} assignment={a} />)}
          {submitted.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No submitted assignments.</p>}
        </TabsContent>
        <TabsContent value="graded" className="space-y-3 mt-4">
          {graded.map((a) => <AssignmentCard key={a.id} assignment={a} />)}
          {graded.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">No graded assignments.</p>}
        </TabsContent>
      </Tabs>

      {/* Detail / Submit Dialog */}
      <Dialog open={!!selectedAssignment && !showSubmit} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedAssignment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground">{selectedAssignment.title}</DialogTitle>
                <DialogDescription>{selectedAssignment.sessionTitle}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Type</p>
                    <p className="text-sm font-medium text-foreground capitalize mt-0.5">{selectedAssignment.type}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Deadline</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{new Date(selectedAssignment.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Max Score</p>
                    <p className="text-sm font-medium text-foreground mt-0.5">{selectedAssignment.maxScore} points</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
                    <p className="text-sm font-medium text-foreground capitalize mt-0.5">{selectedAssignment.status}</p>
                  </div>
                </div>
                {selectedAssignment.score !== undefined && (
                  <div className="rounded-lg bg-wtms-green/5 border border-wtms-green/20 p-4">
                    <div className="flex items-center gap-2">
                      <Star className="size-5 text-wtms-orange" />
                      <span className="text-lg font-bold text-foreground">{selectedAssignment.score}/{selectedAssignment.maxScore}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Your score for this {selectedAssignment.type}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {!isTrainerOrAdmin && selectedAssignment.status === "pending" && (
                    <Button className="flex-1 gap-2" onClick={() => setShowSubmit(true)}>
                      <Send className="size-4" />
                      Submit Work
                    </Button>
                  )}
                  {isTrainerOrAdmin && selectedAssignment.status === "submitted" && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground uppercase tracking-wider">Grade Submission</p>
                      <div className="flex gap-2">
                        <Button className="flex-1 gap-2" onClick={() => {
                          setAssignments(assignments.map((a) => a.id === selectedAssignment.id ? { ...a, status: "graded" as const, score: Math.round(a.maxScore * 0.85) } : a))
                          setSelectedAssignment(null)
                        }}>
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
                  {isTrainerOrAdmin && selectedAssignment.status === "pending" && (
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-xs text-muted-foreground">Waiting for employee submissions. Deadline: {new Date(selectedAssignment.deadline).toLocaleDateString()}</p>
                    </div>
                  )}
                  {isTrainerOrAdmin && selectedAssignment.status === "graded" && selectedAssignment.score !== undefined && (
                    <div className="rounded-lg bg-wtms-green/5 border border-wtms-green/20 p-3">
                      <p className="text-xs font-medium text-foreground">Graded: {selectedAssignment.score}/{selectedAssignment.maxScore} points</p>
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
          <div className="space-y-4 mt-2">
            <Textarea placeholder="Add a comment or notes about your submission..." rows={4} />
            <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
              <Send className="size-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground mt-2">Attach your work files</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSubmit(false)}>Cancel</Button>
              <Button onClick={handleSubmitWork} className="gap-2">
                <Send className="size-4" />
                Submit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Assignment Dialog (Trainer/Admin) */}
      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Create Assignment</DialogTitle>
            <DialogDescription>Create a new quiz or assignment for a training session.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label className="text-foreground">Title</Label>
              <Input name="title" required placeholder="e.g. Module 1 Quiz" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-foreground">Type</Label>
                <Select name="type" defaultValue="assignment">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="quiz">Quiz / Exam</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select name="allowLate" defaultValue="no">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-foreground">Session</Label>
              <Input name="session" required placeholder="e.g. Cybersecurity Fundamentals" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>Cancel</Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
