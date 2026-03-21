 

"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { mockSessions, mockMaterials, mockAssignments, mockAttendance, mockProgress } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  FileText,
  ClipboardCheck,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
  Play,
  Eye,
  Download,
  Presentation,
  Video,
} from "lucide-react";

const typeIcon = {
  pdf: FileText,
  slides: Presentation,
  video: Video,
};

const statusConfig = {
  ongoing: { label: "Ongoing", color: "bg-wtms-teal/10 text-wtms-teal border-0", icon: Play },
  upcoming: { label: "Upcoming", color: "bg-primary/10 text-primary border-0", icon: Clock },
  completed: { label: "Completed", color: "bg-wtms-green/10 text-wtms-green border-0", icon: CheckCircle2 },
};

function MySessionsPageContent() {
  const [selected, setSelected] = useState<string | null>(null);

  const session = selected ? mockSessions.find((s) => s.id === selected) : null;
  const sessionMaterials = selected ? mockMaterials.filter((m) => m.sessionId === selected) : [];
  const sessionAssignments = selected ? mockAssignments.filter((a) => a.sessionId === selected) : [];
  const sessionAttendance = selected
    ? mockAttendance.filter((a) => a.sessionTitle === session?.title)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Sessions</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          View your assigned training sessions, materials, assignments, and track progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockSessions.map((s) => {
          const cfg = statusConfig[s.status];
          const StatusIcon = cfg.icon;
          const progress = mockProgress.find((p) => p.sessionTitle === s.title);

          return (
            <Card
              key={s.id}
              className={`cursor-pointer transition-shadow hover:shadow-md ${
                selected === s.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelected(s.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold leading-tight text-foreground">
                        {s.title}
                      </CardTitle>
                      <p className="mt-0.5 text-xs text-muted-foreground">{s.trainer}</p>
                    </div>
                  </div>

                  <Badge className={`shrink-0 text-[10px] ${cfg.color}`}>
                    <StatusIcon className="mr-1 size-3" />
                    {cfg.label}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Date(s.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    -{" "}
                    {new Date(s.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="size-3" />
                    {s.enrolledCount}/{s.maxCapacity}
                  </span>
                </div>

                {progress && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">
                        {progress.completionRate}%
                      </span>
                    </div>
                    <Progress value={progress.completionRate} className="h-1.5" />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {session && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold text-foreground">
              {session.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{session.description}</p>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="materials">
              <TabsList>
                <TabsTrigger value="materials" className="gap-1.5">
                  <FileText className="size-3.5" />
                  Materials ({sessionMaterials.length})
                </TabsTrigger>

                <TabsTrigger value="assignments" className="gap-1.5">
                  <ClipboardCheck className="size-3.5" />
                  Assignments ({sessionAssignments.length})
                </TabsTrigger>

                <TabsTrigger value="attendance" className="gap-1.5">
                  <Users className="size-3.5" />
                  Attendance ({sessionAttendance.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="materials" className="mt-4 space-y-3">
                {sessionMaterials.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No materials yet.
                  </p>
                ) : (
                  sessionMaterials.map((m) => {
                    const Icon = typeIcon[m.type];

                    return (
                      <div
                        key={m.id}
                        className="flex items-center gap-4 rounded-lg border border-border p-3"
                      >
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <Icon className="size-4 text-primary" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground">
                            {m.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {m.type.toUpperCase()} &middot; {m.size}
                          </p>
                        </div>

                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="size-8">
                            <Eye className="size-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="size-8">
                            <Download className="size-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </TabsContent>

              <TabsContent value="assignments" className="mt-4 space-y-3">
                {sessionAssignments.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No assignments yet.
                  </p>
                ) : (
                  sessionAssignments.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-4 rounded-lg border border-border p-3"
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          a.type === "quiz"
                            ? "bg-wtms-orange/10"
                            : "bg-wtms-green/10"
                        }`}
                      >
                        <ClipboardCheck
                          className={`size-4 ${
                            a.type === "quiz" ? "text-wtms-orange" : "text-wtms-green"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due:{" "}
                          {new Date(a.deadline).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                          {a.score !== undefined && ` | Score: ${a.score}/${a.maxScore}`}
                        </p>
                      </div>

                      <Badge variant="outline" className="text-[10px] capitalize">
                        {a.status}
                      </Badge>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="attendance" className="mt-4 space-y-3">
                {sessionAttendance.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No attendance records.
                  </p>
                ) : (
                  sessionAttendance.map((at) => (
                    <div
                      key={at.id}
                      className="flex items-center gap-4 rounded-lg border border-border p-3"
                    >
                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${
                          at.status === "present"
                            ? "bg-wtms-green/10"
                            : at.status === "late"
                            ? "bg-wtms-orange/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        {at.status === "present" ? (
                          <CheckCircle2 className="size-4 text-wtms-green" />
                        ) : at.status === "late" ? (
                          <Clock className="size-4 text-wtms-orange" />
                        ) : (
                          <span className="flex size-4 items-center justify-center text-xs font-bold text-destructive">
                            X
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          {new Date(at.date).toLocaleDateString("en-US", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      <Badge
                        className={`border-0 text-[10px] ${
                          at.status === "present"
                            ? "bg-wtms-green/10 text-wtms-green"
                            : at.status === "late"
                            ? "bg-wtms-orange/10 text-wtms-orange"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {at.status}
                      </Badge>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function MySessionsPage() {
  return (
    <RoleGuard allowed={["employee"]}>
      <MySessionsPageContent />
    </RoleGuard>
  );
}