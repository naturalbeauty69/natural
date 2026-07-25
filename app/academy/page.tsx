import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import BrandDivider from "@/components/BrandDivider";

export const metadata: Metadata = {
  title: "Beauty Academy",
  description: "Professional beauty, hair science, makeup, and nail art courses with certification.",
};

const courseTracks = [
  { name: "Beauty Training", note: "Skincare, facials, waxing, threading" },
  { name: "Hair Science", note: "Cutting, coloring, treatments, styling" },
  { name: "Makeup Artistry", note: "Bridal, party, and day makeup" },
  { name: "Nail Art", note: "Manicure, pedicure, extensions, nail art" },
];

export default function AcademyPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <SectionHeading
        eyebrow="Natural Beauty Academy"
        title="Certified courses, taught inside a working clinic."
        description="Every course pairs classroom instruction with supervised, hands-on client work — assessed by a licensed trainer and assessor."
        align="center"
      />

      <BrandDivider />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {courseTracks.map((c) => (
          <div key={c.name} className="card p-6">
            <p className="font-display text-xl text-emerald-900">{c.name}</p>
            <p className="mt-2 text-sm text-ink-soft">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-6">
        <p className="eyebrow text-gold-700">Content Needed From Client</p>
        <p className="mt-2 text-sm text-ink-soft">
          The <code>courses</code> table (see supabase/schema.sql) is ready to hold real
          curriculum, duration, eligibility, fees, and certification names for each track
          above. Share the course details/portfolio and Phase 2 will wire this page to
          live data exactly like the Services page.
        </p>
      </div>
    </div>
  );
}
