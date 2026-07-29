"use client";

import { useState, useMemo } from "react";
import { Search, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Appointment {
  id: string;
  customer_name: string;
  phone: string;
  email: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string | null;
  service_id: string | null;
  service_name: string | null;
}

const STATUSES = ["pending", "confirmed", "completed", "cancelled", "rescheduled"];

const statusColor: Record<string, string> = {
  pending: "bg-gold-100 text-gold-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-700 text-cream",
  cancelled: "bg-red-100 text-red-700",
  rescheduled: "bg-blue-100 text-blue-700",
};

export default function AppointmentsTable({
  initialAppointments,
}: {
  initialAppointments: Appointment[];
  services: { id: string; name: string }[];
}) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      const matchesQuery =
        !query ||
        a.customer_name.toLowerCase().includes(query.toLowerCase()) ||
        a.phone.includes(query);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [appointments, query, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("appointments").update({ status }).eq("id", id);
    if (!error) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
    setUpdatingId(null);
  }

  async function deleteAppointment(id: string) {
    if (!confirm("Delete this appointment permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (!error) {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or phone…"
            className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-700 dark:bg-emerald-900 dark:text-cream"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm dark:bg-emerald-900 dark:text-cream"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-cream/70">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Date &amp; Time</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-emerald-900/5 dark:border-cream/5">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink dark:text-cream">{a.customer_name}</p>
                  <p className="text-xs text-ink-soft dark:text-cream/60">{a.phone}</p>
                </td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">{a.service_name ?? "—"}</td>
                <td className="px-4 py-3 text-ink-soft dark:text-cream/70">
                  {a.appointment_date} · {a.appointment_time}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={a.status}
                    disabled={updatingId === a.id}
                    onChange={(e) => updateStatus(a.id, e.target.value)}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${statusColor[a.status] ?? ""}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => deleteAppointment(a.id)}
                    aria-label="Delete appointment"
                    className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-ink-soft">
                  No appointments match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
