"use client";

import { motion } from "framer-motion";

export default function HamburgerButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full transition-colors hover:bg-emerald-50"
    >
      <span className="relative block h-4 w-5" aria-hidden="true">
        <motion.span
          className="absolute left-0 top-0 h-[1.6px] w-5 rounded-full bg-emerald-900"
          animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute left-0 top-[7px] h-[1.6px] w-5 rounded-full bg-emerald-900"
          animate={open ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.15 }}
        />
        <motion.span
          className="absolute left-0 bottom-0 h-[1.6px] w-5 rounded-full bg-emerald-900"
          animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        />
      </span>
    </button>
  );
}
