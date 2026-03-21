 

"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/role-guard";
import { Button } from "@/components/ui/button";
import {
  Download,
  BarChart3,
  Users,
  TrendingUp,
  Award,
  Building2,
  ChevronRight,
  Loader2,
} from "lucide-react";

const departmentStats = [
  { dept: "Operations", employees: 60, completion: 82, avgScore: 78 },
  { dept: "Compliance", employees: 55, completion: 95, avgScore: 84 },
  { dept: "Sales", employees: 45, completion: 65, avgScore: 72 },
  { dept: "HR", employees: 25, completion: 40, avgScore: 0 },
  { dept: "IT", employees: 120, completion: 30, avgScore: 71 },
  { dept: "Finance", employees: 35, completion: 100, avgScore: 88 },
];

const metrics = [
  {
    id: "completion",
    label: "Completion Rate",
    value: "73%",
    icon: BarChart3,
    color: "text-[#1f6fff]",
    bg: "bg-[#1f6fff]/10",
  },
  {
    id: "score",
    label: "Avg. Score",
    value: "79%",
    icon: TrendingUp,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: "learners",
    label: "Active Learners",
    value: "215",
    icon: Users,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    id: "certs",
    label: "Certifications",
    value: "48",
    icon: Award,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
];

function ReportsPageContent() {
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    setTimeout(() => {
      setIsExporting(false);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl animate-in space-y-6 fade-in pb-10 duration-500">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-[22px] font-bold text-[#1f6fff]">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-[13px] text-slate-500">
            Training performance insights and analytics across Wing Bank
          </p>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
        >
          {isExporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#1f6fff]" />
          ) : (
            <Download className="mr-2 h-4 w-4 text-slate-400" />
          )}
          {isExporting ? "Generating PDF..." : "Export All"}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const isActive = activeMetric === metric.id;

          return (
            <div
              key={metric.id}
              onClick={() => setActiveMetric(isActive ? null : metric.id)}
              className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 ${
                isActive
                  ? "border-[#1f6fff] bg-blue-50/30 shadow-md ring-2 ring-[#1f6fff]/20"
                  : "border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
              }`}
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 ${
                  metric.bg
                } ${isActive ? "scale-110" : "group-hover:scale-110"}`}
              >
                <Icon className={`h-6 w-6 ${metric.color}`} />
              </div>
              <div>
                <p
                  className={`text-[13px] font-medium ${
                    isActive ? "text-[#1f6fff]" : "text-slate-500"
                  }`}
                >
                  {metric.label}
                </p>
                <p className="mt-0.5 text-2xl font-bold text-slate-900">
                  {metric.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[#1f6fff]" />
            <h2 className="text-[16px] font-bold text-slate-800">
              Department Performance
            </h2>
          </div>

          {selectedDept && (
            <span className="animate-in rounded-full bg-blue-50 px-3 py-1 text-[12px] font-medium text-[#1f6fff] fade-in">
              Viewing: {selectedDept}
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[12px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="p-4 px-6">Department</th>
                <th className="p-4">Employees</th>
                <th className="w-[250px] p-4">Completion Rate</th>
                <th className="p-4">Avg. Score</th>
                <th className="p-4">Status</th>
                <th className="p-4 px-6"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {departmentStats.map((d, i) => {
                const isSelected = selectedDept === d.dept;

                return (
                  <tr
                    key={i}
                    onClick={() => setSelectedDept(isSelected ? null : d.dept)}
                    className={`group cursor-pointer transition-all duration-200 ${
                      isSelected ? "bg-blue-50/40" : "hover:bg-slate-50"
                    }`}
                  >
                    <td className="p-4 px-6">
                      <p
                        className={`text-[14px] font-semibold transition-colors ${
                          isSelected
                            ? "text-[#1f6fff]"
                            : "text-slate-800 group-hover:text-[#1f6fff]"
                        }`}
                      >
                        {d.dept}
                      </p>
                    </td>

                    <td className="p-4 text-[14px] font-medium text-slate-600">
                      {d.employees}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-full max-w-[120px] overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ease-out ${
                              d.completion === 100
                                ? "bg-green-500"
                                : d.completion >= 50
                                ? "bg-[#1f6fff]"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${d.completion}%` }}
                          />
                        </div>
                        <span className="w-9 text-[13px] font-bold text-slate-700">
                          {d.completion}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-[14px] font-bold text-slate-700">
                      {d.avgScore > 0 ? (
                        `${d.avgScore}%`
                      ) : (
                        <span className="font-normal text-slate-300">N/A</span>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                          d.completion === 100
                            ? "bg-green-50 text-green-600"
                            : d.completion > 50
                            ? "bg-blue-50 text-blue-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            d.completion === 100
                              ? "bg-green-500"
                              : d.completion > 50
                              ? "bg-blue-500"
                              : "bg-amber-500"
                          }`}
                        ></span>
                        {d.completion === 100
                          ? "Complete"
                          : d.completion > 50
                          ? "On Track"
                          : "Behind"}
                      </span>
                    </td>

                    <td className="p-4 px-6 text-right">
                      <ChevronRight
                        className={`h-5 w-5 transition-all duration-200 ${
                          isSelected
                            ? "translate-x-1 text-[#1f6fff]"
                            : "text-slate-300 group-hover:translate-x-1 group-hover:text-[#1f6fff]"
                        }`}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  return (
    <RoleGuard allowed={["admin", "trainer"]}>
      <ReportsPageContent />
    </RoleGuard>
  );
}