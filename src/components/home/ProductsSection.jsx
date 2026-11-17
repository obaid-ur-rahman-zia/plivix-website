"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { revealOnScroll } from "@/lib/scroll/reveal";
import { useI18n } from "@/components/I18nProvider";
import ProductScreen from "@/components/illustrations/ProductScreens";

/** Ready-made Plivix products, each shown as a wireframe of its main screen. */
export default function ProductsSection({ full = false }) {
  const { t } = useI18n();
  const ref = useRef(null);
  const items = t("products.items");

  useEffect(() => {
    if (!ref.current) return;
    return revealOnScroll(ref.current.querySelectorAll("[data-product]"), { y: 32, stagger: 0.08 });
  }, [items]);

  const Head = full ? "h1" : "h2";

  return (
    <section ref={ref} id="products" className="section-gradient-alt relative container-edge py-24 md:py-36 border-t border-[var(--color-line)]">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
            <span>{t("products.eyebrow")}</span>
          </div>
          <Head className="heading-lg text-[var(--color-fg)] max-w-[16ch]">{t("products.title")}</Head>
        </div>
        <p className="max-w-[34ch] text-[var(--color-fg-muted)]">{t("products.lead")}</p>
      </div>

      <div className="mt-12 md:mt-16 grid md:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/contact?service=erp&product=${p.id}`}
            data-product
            data-cursor="hover"
            className="group bg-[var(--color-bg)] p-5 md:p-8 flex flex-col gap-6 transition-colors hover:bg-[var(--color-bg-soft)]"
          >
            <div className="text-[var(--color-fg)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1">
              <ProductScreen id={p.id} />
            </div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl md:text-3xl text-[var(--color-fg)]">{p.t}</h3>
                <p className="mt-1.5 text-sm md:text-base text-[var(--color-fg-muted)]">{p.d}</p>
              </div>
              <span className="eyebrow shrink-0 text-[var(--color-fg-muted)] pt-2">{p.s}</span>
            </div>
            <div className="mt-auto flex items-center justify-between gap-4">
              <ul className="flex flex-wrap gap-1.5">
                {p.tags.map((tag) => (
                  <li key={tag} className="font-mono text-[11px] border border-[var(--color-line)] rounded-full px-2.5 py-1 text-[var(--color-fg-muted)]">
                    {tag}
                  </li>
                ))}
              </ul>
              <span className="shrink-0 text-sm text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                {t("products.demo")} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}
      </div>

      {!full && (
        <div className="mt-8 flex justify-end">
          <Link href="/products" className="eyebrow underline-grow text-[var(--color-fg)]" data-cursor="hover">
            {t("products.all")} →
          </Link>
        </div>
      )}
    </section>
  );
}
