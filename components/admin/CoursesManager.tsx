"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Course {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  level: string | null;
  duration: string | null;
  price: number | null;
  is_active: boolean;
  display_order: number;
}

const emptyForm = { name: "", category: "", level: "", duration: "", price: "" };

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function CoursesManager({ initialCourses }: { initialCourses: Course[] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function startEdit(course: Course) {
    setEditingId(course.id);
    setForm({
      name: course.name,
      category: course.category ?? "",
      level: course.level ?? "",
      duration: course.duration ?? "",
      price: course.price?.toString() ?? "",
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
      slug: slugify(form.name),
      category: form.category || null,
      level: form.level || null,
      duration: form.duration || null,
      price: form.price ? Number(form.price) : null,
    };

    if (editingId) {
      const { error } = await supabase.from("courses").update(payload).eq("id", editingId);
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setCourses((prev) => prev.map((c) => (c.id === editingId ? { ...c, ...payload } : c)));
    } else {
      const { data, error } = await supabase
        .from("courses")
        .insert({ ...payload, is_active: true, display_order: courses.length + 1 })
        .select()
        .single();
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setCourses((prev) => [...prev, data as Course]);
    }

    setSaving(false);
    setFormOpen(false);
  }

  async function toggleActive(course: Course) {
    const supabase = createClient();
    const { error } = await supabase
      .from("courses")
      .update({ is_active: !course.is_active })
      .eq("id", course.id);
    if (!error) {
      setCourses((prev) => prev.map((c) => (c.id === course.id ? { ...c, is_active: !c.is_active } : c)));
    }
  }

  async function deleteCourse(id: string) {
    if (!confirm("Delete this course permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (!error) setCourses((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={startAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Course
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSave} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">
              {editingId ? "Edit Course" : "New Course"}
            </p>
            <button type="button" onClick={() => setFormOpen(false)} aria-label="Close">
              <X className="h-4 w-4 text-ink-soft" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Course Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Level" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Duration" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input type="number" placeholder="Fee (NPR)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          </div>
          {errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
          <button type="submit" disabled={saving} className="btn-primary text-sm">
            {saving ? "Saving…" : "Save Course"}
          </button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-cream/70">
            <tr>
              <th className="px-4 py-3">Course</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Duration / Level</th>
              <th className="px-4 py-3">Fee</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-t border-emerald-900/5 dark:border-cream/5">
                <td className="px-4 py-3 font-medium text-ink dark:text-cream">{c.name}</td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{c.category}</td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{c.duration} · {c.level}</td>
                <td className="px-4 py-3 font-mono text-ink-soft dark:text-cream/70">
                  {c.price ? `Rs. ${c.price.toLocaleString("en-IN")}` : "—"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(c)}
                    className={`rounded-full px-2.5 py-1 text-xs ${c.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-100 text-red-700"}`}
                  >
                    {c.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(c)} aria-label="Edit" className="mr-1 rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteCourse(c.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
