"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product, PRODUCT_CATEGORIES, getStockStatus } from "@/lib/products-types";

const PAGE_SIZE = 12;

type SortOption = "newest" | "price_low" | "price_high" | "name";

export default function ProductsGrid({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [availability, setAvailability] = useState<string>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<SortOption>("newest");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      const matchesAvailability = availability === "all" || getStockStatus(p.stock_quantity) === availability;
      const matchesFeatured = !featuredOnly || p.is_featured;
      return matchesQuery && matchesCategory && matchesAvailability && matchesFeatured;
    });

    list = [...list].sort((a, b) => {
      if (sort === "price_low") return (a.discount_price ?? a.price) - (b.discount_price ?? b.price);
      if (sort === "price_high") return (b.discount_price ?? b.price) - (a.discount_price ?? a.price);
      if (sort === "name") return a.name.localeCompare(b.name);
      return b.display_order - a.display_order;
    });

    return list;
  }, [products, query, category, availability, featuredOnly, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search products…"
            className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft py-2.5 pl-9 pr-3 text-sm outline-none focus:border-emerald-700"
          />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2.5 text-sm">
          <option value="all">All Brands</option>
          {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={availability} onChange={(e) => { setAvailability(e.target.value); setPage(1); }} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2.5 text-sm">
          <option value="all">All Availability</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortOption)} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2.5 text-sm">
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="name">Name (A–Z)</option>
        </select>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => { setFeaturedOnly(e.target.checked); setPage(1); }} />
          Featured only
        </label>
      </div>

      {pageItems.length === 0 ? (
        <p className="py-16 text-center text-sm text-ink-soft">No products match your filters.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {pageItems.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-8 w-8 rounded-full text-xs ${currentPage === i + 1 ? "bg-emerald-700 text-cream" : "bg-emerald-50 text-emerald-700"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
