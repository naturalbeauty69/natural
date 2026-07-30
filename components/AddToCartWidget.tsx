"use client";

import { useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { Product, getStockStatus } from "@/lib/products-types";
import { trackAddToCart } from "@/lib/analytics";

export default function AddToCartWidget({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const status = getStockStatus(product.stock_quantity);
  const effectivePrice = product.discount_price ?? product.price;

  if (status === "out_of_stock") {
    return (
      <div>
        <button disabled className="btn-primary w-full cursor-not-allowed opacity-50">
          Sold Out
        </button>
      </div>
    );
  }

  function handleAdd() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: effectivePrice,
      image: product.image_url,
      quantity,
      maxQuantity: product.stock_quantity,
    });
    trackAddToCart({ id: product.id, name: product.name, price: effectivePrice, quantity });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-emerald-900/15">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2" aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm">{quantity}</span>
          <button onClick={() => setQuantity((q) => Math.min(product.stock_quantity, q + 1))} className="p-2" aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button onClick={handleAdd} className="btn-gold flex flex-1 items-center justify-center gap-2">
          <ShoppingBag className="h-4 w-4" /> {added ? "Added!" : "Add to Cart"}
        </button>
      </div>
      {added && (
        <Link href="/cart" className="block text-center text-xs text-emerald-700 hover:text-gold-600">
          View cart & checkout →
        </Link>
      )}
    </div>
  );
}
