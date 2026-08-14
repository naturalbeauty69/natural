import Papa from "papaparse";
import * as XLSX from "xlsx";
import { PRODUCT_CATEGORIES } from "@/lib/products-types";
import { slugify } from "@/lib/slug";

export const IMPORT_COLUMNS = [
  "Product Name", "Category", "Price", "Discount Price", "Stock",
  "Suitable For", "Ingredients", "Description", "Image",
];

// Optional columns a business user MAY include — never required.
const OPTIONAL_COLUMNS = ["Featured", "Published"];

export interface ImportRow {
  name: string;
  category: string;
  price: number;
  discount_price: number | null;
  stock_quantity: number;
  suitable_for: string;
  ingredients: string;
  description: string;
  image_filename: string;
  is_featured: boolean;
  is_active: boolean;
  previewSlug: string; // UI preview only — the DB trigger has final authority
  errors: string[];
  warnings: string[];
}

function parseBoolLike(value: unknown, fallback: boolean): boolean {
  if (value === undefined || value === null || value === "") return fallback;
  const s = String(value).trim().toLowerCase();
  if (["true", "yes", "1", "y"].includes(s)) return true;
  if (["false", "no", "0", "n"].includes(s)) return false;
  return fallback;
}

function normalizeRow(raw: Record<string, any>): ImportRow {
  const errors: string[] = [];
  const warnings: string[] = [];

  const name = String(raw["Product Name"] ?? "").trim();
  const category = String(raw["Category"] ?? "").trim();
  const priceRaw = raw["Price"];
  const price = Number(priceRaw);
  const discountRaw = raw["Discount Price"];
  const discount_price = discountRaw !== undefined && discountRaw !== "" ? Number(discountRaw) : null;
  const stockRaw = raw["Stock"];
  const stock_quantity = stockRaw === undefined || stockRaw === "" ? 0 : Number(stockRaw);
  const image_filename = String(raw["Image"] ?? "").trim();

  // --- required-field validation (row is skipped on import if any error) ---
  if (!name) errors.push("Missing Product Name");
  if (!category) {
    errors.push("Missing Category");
  } else if (!PRODUCT_CATEGORIES.includes(category as any)) {
    errors.push(`Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`);
  }
  if (priceRaw === undefined || priceRaw === "" || isNaN(price)) {
    errors.push("Price must be a number");
  } else if (price < 0) {
    errors.push("Price cannot be negative");
  }
  if (isNaN(stock_quantity)) {
    errors.push("Stock must be a number");
  } else if (stock_quantity < 0) {
    errors.push("Stock cannot be negative");
  }
  if (discount_price !== null && !isNaN(discount_price) && !isNaN(price) && discount_price >= price) {
    warnings.push("Discount price is not lower than the regular price");
  }

  // --- warnings only (never block the import) ---
  if (!image_filename) {
    warnings.push("No image filename provided");
  }

  return {
    name,
    category,
    price: isNaN(price) ? 0 : price,
    discount_price: discount_price !== null && !isNaN(discount_price) ? discount_price : null,
    stock_quantity: isNaN(stock_quantity) ? 0 : stock_quantity,
    suitable_for: String(raw["Suitable For"] ?? "").trim(),
    ingredients: String(raw["Ingredients"] ?? "").trim(),
    description: String(raw["Description"] ?? "").trim(),
    image_filename,
    is_featured: parseBoolLike(raw["Featured"], false),
    is_active: parseBoolLike(raw["Published"], true),
    previewSlug: name ? slugify(name) : "",
    errors,
    warnings,
  };
}

function rowsAreBlank(raw: Record<string, any>): boolean {
  return Object.values(raw).every((v) => v === undefined || v === null || String(v).trim() === "");
}

export function parseCsvFile(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = (results.data as Record<string, any>[]).filter((r) => !rowsAreBlank(r));
        resolve(rows.map(normalizeRow));
      },
      error: reject,
    });
  });
}

export function parseExcelFile(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = (XLSX.utils.sheet_to_json(sheet) as Record<string, any>[]).filter((r) => !rowsAreBlank(r));
        resolve(rows.map(normalizeRow));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Image filenames from the spreadsheet map to /images/products/<filename>
// in the repo's public folder — admin uploads that folder alongside the
// import (same convention as the Gallery/Team "paste a path" model).
export function resolveImagePath(filename: string): string | null {
  if (!filename) return null;
  return `/images/products/${filename}`;
}

// NOTE: no `slug` field here, deliberately. The `products_ensure_slug`
// Postgres trigger (supabase/schema.sql) generates and uniquifies the
// slug for every row on insert — this is the single authoritative
// implementation. `previewSlug` above is shown in the import review
// table purely so the admin can see roughly what URL to expect.
export function rowToProductPayload(row: ImportRow, displayOrder: number) {
  return {
    name: row.name,
    category: row.category,
    price: row.price,
    discount_price: row.discount_price,
    stock_quantity: row.stock_quantity,
    suitable_for: row.suitable_for || null,
    ingredients: row.ingredients || null,
    description: row.description || null,
    image_url: resolveImagePath(row.image_filename),
    is_active: row.is_active,
    is_featured: row.is_featured,
    display_order: displayOrder,
  };
}

export function productsToCsv(products: Record<string, any>[]): string {
  const rows = products.map((p) => ({
    "Product Name": p.name,
    "Category": p.category,
    "Price": p.price,
    "Discount Price": p.discount_price ?? "",
    "Stock": p.stock_quantity,
    "Suitable For": p.suitable_for ?? "",
    "Ingredients": p.ingredients ?? "",
    "Description": p.description ?? "",
    "Image": p.image_url ? p.image_url.split("/").pop() : "",
    "Featured": p.is_featured ? "Yes" : "No",
    "Published": p.is_active ? "Yes" : "No",
  }));
  return Papa.unparse(rows);
}

export function downloadCsvTemplate() {
  const template = Papa.unparse([
    Object.fromEntries([...IMPORT_COLUMNS, ...OPTIONAL_COLUMNS].map((c) => [c, ""])),
  ]);
  const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
