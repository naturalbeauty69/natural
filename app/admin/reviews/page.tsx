import { createClient } from "@/lib/supabase-admin/server";
import ReviewsManager from "@/components/admin/ReviewsManager";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, customer_name, location, rating, content, is_featured")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Reviews</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Customer reviews shown on the Testimonials page and homepage highlight section.
      </p>
      <div className="mt-6">
        <ReviewsManager initialTestimonials={testimonials ?? []} />
      </div>
    </div>
  );
}
