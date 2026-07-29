"use client";

import { useState } from "react";
import { Star, Trash2, Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Testimonial {
  id: string;
  customer_name: string;
  location: string | null;
  rating: number;
  content: string;
  is_featured: boolean;
}

const emptyForm = { customer_name: "", location: "", rating: "5", content: "" };

export default function ReviewsManager({ initialTestimonials }: { initialTestimonials: Testimonial[] }) {
  const [items, setItems] = useState(initialTestimonials);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        customer_name: form.customer_name,
        location: form.location || null,
        rating: Number(form.rating),
        content: form.content,
        is_featured: false,
      })
      .select()
      .single();
    setSaving(false);
    if (!error) {
      setItems((prev) => [data as Testimonial, ...prev]);
      setForm(emptyForm);
      setFormOpen(false);
    }
  }

  async function toggleFeatured(t: Testimonial) {
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").update({ is_featured: !t.is_featured }).eq("id", t.id);
    if (!error) setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, is_featured: !x.is_featured } : x)));
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this review permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", id);
    if (!error) setItems((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={() => setFormOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Review
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleAdd} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">New Review</p>
            <button type="button" onClick={() => setFormOpen(false)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <input required placeholder="Customer Name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm sm:col-span-2" />
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Stars</option>)}
            </select>
          </div>
          <input placeholder="Location (optional)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <textarea required placeholder="Review text" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={3} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save Review"}</button>
        </form>
      )}

      <div className="space-y-3">
        {items.map((t) => (
          <div key={t.id} className="card flex items-start justify-between gap-4 p-4">
            <div>
              <div className="flex items-center gap-1 text-gold-500">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
              </div>
              <p className="mt-1 text-sm text-ink-soft dark:text-cream/70">&ldquo;{t.content}&rdquo;</p>
              <p className="mt-1 text-xs font-medium text-ink dark:text-cream">{t.customer_name} {t.location && `· ${t.location}`}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button
                onClick={() => toggleFeatured(t)}
                className={`rounded-full px-2.5 py-1 text-xs ${t.is_featured ? "bg-gold-100 text-gold-700" : "bg-emerald-50 text-emerald-700"}`}
              >
                {t.is_featured ? "Featured" : "Feature"}
              </button>
              <button onClick={() => deleteTestimonial(t.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
