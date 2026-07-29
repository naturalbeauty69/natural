import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Breadcrumbs from "@/components/nav/Breadcrumbs";
import ContactMethods from "@/components/ContactMethods";
import ContactForm from "@/components/ContactForm";
import { getContactSettings } from "@/lib/get-data";
import ContactPageSchema from "@/components/schema/ContactPageSchema";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Natural Beauty Clinic & Academy in New Baneshwor, Kathmandu.",
};

export default async function ContactPage() {
  const contact = await getContactSettings();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <ContactPageSchema contact={contact} />
      <Breadcrumbs items={[{ label: "Contact" }]} />
      <SectionHeading eyebrow="Contact" title="We'd love to see you." align="center" />

      <ContactMethods contact={contact} />

      <div className="mt-10">
        <p className="eyebrow mb-4 text-center text-gold-500">Send Us a Message</p>
        <ContactForm />
      </div>

      <div className="mt-10 overflow-hidden rounded-xl2 border border-emerald-900/10">
        {contact.mapEmbedUrl ? (
          <iframe
            src={contact.mapEmbedUrl}
            width="100%"
            height="360"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Natural Beauty Clinic & Academy location"
          />
        ) : (
          <div className="bg-gold-100/30 p-6 text-center text-sm text-ink-soft">
            Google Maps embed goes here — send the Maps link and it drops straight in.
          </div>
        )}
      </div>
    </div>
  );
}
