"use client";

import { useI18n } from "@/components/I18nProvider";

/** Shared shell for Privacy / Terms. Sections: [{ h: {en,bn}, p: {en,bn} }] */
export default function LegalPage({ title, sections }) {
  const { t, locale } = useI18n();
  return (
    <div className="pt-32 md:pt-40 pb-24 md:pb-32 container-edge max-w-3xl">
      <h1 className="heading-lg text-[var(--color-fg)]">{title[locale] || title.en}</h1>
      <p className="eyebrow mt-4">{t("legal.updated")}</p>
      <div className="mt-12 grid gap-10">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="font-display text-xl md:text-2xl text-[var(--color-fg)]">{s.h[locale] || s.h.en}</h2>
            <p className="mt-3 text-[var(--color-fg-muted)] leading-relaxed">{s.p[locale] || s.p.en}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
