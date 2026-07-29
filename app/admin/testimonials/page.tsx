import { redirect } from "next/navigation";

// Testimonials and Reviews manage the same underlying table —
// redirect here to avoid a duplicate management screen.
export default function AdminTestimonialsPage() {
  redirect("/admin/reviews");
}
