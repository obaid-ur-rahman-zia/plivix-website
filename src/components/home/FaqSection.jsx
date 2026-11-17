"use client";

import Link from "next/link";
import { useState } from "react";
import { useI18n } from "@/components/I18nProvider";

export default function FaqSection({ faqs = [] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(0);
  if (!faqs.length) return null;
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <section className="section-gradient relative container-edge py-24 md:py-40 border-t border-[var(--color-line)]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="grid grid-cols-12 gap-8 md:gap-12">
        <div className="col-span-12 md:col-span-5">
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
            <span>{t("faq.eyebrow")}</span>
          </div>
          <h2 className="heading-md text-[var(--color-fg)]">{t("faq.title")}</h2>
          <div className="mt-8 hidden md:block">
            <div className="font-display text-lg text-[var(--color-fg)]">{t("faq.stillTitle")}</div>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)] max-w-[34ch]">{t("faq.stillText")}</p>
            <Link href="/contact" className="eyebrow underline-grow text-[var(--color-fg)] mt-4 inline-block" data-cursor="hover">
              {t("common.startProject")} →
            </Link>
          </div>
        </div>
        <ul className="col-span-12 md:col-span-7 border-t border-[var(--color-line)]">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.id ?? f.question} className="border-b border-[var(--color-line)]">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-display text-lg md:text-xl text-[var(--color-fg)]"
                  >
                    {f.question}
                    <span aria-hidden className={`shrink-0 text-[var(--color-accent)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>
                </h3>
                <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
                  <p className="overflow-hidden text-[var(--color-fg-muted)] leading-relaxed max-w-[60ch]">{f.answer}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
