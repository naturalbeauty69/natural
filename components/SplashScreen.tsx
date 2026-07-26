"use client";

import { useLayoutEffect, useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SESSION_KEY = "nbc-splash-shown";
const TOTAL_VISIBLE_MS = 1800;

export default function SplashScreen() {
  // Default to true so the very first paint (matching SSR output)
  // shows the splash. If sessionStorage already has the flag, the
  // layout effect below flips this to false synchronously — before
  // the browser paints — so returning-within-session visitors never
  // see a flash of the splash screen.
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useLayoutEffect(() => {
    const alreadyShown = sessionStorage.getItem(SESSION_KEY);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);

    if (alreadyShown) {
      setVisible(false);
      return;
    }

    sessionStorage.setItem(SESSION_KEY, "1");

    if (prefersReduced) {
      // Respect the setting: skip the animated sequence, close almost immediately.
      setVisible(false);
      return;
    }

    timeoutRef.current = setTimeout(() => setVisible(false), TOTAL_VISIBLE_MS);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return (
    <AnimatePresence>
      {visible && !reducedMotion && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream-soft"
          aria-hidden="true"
        >
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-28 w-28"
            >
              <Image src="/images/logo/logo.png" alt="" fill priority className="object-contain" />

              {/* Light sweep across the logo */}
              <motion.div
                initial={{ x: "-120%", opacity: 0 }}
                animate={{ x: "120%", opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.9, delay: 0.35, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-gold-300/70 to-transparent"
                style={{ mixBlendMode: "overlay" }}
              />
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.65 }}
            className="mt-5 font-display text-lg text-emerald-900 md:text-xl"
          >
            Natural Beauty Clinic &amp; Academy
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="eyebrow mt-2 text-gold-500"
          >
            Beauty • Hair • Skin • Nail • Professional Training
          </motion.p>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 96, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
            className="mt-7 h-[2px] overflow-hidden rounded-full bg-emerald-900/10"
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              transition={{ duration: 1.1, delay: 0.25, ease: "easeOut" }}
              className="h-full w-full bg-gold-500"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
