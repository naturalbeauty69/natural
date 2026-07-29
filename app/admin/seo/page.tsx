import { createClient } from "@/lib/supabase-admin/server";
import SeoManagerForm from "@/components/admin/SeoManagerForm";

export default async function AdminSeoPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "seo_settings").single();

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">SEO Manager</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Site-wide SEO defaults. Structured data (Organization, Service, Course, FAQPage, BlogPosting,
        BreadcrumbList) is already implemented in code across the site and doesn&apos;t need editing here.
      </p>
      <div className="mt-6 max-w-2xl">
        <SeoManagerForm initialSettings={data?.value ?? null} />
      </div>
      <div className="mt-6 max-w-2xl rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-5 text-sm text-ink-soft dark:bg-emerald-900/40">
        Per-page title/description overrides (editing one specific page&apos;s meta tags individually) aren&apos;t wired
        up yet — today, each page&apos;s SEO metadata is set in its code file. That&apos;s a scoped follow-up if you need it.
      </div>
    </div>
  );
}
