import Link from "next/link";
import { ContactSettings } from "@/lib/types";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/SocialIcons";

export default function Footer({ contact }: { contact: ContactSettings }) {
  return (
    <footer className="border-t border-emerald-900/10 bg-emerald-900 text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <p className="font-display text-lg text-cream">Natural Beauty</p>
          <p className="mt-1 text-sm text-cream/60">Clinic &amp; Academy</p>
          <p className="mt-4 text-sm leading-relaxed">
            Professional Beauty, Skin &amp; Hair Care | Training &amp; Certification
          </p>
          <div className="mt-5 flex items-center gap-4">
            <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-cream/70 hover:text-gold-300">
              <FacebookIcon className="h-5 w-5" />
            </a>
            <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-cream/70 hover:text-gold-300">
              <InstagramIcon className="h-5 w-5" />
            </a>
            <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-cream/70 hover:text-gold-300">
              <TikTokIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow text-gold-300">Visit</p>
          <p className="mt-3 text-sm leading-relaxed">{contact.address}</p>
          <p className="mt-3 text-sm text-cream/70">{contact.businessHours}</p>
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
            <li><Link href="/gallery" className="hover:text-gold-300">Gallery</Link></li>
            <li><Link href="/team" className="hover:text-gold-300">Team</Link></li>
            <li><Link href="/blog" className="hover:text-gold-300">Blog</Link></li>
            <li><Link href="/testimonials" className="hover:text-gold-300">Testimonials</Link></li>
            <li><Link href="/faq" className="hover:text-gold-300">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-gold-300">Legal</p>
          <ul className="mt-3 space-y-1 text-sm">
            <li><Link href="/privacy" className="hover:text-gold-300">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-gold-300">Terms &amp; Conditions</Link></li>
            <li><Link href="/refund-policy" className="hover:text-gold-300">Refund Policy</Link></li>
            <li><Link href="/cookie-policy" className="hover:text-gold-300">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-5 text-center text-xs text-cream/50">
        © {new Date().getFullYear()} Natural Beauty Clinic &amp; Academy. All rights reserved.
        {" · "}Reg. No. 211472/075/076{" · "}PAN 606806860{" · "}Est. 2019
      </div>
    </footer>
  );
}
