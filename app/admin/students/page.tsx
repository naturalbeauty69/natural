import { createClient } from "@/lib/supabase-admin/server";
import StudentsManager from "@/components/admin/StudentsManager";

export default async function AdminStudentsPage() {
  const supabase = await createClient();

  const [{ data: students }, { data: courses }] = await Promise.all([
    supabase
      .from("students")
      .select("id, photo_url, name, gender, phone, email, address, course_id, enrollment_date, status, guardian_name, emergency_contact, notes, courses(name)")
      .order("enrollment_date", { ascending: false }),
    supabase.from("courses").select("id, name").eq("is_active", true).order("name"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Students</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Enrollment records — not a login portal (per scope).
      </p>
      <div className="mt-6">
        <StudentsManager
          initialStudents={(students ?? []).map((s: any) => ({ ...s, course_name: s.courses?.name ?? null }))}
          courses={courses ?? []}
        />
      </div>
    </div>
  );
}
