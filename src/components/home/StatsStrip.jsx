"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

export default function StatsStrip({ stats = [] }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || stats.length === 0) return;
    const numbers = sectionRef.current.querySelectorAll("[data-stat-value]");
    if (prefersReducedMotion()) {
      numbers.forEach((el) => {
        el.textContent = el.dataset.statValue;
      });
      return;
    }
    const ctx = gsap.context(() => {
      numbers.forEach((el) => {
        const end = Number(el.dataset.statValue);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2.2,
          ease: "expo.out",
          snap: { v: 1 },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString();
          },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [stats]);

  if (stats.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="section-gradient-alt relative container-edge py-20 md:py-28 border-t border-[var(--color-line)]"
    >
      <div className="grid grid-cols-2 md:grid-cols-4 relative z-10">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col gap-3 px-4 md:px-6 py-6 md:py-8 ${
              i < stats.length - 1 ? "md:border-r md:border-[var(--color-line)]" : ""
            } ${i < 2 ? "border-b border-[var(--color-line)] md:border-b-0" : ""}`}
          >
            <div className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-[-0.03em] text-[var(--color-fg)] flex items-baseline">
              <span data-stat-value={s.value}>0</span>
              <span className="text-[var(--color-accent)] ml-1">
                {s.suffix}
              </span>
            </div>
            <div className="eyebrow text-[var(--color-fg-muted)]">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
