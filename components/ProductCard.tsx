import Link from "next/link";
import Image from "next/image";
import { Product, getStockStatus } from "@/lib/products-types";

const statusLabel: Record<string, { text: string; className: string }> = {
  in_stock: { text: "✅ In Stock", className: "bg-emerald-50 text-emerald-700" },
  low_stock: { text: "🟡 Low Stock", className: "bg-gold-100 text-gold-700" },
  out_of_stock: { text: "🔴 Out of Stock", className: "bg-red-100 text-red-700" },
};

export default function ProductCard({ product }: { product: Product }) {
  const status = getStockStatus(product.stock_quantity);
  const badge = statusLabel[status];
  const effectivePrice = product.discount_price ?? product.price;

  return (
    <Link href={`/products/${product.slug}`} className="card block overflow-hidden transition-shadow hover:shadow-gold">
      <div className="relative aspect-square bg-emerald-50">
        {product.image_url ? (
          <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(min-width: 1024px) 25vw, 50vw" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-emerald-700/50">No image</div>
        )}
        {product.is_featured && (
          <span className="absolute left-2 top-2 rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-semibold text-emerald-900">Featured</span>
        )}
      </div>
      <div className="p-4">
        <p className="eyebrow text-gold-500">{product.category}</p>
        <p className="mt-1 font-display text-sm text-emerald-900 line-clamp-2">{product.name}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-emerald-700">Rs. {effectivePrice.toLocaleString("en-IN")}</span>
          {product.discount_price && (
            <span className="font-mono text-xs text-ink-soft line-through">Rs. {product.price.toLocaleString("en-IN")}</span>
          )}
        </div>
        <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] ${badge.className}`}>{badge.text}</span>
      </div>
    </Link>
  );
}
