export type Role = "admin" | "trainer" | "employee"

export interface User {
  id: string
  name: string
  email: string
  role: Role
  department: string
  avatar?: string
}

export interface TrainingSession {
  id: string
  title: string
  description: string
  trainer: string
  department: string
  startDate: string
  endDate: string
  status: "upcoming" | "ongoing" | "completed"
  enrolledCount: number
  maxCapacity: number
}

export interface Material {
  id: string
  title: string
  type: "pdf" | "slides" | "video"
  sessionId: string
  sessionTitle: string
  uploadedBy: string
  uploadedAt: string
  size: string
  accessLevel: "all" | "department" | "specific"
}

export interface Assignment {
  id: string
  title: string
  type: "assignment" | "quiz"
  sessionId: string
  sessionTitle: string
  deadline: string
  status: "pending" | "submitted" | "graded" | "overdue"
  score?: number
  maxScore: number
  allowLate: boolean
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "material" | "deadline" | "session" | "grade" | "announcement"
  timestamp: string
  read: boolean
}

export interface AttendanceRecord {
  id: string
  sessionTitle: string
  date: string
  status: "present" | "absent" | "late"
  employee: string
}

export interface ProgressRecord {
  sessionTitle: string
  completionRate: number
  score: number
  status: "completed" | "in-progress" | "not-started"
}

export const mockUsers: User[] = [
  { id: "1", name: "Admin User", email: "admin@wingbank.com", role: "admin", department: "HR" },
  { id: "2", name: "Sok Vicheka", email: "trainer@wingbank.com", role: "trainer", department: "IT Training" },
  { id: "3", name: "Chan Dara", email: "employee@wingbank.com", role: "employee", department: "Operations" },
]

export const mockSessions: TrainingSession[] = [
  {
    id: "s1", title: "Cybersecurity Fundamentals", description: "Learn the basics of cybersecurity, threats, and best practices for protecting Wing Bank's digital assets.",
    trainer: "Sok Vicheka", department: "IT", startDate: "2026-02-20", endDate: "2026-03-20", status: "ongoing", enrolledCount: 24, maxCapacity: 30,
  },
  {
    id: "s2", title: "Customer Service Excellence", description: "Master advanced customer service techniques tailored for banking.",
    trainer: "Lay Sopheap", department: "Operations", startDate: "2026-03-01", endDate: "2026-03-30", status: "upcoming", enrolledCount: 18, maxCapacity: 25,
  },
  {
    id: "s3", title: "AML/CFT Compliance Training", description: "Understand Anti-Money Laundering and Counter-Financing of Terrorism regulations.",
    trainer: "Kim Sothea", department: "Compliance", startDate: "2026-01-10", endDate: "2026-02-10", status: "completed", enrolledCount: 30, maxCapacity: 30,
  },
  {
    id: "s4", title: "Digital Banking Solutions", description: "Explore new digital banking tools, mobile wallet systems, and fintech integrations.",
    trainer: "Sok Vicheka", department: "IT", startDate: "2026-03-15", endDate: "2026-04-15", status: "upcoming", enrolledCount: 12, maxCapacity: 20,
  },
  {
    id: "s5", title: "Leadership & Team Management", description: "Develop leadership skills for branch managers and team leads.",
    trainer: "Chea Bopha", department: "HR", startDate: "2026-02-01", endDate: "2026-02-28", status: "ongoing", enrolledCount: 15, maxCapacity: 15,
  },
]

export const mockMaterials: Material[] = [
  { id: "m1", title: "Cybersecurity Handbook v2.0", type: "pdf", sessionId: "s1", sessionTitle: "Cybersecurity Fundamentals", uploadedBy: "Sok Vicheka", uploadedAt: "2026-02-18", size: "4.2 MB", accessLevel: "all" },
  { id: "m2", title: "Phishing Attack Prevention", type: "slides", sessionId: "s1", sessionTitle: "Cybersecurity Fundamentals", uploadedBy: "Sok Vicheka", uploadedAt: "2026-02-19", size: "12.8 MB", accessLevel: "all" },
  { id: "m3", title: "Network Security Demo", type: "video", sessionId: "s1", sessionTitle: "Cybersecurity Fundamentals", uploadedBy: "Sok Vicheka", uploadedAt: "2026-02-17", size: "245 MB", accessLevel: "department" },
  { id: "m4", title: "AML Guidelines 2026", type: "pdf", sessionId: "s3", sessionTitle: "AML/CFT Compliance Training", uploadedBy: "Kim Sothea", uploadedAt: "2026-01-10", size: "2.1 MB", accessLevel: "all" },
  { id: "m5", title: "Customer Service Slides", type: "slides", sessionId: "s2", sessionTitle: "Customer Service Excellence", uploadedBy: "Lay Sopheap", uploadedAt: "2026-02-28", size: "8.5 MB", accessLevel: "specific" },
  { id: "m6", title: "Digital Banking Overview", type: "video", sessionId: "s4", sessionTitle: "Digital Banking Solutions", uploadedBy: "Sok Vicheka", uploadedAt: "2026-03-10", size: "180 MB", accessLevel: "all" },
]

export const mockAssignments: Assignment[] = [
  { id: "a1", title: "Cybersecurity Awareness Quiz", type: "quiz", sessionId: "s1", sessionTitle: "Cybersecurity Fundamentals", deadline: "2026-03-01", status: "pending", maxScore: 100, allowLate: false },
  { id: "a2", title: "Incident Response Plan", type: "assignment", sessionId: "s1", sessionTitle: "Cybersecurity Fundamentals", deadline: "2026-03-10", status: "pending", maxScore: 50, allowLate: true },
  { id: "a3", title: "AML Case Study Analysis", type: "assignment", sessionId: "s3", sessionTitle: "AML/CFT Compliance Training", deadline: "2026-02-05", status: "graded", score: 42, maxScore: 50, allowLate: false },
  { id: "a4", title: "Compliance Final Exam", type: "quiz", sessionId: "s3", sessionTitle: "AML/CFT Compliance Training", deadline: "2026-02-08", status: "graded", score: 88, maxScore: 100, allowLate: false },
  { id: "a5", title: "Customer Scenario Roleplay", type: "assignment", sessionId: "s2", sessionTitle: "Customer Service Excellence", deadline: "2026-03-20", status: "pending", maxScore: 40, allowLate: true },
]

export const mockNotifications: Notification[] = [
  { id: "n1", title: "New Material Available", message: "Cybersecurity Handbook v2.0 has been uploaded to Cybersecurity Fundamentals.", type: "material", timestamp: "2026-02-19T09:00:00", read: false },
  { id: "n2", title: "Assignment Deadline Reminder", message: "Cybersecurity Awareness Quiz is due on March 1st.", type: "deadline", timestamp: "2026-02-19T08:00:00", read: false },
  { id: "n3", title: "Session Starting Soon", message: "Customer Service Excellence starts on March 1st.", type: "session", timestamp: "2026-02-18T14:00:00", read: true },
  { id: "n4", title: "Grade Posted", message: "Your AML Case Study Analysis has been graded: 42/50.", type: "grade", timestamp: "2026-02-15T10:30:00", read: true },
  { id: "n5", title: "Announcement", message: "All staff must complete Cybersecurity training by end of Q1.", type: "announcement", timestamp: "2026-02-14T09:00:00", read: true },
  { id: "n6", title: "New Material Available", message: "Phishing Attack Prevention slides uploaded.", type: "material", timestamp: "2026-02-19T10:00:00", read: false },
]

export const mockAttendance: AttendanceRecord[] = [
  { id: "at1", sessionTitle: "Cybersecurity Fundamentals", date: "2026-02-20", status: "present", employee: "Chan Dara" },
  { id: "at2", sessionTitle: "Cybersecurity Fundamentals", date: "2026-02-21", status: "present", employee: "Chan Dara" },
  { id: "at3", sessionTitle: "Cybersecurity Fundamentals", date: "2026-02-22", status: "late", employee: "Chan Dara" },
  { id: "at4", sessionTitle: "AML/CFT Compliance Training", date: "2026-01-15", status: "present", employee: "Chan Dara" },
  { id: "at5", sessionTitle: "AML/CFT Compliance Training", date: "2026-01-16", status: "absent", employee: "Chan Dara" },
  { id: "at6", sessionTitle: "AML/CFT Compliance Training", date: "2026-01-17", status: "present", employee: "Chan Dara" },
  { id: "at7", sessionTitle: "Leadership & Team Management", date: "2026-02-05", status: "present", employee: "Chan Dara" },
]

export const mockProgress: ProgressRecord[] = [
  { sessionTitle: "Cybersecurity Fundamentals", completionRate: 65, score: 78, status: "in-progress" },
  { sessionTitle: "AML/CFT Compliance Training", completionRate: 100, score: 86, status: "completed" },
  { sessionTitle: "Leadership & Team Management", completionRate: 40, score: 0, status: "in-progress" },
  { sessionTitle: "Customer Service Excellence", completionRate: 0, score: 0, status: "not-started" },
  { sessionTitle: "Digital Banking Solutions", completionRate: 0, score: 0, status: "not-started" },
]
