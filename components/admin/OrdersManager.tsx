"use client";

import { useState, useMemo } from "react";
import { Printer, Search, ChevronDown, ChevronUp } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";
import { ORDER_STATUSES, OrderStatus } from "@/lib/products-types";

interface OrderItem {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
}

interface OrderRow {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  total_price: number;
  status: OrderStatus;
  created_at: string;
  items: OrderItem[];
}

const statusColor: Record<string, string> = {
  pending: "bg-gold-100 text-gold-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  packed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-emerald-700 text-cream",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrdersManager({ initialOrders }: { initialOrders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesQuery = !query || o.customer_name.toLowerCase().includes(query.toLowerCase()) || o.phone.includes(query) || o.order_number.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === "all" || o.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [orders, query, statusFilter]);

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (!error) setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: status as OrderStatus } : o)));
    setUpdatingId(null);
  }

  function printOrder(order: OrderRow) {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Order ${order.order_number}</title>
      <style>body{font-family:sans-serif;padding:24px;} table{width:100%;border-collapse:collapse;margin-top:12px;} td,th{border:1px solid #ccc;padding:6px 10px;text-align:left;font-size:13px;}</style>
      </head><body>
      <h2>Natural Beauty Clinic & Academy — Order ${order.order_number}</h2>
      <p><strong>Customer:</strong> ${order.customer_name} | <strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Address:</strong> ${order.address}, ${order.city}</p>
      <p><strong>Notes:</strong> ${order.notes ?? "—"}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <table><thead><tr><th>Product</th><th>Qty</th><th>Unit Price</th><th>Subtotal</th></tr></thead><tbody>
      ${order.items.map((i) => `<tr><td>${i.product_name}</td><td>${i.quantity}</td><td>Rs. ${i.unit_price}</td><td>Rs. ${i.unit_price * i.quantity}</td></tr>`).join("")}
      </tbody></table>
      <p style="margin-top:12px;"><strong>Total: Rs. ${order.total_price}</strong></p>
      </body></html>
    `);
    win.document.close();
    win.print();
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, phone, or order #…" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft py-2 pl-9 pr-3 text-sm dark:bg-emerald-900 dark:text-cream" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm dark:bg-emerald-900 dark:text-cream">
          <option value="all">All Statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((order) => {
          const expanded = expandedId === order.id;
          return (
            <div key={order.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <button onClick={() => setExpandedId(expanded ? null : order.id)} className="flex items-center gap-2 text-left">
                  {expanded ? <ChevronUp className="h-4 w-4 text-ink-soft" /> : <ChevronDown className="h-4 w-4 text-ink-soft" />}
                  <div>
                    <p className="font-mono text-sm font-medium text-ink dark:text-cream">{order.order_number}</p>
                    <p className="text-xs text-ink-soft dark:text-cream/60">{order.customer_name} · {order.phone} · {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                </button>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-emerald-700">Rs. {order.total_price.toLocaleString("en-IN")}</span>
                  <select
                    value={order.status}
                    disabled={updatingId === order.id}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium ${statusColor[order.status] ?? ""}`}
                  >
                    {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => printOrder(order)} aria-label="Print" className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"><Printer className="h-4 w-4" /></button>
                </div>
              </div>

              {expanded && (
                <div className="mt-4 border-t border-emerald-900/10 pt-4 text-sm">
                  <p className="text-ink-soft dark:text-cream/70"><strong className="text-ink dark:text-cream">Address:</strong> {order.address}, {order.city}</p>
                  {order.email && <p className="text-ink-soft dark:text-cream/70"><strong className="text-ink dark:text-cream">Email:</strong> {order.email}</p>}
                  {order.notes && <p className="text-ink-soft dark:text-cream/70"><strong className="text-ink dark:text-cream">Notes:</strong> {order.notes}</p>}
                  <table className="mt-3 w-full text-xs">
                    <thead className="text-left text-ink-soft dark:text-cream/60">
                      <tr><th className="py-1">Product</th><th className="py-1">Qty</th><th className="py-1">Price</th></tr>
                    </thead>
                    <tbody>
                      {order.items.map((i) => (
                        <tr key={i.id} className="border-t border-emerald-900/5">
                          <td className="py-1.5 text-ink dark:text-cream">{i.product_name}</td>
                          <td className="py-1.5 text-ink-soft dark:text-cream/70">{i.quantity}</td>
                          <td className="py-1.5 font-mono text-ink-soft dark:text-cream/70">Rs. {i.unit_price.toLocaleString("en-IN")}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-ink-soft">No orders match your search.</p>}
      </div>
    </div>
  );
}
