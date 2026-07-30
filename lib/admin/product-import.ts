import Papa from "papaparse";
import * as XLSX from "xlsx";
import { PRODUCT_CATEGORIES } from "@/lib/products-types";

export const IMPORT_COLUMNS = [
  "Product Name", "Category", "Price", "Discount Price", "Stock",
  "Suitable For", "Ingredients", "Description", "Image",
];

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
  errors: string[];
}

function slugify(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function normalizeRow(raw: Record<string, any>): ImportRow {
  const errors: string[] = [];
  const name = String(raw["Product Name"] ?? "").trim();
  const category = String(raw["Category"] ?? "").trim();
  const price = Number(raw["Price"]);
  const discountRaw = raw["Discount Price"];
  const discount_price = discountRaw !== undefined && discountRaw !== "" ? Number(discountRaw) : null;
  const stock_quantity = Number(raw["Stock"] ?? 0);
  const image_filename = String(raw["Image"] ?? "").trim();

  if (!name) errors.push("Missing Product Name");
  if (!PRODUCT_CATEGORIES.includes(category as any)) {
    errors.push(`Category must be one of: ${PRODUCT_CATEGORIES.join(", ")}`);
  }
  if (!price || isNaN(price)) errors.push("Price must be a number");
  if (isNaN(stock_quantity)) errors.push("Stock must be a number");

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
    errors,
  };
}

export function parseCsvFile(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => resolve((results.data as Record<string, any>[]).map(normalizeRow)),
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
        const rows = XLSX.utils.sheet_to_json(sheet) as Record<string, any>[];
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

export function rowToProductPayload(row: ImportRow, displayOrder: number) {
  return {
    slug: slugify(row.name) + "-" + Math.random().toString(36).slice(2, 6),
    name: row.name,
    category: row.category,
    price: row.price,
    discount_price: row.discount_price,
    stock_quantity: row.stock_quantity,
    suitable_for: row.suitable_for || null,
    ingredients: row.ingredients || null,
    description: row.description || null,
    image_url: resolveImagePath(row.image_filename),
    is_active: true,
    is_featured: false,
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
  }));
  return Papa.unparse(rows);
}

export function downloadCsvTemplate() {
  const template = Papa.unparse([
    Object.fromEntries(IMPORT_COLUMNS.map((c) => [c, ""])),
  ]);
  const blob = new Blob([template], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "product-import-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}
