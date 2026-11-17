"use client";

import { gsap } from "gsap";
import { prefersReducedMotion } from "./useScrollTriggerSync";

/**
 * Safe scroll reveal. Only elements that are still BELOW the viewport get
 * hidden, and they are shown the moment they intersect. Anything already on
 * screen (or above it) is never touched, so fast scrolling, ScrollTrigger
 * refreshes or a missed trigger can never leave content invisible.
 *
 * Returns a cleanup function.
 */
export function revealOnScroll(elements, { y = 28, stagger = 0.06, duration = 0.7 } = {}) {
  const els = Array.from(elements || []).filter(Boolean);
  if (!els.length || prefersReducedMotion() || !("IntersectionObserver" in window)) return () => {};

  const vh = window.innerHeight;
  const pending = els.filter((el) => el.getBoundingClientRect().top > vh);
  if (!pending.length) return () => {};

  gsap.set(pending, { opacity: 0, y });
  const io = new IntersectionObserver(
    (entries) => {
      const shown = entries.filter((e) => e.isIntersecting || e.boundingClientRect.top < 0).map((e) => e.target);
      if (!shown.length) return;
      shown.forEach((el) => io.unobserve(el));
      gsap.to(shown, { opacity: 1, y: 0, duration, stagger, ease: "expo.out", overwrite: true, clearProps: "transform,opacity" });
    },
    { rootMargin: "0px 0px -8% 0px" }
  );
  pending.forEach((el) => io.observe(el));

  return () => {
    io.disconnect();
    gsap.set(pending, { clearProps: "transform,opacity" });
  };
}
