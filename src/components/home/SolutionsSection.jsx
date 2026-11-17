"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";
import { revealOnScroll } from "@/lib/scroll/reveal";
import { AsciiStackSkeleton } from "@/components/AsciiSkeleton";
import { useI18n } from "@/components/I18nProvider";
import IconChip from "@/components/IconChip";
import { IndustryGlyph, LocalGlyph } from "@/components/illustrations/LineArt";
import { useTheme } from "@/components/theme/ThemeProvider";

const ErpCanvas = dynamic(() => import("./ErpCanvas"), { ssr: false, loading: () => <AsciiStackSkeleton /> });

/** ERP overview: the module list drives the 3D slab stack beside it. */
export default function SolutionsSection({ full = false }) {
  const { t } = useI18n();
  const { resolved: theme } = useTheme();
  const rootRef = useRef(null);
  const progressRef = useRef(0);
  const [active, setActive] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [near, setNear] = useState(false);
  const stageRef = useRef(null);
  const modules = t("solutions.modules");
  const industries = t("solutions.industries");

  useEffect(() => {
    const on = () => setIsMobile(window.innerWidth < 768);
    on();
    window.addEventListener("resize", on, { passive: true });
    return () => window.removeEventListener("resize", on);
  }, []);

  // Only mount the WebGL scene when it is about to scroll into view.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !("IntersectionObserver" in window)) { setNear(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setNear(true); io.disconnect(); }
    }, { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: "[data-erp-stage]",
        start: "top 85%",
        end: "bottom 40%",
        scrub: true,
        onUpdate: (self) => (progressRef.current = self.progress),
      });
      if (reduce) progressRef.current = 1;
    }, rootRef);
    const undo = revealOnScroll(
      rootRef.current.querySelectorAll("[data-erp-head] > *, [data-erp-mod], [data-erp-ind]")
    );
    return () => {
      undo();
      ctx.revert();
    };
  }, [modules]);

  const Head = full ? "h1" : "h2";

  return (
    <section ref={rootRef} id="solutions" className="section-gradient relative container-edge py-24 md:py-40 border-t border-[var(--color-line)]">
      <div data-erp-head className="max-w-[60rem]">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>{t("solutions.eyebrow")}</span>
        </div>
        <Head className="heading-lg text-[var(--color-fg)]">{t("solutions.title")}</Head>
        <p className="mt-6 md:mt-8 max-w-[62ch] text-base md:text-lg text-[var(--color-fg-muted)] leading-relaxed">
          {t("solutions.lead")}
        </p>
      </div>

      <div data-erp-stage className="mt-12 md:mt-20 grid grid-cols-12 gap-8 md:gap-10 items-start">
        <div ref={stageRef} className="col-span-12 md:col-span-6 md:sticky md:top-28 order-1 md:order-2 relative h-[300px] sm:h-[380px] md:h-[min(70vh,560px)]">
          {near ? (
            <ErpCanvas count={modules.length} activeIdx={active} progressRef={progressRef} theme={theme} isMobile={isMobile} />
          ) : (
            <AsciiStackSkeleton />
          )}
          <span className="absolute bottom-0 right-0 eyebrow text-[var(--color-fg-subtle)]">
            {t("solutions.canvasHint")}
          </span>
        </div>

        <div className="col-span-12 md:col-span-6 order-2 md:order-1">
          <h3 className="font-display text-xl md:text-2xl text-[var(--color-fg)] mb-2">{t("solutions.modulesTitle")}</h3>
          <p className="text-sm text-[var(--color-fg-muted)] mb-6">{t("solutions.modulesHint")}</p>
          <ul data-erp-list className="border-t border-[var(--color-line)]">
            {modules.map((m, i) => (
              <li
                key={m.t}
                data-erp-mod
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                tabIndex={0}
                className={`flex gap-4 border-b border-[var(--color-line)] py-4 cursor-pointer transition-colors outline-none ${
                  active === i ? "text-[var(--color-fg)]" : "text-[var(--color-fg-muted)]"
                }`}
              >
                <IconChip index={i} className={active === i ? "" : "opacity-60"} />
                <div className="min-w-0">
                  <div className="font-display text-lg md:text-xl">{m.t}</div>
                  <div className={`text-sm leading-relaxed overflow-hidden transition-all duration-300 ${active === i ? "max-h-24 opacity-100 mt-1" : "max-h-0 opacity-0"}`}>
                    {m.d}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-20 md:mt-32 grid grid-cols-12 gap-8">
        <div className="col-span-12 md:col-span-4">
          <h3 className="font-display text-2xl md:text-3xl text-[var(--color-fg)]">{t("solutions.industriesTitle")}</h3>
        </div>
        <ul data-erp-ind-list className="col-span-12 md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
          {industries.map((x, i) => (
            <li key={x.t} data-erp-ind data-tilt title={x.d} className="group bg-[var(--color-bg)] p-5 md:p-7 flex flex-col gap-5">
              <IndustryGlyph index={i} className="w-10 h-10 md:w-12 md:h-12 text-[var(--color-fg)] transition-transform duration-500 group-hover:-translate-y-1" />
              <div className="font-display text-base md:text-lg leading-snug text-[var(--color-fg)]">{x.t}</div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-16 md:mt-24 grid grid-cols-12 gap-8 items-end border-t border-[var(--color-line)] pt-10">
        <div className="col-span-12 md:col-span-8">
          <h3 className="font-display text-xl md:text-2xl text-[var(--color-fg)] mb-6">{t("solutions.localTitle")}</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-[var(--color-fg-muted)]">
            {t("solutions.local").map((l, i) => (
              <li key={l} className="flex flex-col gap-3">
                <LocalGlyph index={i} className="w-10 h-10 text-[var(--color-fg)]" />
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-12 md:col-span-4 flex flex-col gap-3 md:items-end">
          <Link
            href="/contact?service=erp"
            data-cursor="hover"
            data-magnetic className="inline-flex justify-center items-center gap-2.5 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-3.5 text-sm font-medium hover:bg-[var(--color-accent-hover)] transition-colors"
          >
            {t("solutions.cta")} <span aria-hidden>→</span>
          </Link>
          <p className="text-xs text-[var(--color-fg-muted)] md:text-right max-w-[40ch]">{t("solutions.ctaNote")}</p>
          {!full && (
            <Link href="/solutions" className="eyebrow underline-grow text-[var(--color-fg)]" data-cursor="hover">
              {t("common.allSolutions")} →
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
