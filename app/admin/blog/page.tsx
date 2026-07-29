import { createClient } from "@/lib/supabase-admin/server";
import BlogManager from "@/components/admin/BlogManager";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, slug, title, cover_image_url, content, category, author, seo_keywords, published_at, is_active, display_order")
    .order("published_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Blog</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Publish, edit, or unpublish articles shown on the public Blog page.
      </p>
      <div className="mt-6">
        <BlogManager initialPosts={posts ?? []} />
      </div>
    </div>
  );
}
