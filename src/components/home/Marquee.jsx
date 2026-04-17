"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useLenis } from "lenis/react";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

const VERBS = [
  "Build",
  "Ship",
  "Automate",
  "Train",
  "Deploy",
  "Scale",
  "Instrument",
  "Forecast",
];

function Segment() {
  return (
    <div className="flex items-center gap-12 pr-12">
      {VERBS.map((v) => (
        <span
          key={v}
          className="font-display italic text-[var(--color-fg)] text-[clamp(2.5rem,7vw,7rem)] leading-none tracking-[-0.03em] flex items-center gap-12"
        >
          {v}
          <span
            aria-hidden
            className="text-[var(--color-accent)] not-italic text-[0.7em]"
          >
            ✱
          </span>
        </span>
      ))}
    </div>
  );
}

export default function Marquee() {
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!trackRef.current) return;
    if (prefersReducedMotion()) return;

    const el = trackRef.current;
    const firstChild = el.children[0];
    if (!firstChild) return;

    const distance = firstChild.offsetWidth;
    const base = distance / 18; // seconds per loop at base speed

    gsap.set(el, { x: 0 });
    tweenRef.current = gsap.to(el, {
      x: -distance,
      duration: base,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % -distance),
      },
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, []);

  // Velocity-reactive speed — boost when user is scrolling.
  useEffect(() => {
    if (!lenis || !tweenRef.current) return;
    const onScroll = ({ velocity }) => {
      const boost = 1 + Math.min(Math.abs(velocity) / 12, 3.5);
      gsap.to(tweenRef.current, {
        timeScale: boost,
        duration: 0.35,
        overwrite: true,
      });
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  return (
    <section
      aria-hidden
      className="section-gradient relative py-12 md:py-20 overflow-hidden border-y border-[var(--color-line)]"
    >
      <div ref={trackRef} className="flex whitespace-nowrap will-change-transform">
        <Segment />
        <Segment />
        <Segment />
      </div>
    </section>
  );
}
