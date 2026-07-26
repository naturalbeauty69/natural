import { Testimonial } from "@/data/testimonials";

export default function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card p-6">
      <div className="text-gold-500" aria-label={`${testimonial.rating} out of 5 stars`}>
        {"★".repeat(testimonial.rating)}
        <span className="text-emerald-900/10">{"★".repeat(5 - testimonial.rating)}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">&ldquo;{testimonial.content}&rdquo;</p>
      <p className="mt-4 font-display text-base text-emerald-900">{testimonial.name}</p>
      <p className="text-xs text-ink-soft">{testimonial.location}</p>
    </div>
  );
}
