import { createClient } from "@/lib/supabase-admin/server";
import ServicesManager from "@/components/admin/ServicesManager";

export default async function AdminServicesPage() {
  const supabase = await createClient();
  const [{ data: services }, { data: categories }] = await Promise.all([
    supabase
      .from("services")
      .select("id, category_id, slug, name, price_min, price_max, is_featured, is_popular, is_active, display_order, service_categories(name)")
      .order("display_order"),
    supabase.from("service_categories").select("id, name").eq("is_active", true).order("display_order"),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Services</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Price list shown on the public Services page.
      </p>
      <div className="mt-6">
        <ServicesManager
          initialServices={(services ?? []).map((s: any) => ({ ...s, category_name: s.service_categories?.name ?? null }))}
          categories={categories ?? []}
        />
      </div>
    </div>
  );
}
