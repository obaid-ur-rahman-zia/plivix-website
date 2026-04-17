"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

const PARAGRAPH =
  "We are a small, senior team that ships production systems — web, mobile, AI and data platforms. We care about performance, accessibility and the craft of shipping software that actually runs. No templates, no AI slop, no throwaway demos.";

export default function TextRevealSection() {
  const sectionRef = useRef(null);
  const words = useMemo(() => PARAGRAPH.split(/\s+/), []);

  useEffect(() => {
    if (!sectionRef.current) return;
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      const wordEls = sectionRef.current.querySelectorAll("[data-word]");
      gsap.fromTo(
        wordEls,
        { color: "var(--color-fg-subtle)" },
        {
          color: "var(--color-fg)",
          ease: "none",
          stagger: 0.02,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 45%",
            scrub: true,
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="section-gradient-warm relative container-edge py-28 md:py-44 border-t border-[var(--color-line)]"
    >
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-2 eyebrow text-[var(--color-fg-muted)]">
          /01 manifesto
        </div>
        <p className="col-span-12 md:col-span-10 font-display text-[clamp(1.75rem,4vw,3.5rem)] leading-[1.15] tracking-[-0.025em] text-[var(--color-fg-subtle)]">
          {words.map((w, i) => (
            <span
              key={i}
              data-word
              className="inline-block mr-[0.22em] will-change-[color]"
            >
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
