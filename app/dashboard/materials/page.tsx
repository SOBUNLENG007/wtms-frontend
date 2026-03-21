 
"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-store"
import { RoleGuard } from "@/components/auth/role-guard"
import { mockMaterials } from "@/lib/mock-data"
import type { Material } from "@/lib/mock-data"
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
import {
  FileText,
  Presentation,
  Video,
  Search,
  Download,
  Upload,
  Eye,
  Filter,
  FolderOpen,
  Lock,
  XCircle,
} from "lucide-react"

const typeConfig = {
  pdf: {
    icon: FileText,
    label: "PDF",
    color: "bg-destructive/10 text-destructive",
  },
  slides: {
    icon: Presentation,
    label: "Slides",
    color: "bg-wtms-orange/10 text-wtms-orange",
  },
  video: {
    icon: Video,
    label: "Video",
    color: "bg-primary/10 text-primary",
  },
}

const accessConfig = {
  all: {
    label: "All Users",
    color: "bg-wtms-green/10 text-wtms-green border-0",
  },
  department: {
    label: "Department Only",
    color: "bg-wtms-teal/10 text-wtms-teal border-0",
  },
  specific: {
    label: "Authorized Only",
    color: "bg-wtms-orange/10 text-wtms-orange border-0",
  },
}

function MaterialsPageContent() {
  const { user } = useAuth()
  const [materials, setMaterials] = useState<Material[]>(mockMaterials)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState<"all" | "pdf" | "slides" | "video">("all")
  const [showUpload, setShowUpload] = useState(false)

  const isAdmin = user?.role === "admin"
  const isTrainer = user?.role === "trainer"
  const isEmployee = user?.role === "employee"
  const canManageMaterials = isAdmin || isTrainer

  const filtered = materials.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.sessionTitle.toLowerCase().includes(search.toLowerCase())

    const matchesType = typeFilter === "all" || m.type === typeFilter
    return matchesSearch && matchesType
  })

  const grouped = filtered.reduce<Record<string, Material[]>>((acc, m) => {
    if (!acc[m.sessionTitle]) acc[m.sessionTitle] = []
    acc[m.sessionTitle].push(m)
    return acc
  }, {})

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!canManageMaterials) return

    const fd = new FormData(e.currentTarget)

    const newMaterial: Material = {
      id: `m${Date.now()}`,
      title: fd.get("title") as string,
      type: ((fd.get("type") as string) || "pdf") as Material["type"],
      sessionId: "s1",
      sessionTitle: (fd.get("session") as string) || "Cybersecurity Fundamentals",
      uploadedBy: user?.name || "",
      uploadedAt: new Date().toISOString().split("T")[0],
      size: "1.2 MB",
      accessLevel: ((fd.get("access") as string) || "all") as Material["accessLevel"],
    }

    setMaterials([newMaterial, ...materials])
    setShowUpload(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Training Materials</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {canManageMaterials
              ? "Upload, organize, and manage access to training materials."
              : "Browse and download training materials."}
          </p>
        </div>

        {canManageMaterials && (
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FolderOpen className="size-4" />
              Organize by Dept.
            </Button>

            <Button onClick={() => setShowUpload(true)} className="gap-2">
              <Upload className="size-4" />
              Upload Material
            </Button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="size-4 text-muted-foreground" />
          {(["all", "pdf", "slides", "video"] as const).map((f) => (
            <Button
              key={f}
              variant={typeFilter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setTypeFilter(f)}
              className="capitalize text-xs"
            >
              {f === "all" ? "All" : typeConfig[f].label}
            </Button>
          ))}
        </div>
      </div>

      {/* Materials grouped by session */}
      {Object.entries(grouped).map(([session, mats]) => (
        <div key={session} className="space-y-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="size-4 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">{session}</h2>
            <Badge variant="secondary" className="text-[10px]">
              {mats.length} files
            </Badge>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            {mats.map((material) => {
              const cfg = typeConfig[material.type]
              const acfg = accessConfig[material.accessLevel]
              const TypeIcon = cfg.icon

              return (
                <Card key={material.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${cfg.color}`}
                      >
                        <TypeIcon className="size-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {material.title}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <Badge className={`border-0 text-[10px] ${cfg.color}`}>
                            {cfg.label}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground">
                            {material.size}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Lock className="size-3 text-muted-foreground" />
                            <Badge className={`text-[10px] ${acfg.color}`}>
                              {acfg.label}
                            </Badge>
                          </div>

                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="size-7">
                              <Eye className="size-3.5" />
                              <span className="sr-only">View</span>
                            </Button>

                            <Button variant="ghost" size="icon" className="size-7">
                              <Download className="size-3.5" />
                              <span className="sr-only">Download</span>
                            </Button>

                            {canManageMaterials && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-7 text-destructive hover:text-destructive"
                                onClick={() =>
                                  setMaterials(materials.filter((m) => m.id !== material.id))
                                }
                              >
                                <XCircle className="size-3.5" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            )}
                          </div>
                        </div>

                        <p className="mt-2 text-[10px] text-muted-foreground">
                          By {material.uploadedBy} &middot;{" "}
                          {new Date(material.uploadedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <FileText className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 text-sm text-muted-foreground">No materials found.</p>
        </div>
      )}

      {/* Upload Dialog */}
      {canManageMaterials && (
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">Upload Training Material</DialogTitle>
              <DialogDescription>
                Upload documents, slides, or videos for training sessions.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpload} className="mt-2 space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground">Title</Label>
                <Input name="title" required placeholder="e.g. Cybersecurity Handbook" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-foreground">Type</Label>
                  <select
                    name="type"
                    defaultValue="pdf"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="pdf">PDF</option>
                    <option value="slides">Slides</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-foreground">Access Level</Label>
                  <select
                    name="access"
                    defaultValue="all"
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="all">All Users</option>
                    <option value="department">Department Only</option>
                    <option value="specific">Authorized Only</option>
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

              <div className="rounded-lg border-2 border-dashed border-border p-6 text-center">
                <Upload className="mx-auto size-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop or click to upload
                </p>
                <p className="mt-1 text-xs text-muted-foreground/60">
                  PDF, PPTX, MP4 up to 500MB
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowUpload(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default function MaterialsPage() {
  return (
    <RoleGuard allowed={["admin", "trainer", "employee"]}>
      <MaterialsPageContent />
    </RoleGuard>
  )
}
