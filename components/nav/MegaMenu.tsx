"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { MegaMenuColumn } from "@/lib/nav-config";

export default function MegaMenu({
  open,
  columns,
  featured,
  onClose,
}: {
  open: boolean;
  columns: MegaMenuColumn[];
  featured: { title: string; description: string; href: string; cta: string };
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="absolute left-1/2 top-full z-40 mt-3 w-[720px] -translate-x-1/2 rounded-xl2 border border-emerald-900/10 bg-cream-soft/95 p-6 shadow-soft backdrop-blur-md"
          role="menu"
        >
          <div className="grid grid-cols-[1fr_1fr_1fr_1fr_220px] gap-6">
            {columns.map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.heading}>
                  <div className="flex items-center gap-2 text-emerald-900">
                    <Icon className="h-4 w-4 text-gold-500" />
                    <p className="font-display text-sm">{col.heading}</p>
                  </div>
                  <ul className="mt-3 space-y-2">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="text-sm text-ink-soft transition-colors hover:text-emerald-700"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <div className="rounded-xl border border-gold-500/20 bg-gold-100/30 p-4">
              <p className="eyebrow text-gold-700">Featured</p>
              <p className="mt-1 font-display text-base text-emerald-900">{featured.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-soft">{featured.description}</p>
              <Link
                href={featured.href}
                onClick={onClose}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-gold-600"
              >
                {featured.cta} <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
