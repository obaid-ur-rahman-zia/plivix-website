"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";
import { useI18n, pick } from "@/components/I18nProvider";

export default function Testimonials({ testimonials = [] }) {
  const sectionRef = useRef(null);
  const { t, locale } = useI18n();

  useEffect(() => {
    if (!sectionRef.current || testimonials.length === 0) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const quotes = sectionRef.current.querySelectorAll("[data-quote]");
      quotes.forEach((q) => {
        gsap.fromTo(
          q,
          { opacity: 0.55 },
          {
            opacity: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: q,
              start: "top 75%",
              end: "top 35%",
              scrub: true,
            },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [testimonials]);

  if (testimonials.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="section-gradient-warm container-edge py-28 md:py-44 border-t border-[var(--color-line)]"
    >
      <div className="eyebrow mb-16 flex items-center gap-3">
        <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
        <span>{t("testimonials.eyebrow")}</span>
      </div>

      <div className="flex flex-col gap-24 md:gap-40">
        {testimonials.map((item) => (
          <figure
            key={item.author}
            data-quote
            className="grid grid-cols-12 gap-6"
          >
            <div className="col-span-12 md:col-span-2 eyebrow text-[var(--color-fg-muted)]">
              {pick(item, "company", locale)}
            </div>
            <blockquote className="col-span-12 md:col-span-10 font-display text-[clamp(1.5rem,3.5vw,3rem)] leading-[1.15] tracking-[-0.02em] text-[var(--color-fg)]">
              <span className="text-[var(--color-accent)]">“</span>
              {pick(item, "quote", locale)}
              <span className="text-[var(--color-accent)]">”</span>
            </blockquote>
            <figcaption className="col-start-1 md:col-start-3 col-span-12 md:col-span-10 mt-6 flex items-center gap-4 text-sm text-[var(--color-fg-muted)]">
              <span className="w-10 h-px bg-[var(--color-line-strong)]" />
              <span className="text-[var(--color-fg)]">{item.author}</span>
              <span>·</span>
              <span>{pick(item, "role", locale)}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
