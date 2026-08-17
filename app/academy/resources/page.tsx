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

  // One focused query: fetch only fields needed for the resource list/filter UI.
  // RLS still decides which resources this visitor/account is allowed to see.
  const { data: resources } = await supabase
    .from("academy_resources")
    .select(
      "id,title,description,resource_type,file_name,download_enabled,access_level,course_id,display_order,courses(name)"
    )
    .eq("is_active", true)
    .order("display_order", { ascending: true })
    .limit(500);

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="eyebrow text-gold-600">Academy resource library</p>
      <h1 className="mt-2 text-4xl text-emerald-900">Notices, syllabi & learning resources</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Public Academy resources are available without signing in. Private course
        resources are shown only when your account has permission to access them.
      </p>
      <AcademyResourceList resources={(resources ?? []) as any} />
    </div>
  );
}
