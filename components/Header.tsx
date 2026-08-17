"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag } from "lucide-react";
import { navItems } from "@/lib/nav-config";
import HamburgerButton from "@/components/nav/HamburgerButton";
import MegaMenu from "@/components/nav/MegaMenu";
import MobileSidebar from "@/components/nav/MobileSidebar";
import SearchModal from "@/components/nav/SearchModal";
import { ContactSettings } from "@/lib/types";
import { useCart } from "@/lib/cart-context";

export default function Header({ contact }: { contact: ContactSettings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const { totalItems } = useCart();

  useEffect(() => {
    let frame = 0;
    let lastScrolled = false;

    const update = () => {
      frame = 0;
      const next = window.scrollY > 12;
      if (next !== lastScrolled) {
        lastScrolled = next;
        setScrolled(next);
      }
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    lastScrolled = window.scrollY > 12;
    setScrolled(lastScrolled);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // Close mobile sidebar / search automatically on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openSearch();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openSearch]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-[padding,background-color,box-shadow] duration-200 ${
          scrolled
            ? "border-emerald-900/8 bg-cream/95 py-2 shadow-soft"
            : "border-transparent bg-cream/90 py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={40} height={40} className="h-9 w-9 md:h-10 md:w-10" />
            <span className="font-display text-lg font-semibold text-emerald-900 md:text-xl">
              Natural Beauty
              <span className="ml-1 align-super text-[0.55em] tracking-widest text-gold-500">
                CLINIC &amp; ACADEMY
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex" onMouseLeave={() => setOpenMenu(null)}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <div key={item.label} className="relative" onMouseEnter={() => item.megaMenu && setOpenMenu(item.label)}>
                  <Link
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-emerald-700 ${
                      isActive ? "text-emerald-700" : "text-ink-soft"
                    }`}
                    aria-haspopup={item.megaMenu ? "true" : undefined}
                    aria-expanded={item.megaMenu ? openMenu === item.label : undefined}
                  >
                    {item.label}
                  </Link>
                  {item.megaMenu && (
                    <MegaMenu
                      open={openMenu === item.label}
                      columns={item.megaMenu.columns}
                      featured={item.megaMenu.featured}
                      onClose={() => setOpenMenu(null)}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={openSearch}
              aria-label="Search"
              className="hidden items-center gap-2 rounded-full border border-emerald-900/10 px-3 py-2 text-xs text-ink-soft transition-colors hover:border-emerald-700/30 md:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="text-[10px] text-ink-soft/70">⌘K</kbd>
            </button>
            <button onClick={openSearch} aria-label="Search" className="rounded-full p-2 hover:bg-emerald-50 md:hidden">
              <Search className="h-5 w-5 text-emerald-900" />
            </button>

            <Link href="/cart" aria-label="Cart" className="relative rounded-full p-2 hover:bg-emerald-50">
              <ShoppingBag className="h-5 w-5 text-emerald-900" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-medium text-emerald-900">
                  {totalItems}
                </span>
              )}
            </Link>

            <Link href="/appointment" className="btn-primary hidden md:inline-flex">
              Book Appointment
            </Link>

            <div className="md:hidden">
              <HamburgerButton open={mobileOpen} onClick={() => setMobileOpen((v) => !v)} />
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar open={mobileOpen} onClose={() => setMobileOpen(false)} contact={contact} />
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
