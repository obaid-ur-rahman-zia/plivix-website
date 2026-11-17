"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";
import { useI18n } from "@/components/I18nProvider";
import { USD_TO_BDT } from "@/lib/i18n/config";

function money(n, locale) {
  const f = (v, loc, cur) =>
    new Intl.NumberFormat(loc, { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(v);
  const usd = f(n, locale === "bn" ? "bn-BD" : "en-US", "USD");
  const bdt = locale === "bn" ? f(n * USD_TO_BDT, "bn-BD", "BDT") : null;
  return { usd, bdt };
}

export default function PricingGrid({ plans = [] }) {
  const { t, locale } = useI18n();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("[data-plan]", {
        y: 40, opacity: 0, duration: 0.8, stagger: 0.1, ease: "expo.out", immediateRender: false,
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [plans]);

  return (
    <div ref={ref} className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {plans.map((p) => {
        const hasPrice = p.price_usd !== null && p.price_usd !== undefined && p.price_usd !== "";
        const price = hasPrice ? money(Number(p.price_usd), locale) : null;
        return (
          <article
            key={p.id ?? p.slug}
            data-plan
            data-tilt
            className={`flex flex-col rounded-2xl border p-6 md:p-7 ${
              p.highlighted
                ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                : "border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/60"
            }`}
          >
            <h3 className="font-display text-xl text-[var(--color-fg)]">{p.name}</h3>
            <p className="mt-1 text-sm text-[var(--color-fg-muted)] sm:min-h-[3.5rem]">{p.tagline}</p>
            <div className="mt-6">
              {price ? (
                <>
                  <span className="eyebrow">{t("common.from")}</span>
                  <div className="font-display text-4xl text-[var(--color-fg)] leading-tight">{price.usd}</div>
                  {price.bdt && (
                    <div className="text-xs text-[var(--color-fg-muted)]">{t("common.approx")} {price.bdt}</div>
                  )}
                </>
              ) : (
                <div className="font-display text-3xl text-[var(--color-fg)] leading-tight pt-5">{t("common.custom")}</div>
              )}
              <div className="mt-1 text-xs text-[var(--color-fg-muted)]">{p.price_note}</div>
            </div>
            <ul className="mt-6 grid gap-2.5 text-sm text-[var(--color-fg)] flex-1">
              {(p.features || []).map((f) => (
                <li key={f} className="flex gap-2.5">
                  <span aria-hidden className="mt-2.5 h-px w-3 bg-[var(--color-accent)] shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link
              data-magnetic
              href={`/contact?plan=${encodeURIComponent(p.slug || "")}`}
              data-cursor="hover"
              className={`mt-8 inline-flex justify-center items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                p.highlighted
                  ? "bg-[var(--color-accent)] text-[var(--color-on-accent)] hover:bg-[var(--color-accent-hover)]"
                  : "border border-[var(--color-line-strong)] text-[var(--color-fg)] hover:border-[var(--color-accent)]"
              }`}
            >
              {p.cta_label || (price ? t("pricing.cta") : t("pricing.contact"))} <span aria-hidden>→</span>
            </Link>
          </article>
        );
      })}
    </div>
  );
}
