 

"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-store";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  X,
  Mail,
  Building,
  BookOpen,
  ShieldCheck,
  GraduationCap,
  User as UserIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type User = {
  id: number;
  name: string;
  email: string;
  role: "Admin" | "Trainer" | "Employee";
  department: string;
  status: "Active" | "Inactive";
  sessions: number;
};

const users: User[] = [
  { id: 1, name: "Dara Pich", email: "dara.pich@wing.com", role: "Trainer", department: "Operations", status: "Active", sessions: 3 },
  { id: 2, name: "Srey Mao", email: "srey.mao@wing.com", role: "Trainer", department: "Compliance", status: "Active", sessions: 2 },
  { id: 3, name: "Channy Kem", email: "channy.kem@wing.com", role: "Employee", department: "Operations", status: "Active", sessions: 5 },
  { id: 4, name: "Bopha Rith", email: "bopha.rith@wing.com", role: "Employee", department: "Sales", status: "Active", sessions: 4 },
  { id: 5, name: "Kosal Chea", email: "kosal.chea@wing.com", role: "Trainer", department: "HR", status: "Active", sessions: 1 },
  { id: 6, name: "Sovann Ly", email: "sovann.ly@wing.com", role: "Employee", department: "Compliance", status: "Inactive", sessions: 2 },
  { id: 7, name: "Sokha Admin", email: "sokha.admin@wing.com", role: "Admin", department: "IT", status: "Active", sessions: 0 },
  { id: 8, name: "Pisey Chan", email: "pisey.chan@wing.com", role: "Employee", department: "HR", status: "Active", sessions: 3 },
];

const getRoleBadge = (role: string) => {
  switch (role) {
    case "Admin":
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-md bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
          <ShieldCheck className="size-3.5" /> {role}
        </span>
      );
    case "Trainer":
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
          <GraduationCap className="size-3.5" /> {role}
        </span>
      );
    default:
      return (
        <span className="flex w-fit items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <UserIcon className="size-3.5" /> {role}
        </span>
      );
  }
};

function UsersPageContent() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const isAdmin = user?.role === "admin";

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl animate-in space-y-6 fade-in duration-500">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f6fff]">Users Management</h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Manage admins, trainers, and employees across all departments
          </p>
        </div>

        {isAdmin && (
          <Button className="h-10 rounded-xl bg-[#1f6fff] px-4 text-white shadow-sm transition-all hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        )}
      </div>

      <div className="flex flex-col items-center gap-3 rounded-t-2xl border border-b-0 border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative w-full max-w-md flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 rounded-lg border-slate-200 pl-10 text-[14px] focus:border-[#1f6fff] focus:ring-[#1f6fff]/20"
          />
        </div>

        {isAdmin && (
          <Button
            variant="outline"
            className="h-10 w-full rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 sm:w-auto"
          >
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        )}
      </div>

      <div className="overflow-hidden rounded-b-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-4 px-6">User Profile</th>
                <th className="p-4">Role</th>
                <th className="p-4">Department</th>
                <th className="p-4">Assigned Sessions</th>
                <th className="p-4">Status</th>
                <th className="p-4 px-6 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => setSelectedUser(u)}
                    className="group cursor-pointer transition-colors hover:bg-blue-50/50"
                  >
                    <td className="p-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-slate-100">
                          <AvatarFallback className="bg-[#1f6fff]/10 text-sm font-bold text-[#1f6fff]">
                            {u.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[14px] font-semibold text-slate-800 transition-colors group-hover:text-[#1f6fff]">
                            {u.name}
                          </p>
                          <p className="text-[12px] text-slate-500">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">{getRoleBadge(u.role)}</td>

                    <td className="p-4 text-[13px] font-medium text-slate-600">{u.department}</td>

                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-[13px] text-slate-600">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        {u.sessions} sessions
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-bold ${
                          u.status === "Active"
                            ? "bg-green-50 text-green-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            u.status === "Active" ? "bg-green-500" : "bg-slate-400"
                          }`}
                        />
                        {u.status}
                      </span>
                    </td>

                    <td className="p-4 px-6 text-right">
                      {isAdmin ? (
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-[#1f6fff]"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">View only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-24 bg-gradient-to-r from-[#1f6fff] to-blue-400">
              <button
                onClick={() => setSelectedUser(null)}
                className="absolute right-4 top-4 rounded-full bg-black/10 p-1.5 text-white transition-colors hover:bg-black/20"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative px-6 pb-8 pt-0">
              <div className="absolute -top-12 left-6">
                <Avatar className="h-24 w-24 border-4 border-white bg-white shadow-sm">
                  <AvatarFallback className="bg-[#1f6fff]/10 text-2xl font-bold text-[#1f6fff]">
                    {selectedUser.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="mb-6 mt-14">
                <h2 className="text-2xl font-bold text-slate-900">{selectedUser.name}</h2>
                <div className="mt-2 flex items-center gap-2">
                  {getRoleBadge(selectedUser.role)}
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      selectedUser.status === "Active"
                        ? "bg-green-50 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {selectedUser.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Mail className="h-4.5 w-4.5 text-[#1f6fff]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-400">Email Address</p>
                    <p className="text-[14px] font-medium text-slate-700">{selectedUser.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Building className="h-4.5 w-4.5 text-[#1f6fff]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-400">Department</p>
                    <p className="text-[14px] font-medium text-slate-700">{selectedUser.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <BookOpen className="h-4.5 w-4.5 text-[#1f6fff]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-slate-400">Training Participation</p>
                    <p className="text-[14px] font-medium text-slate-700">
                      Involved in {selectedUser.sessions} active sessions
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                {isAdmin ? (
                  <>
                    <Button variant="outline" className="h-11 flex-1 rounded-xl border-slate-200">
                      Edit Profile
                    </Button>
                    <Button className="h-11 flex-1 rounded-xl bg-[#1f6fff] text-white shadow-sm hover:bg-blue-700">
                      View Full Report
                    </Button>
                  </>
                ) : (
                  <Button className="h-11 w-full rounded-xl bg-[#1f6fff] text-white shadow-sm hover:bg-blue-700">
                    Close
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <RoleGuard allowed={["admin"]}>
      <UsersPageContent />
    </RoleGuard>
  );
}