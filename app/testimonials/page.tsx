import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import TestimonialCard from "@/components/TestimonialCard";
import { getTestimonials } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Real client and student reviews of Natural Beauty Clinic & Academy.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <SectionHeading
        eyebrow="Testimonials"
        title="What clients & students say."
        align="center"
      />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t) => (
          <TestimonialCard key={t.name} testimonial={t} />
        ))}
      </div>
    </div>
  );
}
