"use client";

import { useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

export default function RootTemplate({ children }) {
  const overlayRef = useRef(null);
  const pathname = usePathname();

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || prefersReducedMotion()) return;
    gsap.set(overlay, { autoAlpha: 1 });
    const tween = gsap.to(overlay, {
      autoAlpha: 0,
      duration: 0.45,
      ease: "power2.out",
    });
    return () => tween.kill();
  }, [pathname]);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[120] bg-[var(--color-bg)]"
      />
      {children}
    </>
  );
}
