"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-admin/browser";
import { ContactSettings } from "@/lib/types";

const fallback: ContactSettings = {
  phones: ["9843805588", "9823207031"],
  whatsapp: "+9779843805588",
  email: "archanabeauty07@gmail.com",
  address: "New Baneshwor, Opposite the Overhead Bridge, Kathmandu, Nepal",
  tiktok: "https://www.tiktok.com/@naturalbeautyclinic5",
  facebook: "https://www.facebook.com/profile.php?id=100063534103647",
  instagram: "https://www.instagram.com/archanasilwal4",
  esewa: "9843805588",
  mapEmbedUrl: "",
  businessHours: "Sunday – Saturday: 10:00 AM – 7:00 PM",
};

export default function SettingsForm({ initialContact }: { initialContact: ContactSettings | null }) {
  const [form, setForm] = useState<ContactSettings>(initialContact ?? fallback);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  function update<K extends keyof ContactSettings>(key: K, value: ContactSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: "contact", value: form, updated_at: new Date().toISOString() });
    setStatus(error ? "error" : "saved");
  }

  return (
    <form onSubmit={handleSave} className="card space-y-4 p-6 dark:border-cream/10 dark:bg-emerald-900">
      <div>
        <label className="text-sm font-medium text-ink dark:text-cream">Address</label>
        <textarea value={form.address} onChange={(e) => update("address", e.target.value)} rows={2} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">Primary Phone</label>
          <input value={form.phones[0] ?? ""} onChange={(e) => update("phones", [e.target.value, form.phones[1] ?? ""])} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">Alternate Phone</label>
          <input value={form.phones[1] ?? ""} onChange={(e) => update("phones", [form.phones[0] ?? "", e.target.value])} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">WhatsApp</label>
          <input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">Email</label>
          <input value={form.email} onChange={(e) => update("email", e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">Facebook URL</label>
          <input value={form.facebook} onChange={(e) => update("facebook", e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">Instagram URL</label>
          <input value={form.instagram} onChange={(e) => update("instagram", e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">TikTok URL</label>
          <input value={form.tiktok} onChange={(e) => update("tiktok", e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink dark:text-cream">Business Hours</label>
          <input value={form.businessHours} onChange={(e) => update("businessHours", e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-ink dark:text-cream">Google Maps Embed URL</label>
        <input value={form.mapEmbedUrl ?? ""} onChange={(e) => update("mapEmbedUrl", e.target.value)} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
      </div>

      {status === "error" && <p className="text-xs text-red-700">Something went wrong saving your changes.</p>}
      {status === "saved" && <p className="text-xs text-emerald-700">Saved.</p>}

      <button type="submit" disabled={status === "saving"} className="btn-primary text-sm">
        {status === "saving" ? "Saving…" : "Save Settings"}
      </button>
    </form>
  );
}
