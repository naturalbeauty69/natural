import { createClient } from "@/lib/supabase-admin/server";
import GalleryManager from "@/components/admin/GalleryManager";

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: images } = await supabase
    .from("gallery_images")
    .select("id, url, category, caption, is_active, display_order")
    .order("display_order");

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Gallery</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Manage photos shown on the public Gallery page, by category.
      </p>
      <div className="mt-6">
        <GalleryManager initialImages={images ?? []} />
      </div>
    </div>
  );
}
