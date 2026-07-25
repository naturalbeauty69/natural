import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import BrandDivider from "@/components/BrandDivider";
import { getTeam } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "About Us",
  description: "About Natural Beauty Clinic & Academy — New Baneshwor, Kathmandu.",
};

export default async function AboutPage() {
  const team = await getTeam();
  const director = team.find((m) => m.slug === "archana-silwal-kadel");

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading
        eyebrow="About Us"
        title="Natural Beauty Clinic & Academy"
        description="Professional Beauty, Skin & Hair Care | Training & Certification — based in New Baneshwor, Kathmandu, opposite the overhead bridge."
      />

      <BrandDivider />

      <div className="prose-none mt-8 space-y-6 text-base leading-relaxed text-ink-soft">
        <p>
          Natural Beauty Clinic &amp; Academy operates as a working beauty clinic and a
          certified training academy under one roof — treatments performed on the same
          floor where the next generation of beauticians is trained and assessed.
        </p>
        {director && (
          <p>
            The clinic is led by <strong className="text-emerald-900">{director.name}</strong>,{" "}
            {director.role.toLowerCase()}, senior beautician, trainer, and assessor.
          </p>
        )}
      </div>

      <div className="mt-10 rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-6">
        <p className="eyebrow text-gold-700">Content Needed From Client</p>
        <p className="mt-2 text-sm text-ink-soft">
          Per the "no fictional content" rule, this page intentionally stays factual and
          brief. To complete <strong>Our Story</strong>, <strong>Vision</strong>, and{" "}
          <strong>Mission</strong> sections with real detail (founding year, milestones,
          specific philosophy in the owner&apos;s words), please share the source copy or
          portfolio PDF and it will be dropped in here without changing this layout.
        </p>
      </div>
    </div>
  );
}
