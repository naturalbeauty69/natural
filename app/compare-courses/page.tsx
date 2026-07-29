import type { Metadata } from "next";
import Link from "next/link";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import BrandDivider from "@/components/BrandDivider";
import { courses } from "@/data/courses";

export const metadata: Metadata = {
  title: "Compare Beauty Courses",
  description:
    "Compare Basic Beautician Course, Advanced Beautician Course, and Professional Makeup Artist Course at Natural Beauty Clinic and Academy Kathmandu.",
  keywords: [
    "beautician course Kathmandu",
    "beauty academy Nepal",
    "makeup artist course Kathmandu",
    "professional beauty training Nepal",
  ],
};

const compareSlugs = [
  "basic-beautician-course",
  "advanced-beautician-course",
  "professional-makeup-artist-course",
];

const compared = compareSlugs.map((slug) => courses.find((c) => c.slug === slug)!);

type Cell = string;
const featureRows: { feature: string; values: [Cell, Cell, Cell] }[] = [
  { feature: "Course Level", values: [compared[0].level, compared[1].level, compared[2].level] },
  { feature: "Duration", values: [compared[0].duration, compared[1].duration, compared[2].duration] },
  { feature: "Suggested Fee", values: [
    `Rs. ${compared[0].fee.toLocaleString("en-IN")}`,
    `Rs. ${compared[1].fee.toLocaleString("en-IN")}`,
    `Rs. ${compared[2].fee.toLocaleString("en-IN")}`,
  ] },
  { feature: "Suitable For", values: ["Beginners, no experience needed", "Working beauticians upgrading skills", "Aspiring professional makeup artists"] },
  { feature: "Prerequisite", values: ["None", "Basic Beautician Course or equivalent experience", "None"] },
  { feature: "Theory Classes", values: ["Included", "Included", "Included"] },
  { feature: "Practical Training", values: ["Basic practical sessions", "Advanced practical sessions", "Professional makeup practice"] },
  { feature: "Hands-on Practice", values: ["Guided, supervised", "Independent, client-facing", "Independent, client-facing"] },
  { feature: "Hair Training", values: ["Introductory", "Advanced", "Not a focus"] },
  { feature: "Skin Training", values: ["Introductory", "Advanced", "Not a focus"] },
  { feature: "Makeup Training", values: ["Introductory", "Intermediate", "Advanced — bridal & party"] },
  { feature: "Nail Training", values: ["Introductory", "Intermediate", "Not a focus"] },
  { feature: "Product Knowledge", values: ["Included", "In-depth", "In-depth (makeup lines)"] },
  { feature: "Client Handling Skills", values: ["Introduced", "Emphasized", "Emphasized"] },
  { feature: "Salon Management", values: ["Not covered", "Introduced", "Not covered"] },
  { feature: "Certificate Provided", values: ["Yes", "Yes", "Yes"] },
  { feature: "Career Support", values: ["Basic guidance", "Professional guidance", "Makeup career guidance"] },
];

export default function CompareCoursesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Beauty Course Comparison",
    itemListElement: compared.map((c, i) => ({
      "@type": "Course",
      position: i + 1,
      name: c.name,
      description: `${c.name} — ${c.level} level, ${c.duration}.`,
      provider: { "@type": "Organization", name: "Natural Beauty Clinic & Academy" },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="mx-auto max-w-6xl px-6 pt-10">
        <Breadcrumbs items={[{ label: "Academy", href: "/academy" }, { label: "Compare Courses" }]} />
      </div>

      <section className="mx-auto max-w-4xl px-6 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl">Compare Our Professional Beauty Courses</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-soft">
          Choose the right beauty course based on your career goals, skill level, and professional requirements.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link href="/appointment" className="btn-gold">Enroll Now</Link>
          <Link href="/contact" className="btn-outline">Contact Academy</Link>
        </div>
      </section>

      <BrandDivider />

      <section className="mx-auto max-w-6xl overflow-x-auto px-6 py-12">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-40 border-b border-emerald-900/10 px-4 py-3 text-left text-xs uppercase tracking-wide text-ink-soft">Feature</th>
              {compared.map((c) => (
                <th key={c.slug} className="border-b border-emerald-900/10 px-4 py-3 text-left font-display text-emerald-900">
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {featureRows.map((row) => (
              <tr key={row.feature} className="odd:bg-emerald-50/40">
                <td className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-ink-soft">{row.feature}</td>
                {row.values.map((v, i) => (
                  <td key={i} className="px-4 py-2.5 text-ink-soft">{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <BrandDivider />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <SectionHeading eyebrow="Course Details" title="A closer look at each course." align="center" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {compared.map((c, i) => (
            <div key={c.slug} className="card p-6">
              <p className="eyebrow text-gold-500">{c.category}</p>
              <p className="mt-2 font-display text-lg text-emerald-900">{c.name}</p>
              <p className="mt-2 text-sm text-ink-soft">{c.duration} · {c.level}</p>
              <p className="mt-3 font-mono text-sm text-emerald-700">Rs. {c.fee.toLocaleString("en-IN")}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-ink-soft">
                {i === 0 && (
                  <>
                    <li>• Foundational skincare, haircare, and grooming skills</li>
                    <li>• Best for complete beginners</li>
                    <li>• Entry point into salon/clinic work</li>
                  </>
                )}
                {i === 1 && (
                  <>
                    <li>• Advanced techniques across hair, skin, and nails</li>
                    <li>• Salon-readiness and client handling</li>
                    <li>• Preparation for senior salon roles</li>
                  </>
                )}
                {i === 2 && (
                  <>
                    <li>• Bridal and party makeup specialization</li>
                    <li>• Professional makeup techniques and product knowledge</li>
                    <li>• Preparation for freelance or salon makeup artistry</li>
                  </>
                )}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <BrandDivider />

      <section className="mx-auto max-w-4xl px-6 py-12">
        <SectionHeading eyebrow="Which Course Is Right For You?" title="Match your goal to a course." align="center" />
        <div className="mt-8 space-y-3">
          <div className="card p-5">
            <p className="text-sm text-ink-soft"><strong className="text-emerald-900">New to beauty, starting out?</strong> → Basic Beautician Course</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-ink-soft"><strong className="text-emerald-900">Already working in the beauty field?</strong> → Advanced Beautician Course</p>
          </div>
          <div className="card p-5">
            <p className="text-sm text-ink-soft"><strong className="text-emerald-900">Want a career in makeup artistry?</strong> → Professional Makeup Artist Course</p>
          </div>
        </div>
      </section>

      <section className="bg-emerald-900 py-14 text-center text-cream">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl text-cream md:text-4xl">Ready to Start Your Beauty Career?</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/appointment" className="btn-gold">Apply Now</Link>
            <Link href="/appointment" className="btn-outline border-cream/30 text-cream hover:bg-cream/10">Book Free Consultation</Link>
            <Link href="/contact" className="btn-outline border-cream/30 text-cream hover:bg-cream/10">Contact Academy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
