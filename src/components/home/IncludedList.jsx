"use client";

import { useI18n } from "@/components/I18nProvider";

export default function IncludedList() {
  const { t } = useI18n();
  return (
    <section className="container-edge pb-24 md:pb-32">
      <h2 className="font-display text-2xl md:text-3xl text-[var(--color-fg)] mb-8">{t("pricing.compareTitle")}</h2>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
        {t("pricing.included").map((x) => (
          <li key={x} className="bg-[var(--color-bg)] p-5 text-[var(--color-fg)] text-sm md:text-base">
            {x}
          </li>
        ))}
      </ul>
    </section>
  );
}
