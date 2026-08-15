import { createClient } from "@/lib/supabase-admin/server";
import CourseApplicationsManager from "@/components/admin/CourseApplicationsManager";

export default async function AdminCourseApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("course_applications")
    .select("id, full_name, email, phone, status, message, admin_notes, created_at, courses(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Course Applications</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Review online academy applications and move applicants through your admission workflow.
      </p>
      <div className="mt-6">
        <CourseApplicationsManager initialApplications={(applications ?? []) as any} />
      </div>
    </div>
  );
}
