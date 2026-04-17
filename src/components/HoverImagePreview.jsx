"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Pointer-follow preview for CMS image URLs (team, services, etc.).
 */
export function useHoverImagePreview() {
  const [active, setActive] = useState(null);

  const clear = useCallback(() => setActive(null), []);

  const bind = useCallback(
    (imageSrc) => {
      const src = imageSrc && String(imageSrc).trim() ? String(imageSrc).trim() : null;

      return {
        onMouseEnter: (e) => {
          if (!src) return;
          setActive({ src, x: e.clientX, y: e.clientY });
        },
        onMouseMove: (e) => {
          if (!src) return;
          setActive((a) => (a ? { ...a, x: e.clientX, y: e.clientY } : null));
        },
        onMouseLeave: () => setActive(null),
      };
    },
    []
  );

  return { active, bind, clear };
}

export function HoverImagePreviewLayer({ active, onClear }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!active?.src || typeof window === "undefined") return;
    const onScroll = () => onClear?.();
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [active?.src, onClear]);

  if (!mounted || !active?.src) return null;

  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const style = reduced
    ? {
        left: "50%",
        top: "40%",
        transform: "translate(-50%, -50%)",
      }
    : {
        left: active.x,
        top: active.y,
        transform: "translate(18px, 18px)",
      };

  return createPortal(
    <div
      className="pointer-events-none fixed z-[300] w-[min(280px,42vw)] overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
      style={style}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={active.src} alt="" className="aspect-[4/5] w-full object-cover" draggable={false} />
    </div>,
    document.body
  );
}
