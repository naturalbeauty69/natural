"use client";

import { useState } from "react";
import { Download, Printer } from "lucide-react";

type Row = Record<string, any>;

function toCsv(rows: Row[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
}

function downloadCsv(rows: Row[], filename: string) {
  const csv = toCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsView({
  appointments,
  students,
  courses,
  services,
  messages,
  reviews,
}: {
  appointments: Row[];
  students: Row[];
  courses: Row[];
  services: Row[];
  messages: Row[];
  reviews: Row[];
}) {
  const reports = [
    { key: "appointments", label: "Appointments", rows: appointments },
    { key: "students", label: "Student Enrollments", rows: students },
    { key: "courses", label: "Courses", rows: courses },
    { key: "services", label: "Services", rows: services },
    { key: "messages", label: "Messages", rows: messages },
    { key: "reviews", label: "Reviews", rows: reviews },
  ];

  const [active, setActive] = useState(reports[0].key);
  const current = reports.find((r) => r.key === active)!;

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {reports.map((r) => (
          <button
            key={r.key}
            onClick={() => setActive(r.key)}
            className={`rounded-full px-3 py-1.5 text-xs ${active === r.key ? "bg-emerald-700 text-cream" : "bg-emerald-50 text-emerald-700"}`}
          >
            {r.label} ({r.rows.length})
          </button>
        ))}
      </div>

      <div className="mb-4 flex gap-2">
        <button onClick={() => downloadCsv(current.rows, `${current.key}.csv`)} className="btn-outline flex items-center gap-2 text-xs">
          <Download className="h-3.5 w-3.5" /> Export CSV (Excel)
        </button>
        <button onClick={() => window.print()} className="btn-outline flex items-center gap-2 text-xs">
          <Printer className="h-3.5 w-3.5" /> Print / Save as PDF
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-cream/70">
            <tr>
              {current.rows[0] && Object.keys(current.rows[0]).map((h) => (
                <th key={h} className="px-4 py-3">{h.replace(/_/g, " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {current.rows.map((row, i) => (
              <tr key={i} className="border-t border-emerald-900/5 dark:border-cream/5">
                {Object.values(row).map((v: any, j) => (
                  <td key={j} className="px-4 py-2.5 text-ink-soft dark:text-cream/70">{String(v ?? "—")}</td>
                ))}
              </tr>
            ))}
            {current.rows.length === 0 && (
              <tr><td className="px-4 py-10 text-center text-ink-soft">No data yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
