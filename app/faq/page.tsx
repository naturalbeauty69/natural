import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import FaqAccordion from "@/components/FaqAccordion";
import { getFaqs } from "@/lib/get-data";
import FaqSchema from "@/components/schema/FaqSchema";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about services, courses, booking, and payment at Natural Beauty Clinic & Academy.",
};

export default async function FaqPage() {
  const faqs = await getFaqs();
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <FaqSchema faqs={faqs} />
      <Breadcrumbs items={[{ "label": "FAQ" }]} />
      <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" align="center" />
      <div className="mt-10">
        <FaqAccordion faqs={faqs} />
      </div>
    </div>
  );
}
