"use client";

import { useState, useMemo, useRef } from "react";
import Image from "next/image";
import {
  Plus, Pencil, Trash2, X, Search, Upload, Download, Copy,
  Eye, EyeOff, Star, FileSpreadsheet,
} from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";
import { Product, PRODUCT_CATEGORIES, getStockStatus } from "@/lib/products-types";
import { slugify } from "@/lib/slug";
import { indexImageZip, extractZipImage, ZipImageIndex } from "@/lib/admin/image-zip";
import { uploadProductImage, normalizeProductImageFilename, isLegacyProductImagePath, isAbsoluteImageUrl } from "@/lib/admin/product-image-storage";
import {
  parseCsvFile, parseExcelFile, rowToProductPayload, productsToCsv,
  downloadCsvTemplate, ImportRow,
} from "@/lib/admin/product-import";

const emptyForm = {
  name: "", category: PRODUCT_CATEGORIES[0] as string, price: "", discount_price: "",
  stock_quantity: "", suitable_for: "", ingredients: "", description: "", image_url: "", slug: "",
};

const statusBadge: Record<string, string> = {
  in_stock: "bg-emerald-50 text-emerald-700",
  low_stock: "bg-gold-100 text-gold-700",
  out_of_stock: "bg-red-100 text-red-700",
};

export default function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sort, setSort] = useState<"name" | "price" | "stock">("name");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 15;

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [importRows, setImportRows] = useState<ImportRow[] | null>(null);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState<{
    imported: number; failed: number; skipped: number; missingImages: number; ms: number;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageZipInputRef = useRef<HTMLInputElement>(null);
  const [imageZip, setImageZip] = useState<ZipImageIndex | null>(null);
  const [imageZipLoading, setImageZipLoading] = useState(false);
  const [imageZipMessage, setImageZipMessage] = useState("");
  const [imageZipErrors, setImageZipErrors] = useState<string[]>([]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });
    list = [...list].sort((a, b) => {
      if (sort === "price") return (a.discount_price ?? a.price) - (b.discount_price ?? b.price);
      if (sort === "stock") return a.stock_quantity - b.stock_quantity;
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [products, query, categoryFilter, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAllOnPage() {
    setSelected((prev) => {
      const next = new Set(prev);
      const allSelected = pageItems.every((p) => next.has(p.id));
      pageItems.forEach((p) => (allSelected ? next.delete(p.id) : next.add(p.id)));
      return next;
    });
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      name: p.name, category: p.category, price: p.price.toString(),
      discount_price: p.discount_price?.toString() ?? "", stock_quantity: p.stock_quantity.toString(),
      suitable_for: p.suitable_for ?? "", ingredients: p.ingredients ?? "",
      description: p.description ?? "", image_url: p.image_url ?? "", slug: p.slug,
    });
    setFormOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    const supabase = createClient();

    const payload: Record<string, unknown> = {
      name: form.name,
      category: form.category,
      price: Number(form.price),
      discount_price: form.discount_price ? Number(form.discount_price) : null,
      stock_quantity: Number(form.stock_quantity) || 0,
      suitable_for: form.suitable_for || null,
      ingredients: form.ingredients || null,
      description: form.description || null,
      image_url: form.image_url || null,
    };
    if (form.slug.trim()) payload.slug = form.slug.trim();

    if (editingId) {
      const { data, error } = await supabase.from("products").update(payload).eq("id", editingId).select().single();
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setProducts((prev) => prev.map((p) => (p.id === editingId ? (data as Product) : p)));
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert({ ...payload, is_active: true, is_featured: false, display_order: products.length + 1, gallery_urls: [] })
        .select()
        .single();
      if (error) { setErrorMessage(error.message); setSaving(false); return; }
      setProducts((prev) => [...prev, data as Product]);
    }

    setSaving(false);
    setFormOpen(false);
  }

  async function toggleActive(p: Product) {
    const supabase = createClient();
    const { error } = await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    if (!error) setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_active: !x.is_active } : x)));
  }

  async function toggleFeatured(p: Product) {
    const supabase = createClient();
    const { error } = await supabase.from("products").update({ is_featured: !p.is_featured }).eq("id", p.id);
    if (!error) setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_featured: !x.is_featured } : x)));
  }

  async function duplicateProduct(p: Product) {
    const supabase = createClient();
    const rest = { ...p };
    delete (rest as Partial<Product>).id;
    delete (rest as Partial<Product>).slug;
    const { data, error } = await supabase
      .from("products")
      .insert({ ...rest, name: `${p.name} (Copy)`, display_order: products.length + 1 })
      .select()
      .single();
    if (!error) setProducts((prev) => [...prev, data as Product]);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function bulkAction(action: "delete" | "publish" | "hide") {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    const supabase = createClient();

    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} selected products permanently?`)) return;
      const { error } = await supabase.from("products").delete().in("id", ids);
      if (!error) setProducts((prev) => prev.filter((p) => !selected.has(p.id)));
    } else {
      const is_active = action === "publish";
      const { error } = await supabase.from("products").update({ is_active }).in("id", ids);
      if (!error) setProducts((prev) => prev.map((p) => (selected.has(p.id) ? { ...p, is_active } : p)));
    }
    setSelected(new Set());
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const rows = file.name.toLowerCase().endsWith(".csv") ? await parseCsvFile(file) : await parseExcelFile(file);
      setImportRows(rows);
      setImportSummary(null);
      setImageZipMessage("");
    } catch (error) {
      alert(`Could not read the product file: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleImageZipSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageZipLoading(true);
    setImageZipMessage("");
    setImageZipErrors([]);

    try {
      if (!/\.zip$/i.test(file.name)) {
        throw new Error("Please choose a .zip file containing your product images.");
      }

      const index = await indexImageZip(file);
      if (index.entries.size === 0) {
        throw new Error("The ZIP was read successfully but contains no supported image files (JPG, PNG, WEBP, GIF, AVIF, BMP, or SVG).");
      }

      setImageZip(index);
      const samples = Array.from(index.entries.values())
        .slice(0, 5)
        .map((entry) => entry.fileName)
        .join(", ");

      setImageZipMessage(
        `${index.entries.size} image${index.entries.size === 1 ? "" : "s"} found in ${file.name}.` +
        (samples ? ` Examples: ${samples}${index.entries.size > 5 ? "…" : ""}` : "")
      );
    } catch (error) {
      setImageZip(null);
      setImageZipErrors([error instanceof Error ? error.message : String(error)]);
      setImageZipMessage("");
    } finally {
      setImageZipLoading(false);
      if (imageZipInputRef.current) imageZipInputRef.current.value = "";
    }
  }

  async function prepareStorageImages(
    rows: ImportRow[],
    supabase: ReturnType<typeof createClient>
  ): Promise<{
    resolved: Map<string, string>;
    missing: string[];
    failedUploads: Array<{ filename: string; error: string }>;
  }> {
    if (!imageZip) {
      return { resolved: new Map(), missing: [], failedUploads: [] };
    }

    const needed = new Map<string, string>();
    rows.forEach((row) => {
      const filename = normalizeProductImageFilename(row.image_filename);
      if (
        filename &&
        !isLegacyProductImagePath(row.image_filename) &&
        !isAbsoluteImageUrl(row.image_filename)
      ) {
        needed.set(filename, row.image_filename);
      }
    });

    const resolved = new Map<string, string>();
    const missing: string[] = [];
    const failedUploads: Array<{ filename: string; error: string }> = [];
    const entries = Array.from(needed.entries());

    // Upload in small batches so a large import does not hammer Storage or the browser.
    for (let i = 0; i < entries.length; i += 3) {
      const batch = entries.slice(i, i + 3);

      await Promise.all(
        batch.map(async ([normalizedName, originalName]) => {
          const entry = imageZip.entries.get(normalizedName);

          if (!entry) {
            missing.push(originalName);
            return;
          }

          try {
            const imageFile = await extractZipImage(imageZip, entry);
            const uploaded = await uploadProductImage(supabase, imageFile);
            resolved.set(normalizedName, uploaded.url);
          } catch (error) {
            failedUploads.push({
              filename: originalName,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        })
      );
    }

    return { resolved, missing, failedUploads };
  }

  async function confirmImport() {
    if (!importRows) return;
    const validRows = importRows.filter((r) => r.errors.length === 0);
    const skipped = importRows.length - validRows.length;
    const missingCsvImages = importRows.filter((r) => !r.image_filename).length;
    if (validRows.length === 0) return;

    setImporting(true);
    const started = performance.now();
    const supabase = createClient();

    try {
      const storageResult = await prepareStorageImages(validRows, supabase);
      const uploadedByName = storageResult.resolved;
      const storageMissing = storageResult.missing;
      const uploadFailures = storageResult.failedUploads.length;

      if (storageResult.failedUploads.length > 0) {
        const firstErrors = storageResult.failedUploads
          .slice(0, 3)
          .map((item) => `${item.filename}: ${item.error}`)
          .join(" | ");
        setImageZipErrors(firstErrors ? [firstErrors] : []);
      }

      const payloads = validRows.map((row, i) => {
        const normalized = normalizeProductImageFilename(row.image_filename);
        const storageUrl = normalized ? uploadedByName.get(normalized) : undefined;

        let imageOverride: string | null | undefined;
        if (isLegacyProductImagePath(row.image_filename) || isAbsoluteImageUrl(row.image_filename)) {
          // Preserve existing GitHub/public paths and external URLs exactly as supplied.
          imageOverride = row.image_filename;
        } else if (imageZip) {
          // When the user selected an images ZIP, a bare filename is expected to be uploaded
          // to Supabase Storage. If it is missing/failed, import the product without a
          // misleading legacy URL; the missing image is already reflected in the summary.
          imageOverride = storageUrl ?? null;
        }

        return rowToProductPayload(row, products.length + i + 1, imageOverride);
      });

      const { data, error } = await supabase.from("products").insert(payloads).select();
      const ms = Math.round(performance.now() - started);

      if (error || !data) {
        setImportSummary({
          imported: 0,
          failed: validRows.length,
          skipped,
          missingImages: missingCsvImages + storageMissing.length + uploadFailures,
          ms,
        });
        alert("Import failed: " + (error?.message || "No products were returned."));
        return;
      }

      setProducts((prev) => [...prev, ...(data as Product[])]);
      setImportSummary({
        imported: data.length,
        failed: 0,
        skipped,
        missingImages: missingCsvImages + storageMissing.length + uploadFailures,
        ms,
      });
      setImportRows(null);
    } catch (error) {
      const ms = Math.round(performance.now() - started);
      setImportSummary({
        imported: 0,
        failed: validRows.length,
        skipped,
        missingImages: missingCsvImages,
        ms,
      });
      alert(`Import failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setImporting(false);
    }
  }

  function exportCsv() {
    const csv = productsToCsv(products);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const duplicateNamesInImport = importRows
    ? new Set(
        importRows
          .map((r) => r.name.toLowerCase())
          .filter((name, i, arr) => name && arr.indexOf(name) !== arr.lastIndexOf(name))
      )
    : new Set<string>();

  const zipMatchedForImport = imageZip && importRows
    ? importRows.filter((row) => {
        const normalized = normalizeProductImageFilename(row.image_filename);
        return Boolean(
          normalized &&
          !isLegacyProductImagePath(row.image_filename) &&
          !isAbsoluteImageUrl(row.image_filename) &&
          imageZip.entries.has(normalized)
        );
      }).length
    : 0;

  return (
    <div>
      {importSummary && (
        <div className="card mb-6 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">Import Summary</p>
            <button onClick={() => setImportSummary(null)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div><p className="text-2xl font-display text-emerald-700">{importSummary.imported}</p><p className="text-xs text-ink-soft">Imported</p></div>
            <div><p className="text-2xl font-display text-red-600">{importSummary.failed}</p><p className="text-xs text-ink-soft">Failed</p></div>
            <div><p className="text-2xl font-display text-gold-600">{importSummary.skipped}</p><p className="text-xs text-ink-soft">Skipped (invalid)</p></div>
            <div><p className="text-2xl font-display text-ink-soft">{importSummary.missingImages}</p><p className="text-xs text-ink-soft">Missing Images</p></div>
          </div>
          <p className="mt-3 text-xs text-ink-soft">Completed in {importSummary.ms}ms</p>
        </div>
      )}

      {importRows && (
        <div className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">
              Review Import — {importRows.length} rows ({importRows.filter((r) => r.errors.length === 0).length} valid)
            </p>
            <button onClick={() => setImportRows(null)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-lg border border-emerald-900/10">
            <table className="w-full text-xs">
              <thead className="bg-emerald-50 text-left dark:bg-emerald-900">
                <tr><th className="px-2 py-1.5">Name</th><th className="px-2 py-1.5">Slug (preview)</th><th className="px-2 py-1.5">Category</th><th className="px-2 py-1.5">Price</th><th className="px-2 py-1.5">Stock</th><th className="px-2 py-1.5">Notes</th></tr>
              </thead>
              <tbody>
                {importRows.map((r, i) => {
                  const isDupeName = r.name && duplicateNamesInImport.has(r.name.toLowerCase());
                  return (
                    <tr key={i} className={`border-t border-emerald-900/5 ${r.errors.length ? "bg-red-50" : isDupeName ? "bg-gold-100/40" : ""}`}>
                      <td className="px-2 py-1.5">{r.name || "—"}</td>
                      <td className="px-2 py-1.5 font-mono text-ink-soft">{r.previewSlug || "—"}</td>
                      <td className="px-2 py-1.5">{r.category || "—"}</td>
                      <td className="px-2 py-1.5">{r.price}</td>
                      <td className="px-2 py-1.5">{r.stock_quantity}</td>
                      <td className="px-2 py-1.5">
                        {r.errors.length > 0 && <span className="text-red-700">{r.errors.join("; ")}</span>}
                        {r.errors.length === 0 && r.warnings.length > 0 && <span className="text-gold-700">{r.warnings.join("; ")}</span>}
                        {isDupeName && <span className="text-gold-700"> · Duplicate name in this file</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="rounded-lg bg-emerald-50/60 p-3 text-xs text-ink-soft dark:bg-emerald-950/30">
            <p>
              Existing product images that already use <code>/images/products/&lt;filename&gt;</code> remain unchanged.
              For new products, choose an optional <strong>images ZIP</strong> below to upload those images directly to
              Supabase Storage. Missing images never stop the import.
            </p>
            {imageZipMessage && (
              <p className="mt-1 text-emerald-700">
                {imageZipMessage}
                {importRows && imageZip && (
                  <> Matched to this CSV: <strong>{zipMatchedForImport}</strong> of {importRows.filter((r) => r.image_filename && !isLegacyProductImagePath(r.image_filename) && !isAbsoluteImageUrl(r.image_filename)).length} new-image rows.</>
                )}
              </p>
            )}
            {imageZipErrors.length > 0 && (
              <div className="mt-2 rounded-md bg-red-50 p-2 text-red-700">
                <strong>Image ZIP status:</strong> {imageZipErrors.join(" ")}
              </div>
            )}
            {imageZip && importRows && zipMatchedForImport === 0 && (
              <p className="mt-2 text-gold-700">No CSV image filenames matched the selected ZIP. Check the CSV <code>Image</code> values against the ZIP filenames.</p>
            )}
            <p className="mt-1">Slugs are previewed only — the database assigns and guarantees the final unique slug.</p>
          </div>
          <button onClick={confirmImport} disabled={importing || imageZipLoading} className="btn-primary text-sm">
            {importing ? "Importing…" : `Import ${importRows.filter((r) => r.errors.length === 0).length} Products`}
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-1 flex-wrap gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" />
            <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} placeholder="Search products…" className="w-full rounded-lg border border-emerald-900/15 bg-cream-soft py-2 pl-9 pr-3 text-sm dark:bg-emerald-900 dark:text-cream" />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm dark:bg-emerald-900 dark:text-cream">
            <option value="all">All Brands</option>
            {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-lg border border-emerald-900/15 bg-cream-soft px-3 py-2 text-sm dark:bg-emerald-900 dark:text-cream">
            <option value="name">Sort: Name</option>
            <option value="price">Sort: Price</option>
            <option value="stock">Sort: Stock</option>
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={downloadCsvTemplate} className="btn-outline flex items-center gap-1.5 text-xs"><FileSpreadsheet className="h-3.5 w-3.5" /> Template</button>
          <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" onChange={handleFileSelect} className="hidden" id="import-file" />
          <label htmlFor="import-file" className="btn-outline flex cursor-pointer items-center gap-1.5 text-xs"><Upload className="h-3.5 w-3.5" /> Import CSV/Excel</label>
          <input ref={imageZipInputRef} type="file" accept=".zip,application/zip,application/x-zip-compressed" onChange={handleImageZipSelect} className="hidden" id="import-images-zip" />
          <label htmlFor="import-images-zip" className={`btn-outline flex cursor-pointer items-center gap-1.5 text-xs ${imageZipLoading ? "pointer-events-none opacity-60" : ""}`}>
            <Upload className="h-3.5 w-3.5" /> {imageZipLoading ? "Reading Images…" : "Choose Images ZIP"}
          </label>
          {imageZip && <button onClick={() => { setImageZip(null); setImageZipMessage(""); }} className="btn-outline text-xs">Clear ZIP</button>}
          <button onClick={exportCsv} className="btn-outline flex items-center gap-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export</button>
          <button onClick={startAdd} className="btn-primary flex items-center gap-1.5 text-xs"><Plus className="h-3.5 w-3.5" /> Add Product</button>
        </div>
      </div>

      {(imageZip || imageZipLoading || imageZipErrors.length > 0) && (
        <div className="mb-4 rounded-lg border border-emerald-900/10 bg-cream-soft p-3 text-sm dark:border-cream/10 dark:bg-emerald-950/30">
          <div className="flex items-center justify-between gap-3">
            <p className="font-medium text-emerald-900 dark:text-cream">Product image ZIP</p>
            {imageZip && (
              <button
                type="button"
                onClick={() => {
                  setImageZip(null);
                  setImageZipMessage("");
                  setImageZipErrors([]);
                }}
                className="text-xs text-ink-soft hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          {imageZipLoading && <p className="mt-1 text-ink-soft">Reading ZIP and indexing image filenames…</p>}
          {imageZipMessage && <p className="mt-1 text-emerald-700">{imageZipMessage}</p>}
          {imageZipErrors.length > 0 && <p className="mt-1 text-red-700">{imageZipErrors.join(" ")}</p>}
          {imageZip && (
            <div className="mt-2 grid gap-2 text-xs sm:grid-cols-3">
              <div><strong>{imageZip.entries.size}</strong> images found</div>
              <div><strong>{Array.from(imageZip.entries.keys()).slice(0, 3).join(", ") || "—"}</strong>{imageZip.entries.size > 3 ? " …" : ""}</div>
              <div className="text-ink-soft">Ready to match with the CSV Image column</div>
            </div>
          )}
        </div>
      )}

      {selected.size > 0 && (
        <div className="mb-4 flex items-center gap-3 rounded-lg bg-emerald-50 px-4 py-2 text-sm dark:bg-emerald-900">
          <span>{selected.size} selected</span>
          <button onClick={() => bulkAction("publish")} className="text-emerald-700 hover:underline">Publish</button>
          <button onClick={() => bulkAction("hide")} className="text-emerald-700 hover:underline">Hide</button>
          <button onClick={() => bulkAction("delete")} className="text-red-600 hover:underline">Delete</button>
        </div>
      )}

      {formOpen && (
        <form onSubmit={handleSave} className="card mb-6 space-y-3 p-5 dark:border-cream/10 dark:bg-emerald-900">
          <div className="flex items-center justify-between">
            <p className="font-display text-base text-emerald-900 dark:text-cream">{editingId ? "Edit Product" : "New Product"}</p>
            <button type="button" onClick={() => setFormOpen(false)}><X className="h-4 w-4 text-ink-soft" /></button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="Product Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm">
              {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input type="number" placeholder="Discount Price (optional)" value={form.discount_price} onChange={(e) => setForm({ ...form, discount_price: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input required type="number" placeholder="Stock Quantity" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
            <input placeholder="Suitable For" value={form.suitable_for} onChange={(e) => setForm({ ...form, suitable_for: e.target.value })} className="rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          </div>
          <div>
            <input
              placeholder="Slug (optional — auto-generated from name if left blank)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-ink-soft">
              URL preview: /products/<span className="font-mono">{form.slug.trim() ? slugify(form.slug) : (form.name ? slugify(form.name) : "…")}</span>
              {" "}— the database guarantees this is unique, adjusting it automatically if it collides with an existing product.
            </p>
          </div>
          <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <input placeholder="Ingredients" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2 text-sm" />
          {errorMessage && <p className="text-xs text-red-700">{errorMessage}</p>}
          <button type="submit" disabled={saving} className="btn-primary text-sm">{saving ? "Saving…" : "Save Product"}</button>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl2 border border-emerald-900/10 dark:border-cream/10">
        <table className="w-full text-sm">
          <thead className="bg-emerald-50 text-left text-xs uppercase tracking-wide text-emerald-700 dark:bg-emerald-900 dark:text-cream/70">
            <tr>
              <th className="px-3 py-3"><input type="checkbox" checked={pageItems.length > 0 && pageItems.every((p) => selected.has(p.id))} onChange={toggleSelectAllOnPage} /></th>
              <th className="px-3 py-3">Product</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3">Price</th>
              <th className="px-3 py-3">Stock</th>
              <th className="px-3 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => {
              const status = getStockStatus(p.stock_quantity);
              return (
                <tr key={p.id} className="border-t border-emerald-900/5 dark:border-cream/5">
                  <td className="px-3 py-2.5"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      {p.image_url && <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded"><Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="32px" /></div>}
                      <span className="font-medium text-ink dark:text-cream">{p.name}</span>
                      {p.is_featured && <Star className="h-3 w-3 fill-gold-500 text-gold-500" />}
                      {!p.is_active && <span className="rounded-full bg-red-100 px-1.5 py-0.5 text-[9px] text-red-700">Hidden</span>}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-ink-soft dark:text-cream/70">{p.category}</td>
                  <td className="px-3 py-2.5 font-mono text-ink-soft dark:text-cream/70">Rs. {(p.discount_price ?? p.price).toLocaleString("en-IN")}</td>
                  <td className="px-3 py-2.5"><span className={`rounded-full px-2 py-0.5 text-[10px] ${statusBadge[status]}`}>{p.stock_quantity}</span></td>
                  <td className="px-3 py-2.5">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => toggleFeatured(p)} aria-label="Feature" className="rounded-lg p-1.5 text-gold-600 hover:bg-gold-50"><Star className="h-3.5 w-3.5" /></button>
                      <button onClick={() => toggleActive(p)} aria-label="Toggle visibility" className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50">{p.is_active ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}</button>
                      <button onClick={() => duplicateProduct(p)} aria-label="Duplicate" className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"><Copy className="h-3.5 w-3.5" /></button>
                      <button onClick={() => startEdit(p)} aria-label="Edit" className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50"><Pencil className="h-3.5 w-3.5" /></button>
                      <button onClick={() => deleteProduct(p.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-soft">No products yet — add one or import a CSV/Excel file.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`h-8 w-8 rounded-full text-xs ${page === i + 1 ? "bg-emerald-700 text-cream" : "bg-emerald-50 text-emerald-700"}`}>{i + 1}</button>
          ))}
        </div>
      )}
    </div>
  );
}
