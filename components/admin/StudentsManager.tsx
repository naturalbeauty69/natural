"use client";

import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Student {
  id: string;
  photo_url: string | null;
  name: string;
  gender: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  course_id: string | null;
  course_name: string | null;
  enrollment_date: string;
  status: string;
  guardian_name: string | null;
  emergency_contact: string | null;
  notes: string | null;
}

const STATUSES = ["enrolled", "active", "completed", "dropped"];
const emptyForm = {
  name: "", gender: "", phone: "", email: "", address: "", course_id: "",
  status: "enrolled", guardian_name: "", emergency_contact: "", notes: "", photo_url: "",
};

export default function StudentsManager({
  initialStudents,
  courses,
}: {
  initialStudents: Student[];
  courses: { id: string; name: string }[];
}) {
  const [students, setStudents] = useState(initialStudents);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesQuery = !query || s.name.toLowerCase().includes(query.toLowerCase()) || (s.phone ?? "").includes(query);
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [students, query, statusFilter]);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function startEdit(s: Student) {
    setEditingId(s.id);
    setForm({
      name: s.name, gender: s.gender ?? "", phone: s.phone ?? "", email: s.email ?? "",
      address: s.address ?? "", course_id: s.course_id ?? "", status: s.status,
      guardian_name: s.guardian_name ?? "", emergency_contact: s.emergency_contact ?? "",
      notes: s.notes ?? "", photo_url: s.photo_url ?? "",
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    const supabase = createClient();

    const payload = {
      name: form.name,
      gender: form.gender || null,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      course_id: form.course_id || null,
      status: form.status,
      guardian_name: form.guardian_name || null,
      emergency_contact: form.emergency_contact || null,
      notes: form.notes || null,
      photo_url: form.photo_url || null,
    };

    if (editingId) {
      const { error } = await supabase.from("students").update(payload).eq("id", editingId);
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      const courseName = courses.find((c) => c.id === form.course_id)?.name ?? null;
      setStudents((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...payload, course_name: courseName } : s)));
    } else {
      const { data, error } = await supabase.from("students").insert(payload).select().single();
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      const courseName = courses.find((c) => c.id === form.course_id)?.name ?? null;
      setStudents((prev) => [{ ...(data as Student), course_name: courseName }, ...prev]);
    }

    setSaving(false);
    setFormOpen(false);
  }

  async function deleteStudent(id: string) {
    if (!confirm("Delete this student record permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("students").delete().eq("id", id);
    if (!error) setStudents((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or phone…" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft py-2 pl-9 pr-3 text-sm dark:bg-emerald-900 dark:text-cream" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm dark:bg-emerald-900 dark:text-cream">
            <option value="all">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <button onClick={startAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Student
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSave} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">{editingId ? "Edit Student" : "New Student"}</p>
            <button type="button" onClick={() => setFormOpen(false)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              <option value="">Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <select value={form.course_id} onChange={(e) => setForm({ ...form, course_id: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              <option value="">Select Course</option>
              {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input placeholder="Guardian Name" value={form.guardian_name} onChange={(e) => setForm({ ...form, guardian_name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Emergency Contact" value={form.emergency_contact} onChange={(e) => setForm({ ...form, emergency_contact: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          </div>
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <input placeholder="Photo URL (optional)" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          {errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save Student"}</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-cream/70">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-emerald-900/5 dark:border-cream/5">
                <td className="px-4 py-3 font-medium text-ink dark:text-cream">{s.name}</td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{s.course_name ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{s.phone ?? s.email ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{s.enrollment_date}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs text-emerald-700">{s.status}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(s)} aria-label="Edit" className="mr-1 rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteStudent(s.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-soft">No students match your search.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
