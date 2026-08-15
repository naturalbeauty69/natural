"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-admin/browser";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  status: string;
  message: string | null;
  admin_notes: string | null;
  created_at: string;
  courses: { name: string } | null;
};

const statuses = ["pending", "reviewing", "approved", "rejected", "waitlisted", "enrolled"];

export default function CourseApplicationsManager({ initialApplications }: { initialApplications: Application[] }) {
  const [applications, setApplications] = useState(initialApplications);

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase.from("course_applications").update({ status }).eq("id", id);
    if (!error) setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  }

  async function saveNotes(id: string, admin_notes: string) {
    const supabase = createClient();
    const { error } = await supabase.from("course_applications").update({ admin_notes }).eq("id", id);
    if (!error) setApplications((prev) => prev.map((a) => a.id === id ? { ...a, admin_notes } : a));
  }

  return (
    <div className="space-y-4">
      {applications.map((a) => (
        <article key={a.id} className="card p-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="eyebrow text-gold-600">{a.courses?.name ?? "Course"}</p>
              <h2 className="mt-1 font-display text-xl text-emerald-900">{a.full_name}</h2>
              <p className="text-sm text-ink-soft">{a.email} · {a.phone}</p>
              <p className="mt-3 text-sm text-ink-soft">{a.message || "No message provided."}</p>
            </div>
            <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <textarea
            defaultValue={a.admin_notes ?? ""}
            onBlur={(e) => saveNotes(a.id, e.target.value)}
            placeholder="Internal admin notes"
            className="mt-4 min-h-20 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
          />
          <p className="mt-2 text-xs text-ink-soft">Submitted {new Date(a.created_at).toLocaleString()}</p>
        </article>
      ))}
      {!applications.length && <div className="card p-6 text-sm text-ink-soft">No course applications yet.</div>}
    </div>
  );
}
