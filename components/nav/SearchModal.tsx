"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import { services } from "@/data/services";
import { blogPosts } from "@/data/blog";
import { team } from "@/data/team";
import { faqs } from "@/data/faq";
import { useFocusTrap } from "@/lib/hooks/useFocusTrap";
import { useLockBodyScroll } from "@/lib/hooks/useLockBodyScroll";
import { useEscapeKey } from "@/lib/hooks/useEscapeKey";
import { trackSearch } from "@/lib/analytics";

interface SearchResult {
  type: "Page" | "Service" | "Blog" | "Team" | "FAQ";
  title: string;
  href: string;
  subtitle?: string;
}

const staticPages: SearchResult[] = [
  { type: "Page", title: "Home", href: "/" },
  { type: "Page", title: "About", href: "/about" },
  { type: "Page", title: "Services & Pricing", href: "/services" },
  { type: "Page", title: "Academy", href: "/academy" },
  { type: "Page", title: "Compare Courses", href: "/compare-courses" },
  { type: "Page", title: "Gallery", href: "/gallery" },
  { type: "Page", title: "Team", href: "/team" },
  { type: "Page", title: "Blog", href: "/blog" },
  { type: "Page", title: "Testimonials", href: "/testimonials" },
  { type: "Page", title: "FAQ", href: "/faq" },
  { type: "Page", title: "Contact", href: "/contact" },
  { type: "Page", title: "Book Appointment", href: "/appointment" },
];

const index: SearchResult[] = [
  ...staticPages,
  ...services.map((s) => ({
    type: "Service" as const,
    title: s.name,
    href: `/services#${s.category_slug}`,
    subtitle: s.brand_name ?? undefined,
  })),
  ...blogPosts.map((p) => ({
    type: "Blog" as const,
    title: p.title,
    href: `/blog/${p.slug}`,
    subtitle: p.category,
  })),
  ...team.map((t) => ({
    type: "Team" as const,
    title: t.name,
    href: "/team",
    subtitle: t.role,
  })),
  ...faqs.map((f) => ({
    type: "FAQ" as const,
    title: f.question,
    href: "/faq",
  })),
];

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useFocusTrap(modalRef, open);
  useLockBodyScroll(open);
  useEscapeKey(onClose, open);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return index.filter((r) => r.title.toLowerCase().includes(q) || r.subtitle?.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[70] bg-emerald-900/50 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="fixed left-1/2 top-24 z-[71] w-[90%] max-w-lg -translate-x-1/2 rounded-xl2 bg-cream-soft shadow-soft"
          >
            <div className="flex items-center gap-3 border-b border-emerald-900/10 px-5 py-4">
              <SearchIcon className="h-4 w-4 text-gold-500" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search services, blog, team, FAQs…"
                className="flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
                role="searchbox"
                aria-label="Search"
              />
              <kbd className="rounded border border-emerald-900/15 px-1.5 py-0.5 text-[10px] text-ink-soft">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
              {query.trim() && results.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-soft">No results for &ldquo;{query}&rdquo;.</p>
              )}
              {results.map((r) => (
                <Link
                  key={`${r.type}-${r.title}`}
                  href={r.href}
                  onClick={() => {
                    trackSearch(query);
                    onClose();
                  }}
                  className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-emerald-50"
                >
                  <div>
                    <p className="text-sm text-ink">{r.title}</p>
                    {r.subtitle && <p className="text-xs text-ink-soft">{r.subtitle}</p>}
                  </div>
                  <span className="eyebrow text-emerald-500">{r.type}</span>
                </Link>
              ))}
              {!query.trim() && (
                <p className="px-3 py-6 text-center text-sm text-ink-soft">
                  Try &ldquo;bridal&rdquo;, &ldquo;keratin&rdquo;, or &ldquo;academy&rdquo;.
                </p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
