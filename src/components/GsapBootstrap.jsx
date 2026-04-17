"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";

let registered = false;

function registerPlugins() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Bridge Lenis smooth-scroll into GSAP's ScrollTrigger.
 *
 * Because Lenis here is mounted with `root` (SmoothScroll.jsx), it drives the
 * NATIVE window scroll position (no transforms). That means standard
 * ScrollTriggers work against the window as normal — we don't need a
 * `scrollerProxy`. The previous proxy actually caused occasional blank frames
 * during scroll because calls to scrollTop(value) fed back into lenis.scrollTo.
 *
 * All we need to do is:
 *   1. Run Lenis from GSAP's ticker (single frame clock, no jitter).
 *   2. Call ScrollTrigger.update() on every Lenis scroll event so pinned
 *      timelines stay frame-synced.
 */
export default function GsapBootstrap() {
  const lenis = useLenis();

  useEffect(() => {
    registerPlugins();
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // One refresh after wiring up so any triggers created before we arrived
    // recompute against the now-correct scroll height.
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
    };
  }, [lenis]);

  return null;
}
