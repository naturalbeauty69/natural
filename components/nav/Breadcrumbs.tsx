import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string; // omit on the current/last item
}

const BASE = "https://naturalbeautyclinic.com.np";

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const withHome: BreadcrumbItem[] = [{ label: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: withHome.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: item.href ? `${BASE}${item.href}` : undefined,
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-xs">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ol className="flex flex-wrap items-center gap-1.5 text-ink-soft">
        {withHome.map((item, i) => {
          const isLast = i === withHome.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-emerald-700">{item.label}</Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={isLast ? "text-emerald-900" : ""}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="h-3 w-3 text-emerald-900/30" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
