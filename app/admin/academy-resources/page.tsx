import { createClient } from "@/lib/supabase-admin/server";
import AcademyResourcesManager from "@/components/admin/AcademyResourcesManager";

export default async function AdminAcademyResourcesPage() {
  const supabase = await createClient();
  const [{ data: resources }, { data: courses }] = await Promise.all([
    supabase.from("academy_resources").select("id, title, description, resource_type, course_id, google_drive_url, storage_path, storage_url, download_enabled, access_level, is_active, display_order").order("display_order"),
    supabase.from("courses").select("id, name").order("display_order"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Academy Resources</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Publish course files, syllabus links, notices and images. Control visibility and whether the resource is downloadable/openable.
      </p>
      <div className="mt-6">
        <AcademyResourcesManager initialResources={(resources ?? []) as any} courses={courses ?? []} />
      </div>
    </div>
  );
}
