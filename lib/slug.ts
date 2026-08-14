// Client-side preview mirror of supabase/schema.sql's slugify_text()
// SQL function. Used ONLY for live UI feedback (Admin Product Editor,
// CSV/Excel import preview) — it never determines what actually gets
// stored. The `products_ensure_slug` database trigger is the single
// authoritative source: it fills in missing slugs, repairs invalid
// ones, and resolves collisions deterministically (product-2, -3...)
// on every insert/update, regardless of which client path wrote the
// row. Keeping this function's rules identical to the SQL version
// means the preview shown here matches what the database will
// actually save in the common case (no collision).
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
