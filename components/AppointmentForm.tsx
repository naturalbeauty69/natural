"use client";

import { useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Service } from "@/lib/types";

type Status = "idle" | "submitting" | "success" | "error" | "not_configured";

export default function AppointmentForm({ services }: { services: Service[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    if (!isSupabaseConfigured || !supabase) {
      setStatus("not_configured");
      return;
    }

    setStatus("submitting");
    const { error } = await supabase.from("appointments").insert({
      customer_name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email") || null,
      service_id: form.get("service") || null,
      appointment_date: form.get("date"),
      appointment_time: form.get("time"),
      notes: form.get("notes") || null,
    });

    if (error) {
      setErrorMessage(error.message);
      setStatus("error");
    } else {
      setStatus("success");
    }
  }

  if (status === "success") {
    return (
      <div className="card p-6 text-center">
        <p className="font-display text-lg text-emerald-900">Request received.</p>
        <p className="mt-2 text-sm text-ink-soft">
          We&apos;ll confirm your appointment by phone or WhatsApp shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6">
      {status === "not_configured" && (
        <p className="rounded-lg bg-gold-100 p-3 text-xs text-gold-700">
          Booking storage isn&apos;t connected yet — set NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY, then run supabase/schema.sql, to enable live
          bookings. Meanwhile, please call or WhatsApp us directly.
        </p>
      )}
      {status === "error" && (
        <p className="rounded-lg bg-red-100 p-3 text-xs text-red-700">{errorMessage}</p>
      )}

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="name">Full Name</label>
        <input required id="name" name="name" className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="phone">Phone</label>
          <input required id="phone" name="phone" className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="email">Email (optional)</label>
          <input id="email" name="email" type="email" className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="service">Service</label>
        <select id="service" name="service" className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm">
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.slug} value={s.id ?? s.slug}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="date">Preferred Date</label>
          <input required id="date" name="date" type="date" className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink" htmlFor="time">Preferred Time</label>
          <input required id="time" name="time" type="time" className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink" htmlFor="notes">Notes (optional)</label>
        <textarea id="notes" name="notes" rows={3} className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
      </div>

      <button type="submit" disabled={status === "submitting"} className="btn-primary w-full">
        {status === "submitting" ? "Submitting…" : "Request Appointment"}
      </button>
    </form>
  );
}
