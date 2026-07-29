"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-admin/browser";
import { trackContactFormSubmit } from "@/lib/analytics";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase.from("messages").insert({
      sender_name: form.get("name"),
      sender_email: form.get("email"),
      sender_phone: form.get("phone") || null,
      subject: form.get("subject") || null,
      body: form.get("message"),
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      trackContactFormSubmit();
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-6 text-center">
        <p className="font-display text-lg text-emerald-900">Message sent.</p>
        <p className="mt-2 text-sm text-ink-soft">We&apos;ll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <input required name="name" placeholder="Your Name" className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        <input required name="email" type="email" placeholder="Email" className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
      </div>
      <input name="phone" placeholder="Phone (optional)" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
      <input name="subject" placeholder="Subject (optional)" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
      <textarea required name="message" placeholder="Your message" rows={4} className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
      {status === "error" && <p className="rounded-lg bg-red-100 p-3 text-xs text-red-700">{errorMessage}</p>}
      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
