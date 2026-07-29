import { createClient } from "@/lib/supabase-admin/server";
import AppointmentsTable from "@/components/admin/AppointmentsTable";

export default async function AdminAppointmentsPage() {
  const supabase = await createClient();

  const [{ data: appointments }, { data: services }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, customer_name, phone, email, appointment_date, appointment_time, status, notes, service_id, services(name)")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false }),
    supabase.from("services").select("id, name").eq("is_active", true).order("name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Appointments</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Bookings submitted through the website appointment form.
      </p>
      <div className="mt-6">
        <AppointmentsTable
          initialAppointments={(appointments ?? []).map((a: any) => ({
            ...a,
            service_name: a.services?.name ?? null,
          }))}
          services={services ?? []}
        />
      </div>
    </div>
  );
}
