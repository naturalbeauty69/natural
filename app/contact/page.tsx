import type { Metadata } from "next";
import Image from "next/image";
import SectionHeading from "@/components/SectionHeading";
import { getContactSettings } from "@/lib/get-data";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Natural Beauty Clinic & Academy in New Baneshwor, Kathmandu.",
};

const icon = (name: string) => `/images/logo/icon-${name}.png`;

export default async function ContactPage() {
  const contact = await getContactSettings();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <SectionHeading eyebrow="Contact" title="We'd love to see you." align="center" />

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="card flex gap-4 p-6">
          <Image src={icon("location-pin")} alt="" width={28} height={28} className="h-7 w-7 flex-shrink-0" />
          <div>
            <p className="eyebrow text-gold-500">Address</p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{contact.address}</p>
          </div>
        </div>
        <div className="card flex gap-4 p-6">
          <Image src={icon("phone")} alt="" width={28} height={28} className="h-7 w-7 flex-shrink-0" />
          <div>
            <p className="eyebrow text-gold-500">Phone</p>
            {contact.phones.map((p) => (
              <p key={p} className="mt-1 text-sm text-ink-soft">
                <a href={`tel:${p}`} className="hover:text-emerald-700">{p}</a>
              </p>
            ))}
          </div>
        </div>
        <div className="card flex gap-4 p-6">
          <Image src={icon("email")} alt="" width={28} height={28} className="h-7 w-7 flex-shrink-0" />
          <div>
            <p className="eyebrow text-gold-500">Email</p>
            <p className="mt-2 text-sm">
              <a href={`mailto:${contact.email}`} className="hover:text-emerald-700">{contact.email}</a>
            </p>
          </div>
        </div>
        <div className="card flex gap-4 p-6">
          <Image src={icon("whatsapp")} alt="" width={28} height={28} className="h-7 w-7 flex-shrink-0" />
          <div>
            <p className="eyebrow text-gold-500">WhatsApp &amp; Social</p>
            <p className="mt-2 text-sm">
              <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} className="hover:text-emerald-700">
                {contact.whatsapp}
              </a>
            </p>
            <div className="mt-3 flex items-center gap-3">
              <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Image src={icon("facebook")} alt="" width={24} height={24} className="h-6 w-6" />
              </a>
              <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Image src={icon("instagram")} alt="" width={24} height={24} className="h-6 w-6" />
              </a>
              <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <Image src={icon("tik-tok")} alt="" width={24} height={24} className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
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
