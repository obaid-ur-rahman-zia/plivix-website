"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";
import { revealOnScroll } from "@/lib/scroll/reveal";
import { StepGlyph } from "@/components/illustrations/LineArt";
import IsoBlocks from "@/components/IsoBlocks";
import { useI18n } from "@/components/I18nProvider";

export default function ProcessSection() {
  const { t } = useI18n();
  const ref = useRef(null);
  const steps = t("process.steps");

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-line]",
        { scaleY: 0 },
        {
          scaleY: 1, ease: "none", transformOrigin: "top",
          scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true },
        }
      );
    }, ref);
    const undo = revealOnScroll(ref.current.querySelectorAll("[data-step]"), { y: 36 });
    return () => {
      undo();
      ctx.revert();
    };
  }, [steps]);

  return (
    <section ref={ref} className="section-gradient-alt relative container-edge py-24 md:py-40 border-t border-[var(--color-line)]">
      <div className="eyebrow mb-6 flex items-center gap-3">
        <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
        <span>{t("process.eyebrow")}</span>
      </div>
      <div className="flex items-end justify-between gap-8">
        <h2 className="heading-lg text-[var(--color-fg)] max-w-[18ch]">{t("process.title")}</h2>
        <IsoBlocks className="hidden md:block w-56 lg:w-72 shrink-0 -mb-6" />
      </div>

      <ol data-steps className="relative mt-14 md:mt-24 ml-3 md:ml-0">
        <span aria-hidden className="absolute left-0 md:left-[calc(16.666%-1px)] top-2 bottom-2 w-px bg-[var(--color-line)]" />
        <span data-line aria-hidden className="absolute left-0 md:left-[calc(16.666%-1px)] top-2 bottom-2 w-px bg-[var(--color-accent)]" />
        {steps.map((s, i) => (
          <li key={s.t} data-step className="relative grid grid-cols-12 gap-4 md:gap-8 pb-12 md:pb-16 last:pb-0 pl-8 md:pl-0">
            <div className="col-span-12 md:col-span-2 eyebrow text-[var(--color-fg-muted)] md:pt-2">{s.w}</div>
            <span aria-hidden className="absolute left-[-5px] md:left-[calc(16.666%-5px)] top-2.5 h-[11px] w-[11px] rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-bg)]" />
            <div className="col-span-12 md:col-span-9 md:col-start-4">
              <div className="flex items-center gap-5 md:gap-7">
                <StepGlyph index={i} className="w-11 h-11 md:w-14 md:h-14 shrink-0 text-[var(--color-fg)]" />
                <div>
                  <h3 className="font-display text-2xl md:text-4xl text-[var(--color-fg)]">{s.t}</h3>
                  <p className="mt-1.5 text-[var(--color-fg-muted)]">{s.d}</p>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
