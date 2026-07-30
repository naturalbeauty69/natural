import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import AddToCartWidget from "@/components/AddToCartWidget";
import ShippingPolicy from "@/components/ShippingPolicy";
import ProductCard from "@/components/ProductCard";
import BrandDivider from "@/components/BrandDivider";
import { getProducts, getProductBySlug } from "@/lib/get-data";
import { getStockStatus } from "@/lib/products-types";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description?.slice(0, 155) || `${product.name} — ${product.category}`,
  };
}

const statusLabel: Record<string, { text: string; className: string }> = {
  in_stock: { text: "✅ In Stock", className: "bg-emerald-50 text-emerald-700" },
  low_stock: { text: "🟡 Low Stock", className: "bg-gold-100 text-gold-700" },
  out_of_stock: { text: "🔴 Out of Stock", className: "bg-red-100 text-red-700" },
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();

  const status = getStockStatus(product.stock_quantity);
  const badge = statusLabel[status];
  const effectivePrice = product.discount_price ?? product.price;
  const related = allProducts.filter((p) => p.category === product.category && p.slug !== product.slug).slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.category },
    image: product.image_url ? `https://naturalbeauty.com.np${product.image_url}` : undefined,
    offers: {
      "@type": "Offer",
      price: effectivePrice,
      priceCurrency: "NPR",
      availability: status === "out_of_stock" ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Breadcrumbs items={[{ label: "Products", href: "/products" }, { label: product.name }]} />

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-xl2 bg-emerald-50">
          {product.image_url ? (
            <Image src={product.image_url} alt={product.name} fill priority className="object-cover" sizes="500px" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-emerald-700/50">No image</div>
          )}
        </div>

        <div>
          <p className="eyebrow text-gold-500">{product.category}</p>
          <h1 className="mt-2 text-3xl">{product.name}</h1>
          <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${badge.className}`}>{badge.text}</span>

          <div className="mt-4 flex items-center gap-3">
            <span className="font-mono text-2xl text-emerald-700">Rs. {effectivePrice.toLocaleString("en-IN")}</span>
            {product.discount_price && (
              <span className="font-mono text-base text-ink-soft line-through">Rs. {product.price.toLocaleString("en-IN")}</span>
            )}
          </div>

          {product.suitable_for && (
            <p className="mt-4 text-sm text-ink-soft"><strong className="text-ink">Suitable for:</strong> {product.suitable_for}</p>
          )}
          {product.description && <p className="mt-3 text-sm leading-relaxed text-ink-soft">{product.description}</p>}
          {product.ingredients && (
            <p className="mt-3 text-xs text-ink-soft"><strong className="text-ink">Ingredients:</strong> {product.ingredients}</p>
          )}

          <div className="mt-6">
            <AddToCartWidget product={product} />
          </div>

          <div className="mt-8">
            <ShippingPolicy />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <>
          <BrandDivider className="mt-16" />
          <div className="mt-8">
            <h2 className="font-display text-xl text-emerald-900">Related Products</h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
