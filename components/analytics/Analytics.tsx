"use client";

import { useEffect, useState, Suspense } from "react";
import { GoogleAnalytics, sendGAEvent } from "@next/third-parties/google";
import CookieConsentBanner, { getStoredConsent } from "@/components/analytics/CookieConsentBanner";
import AnalyticsPageview from "@/components/analytics/AnalyticsPageview";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-0L15XJ8PZT";

export default function Analytics() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    if (getStoredConsent() === "accepted") setConsented(true);
  }, []);

  useEffect(() => {
    // Enable GA4 DebugView only in development, once GA has mounted.
    if (consented && process.env.NODE_ENV === "development") {
      sendGAEvent("config", GA_MEASUREMENT_ID, { debug_mode: true });
    }
  }, [consented]);

  return (
    <>
      {consented && (
        <>
          <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
          <Suspense fallback={null}>
            <AnalyticsPageview />
          </Suspense>
        </>
      )}
      <CookieConsentBanner onDecision={(consent) => setConsented(consent === "accepted")} />
    </>
  );
}
