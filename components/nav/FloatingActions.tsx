"use client";

import Link from "next/link";
import { Phone, Calendar } from "lucide-react";
import { ContactSettings } from "@/lib/types";
import { trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";

export default function FloatingActions({ contact }: { contact: ContactSettings }) {
  const whatsappHref = `https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`;

  return (
    <>
      <div
        className="fixed bottom-24 right-5 z-40 flex flex-col items-end gap-3 md:bottom-6"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          onClick={trackWhatsAppClick}
          className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-soft"
        >
          <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60" />
          <svg viewBox="0 0 24 24" fill="white" className="relative h-7 w-7">
            <path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.5-.1-.6.1-.2.3-.7.9-.9 1-.2.2-.3.2-.6.1-.9-.4-1.9-1-2.7-2-.7-.9-1.2-1.8-1.3-2.1-.1-.3 0-.4.1-.6.1-.1.6-.7.7-1 .1-.2 0-.4-.1-.5-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9 1-.9 2.3 0 1.3 1 2.6 1.1 2.8.1.2 1.6 2.5 4 3.5 2 .8 2.4.7 2.8.6.4-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z" />
          </svg>
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-emerald-900 px-3 py-1.5 text-xs text-cream opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
            Chat on WhatsApp
          </span>
        </a>

        <a
          href={`tel:${contact.phones[0]}`}
          aria-label="Call now"
          onClick={trackPhoneClick}
          className="group relative flex h-12 w-12 items-center justify-center rounded-full bg-emerald-700 shadow-soft"
        >
          <Phone className="h-5 w-5 text-cream" />
          <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full bg-emerald-900 px-3 py-1.5 text-xs text-cream opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
            Call Now
          </span>
        </a>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-emerald-900/10 bg-cream-soft/95 p-3 backdrop-blur-md md:hidden"
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <Link href="/appointment" className="btn-gold flex w-full items-center justify-center gap-2">
          <Calendar className="h-4 w-4" /> Book Appointment
        </Link>
      </div>
    </>
  );
}
