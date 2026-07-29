"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, X } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface GalleryImage {
  id: string;
  url: string;
  category: string;
  caption: string | null;
  is_active: boolean;
  display_order: number;
}

const CATEGORIES = [
  "hair", "skin", "clinic", "training", "students", "bridal",
  "nails", "threading", "waxing", "certificates", "events", "before_after",
];

export default function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [formOpen, setFormOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [caption, setCaption] = useState("");
  const [filter, setFilter] = useState("all");
  const [errorMessage, setErrorMessage] = useState("");

  const filtered = filter === "all" ? images : images.filter((i) => i.category === filter);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery_images")
      .insert({ url, category, caption: caption || null, is_active: true, display_order: images.length + 1 })
      .select()
      .single();
    if (error) { setErrorMessage(error.message); return; }
    setImages((prev) => [...prev, data as GalleryImage]);
    setUrl(""); setCaption(""); setFormOpen(false);
  }

  async function toggleActive(img: GalleryImage) {
    const supabase = createClient();
    const { error } = await supabase.from("gallery_images").update({ is_active: !img.is_active }).eq("id", img.id);
    if (!error) setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, is_active: !i.is_active } : i)));
  }

  async function deleteImage(id: string) {
    if (!confirm("Remove this photo from the gallery?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("gallery_images").delete().eq("id", id);
    if (!error) setImages((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm dark:bg-emerald-900 dark:text-cream">
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <button onClick={() => setFormOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="h-4 w-4" /> Add Photo (by URL)
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleAdd} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">Add Photo</p>
            <button type="button" onClick={() => setFormOpen(false)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <p className="text-xs text-ink-soft dark:text-cream/60">
            Paste a URL to an already-hosted image (e.g. upload to /public/images/library in your repo, or use
            any external image URL). Direct file upload from this screen is a follow-up enhancement.
          </p>
          <input required placeholder="Image URL (e.g. /images/library/photo.webp)" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <div className="grid gap-3 sm:grid-cols-2">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input placeholder="Caption (optional)" value={caption} onChange={(e) => setCaption(e.target.value)} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          </div>
          {errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
          <button type="submit" className="btn-primary text-sm">Add to Gallery</button>
        </form>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((img) => (
          <div key={img.id} className="card overflow-hidden">
            <div className="relative aspect-square">
              <Image src={img.url} alt={img.caption ?? img.category} fill className="object-cover" sizes="200px" />
            </div>
            <div className="p-2">
              <p className="truncate text-xs text-ink-soft dark:text-cream/60">{img.category}</p>
              <div className="mt-1.5 flex items-center justify-between">
                <button
                  onClick={() => toggleActive(img)}
                  className={`rounded-full px-2 py-0.5 text-[10px] ${img.is_active ? "bg-emerald-50 text-emerald-700" : "bg-red-100 text-red-700"}`}
                >
                  {img.is_active ? "Visible" : "Hidden"}
                </button>
                <button onClick={() => deleteImage(img.id)} aria-label="Delete" className="rounded p-1 text-red-600 hover:bg-red-50">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-ink-soft">No photos in this category yet.</p>
        )}
      </div>
    </div>
  );
}
