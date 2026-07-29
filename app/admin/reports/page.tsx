import { createClient } from "@/lib/supabase-admin/server";
import ReportsView from "@/components/admin/ReportsView";

export default async function AdminReportsPage() {
  const supabase = await createClient();

  const [appointments, students, courses, services, messages, reviews] = await Promise.all([
    supabase.from("appointments").select("customer_name, phone, appointment_date, appointment_time, status"),
    supabase.from("students").select("name, course_id, enrollment_date, status, courses(name)"),
    supabase.from("courses").select("name, category, level, duration, price, is_active"),
    supabase.from("services").select("name, price_min, price_max, is_active, service_categories(name)"),
    supabase.from("messages").select("sender_name, sender_email, subject, is_read, created_at"),
    supabase.from("testimonials").select("customer_name, rating, is_featured, created_at"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Reports</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Export current data as CSV (opens in Excel/Sheets) or print as PDF.
      </p>
      <div className="mt-6">
        <ReportsView
          appointments={appointments.data ?? []}
          students={(students.data ?? []).map((s: any) => ({ ...s, course_name: s.courses?.name ?? null }))}
          courses={courses.data ?? []}
          services={(services.data ?? []).map((s: any) => ({ ...s, category_name: s.service_categories?.name ?? null }))}
          messages={messages.data ?? []}
          reviews={reviews.data ?? []}
        />
      </div>
    </div>
  );
}
