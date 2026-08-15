import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-admin/server";
import AcademyResourceList from "@/components/academy/AcademyResourceList";

export const metadata: Metadata = {
  title: "Academy Resource Library",
  description: "Private course files, notices and academy learning links.",
  robots: { index: false, follow: false },
};

export default async function AcademyResourcesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/academy/resources");

  const { data: resources } = await supabase
    .from("academy_resources")
    .select("id, title, description, resource_type, file_name, storage_path, storage_url, google_drive_url, download_enabled, course_id")
    .eq("is_active", true)
    .order("display_order");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="eyebrow text-gold-600">Private academy library</p>
      <h1 className="mt-2 text-4xl text-emerald-900">Your learning resources</h1>
      <p className="mt-3 text-sm text-ink-soft">
        Only resources your account is allowed to see are shown here. Downloads can be enabled or disabled by academy staff.
      </p>
      <AcademyResourceList resources={(resources ?? []) as any} />
    </div>
  );
}
