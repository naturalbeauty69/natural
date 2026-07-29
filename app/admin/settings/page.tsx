import { createClient } from "@/lib/supabase-admin/server";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "contact").single();

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Website Settings</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Business contact info shown across the public site (header, footer, contact page).
      </p>
      <div className="mt-6 max-w-2xl">
        <SettingsForm initialContact={data?.value ?? null} />
      </div>
    </div>
  );
}
