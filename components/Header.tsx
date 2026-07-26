import Link from "next/link";
import Image from "next/image";

const nav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/academy", label: "Academy" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-emerald-900/5 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={40} height={40} className="h-10 w-10" />
          <span className="font-display text-xl font-semibold text-emerald-900">
            Natural Beauty
            <span className="ml-1 align-super text-[0.55em] tracking-widest text-gold-500">
              CLINIC &amp; ACADEMY
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition-colors hover:text-emerald-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/appointment" className="btn-primary">
          Book Appointment
        </Link>
      </div>
    </header>
  );
}
