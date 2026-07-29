import { ContactSettings } from "@/lib/types";

const BASE = "https://naturalbeauty.com.np";

export default function ContactPageSchema({ contact }: { contact: ContactSettings }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${BASE}/contact`,
    about: { "@id": `${BASE}/#organization` },
    mainEntity: {
      "@type": "Organization",
      "@id": `${BASE}/#organization`,
      telephone: contact.phones[0],
      email: contact.email,
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}
