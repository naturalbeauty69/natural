import { createClient } from "@/lib/supabase-admin/server";
import OrdersManager from "@/components/admin/OrdersManager";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, phone, email, address, city, notes, total_price, status, created_at, order_items(id, product_name, unit_price, quantity)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Orders</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Product orders placed through the website — Cash on Delivery, confirmed by phone.
      </p>
      <div className="mt-6">
        <OrdersManager initialOrders={(orders ?? []).map((o: any) => ({ ...o, items: o.order_items }))} />
      </div>
    </div>
  );
}
