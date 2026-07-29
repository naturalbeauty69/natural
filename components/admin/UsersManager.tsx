"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
}

const ROLES = ["owner", "director", "manager", "receptionist", "trainer", "staff", "student", "guest"];

export default function UsersManager({ initialProfiles, canManage }: { initialProfiles: Profile[]; canManage: boolean }) {
  const [profiles, setProfiles] = useState(initialProfiles);

  async function updateRole(id: string, role: string) {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
    if (!error) setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, role } : p)));
  }

  async function toggleActive(profile: Profile) {
    const supabase = createClient();
    const { error } = await supabase.from("profiles").update({ is_active: !profile.is_active }).eq("id", profile.id);
    if (!error) setProfiles((prev) => prev.map((p) => (p.id === profile.id ? { ...p, is_active: !p.is_active } : p)));
  }

  return (
    <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
      <table className="w-full text-sm">
        <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-cream/70">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {profiles.map((p) => (
            <tr key={p.id} className="border-t border-emerald-900/5 dark:border-cream/5">
              <td className="px-4 py-3 text-ink dark:text-cream">{p.full_name ?? "—"}</td>
              <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{p.email}</td>
              <td className="px-4 py-3">
                <select
                  value={p.role}
                  disabled={!canManage}
                  onChange={(e) => updateRole(p.id, e.target.value)}
                  className="rounded-lg border border-emerald-900/15 bg-cream px-2 py-1 text-xs disabled:opacity-60"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => toggleActive(p)}
                  disabled={!canManage}
                  className={`rounded-full px-2.5 py-1 text-xs disabled:opacity-60 ${p.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                  {p.is_active ? "Active" : "Suspended"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
