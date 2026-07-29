"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Phone } from "lucide-react";
import { navItems, quickLinks } from "@/lib/nav-config";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "@/components/SocialIcons";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";
import { ContactSettings } from "@/lib/types";
import { trackGoogleMapsClick, trackSocialClick, trackPhoneClick } from "@/lib/analytics";

export default function MobileSidebar({
  open,
  onClose,
  contact,
}: {
  open: boolean;
  onClose: () => void;
  contact: ContactSettings;
}) {
  const pathname = usePathname();
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useFocusTrap(sidebarRef, open);
  useLockBodyScroll(open);
  useEscapeKey(onClose, open);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-emerald-900/40 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={sidebarRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-y-0 left-0 z-[61] flex w-[85%] max-w-sm flex-col bg-cream-soft/95 shadow-soft backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={36} height={36} />
              <button onClick={onClose} aria-label="Close menu" className="rounded-full p-2 hover:bg-emerald-50">
                <span className="block h-4 w-4 text-emerald-900">✕</span>
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 pb-6">
              <ul className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  if (!item.megaMenu) {
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`block rounded-lg px-3 py-3 font-display text-base ${
                            isActive ? "bg-emerald-50 text-emerald-900" : "text-emerald-900"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  }

                  const isOpen = openAccordion === item.label;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => setOpenAccordion(isOpen ? null : item.label)}
                        aria-expanded={isOpen}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-3 font-display text-base text-emerald-900"
                      >
                        {item.label}
                        <ChevronDown className={`h-4 w-4 text-gold-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden pl-4"
                          >
                            {item.megaMenu.columns.map((col) => (
                              <div key={col.heading} className="py-2">
                                <p className="eyebrow text-gold-500">{col.heading}</p>
                                <ul className="mt-1 space-y-1.5">
                                  {col.links.map((link) => (
                                    <li key={link.label}>
                                      <Link
                                        href={link.href}
                                        onClick={onClose}
                                        className="block py-1 text-sm text-ink-soft"
                                      >
                                        {link.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 border-t border-emerald-900/10 pt-6">
                <p className="eyebrow text-gold-500">Quick Links</p>
                <ul className="mt-3 grid grid-cols-2 gap-2">
                  {quickLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={() => {
                            if (link.label === "Directions") trackGoogleMapsClick();
                            onClose();
                          }}
                          className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900"
                        >
                          <Icon className="h-3.5 w-3.5 text-gold-500" />
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <Link
                href="/appointment"
                onClick={onClose}
                className="btn-gold mt-6 flex w-full items-center justify-center"
              >
                Book Appointment
              </Link>
            </nav>

            <div className="border-t border-emerald-900/10 px-5 py-4">
              <a href={`tel:${contact.phones[0]}`} onClick={trackPhoneClick} className="flex items-center gap-2 text-sm text-emerald-900">
                <Phone className="h-4 w-4 text-gold-500" /> {contact.phones[0]}
              </a>
              <p className="mt-1 text-xs text-ink-soft">{contact.businessHours}</p>
              <div className="mt-3 flex items-center gap-4 text-emerald-700">
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" onClick={() => trackSocialClick("facebook")}><FacebookIcon className="h-4 w-4" /></a>
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" onClick={() => trackSocialClick("instagram")}><InstagramIcon className="h-4 w-4" /></a>
                <a href={contact.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" onClick={() => trackSocialClick("tiktok")}><TikTokIcon className="h-4 w-4" /></a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
