"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";
import IsoBlocks from "@/components/IsoBlocks";
import { useI18n } from "@/components/I18nProvider";

export default function CTASection() {
  const { t } = useI18n();
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const lines = rootRef.current.querySelectorAll("[data-cta-line] > span");
      gsap.fromTo(
        lines,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 1.2,
          stagger: 0.08,
          ease: "expo.out",
          // Don't apply the from-state until the trigger fires. Prevents the
          // spans being left clipped (yPercent: 120 inside overflow-hidden)
          // if a user scrolls past this section very fast before the
          // trigger's "top 70%" condition is satisfied.
          immediateRender: false,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="contact-cta"
      className="section-gradient relative container-edge py-28 md:py-52 border-t border-[var(--color-line)]"
    >
      {/* Local chromatic wash — feathered top + bottom so it blends into
          the surrounding page gradient instead of ending in a hard edge. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          maskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, #000 15%, #000 85%, transparent 100%)",
        }}
      >
        <div
          className="blob blob-pink blob-float"
          style={{
            width: "65vmax",
            height: "65vmax",
            top: "-20vmax",
            left: "-15vmax",
            opacity: 0.45,
          }}
        />
        <div
          className="blob blob-violet blob-float-slow"
          style={{
            width: "70vmax",
            height: "70vmax",
            bottom: "-25vmax",
            right: "-15vmax",
            opacity: 0.4,
          }}
        />
      </div>

      <IsoBlocks className="hidden lg:block absolute right-[4vw] top-[8%] w-[22vw] max-w-[360px] opacity-90 pointer-events-none" />

      <div className="eyebrow mb-10 md:mb-16 flex items-center gap-3">
        <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
        <span>{t("cta.eyebrow")}</span>
      </div>

      <h2
        data-cta-line
        className="font-display text-[clamp(2.5rem,11vw,11rem)] leading-[0.95] tracking-[-0.045em] text-[var(--color-fg)]"
      >
        <span className="block overflow-hidden pb-[0.08em]">
          <span className="block">{t("cta.l1")}</span>
        </span>
        <span className="block overflow-hidden pb-[0.08em]">
          <span className="block italic text-stacked-shadow">{t("cta.l2")}</span>
        </span>
      </h2>

      <div className="mt-12 md:mt-20 flex flex-col md:flex-row md:items-end md:justify-between gap-8 border-t border-[var(--color-line)] pt-8">
        <div className="max-w-[44ch] text-[var(--color-fg-muted)] text-lg leading-relaxed">
          {t("cta.text")}
        </div>
        <Link
          href="/contact"
          data-magnetic
          data-cursor="hover"
          className="group inline-flex items-center gap-4 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-8 py-5 rounded-full text-base md:text-lg font-medium transition-all hover:bg-[var(--color-accent-hover)]"
        >
          <span>{t("cta.button")}</span>
          <span
            aria-hidden
            className="inline-block transition-transform duration-500 group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
