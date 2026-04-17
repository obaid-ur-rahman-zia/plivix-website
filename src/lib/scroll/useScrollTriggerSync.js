"use client";

/**
 * Helper hook for components that create their own ScrollTriggers.
 * Ensures ScrollTrigger.refresh() runs once after mount so that
 * measurements account for async content (fonts, images, Supabase
 * queries resolved by the Loader gate).
 */

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useScrollTriggerRefresh(deps = []) {
  useEffect(() => {
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
