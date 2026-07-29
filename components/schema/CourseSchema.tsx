import { Course } from "@/data/courses";

const BASE = "https://naturalbeauty.com.np";

export default function CourseSchema({ courses }: { courses: Course[] }) {
  const graph = courses.map((c) => ({
    "@type": "Course",
    "@id": `${BASE}/academy#${c.slug}`,
    name: c.name,
    description: `${c.name} — ${c.category}, ${c.level} level, ${c.duration}.`,
    provider: {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      name: "Natural Beauty Clinic & Academy",
      sameAs: BASE,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Onsite",
      courseWorkload: c.duration,
    },
    offers: {
      "@type": "Offer",
      price: c.fee,
      priceCurrency: "NPR",
      category: c.category,
    },
  }));

  const schema = { "@context": "https://schema.org", "@graph": graph };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
