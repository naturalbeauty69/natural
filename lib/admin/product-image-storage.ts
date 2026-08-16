import type { SupabaseClient } from "@supabase/supabase-js";

export const PRODUCT_IMAGE_BUCKET = "products";

export function normalizeProductImageFilename(filename: string): string {
  const base = filename.replace(/\\/g, "/").split("/").pop()?.trim() || "";
  const withoutSpaces = base.replace(/\s+/g, "-");
  const safe = withoutSpaces.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return safe.toLowerCase();
}

export function isLegacyProductImagePath(value: string | null | undefined): boolean {
  return !!value && (value.startsWith("/images/products/") || value.startsWith("images/products/"));
}

export function isAbsoluteImageUrl(value: string | null | undefined): boolean {
  return !!value && /^https?:\/\//i.test(value);
}

export async function uploadProductImage(
  supabase: SupabaseClient,
  file: File
): Promise<{ url: string; storagePath: string; reused: boolean }> {
  const filename = normalizeProductImageFilename(file.name);
  if (!filename) throw new Error("Image filename is empty after normalization.");

  const storagePath = filename;
  const storage = supabase.storage.from(PRODUCT_IMAGE_BUCKET);

  const { error } = await storage.upload(storagePath, file, {
    contentType: file.type || "application/octet-stream",
    cacheControl: "31536000",
    upsert: true,
  });

  if (error) {
    const message = String(error.message || "");
    throw new Error(
      /bucket/i.test(message)
        ? `Supabase Storage bucket "${PRODUCT_IMAGE_BUCKET}" is not available. Create the PUBLIC bucket and run the product-image Storage policy SQL.`
        : /row-level security|not authorized|permission|forbidden/i.test(message)
          ? `Upload permission was denied by Supabase Storage RLS. Run the PRODUCT_IMAGE_STORAGE_POLICY_FIX.sql migration and make sure your logged-in profile is a staff/owner account.`
          : message || `Supabase Storage upload failed for ${filename}.`
    );
  }

  const { data } = storage.getPublicUrl(storagePath);
  if (!data.publicUrl) throw new Error(`Could not create a public URL for ${filename}.`);

  return {
    url: data.publicUrl,
    storagePath,
    reused: !!error,
  };
}
