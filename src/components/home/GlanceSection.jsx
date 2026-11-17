"use client";

import { useI18n } from "@/components/I18nProvider";

/** Plain-language facts block: easy for visitors, search snippets and AI assistants to quote. */
export default function GlanceSection() {
  const { t } = useI18n();
  const rows = t("glance.rows");
  return (
    <section className="container-edge py-20 md:py-28 border-t border-[var(--color-line)]">
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <div className="eyebrow mb-5 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
            <span>{t("glance.eyebrow")}</span>
          </div>
          <h2 className="heading-md text-[var(--color-fg)]">{t("glance.title")}</h2>
        </div>
        <dl className="col-span-12 md:col-span-8 border-t border-[var(--color-line)]">
          {rows.map(([k, v]) => (
            <div key={k} className="grid sm:grid-cols-[11rem_1fr] gap-1 sm:gap-6 py-4 border-b border-[var(--color-line)]">
              <dt className="eyebrow text-[var(--color-fg-muted)] pt-1">{k}</dt>
              <dd className="text-[var(--color-fg)] leading-relaxed">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
