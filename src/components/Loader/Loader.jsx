"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useLoading } from "../LoadingContext";
import { useI18n } from "../I18nProvider";

const BAR = 24;
const SEEN_KEY = "plx_seen";

/**
 * Terminal-style intro loader. Shown once per browser session (first page
 * load only); ThemeScript marks <html data-seen> so repeat loads never paint it.
 */
export default function Loader({ onComplete }) {
  const { t } = useI18n();
  const { progress, isComplete } = useLoading();
  const rootRef = useRef(null);
  const barRef = useRef(null);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SEEN_KEY)) {
        setUnmounted(true);
        onComplete?.();
        return;
      }
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }, [onComplete]);

  useEffect(() => {
    if (!barRef.current) return;
    const filled = Math.round((Math.min(progress, 100) / 100) * BAR);
    barRef.current.textContent = `[${"#".repeat(filled)}${".".repeat(BAR - filled)}] ${String(progress).padStart(3, " ")}%`;
  }, [progress]);

  useEffect(() => {
    if (!isComplete || !rootRef.current || unmounted) return;
    const tl = gsap.timeline({
      onComplete: () => {
        setUnmounted(true);
        onComplete?.();
      },
    });
    tl.to(rootRef.current, { clipPath: "inset(0 0 100% 0)", duration: 0.55, ease: "expo.inOut", delay: 0.1 });
    return () => tl.kill();
  }, [isComplete, onComplete, unmounted]);

  if (unmounted) return null;

  return (
    <div
      ref={rootRef}
      data-loader
      aria-hidden={isComplete}
      role="status"
      aria-live="polite"
      style={{ clipPath: "inset(0 0 0 0)" }}
      className="fixed inset-0 z-[9999] bg-[var(--color-bg)] text-[var(--color-fg)] flex items-center justify-center px-6"
    >
      <pre className="font-mono text-[11px] sm:text-xs leading-relaxed text-[var(--color-fg-muted)] whitespace-pre">
{`plivix@bd:~$ boot --site
  > fonts ......... ok
  > content ....... ok
  > ${t("loader.loading").toLowerCase()} ...
`}
        <span ref={barRef} className="text-[var(--color-accent)]">{`[${".".repeat(BAR)}]   0%`}</span>
        <span className="inline-block w-[0.6em] animate-pulse text-[var(--color-fg)]">_</span>
      </pre>
    </div>
  );
}
