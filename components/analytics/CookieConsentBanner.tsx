"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export const CONSENT_KEY = "nbc-cookie-consent"; // "accepted" | "declined"

export function getStoredConsent(): "accepted" | "declined" | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accepted" || value === "declined" ? value : null;
}

export default function CookieConsentBanner({
  onDecision,
}: {
  onDecision: (consent: "accepted" | "declined") => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getStoredConsent()) setVisible(true);
  }, []);

  function decide(consent: "accepted" | "declined") {
    window.localStorage.setItem(CONSENT_KEY, consent);
    setVisible(false);
    onDecision(consent);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-emerald-900/10 bg-cream-soft/98 px-5 py-4 shadow-soft backdrop-blur-md">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="text-xs leading-relaxed text-ink-soft">
          We use cookies to understand site traffic and improve your experience. See our{" "}
          <Link href="/cookie-policy" className="underline hover:text-emerald-700">Cookie Policy</Link>.
        </p>
        <div className="flex flex-shrink-0 gap-2">
          <button onClick={() => decide("declined")} className="btn-outline px-4 py-2 text-xs">
            Decline
          </button>
          <button onClick={() => decide("accepted")} className="btn-primary px-4 py-2 text-xs">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
