import type { Metadata } from "next";
import Link from "next/link";
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
    .select("id, title, description, resource_type, file_name, storage_path, storage_url, google_drive_url, download_enabled, access_level, course_id, courses(name)")
    .eq("is_active", true)
    .order("display_order", { ascending: true });

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow text-gold-600">Academy resource library</p>
          <h1 className="mt-2 text-3xl leading-tight text-emerald-900 sm:text-4xl">
            Notices, syllabi & learning resources
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-soft">
            Public notices and syllabi are available without signing in. Protected course resources require an approved account.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/login?role=student&redirect=/academy/resources" className="btn-outline text-sm">
            Login
          </Link>
          <Link href="/register?role=student" className="btn-primary text-sm">
            Create account
          </Link>
        </div>
      </div>
      <AcademyResourceList resources={(resources ?? []) as any} />
    </div>
  );
}
