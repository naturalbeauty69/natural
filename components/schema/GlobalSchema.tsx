import { ContactSettings } from "@/lib/types";
import { companyProfile } from "@/data/company";

const BASE = "https://naturalbeauty.com.np";
const LOGO = `${BASE}/images/logo/logo.png`;

export default function GlobalSchema({ contact }: { contact: ContactSettings }) {
  const sameAs = [contact.facebook, contact.instagram, contact.tiktok].filter(Boolean);

  const organization = {
    "@type": "Organization",
    "@id": `${BASE}/#organization`,
    name: "Natural Beauty Clinic & Academy",
    url: BASE,
    logo: { "@type": "ImageObject", url: LOGO },
    image: LOGO,
    description: companyProfile.shortDescription,
    email: contact.email,
    telephone: contact.phones[0],
    sameAs,
    address: {
      "@type": "PostalAddress",
      streetAddress: "New Baneshwor, Opposite the Overhead Bridge",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    areaServed: "Kathmandu, Nepal",
  };

  const website = {
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    name: "Natural Beauty Clinic & Academy",
    url: BASE,
    publisher: { "@id": `${BASE}/#organization` },
    inLanguage: "en",
  };

  // BeautySalon extends LocalBusiness — combines the salon + academy's
  // physical-location facts. Fields we don't have (e.g. geo coordinates)
  // are simply omitted rather than filled with placeholder values.
  const beautySalon = {
    "@type": "BeautySalon",
    "@id": `${BASE}/#beautysalon`,
    name: "Natural Beauty Clinic & Academy",
    description: companyProfile.shortDescription,
    url: BASE,
    logo: LOGO,
    image: LOGO,
    telephone: contact.phones[0],
    email: contact.email,
    priceRange: "NPR",
    paymentAccepted: "Cash, eSewa, Bank Transfer",
    address: {
      "@type": "PostalAddress",
      streetAddress: "New Baneshwor, Opposite the Overhead Bridge",
      addressLocality: "Kathmandu",
      addressCountry: "NP",
    },
    areaServed: "Kathmandu, Nepal",
    sameAs,
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organization, website, beautySalon],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
