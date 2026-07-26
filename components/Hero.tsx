"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { HeroCta } from "@/lib/types";

const ctaClass: Record<HeroCta["style"], string> = {
  gold: "btn-gold",
  outline: "btn-outline",
  primary: "btn-primary",
};

export default function Hero({
  tagline,
  heading,
  description,
  ctas,
}: {
  tagline: string;
  heading: string;
  description: string;
  ctas: HeroCta[];
}) {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <p className="eyebrow">{tagline}</p>
          <h1 className="mt-4 text-4xl leading-[1.1] md:text-5xl">{heading}</h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">
            {description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((cta) => (
              <Link key={cta.label} href={cta.href} className={ctaClass[cta.style]}>
                {cta.label}
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.15 }}
          className="relative"
        >
          <div className="relative aspect-[4/5] w-full max-w-md overflow-hidden rounded-xl2 shadow-soft md:ml-auto">
            <Image
              src="/images/team/archana-silwal-kadel.jpg"
              alt="Archana Silwal Kadel, Owner & Director, Natural Beauty Clinic & Academy"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 768px) 480px, 90vw"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 hidden rounded-xl2 bg-emerald-700 px-6 py-4 text-cream shadow-soft md:block">
            <p className="font-display text-2xl">Archana Silwal Kadel</p>
            <p className="eyebrow text-gold-300">Owner · Senior Beautician · Trainer · Assessor</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
