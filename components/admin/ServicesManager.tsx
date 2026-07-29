"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface ServiceRow {
  id: string;
  category_id: string;
  category_name: string | null;
  slug: string;
  name: string;
  price_min: number;
  price_max: number | null;
  is_featured: boolean;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
}

const emptyForm = { name: "", category_id: "", price_min: "", price_max: "", is_featured: false, is_popular: false };

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);
}

export default function ServicesManager({
  initialServices,
  categories,
}: {
  initialServices: ServiceRow[];
  categories: { id: string; name: string }[];
}) {
  const [services, setServices] = useState(initialServices);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = categoryFilter === "all" ? services : services.filter((s) => s.category_id === categoryFilter);

  function startAdd() {
    setEditingId(null);
    setForm({ ...emptyForm, category_id: categories[0]?.id ?? "" });
    setFormOpen(true);
  }

  function startEdit(s: ServiceRow) {
    setEditingId(s.id);
    setForm({
      name: s.name, category_id: s.category_id,
      price_min: s.price_min.toString(), price_max: s.price_max?.toString() ?? "",
      is_featured: s.is_featured, is_popular: s.is_popular,
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
      category_id: form.category_id,
      price_min: Number(form.price_min),
      price_max: form.price_max ? Number(form.price_max) : null,
      is_featured: form.is_featured,
      is_popular: form.is_popular,
    };

    if (editingId) {
      const { error } = await supabase.from("services").update(payload).eq("id", editingId);
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      const categoryName = categories.find((c) => c.id === form.category_id)?.name ?? null;
      setServices((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...payload, category_name: categoryName } : s)));
    } else {
      const { data, error } = await supabase
        .from("services")
        .insert({ ...payload, slug: slugify(form.name), is_active: true, display_order: services.length + 1 })
        .select()
        .single();
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      const categoryName = categories.find((c) => c.id === form.category_id)?.name ?? null;
      setServices((prev) => [...prev, { ...(data as ServiceRow), category_name: categoryName }]);
    }

    setSaving(false);
    setFormOpen(false);
  }

  async function toggleActive(s: ServiceRow) {
    const supabase = createClient();
    const { error } = await supabase.from("services").update({ is_active: !s.is_active }).eq("id", s.id);
    if (!error) setServices((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_active: !x.is_active } : x)));
  }

  async function deleteService(id: string) {
    if (!confirm("Delete this service permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (!error) setServices((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm dark:bg-emerald-900 dark:text-cream">
          <option value="all">All Categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={startAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Service
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSave} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">{editingId ? "Edit Service" : "New Service"}</p>
            <button type="button" onClick={() => setFormOpen(false)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Service Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <input required type="number" placeholder="Price (min / fixed)" value={form.price_min} onChange={(e) => setForm({ ...form, price_min: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input type="number" placeholder="Price max (optional, for ranges)" value={form.price_max} onChange={(e) => setForm({ ...form, price_max: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-4 text-sm text-ink-soft">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_popular} onChange={(e) => setForm({ ...form, is_popular: e.target.checked })} /> Popular</label>
          </div>
          {errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save Service"}</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-cream/70">
            <tr>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-emerald-900/5 dark:border-cream/5">
                <td className="px-4 py-3 font-medium text-ink dark:text-cream">
                  {s.name}
                  {s.is_featured && <span className="ml-2 rounded-full bg-gold-100 px-2 py-0.5 text-[10px] text-gold-700">Featured</span>}
                  {s.is_popular && <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] text-emerald-700">Popular</span>}
                </td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{s.category_name}</td>
                <td className="px-4 py-3 font-mono text-ink-soft dark:text-cream/70">
                  Rs. {s.price_min.toLocaleString("en-IN")}{s.price_max ? ` – ${s.price_max.toLocaleString("en-IN")}` : ""}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleActive(s)} className={`rounded-full px-2.5 py-1 text-xs ${s.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                    {s.is_active ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(s)} aria-label="Edit" className="mr-1 rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteService(s.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
