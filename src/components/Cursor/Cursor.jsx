"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/**
 * Magnetic dot cursor.
 * Disabled on touch devices and when prefers-reduced-motion is set.
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reduced) return;
    if (!dotRef.current || !ringRef.current) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const xTo = gsap.quickTo(dot, "x", { duration: 0.15, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.15, ease: "power3" });
    const rxTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3" });
    const ryTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3" });

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      rxTo(e.clientX);
      ryTo(e.clientY);
    };

    const grow = () => {
      gsap.to(ring, { scale: 1.6, borderColor: "var(--color-accent)", duration: 0.4, ease: "expo.out" });
    };
    const shrink = () => {
      gsap.to(ring, { scale: 1, borderColor: "var(--color-fg-muted)", duration: 0.4, ease: "expo.out" });
    };

    const hoverables = document.querySelectorAll("a, button, [data-cursor]");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    window.addEventListener("mousemove", onMove);

    // Re-scan hoverables when the DOM changes (e.g. route transitions).
    const mo = new MutationObserver(() => {
      const fresh = document.querySelectorAll("a, button, [data-cursor]");
      fresh.forEach((el) => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      hoverables.forEach((el) => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
      mo.disconnect();
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <span
        ref={ringRef}
        aria-hidden
        className="absolute top-0 left-0 w-8 h-8 rounded-full border border-[var(--color-fg-muted)] will-change-transform mix-blend-difference"
      />
      <span
        ref={dotRef}
        aria-hidden
        className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-[var(--color-fg)] will-change-transform mix-blend-difference"
      />
    </div>
  );
}
