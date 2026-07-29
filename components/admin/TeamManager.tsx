"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Member {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  gallery: string[] | null;
  specialization: string | null;
  experience_years: number | null;
  is_active: boolean;
  display_order: number;
}

const emptyForm = { name: "", role: "", bio: "", photo_url: "", gallery: "", specialization: "", experience_years: "" };

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function TeamManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers);
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

  function startEdit(m: Member) {
    setEditingId(m.id);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio,
      photo_url: m.photo_url,
      gallery: (m.gallery ?? []).join(", "),
      specialization: m.specialization ?? "",
      experience_years: m.experience_years?.toString() ?? "",
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
      role: form.role,
      bio: form.bio,
      photo_url: form.photo_url,
      gallery: form.gallery ? form.gallery.split(",").map((s) => s.trim()).filter(Boolean) : [],
      specialization: form.specialization || null,
      experience_years: form.experience_years ? Number(form.experience_years) : null,
    };

    if (editingId) {
      const { error } = await supabase.from("team_members").update(payload).eq("id", editingId);
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setMembers((prev) => prev.map((m) => (m.id === editingId ? { ...m, ...payload } : m)));
    } else {
      const { data, error } = await supabase
        .from("team_members")
        .insert({ ...payload, is_active: true, display_order: members.length + 1 })
        .select()
        .single();
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setMembers((prev) => [...prev, data as Member]);
    }

    setSaving(false);
    setFormOpen(false);
  }

  async function toggleActive(m: Member) {
    const supabase = createClient();
    const { error } = await supabase.from("team_members").update({ is_active: !m.is_active }).eq("id", m.id);
    if (!error) setMembers((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_active: !x.is_active } : x)));
  }

  async function deleteMember(id: string) {
    if (!confirm("Remove this team member permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("team_members").delete().eq("id", id);
    if (!error) setMembers((prev) => prev.filter((m) => m.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={startAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Team Member
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSave} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">
              {editingId ? "Edit Team Member" : "New Team Member"}
            </p>
            <button type="button" onClick={() => setFormOpen(false)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input required placeholder="Role / Title" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input type="number" placeholder="Years of Experience" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          </div>
          <input required placeholder="Profile Photo URL" value={form.photo_url} onChange={(e) => setForm({ ...form, photo_url: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <textarea required placeholder="Biography" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <input placeholder="Work gallery URLs, comma-separated (optional)" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          {errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save"}</button>
        </form>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m) => (
          <div key={m.id} className="card overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image src={m.photo_url} alt={m.name} fill className="object-cover" sizes="300px" />
            </div>
            <div className="p-4">
              <p className="font-display text-base text-emerald-900 dark:text-cream">{m.name}</p>
              <p className="eyebrow text-gold-500">{m.role}</p>
              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() => toggleActive(m)}
                  className={`rounded-full px-2.5 py-1 text-xs ${m.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                  {m.is_active ? "Active" : "Hidden"}
                </button>
                <div>
                  <button onClick={() => startEdit(m)} aria-label="Edit" className="mr-1 rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteMember(m.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
