"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase-admin/browser";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import ShippingPolicy from "@/components/ShippingPolicy";
import { trackBeginCheckout, trackPurchase } from "@/lib/analytics";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setStatus("submitting");
    setErrorMessage("");

    const form = new FormData(e.currentTarget);
    const supabase = createClient();

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: form.get("name"),
        phone: form.get("phone"),
        email: form.get("email") || null,
        address: form.get("address"),
        city: form.get("city"),
        notes: form.get("notes") || null,
        total_price: totalPrice,
      })
      .select()
      .single();

    if (orderError || !order) {
      setErrorMessage(orderError?.message || "Something went wrong placing your order.");
      setStatus("error");
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map((i) => ({
        order_id: order.id,
        product_id: i.productId,
        product_name: i.name,
        unit_price: i.price,
        quantity: i.quantity,
      }))
    );

    if (itemsError) {
      setErrorMessage(itemsError.message);
      setStatus("error");
      return;
    }

    trackPurchase(order.order_number, items.map((i) => ({ id: i.productId, name: i.name, price: i.price, quantity: i.quantity })), totalPrice);
    clearCart();
    router.push(`/checkout/confirmation?order=${order.order_number}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <p className="text-sm text-ink-soft">Your cart is empty.</p>
        <Link href="/products" className="btn-primary mt-4 inline-flex">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />
      <SectionHeading eyebrow="Checkout" title="Complete Your Order" align="center" />

      <div className="mt-8 card p-5">
        <p className="eyebrow text-gold-500">Order Summary</p>
        <ul className="mt-3 space-y-1.5">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between text-sm text-ink-soft">
              <span>{i.name} × {i.quantity}</span>
              <span className="font-mono">Rs. {(i.price * i.quantity).toLocaleString("en-IN")}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-emerald-900/10 pt-3 font-display text-base text-emerald-900">
          <span>Total</span>
          <span className="font-mono">Rs. {totalPrice.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} onFocus={() => trackBeginCheckout(items, totalPrice)} className="card mt-6 space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <input required name="name" placeholder="Full Name" className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
          <input required name="phone" placeholder="Phone Number" className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        </div>
        <input name="email" type="email" placeholder="Email (optional)" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        <input required name="address" placeholder="Address" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        <input required name="city" placeholder="City" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />
        <textarea name="notes" placeholder="Additional notes (optional)" rows={3} className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm" />

        {status === "error" && <p className="rounded-lg bg-red-100 p-3 text-xs text-red-700">{errorMessage}</p>}

        <button type="submit" disabled={status === "submitting"} className="btn-gold w-full">
          {status === "submitting" ? "Placing Order…" : "Submit Order (Cash on Delivery)"}
        </button>
      </form>

      <div className="mt-6">
        <ShippingPolicy />
      </div>
    </div>
  );
}
