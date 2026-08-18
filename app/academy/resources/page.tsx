import type { Metadata } from "next";
import { createClient } from "@/lib/supabase-admin/server";
import AcademyResourceList from "@/components/academy/AcademyResourceList";

export const metadata: Metadata = {
  title: "Academy Resource Library",
  description: "Academy notices, syllabi, course files and learning resources.",
  robots: { index: false, follow: false },
};

export default async function AcademyResourcesPage() {
  const supabase = await createClient();
  // No page-wide login redirect. RLS decides which resources this visitor may see.
  const { data: resources } = await supabase
    .from("academy_resources")
    .select("id, title, description, resource_type, file_name, storage_path, storage_url, google_drive_url, download_enabled, course_id")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="eyebrow text-gold-600">Academy resource library</p>
      <h1 className="mt-2 text-4xl text-emerald-900">Notices, syllabi & learning resources</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Public resources are available without signing in. Private resources appear only when your account has permission.
      </p>
      <AcademyResourceList resources={(resources ?? []) as any} />
    </div>
  );
}
