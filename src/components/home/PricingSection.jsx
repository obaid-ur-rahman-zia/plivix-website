"use client";

import Link from "next/link";
import PricingGrid from "./PricingGrid";
import { useI18n } from "@/components/I18nProvider";

export default function PricingSection({ plans = [], full = false }) {
  const { t } = useI18n();
  if (!plans.length) return null;
  const Head = full ? "h1" : "h2";
  return (
    <section id="pricing" className="section-gradient-warm relative container-edge py-24 md:py-40 border-t border-[var(--color-line)]">
      <div className="grid grid-cols-12 gap-6 mb-12 md:mb-16">
        <div className="col-span-12 md:col-span-7">
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
            <span>{t("pricing.eyebrow")}</span>
          </div>
          <Head className="heading-lg text-[var(--color-fg)]">{full ? t("pricing.pageTitle") : t("pricing.title")}</Head>
        </div>
        <p className="col-span-12 md:col-span-5 md:self-end text-[var(--color-fg-muted)] leading-relaxed">
          {full ? t("pricing.pageLead") + " " : ""}
          {t("pricing.lead")}
        </p>
      </div>
      <PricingGrid plans={plans} />
      <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-[var(--color-fg-muted)]">
        <p className="max-w-[70ch]">
          {t("pricing.note")} {t("pricing.support")}
        </p>
        {!full && (
          <Link href="/pricing" className="eyebrow underline-grow text-[var(--color-fg)] shrink-0" data-cursor="hover">
            {t("common.seePricing")} →
          </Link>
        )}
      </div>
    </section>
  );
}
