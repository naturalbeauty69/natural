import Link from "next/link";
import { ContactSettings } from "@/lib/types";

export default function Footer({ contact }: { contact: ContactSettings }) {
  return (
    <footer className="border-t border-emerald-900/10 bg-emerald-900 text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          <p className="font-display text-lg text-cream">Natural Beauty</p>
          <p className="mt-1 text-sm text-cream/60">Clinic &amp; Academy</p>
          <p className="mt-4 text-sm leading-relaxed">
            Professional Beauty, Skin &amp; Hair Care | Training &amp; Certification
          </p>
        </div>

        <div>
          <p className="eyebrow text-gold-300">Visit</p>
          <p className="mt-3 text-sm leading-relaxed">{contact.address}</p>
        </div>

        <div>
          <p className="eyebrow text-gold-300">Contact</p>
          <ul className="mt-3 space-y-1 text-sm">
            {contact.phones.map((p) => (
              <li key={p}>
                <a href={`tel:${p}`} className="hover:text-gold-300">{p}</a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`} className="hover:text-gold-300">{contact.email}</a>
            </li>
            <li>
              <a
                href={`https://wa.me/${contact.whatsapp.replace(/\D/g, "")}`}
                className="hover:text-gold-300"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold-300">Explore</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/services" className="hover:text-gold-300">Services</Link></li>
            <li><Link href="/academy" className="hover:text-gold-300">Academy</Link></li>
            <li><Link href="/team" className="hover:text-gold-300">Team</Link></li>
            <li><Link href="/privacy" className="hover:text-gold-300">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold-300">Terms</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Natural Beauty Clinic &amp; Academy. All rights reserved.
      </div>
    </footer>
  );
}
