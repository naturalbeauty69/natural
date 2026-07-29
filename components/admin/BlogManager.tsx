"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Post {
  id: string;
  slug: string;
  title: string;
  cover_image_url: string | null;
  content: string;
  category: string | null;
  author: string;
  seo_keywords: string[];
  published_at: string;
  is_active: boolean;
  display_order: number;
}

const emptyForm = { title: "", category: "", author: "Archana Silwal Kadel", content: "", cover_image_url: "", seo_keywords: "" };

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function BlogManager({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts);
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

  function startEdit(p: Post) {
    setEditingId(p.id);
    setForm({
      title: p.title, category: p.category ?? "", author: p.author,
      content: p.content, cover_image_url: p.cover_image_url ?? "",
      seo_keywords: (p.seo_keywords ?? []).join(", "),
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    const supabase = createClient();

    const payload = {
      title: form.title,
      category: form.category || null,
      author: form.author,
      content: form.content,
      cover_image_url: form.cover_image_url || null,
      seo_keywords: form.seo_keywords ? form.seo_keywords.split(",").map((s) => s.trim()).filter(Boolean) : [],
    };

    if (editingId) {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId);
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setPosts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...payload } : p)));
    } else {
      const { data, error } = await supabase
        .from("blog_posts")
        .insert({ ...payload, slug: slugify(form.title), is_active: false, published_at: new Date().toISOString().split("T")[0] })
        .select()
        .single();
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setPosts((prev) => [data as Post, ...prev]);
    }

    setSaving(false);
    setFormOpen(false);
  }

  async function togglePublished(p: Post) {
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").update({ is_active: !p.is_active }).eq("id", p.id);
    if (!error) setPosts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this article permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (!error) setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button onClick={startAdd} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> New Article
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSave} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">{editingId ? "Edit Article" : "New Article"}</p>
            <button type="button" onClick={() => setFormOpen(false)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm sm:col-span-2" />
            <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Author" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          </div>
          <input placeholder="Cover Image URL" value={form.cover_image_url} onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <textarea required placeholder="Article content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <input placeholder="SEO keywords, comma-separated" value={form.seo_keywords} onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          {errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
          <p className="text-xs text-ink-soft">New articles save as a draft — publish it from the list below once ready.</p>
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save Article"}</button>
        </form>
      )}

      <div className="space-y-2">
        {posts.map((p) => (
          <div key={p.id} className="card flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium text-ink dark:text-cream">{p.title}</p>
              <p className="text-xs text-ink-soft dark:text-cream/60">{p.category} · {p.author} · {p.published_at}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-2">
              <button onClick={() => togglePublished(p)} className={`rounded-full px-2.5 py-1 text-xs ${p.is_active ? "bg-emerald-50 text-emerald-700" : "bg-gold-100 text-gold-700"}`}>
                {p.is_active ? "Published" : "Draft"}
              </button>
              <button onClick={() => startEdit(p)} aria-label="Edit" className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => deletePost(p.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
