"use client";

import { useState } from "react";
import { Faq } from "@/data/faq";

export default function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.question} className="card overflow-hidden">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base text-emerald-900">{faq.question}</span>
              <span className={`flex-shrink-0 text-gold-500 transition-transform ${isOpen ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            {isOpen && (
              <p className="px-5 pb-5 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
