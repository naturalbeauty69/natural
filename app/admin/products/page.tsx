import { createClient } from "@/lib/supabase-admin/server";
import ProductsManager from "@/components/admin/ProductsManager";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase.from("products").select("*").order("display_order");

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Products</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Product catalog shown on the public Shop page. Bulk import supports CSV and Excel.
      </p>
      <div className="mt-6">
        <ProductsManager initialProducts={products ?? []} />
      </div>
    </div>
  );
}
