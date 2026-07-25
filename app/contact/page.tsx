import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import { getContactSettings } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Natural Beauty Clinic & Academy in New Baneshwor, Kathmandu.",
};

export default async function ContactPage() {
  const contact = await getContactSettings();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading eyebrow="Contact" title="We'd love to see you." align="center" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="card p-6">
          <p className="eyebrow text-gold-500">Address</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{contact.address}</p>
        </div>
        <div className="card p-6">
          <p className="eyebrow text-gold-500">Phone</p>
          {contact.phones.map((p) => (
            <p key={p} className="mt-1 text-sm text-ink-soft">
              <a href={`tel:${p}`} className="hover:text-emerald-700">{p}</a>
            </p>
          ))}
        </div>
        <div className="card p-6">
          <p className="eyebrow text-gold-500">Email</p>
          <p className="mt-2 text-sm">
            <a href={`mailto:${contact.email}`} className="hover:text-emerald-700">{contact.email}</a>
          </p>
        </div>
        <div className="card p-6">
          <p className="eyebrow text-gold-500">WhatsApp &amp; TikTok</p>
          <p className="mt-2 text-sm">
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
              className="hover:text-emerald-700"
            >
              {contact.whatsapp}
            </a>
          </p>
          <p className="mt-1 text-sm text-ink-soft">{contact.tiktok}</p>
        </div>
      </div>

      <div className="mt-10 rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-6 text-sm text-ink-soft">
        Embedded Google Map goes here once the exact place listing / Google Business
        Profile link is confirmed.
      </div>
    </div>
  );
}
