"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

/**
 * Line drawing of three sheared panels (the shapes in the Plivix mark),
 * one filled in the brand accent, joined by a dashed path.
 */
export default function IsoBlocks({ className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-float]").forEach((el, i) => {
        gsap.to(el, { y: i % 2 ? 10 : -10, duration: 3.5 + i * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
      gsap.to("[data-dash]", { strokeDashoffset: -40, duration: 3, ease: "none", repeat: -1 });
    }, ref);
    return () => ctx.revert();
  }, []);

  const line = { fill: "none", stroke: "var(--color-fg)", strokeWidth: 1.25, strokeLinejoin: "round" };
  return (
    <svg ref={ref} viewBox="0 0 420 420" className={className} role="img" aria-label="Connected modules">
      <path data-dash d="M190 225 C 220 190, 250 170, 280 130 M 220 300 C 260 290, 300 270, 330 250" fill="none" stroke="var(--color-fg-muted)" strokeWidth="1.25" strokeDasharray="3 6" />
      <g data-float>
        <polygon points="60,150 190,225 190,360 60,285" {...line} />
      </g>
      <g data-float>
        <polygon points="200,40 340,120 340,215 200,135" fill="var(--color-accent)" />
      </g>
      <g data-float>
        <polygon points="230,250 360,200 360,320 230,370" {...line} />
      </g>
    </svg>
  );
}
