"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

/**
 * Site-wide micro-interactions by event delegation (no per-component wiring):
 *   [data-tilt]      card tilts toward the pointer and shows a soft light spot
 *   [data-magnetic]  button drifts toward the pointer
 * Both are off on touch devices and with reduced motion.
 * Also renders the thin scroll-progress bar under the nav.
 */
export default function Interactions() {
  const barRef = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? window.scrollY / h : 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, p))})`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let cleanup = () => {};
    if (fine && !prefersReducedMotion()) {
      let active = null;
      const reset = (el) => {
        if (!el) return;
        if (el.dataset.tilt !== undefined) {
          gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
          el.style.setProperty("--mx", "50%");
          el.style.setProperty("--my", "-50%");
        } else gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.5)" });
      };
      const onMove = (e) => {
        const el = e.target.closest?.("[data-tilt],[data-magnetic]");
        if (active && active !== el) { reset(active); active = null; }
        if (!el) return;
        active = el;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        if (el.dataset.tilt !== undefined) {
          gsap.to(el, {
            rotateY: (px - 0.5) * 7,
            rotateX: (0.5 - py) * 7,
            transformPerspective: 900,
            duration: 0.4,
            ease: "power2.out",
          });
          el.style.setProperty("--mx", `${px * 100}%`);
          el.style.setProperty("--my", `${py * 100}%`);
        } else {
          gsap.to(el, { x: (px - 0.5) * 14, y: (py - 0.5) * 10, duration: 0.3, ease: "power2.out" });
        }
      };
      const onLeave = () => { reset(active); active = null; };
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      cleanup = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerleave", onLeave);
      };
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cleanup();
    };
  }, []);

  return (
    <div aria-hidden className="fixed top-0 inset-x-0 z-[70] h-[3px] pointer-events-none">
      <div
        ref={barRef}
        className="h-full origin-left"
        style={{
          transform: "scaleX(0)",
          background: "linear-gradient(90deg, var(--chroma-cyan), var(--chroma-violet), var(--chroma-pink))",
        }}
      />
    </div>
  );
}
