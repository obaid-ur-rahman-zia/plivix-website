"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useLoading } from "../LoadingContext";
import { useI18n } from "../I18nProvider";
import Logo from "../Logo";

/**
 * Lenis-style editorial loader.
 * - Top-left wordmark
 * - Centered digit counter 000 -> 100 driven by actual data/asset progress
 * - Hairline progress bar at the bottom
 * - On completion: clip-path curtain expo-out reveal, then unmounts.
 */
export default function Loader({ onComplete }) {
  const { t } = useI18n();
  const { progress, isComplete } = useLoading();
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const barRef = useRef(null);
  const [unmounted, setUnmounted] = useState(false);

  // Paint the counter + bar directly from progress (avoids re-renders).
  useEffect(() => {
    if (counterRef.current) {
      counterRef.current.textContent = String(progress).padStart(3, "0");
    }
    if (barRef.current) {
      barRef.current.style.transform = `scaleX(${Math.min(progress / 100, 1)})`;
    }
  }, [progress]);

  // Exit animation when data + assets + fonts are all ready.
  useEffect(() => {
    if (!isComplete || !rootRef.current) return;
    const el = rootRef.current;
    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        setUnmounted(true);
        onComplete?.();
      },
    });

    tl.to(el.querySelectorAll("[data-loader-content]"), {
      opacity: 0,
      y: -12,
      duration: 0.6,
      stagger: 0.04,
      ease: "power3.inOut",
    })
      .to(
        el,
        {
          clipPath: "inset(0 0 100% 0)",
          duration: 1.05,
        },
        "-=0.2"
      )
      .set(el, { pointerEvents: "none" });

    return () => tl.kill();
  }, [isComplete, onComplete]);

  if (unmounted) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden={isComplete}
      role="status"
      aria-live="polite"
      style={{ clipPath: "inset(0 0 0 0)" }}
      className="fixed inset-0 z-[9999] bg-[var(--color-bg)] text-[var(--color-fg)] flex flex-col"
    >
      {/* Top strip */}
      <div
        data-loader-content
        className="flex items-center justify-between px-6 md:px-10 pt-6 md:pt-8"
      >
        <div className="flex items-center gap-3">
          <Logo variant="mark" width={26} height={49} priority className="h-11 w-auto object-contain" />
          <span className="eyebrow text-[var(--color-fg-muted)]">
            Plivix / Technologies
          </span>
        </div>
        <div className="eyebrow hidden md:block text-[var(--color-fg-muted)]">
          {t("loader.loading")}
        </div>
      </div>

      {/* Center counter */}
      <div
        data-loader-content
        className="flex-1 flex items-center justify-center"
      >
        <div className="flex items-end gap-4">
          <span
            ref={counterRef}
            className="font-display text-[22vw] md:text-[14vw] leading-none tracking-[-0.05em] text-[var(--color-fg)] tabular-nums"
          >
            000
          </span>
          <span className="font-mono text-sm md:text-base text-[var(--color-fg-muted)] mb-4 md:mb-6">
            /100
          </span>
        </div>
      </div>

      {/* Bottom strip */}
      <div
        data-loader-content
        className="px-6 md:px-10 pb-6 md:pb-8 flex flex-col gap-4"
      >
        <div className="eyebrow flex items-center justify-between">
          <span className="text-[var(--color-fg-muted)]">
            engineering intelligent systems
          </span>
          <span className="text-[var(--color-fg-muted)]">ready</span>
        </div>
        <div className="hairline relative overflow-hidden">
          <div
            ref={barRef}
            className="absolute inset-0 bg-[var(--color-accent)] origin-left"
            style={{ transform: "scaleX(0)", transition: "transform 180ms linear" }}
          />
        </div>
      </div>
    </div>
  );
}
