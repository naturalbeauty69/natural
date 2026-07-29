"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-admin/browser";

interface SeoSettings {
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  keywords: string;
  robotsIndex: boolean;
}

const fallback: SeoSettings = {
  defaultTitle: "Natural Beauty Clinic & Academy | Kathmandu",
  titleTemplate: "%s | Natural Beauty Clinic & Academy",
  defaultDescription: "Professional Beauty, Skin & Hair Care | Training & Certification — New Baneshwor, Kathmandu.",
  keywords: "Beauty Clinic Kathmandu, Beauty Academy Nepal, Skin Clinic Kathmandu",
  robotsIndex: true,
};

export default function SeoManagerForm({ initialSettings }: { initialSettings: SeoSettings | null }) {
  const [form, setForm] = useState<SeoSettings>(initialSettings ?? fallback);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "seo_settings", value: form, updated_at: new Date().toISOString() });
    setStatus(error ? "error" : "saved");
  }

  return (
    <form onSubmit={handleSave} className="card space-y-4 p-6 dark:border-cream/10 dark:bg-emerald-900">
      <div>
        <label className="text-sm font-medium text-ink dark:text-cream">Default Site Title</label>
        <input value={form.defaultTitle} onChange={(e) => setForm({ ...form, defaultTitle: e.target.value })} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink dark:text-cream">Title Template (%s = page title)</label>
        <input value={form.titleTemplate} onChange={(e) => setForm({ ...form, titleTemplate: e.target.value })} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink dark:text-cream">Default Meta Description</label>
        <textarea value={form.defaultDescription} onChange={(e) => setForm({ ...form, defaultDescription: e.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="text-sm font-medium text-ink dark:text-cream">Default Keywords (comma-separated)</label>
        <input value={form.keywords} onChange={(e) => setForm({ ...form, keywords: e.target.value })} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft dark:text-cream/70">
        <input type="checkbox" checked={form.robotsIndex} onChange={(e) => setForm({ ...form, robotsIndex: e.target.checked })} />
        Allow search engines to index the site
      </label>

      {status === "error" && <p className="text-xs text-red-700">Something went wrong saving.</p>}
      {status === "saved" && <p className="text-xs text-emerald-700">Saved — live on the site immediately (once Supabase is connected).</p>}

      <button type="submit" disabled={status === "saving"} className="btn-primary text-sm">
        {status === "saving" ? "Saving…" : "Save SEO Settings"}
      </button>
    </form>
  );
}
