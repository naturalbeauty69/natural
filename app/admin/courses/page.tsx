import { createClient } from "@/lib/supabase-admin/server";
import CoursesManager from "@/components/admin/CoursesManager";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, name, category, level, duration, price, is_active, display_order")
    .order("display_order");

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Courses</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Manage the academy course catalog shown on the public Academy page.
      </p>
      <div className="mt-6">
        <CoursesManager initialCourses={courses ?? []} />
      </div>
    </div>
  );
}
