"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

/**
 * Page transition on every route change: a panel showing the route as a
 * terminal line wipes upward while the new page rises into place.
 * Runs only on client navigations (the intro Loader covers the first load).
 */
let firstPaint = true;

export default function RootTemplate({ children }) {
  const panelRef = useRef(null);
  const pageRef = useRef(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const page = pageRef.current;
    if (!panel || !page) return;
    if (firstPaint || prefersReducedMotion()) {
      firstPaint = false;
      gsap.set(panel, { display: "none" });
      return;
    }
    const tl = gsap.timeline();
    tl.set(panel, { display: "flex", clipPath: "inset(0 0 0 0)" })
      .fromTo("[data-route-label]", { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.18, ease: "power2.out" }, 0)
      .to(panel, { clipPath: "inset(0 0 100% 0)", duration: 0.6, ease: "expo.inOut" }, 0.22)
      .fromTo(page, { y: 40, opacity: 0.4 }, { y: 0, opacity: 1, duration: 0.7, ease: "expo.out", clearProps: "transform,opacity" }, 0.3)
      .set(panel, { display: "none" });
    return () => tl.kill();
  }, [pathname]);

  return (
    <>
      <div
        ref={panelRef}
        aria-hidden
        style={{ display: "none" }}
        className="pointer-events-none fixed inset-0 z-[120] bg-[var(--color-bg)] items-center justify-center"
      >
        <span data-route-label className="font-mono text-xs sm:text-sm text-[var(--color-fg-muted)]">
          plivix@bd:~$ cd <span className="text-[var(--color-accent)]">{pathname === "/" ? "~" : pathname}</span>
          <span className="animate-pulse text-[var(--color-fg)]">_</span>
        </span>
      </div>
      <div ref={pageRef}>{children}</div>
    </>
  );
}
