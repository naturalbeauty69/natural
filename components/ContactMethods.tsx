"use client";

import Image from "next/image";
import { ContactSettings } from "@/lib/types";
import { trackPhoneClick, trackEmailClick, trackWhatsAppClick, trackSocialClick } from "@/lib/analytics";

const icon = (name: string) => `/images/logo/icon-${name}.png`;

export default function ContactMethods({ contact }: { contact: ContactSettings }) {
  return (
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
              <a href={`tel:${p}`} onClick={trackPhoneClick} className="hover:text-emerald-700">{p}</a>
            </p>
          ))}
        </div>
      </div>
      <div className="card flex gap-4 p-6">
        <Image src={icon("email")} alt="" width={28} height={28} className="h-7 w-7 flex-shrink-0" />
        <div>
          <p className="eyebrow text-gold-500">Email</p>
          <p className="mt-2 text-sm">
            <a href={`mailto:${contact.email}`} onClick={trackEmailClick} className="hover:text-emerald-700">{contact.email}</a>
          </p>
        </div>
      </div>
      <div className="card flex gap-4 p-6">
        <Image src={icon("whatsapp")} alt="" width={28} height={28} className="h-7 w-7 flex-shrink-0" />
        <div>
          <p className="eyebrow text-gold-500">WhatsApp &amp; Social</p>
          <p className="mt-2 text-sm">
            <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`} onClick={trackWhatsAppClick} className="hover:text-emerald-700">
              {contact.whatsapp}
            </a>
          </p>
          <div className="mt-3 flex items-center gap-3">
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" onClick={() => trackSocialClick("facebook")}>
              <Image src={icon("facebook")} alt="" width={24} height={24} className="h-6 w-6" />
            </a>
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" onClick={() => trackSocialClick("instagram")}>
              <Image src={icon("instagram")} alt="" width={24} height={24} className="h-6 w-6" />
            </a>
            <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" onClick={() => trackSocialClick("tiktok")}>
              <Image src={icon("tik-tok")} alt="" width={24} height={24} className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
