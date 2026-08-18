"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
  requested_role: string | null;
  approval_status: string;
  is_active: boolean;
  created_at: string;
}

const ROLES = ["owner", "director", "manager", "receptionist", "trainer", "staff", "student", "guest"];
const APPROVALS = ["pending", "approved", "rejected", "suspended"];
const STAFF_ROLES = ["owner", "director", "manager", "receptionist", "trainer", "staff"];

export default function UsersManager({
  initialProfiles,
  courses,
  canManage,
}: {
  initialProfiles: Profile[];
  courses: { id: string; name: string }[];
  canManage: boolean;
}) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [courseByUser, setCourseByUser] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const pending = useMemo(
    () => profiles.filter((p) => p.approval_status === "pending"),
    [profiles]
  );

  async function updateProfile(id: string, patch: Partial<Profile>) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", id)
      .select("id, full_name, email, phone, role, requested_role, approval_status, is_active, created_at")
      .single();

    if (error) throw error;
    setProfiles((prev) => prev.map((p) => (p.id === id ? data as Profile : p)));
  }

  async function approve(profile: Profile, role: "student" | "staff") {
    if (!canManage) return;
    setSavingId(profile.id);
    setMessage("");

    try {
      await updateProfile(profile.id, {
        role,
        approval_status: "approved",
        is_active: true,
      });

      if (role === "student") {
        const courseId = courseByUser[profile.id] || null;
        const supabase = createClient();

        const byProfile = await supabase
          .from("students")
          .select("id")
          .eq("profile_id", profile.id)
          .limit(1)
          .maybeSingle();

        let studentId = byProfile.data?.id ?? null;

        if (!studentId && profile.email) {
          const byEmail = await supabase
            .from("students")
            .select("id")
            .eq("email", profile.email)
            .limit(1)
            .maybeSingle();
          studentId = byEmail.data?.id ?? null;
        }

        const payload = {
          profile_id: profile.id,
          name: profile.full_name || profile.email || "Student",
          email: profile.email,
          phone: profile.phone,
          course_id: courseId,
          status: "enrolled",
        };

        if (studentId) {
          const { error } = await supabase.from("students").update(payload).eq("id", studentId);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("students").insert(payload);
          if (error) throw error;
        }
      }

      setMessage(`${profile.full_name || profile.email || "User"} approved as ${role}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Approval failed.");
    } finally {
      setSavingId(null);
    }
  }

  async function reject(profile: Profile) {
    if (!canManage) return;
    setSavingId(profile.id);
    setMessage("");
    try {
      await updateProfile(profile.id, {
        approval_status: "rejected",
        is_active: false,
      });
      setMessage(`${profile.full_name || profile.email || "User"} rejected.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Rejection failed.");
    } finally {
      setSavingId(null);
    }
  }

  async function updateRole(id: string, role: string) {
    if (!canManage) return;
    try {
      await updateProfile(id, { role });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Role update failed.");
    }
  }

  async function toggleActive(profile: Profile) {
    if (!canManage) return;
    try {
      await updateProfile(profile.id, {
        is_active: !profile.is_active,
        approval_status: profile.is_active ? "suspended" : "approved",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Status update failed.");
    }
  }

  return (
    <div className="space-y-8">
      {message && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}

      {pending.length > 0 && (
        <section className="card p-5">
          <div>
            <p className="eyebrow text-gold-600">Approval queue</p>
            <h2 className="mt-1 font-display text-xl text-emerald-900">Pending account requests</h2>
            <p className="mt-1 text-sm text-ink-soft">
              Only an owner/director can approve or reject a new Student or Staff account.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            {pending.map((p) => (
              <div key={p.id} className="rounded-xl border border-emerald-900/10 bg-white/50 p-4">
                <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                  <div>
                    <p className="font-medium text-emerald-900">{p.full_name || "Unnamed user"}</p>
                    <p className="text-xs text-ink-soft">{p.email} · Requested: {p.requested_role || "unknown"}</p>
                    {p.phone && <p className="text-xs text-ink-soft">{p.phone}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {p.requested_role === "student" && (
                      <select
                        value={courseByUser[p.id] ?? ""}
                        onChange={(e) => setCourseByUser((prev) => ({ ...prev, [p.id]: e.target.value }))}
                        className="rounded-lg border border-emerald-900/15 bg-cream px-2.5 py-2 text-xs"
                      >
                        <option value="">Course (optional)</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>{course.name}</option>
                        ))}
                      </select>
                    )}

                    <button
                      disabled={!canManage || savingId === p.id}
                      onClick={() => approve(p, p.requested_role === "staff" ? "staff" : "student")}
                      className="btn-primary px-3 py-2 text-xs disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      disabled={!canManage || savingId === p.id}
                      onClick={() => reject(p)}
                      className="btn-outline px-3 py-2 text-xs text-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3">
          <p className="eyebrow text-emerald-600">Accounts</p>
          <p className="text-xs text-ink-soft">{profiles.length} account{profiles.length === 1 ? "" : "s"}</p>
        </div>
        <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
          <table className="w-full text-sm">
            <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Requested</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Approval</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((p) => (
                <tr key={p.id} className="border-t border-emerald-900/5">
                  <td className="px-4 py-3">{p.full_name ?? "—"}</td>
                  <td className="px-4 py-3 text-ink-soft">{p.email}</td>
                  <td className="px-4 py-3 text-xs text-ink-soft">{p.requested_role ?? "—"}</td>
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
                    <span className="rounded-full bg-gold-100 px-2.5 py-1 text-xs text-gold-800">{p.approval_status}</span>
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
      </section>
    </div>
  );
}
