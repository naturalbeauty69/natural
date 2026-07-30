"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <SectionHeading eyebrow="Your Cart" title="Shopping Cart" align="center" />

      {items.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-sm text-ink-soft">Your cart is empty.</p>
          <Link href="/products" className="btn-primary mt-4 inline-flex">Browse Products</Link>
        </div>
      ) : (
        <div className="mt-10 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="card flex items-center gap-4 p-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-emerald-50">
                {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />}
              </div>
              <div className="flex-1">
                <Link href={`/products/${item.slug}`} className="font-display text-sm text-emerald-900 hover:text-gold-600">{item.name}</Link>
                <p className="mt-1 font-mono text-sm text-ink-soft">Rs. {item.price.toLocaleString("en-IN")}</p>
              </div>
              <div className="flex items-center rounded-full border border-emerald-900/15">
                <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-1.5" aria-label="Decrease"><Minus className="h-3.5 w-3.5" /></button>
                <span className="w-6 text-center text-xs">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="p-1.5" aria-label="Increase"><Plus className="h-3.5 w-3.5" /></button>
              </div>
              <p className="w-20 text-right font-mono text-sm text-emerald-700">Rs. {(item.price * item.quantity).toLocaleString("en-IN")}</p>
              <button onClick={() => removeItem(item.productId)} aria-label="Remove" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}

          <div className="card flex items-center justify-between p-5">
            <p className="font-display text-lg text-emerald-900">Total</p>
            <p className="font-mono text-xl text-emerald-700">Rs. {totalPrice.toLocaleString("en-IN")}</p>
          </div>

          <Link href="/checkout" className="btn-gold flex w-full items-center justify-center">
            Proceed to Checkout
          </Link>
        </div>
      )}
    </div>
  );
}
