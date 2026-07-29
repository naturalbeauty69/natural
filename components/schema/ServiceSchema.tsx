import { Service } from "@/lib/types";

const BASE = "https://naturalbeauty.com.np";

export default function ServiceSchema({ services }: { services: Service[] }) {
  const itemListElement = services.map((s, i) => ({
    "@type": "Service",
    position: i + 1,
    name: s.name,
    category: s.category_slug,
    provider: { "@id": `${BASE}/#organization` },
    areaServed: "Kathmandu, Nepal",
    url: `${BASE}/services#${s.category_slug}`,
  }));

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement,
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
