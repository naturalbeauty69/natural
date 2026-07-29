"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

export default function AnalyticsPageview() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const fullPath = query ? `${pathname}?${query}` : pathname;
    if (lastPath.current === fullPath) return; // avoid duplicate page_view on same path
    lastPath.current = fullPath;
    trackPageView(fullPath);
  }, [pathname, searchParams]);

  return null;
}
