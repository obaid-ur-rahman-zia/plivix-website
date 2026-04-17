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
    (imageSrc, previewKey, options) => {
      const src = imageSrc && String(imageSrc).trim() ? String(imageSrc).trim() : null;
      const key = previewKey != null ? String(previewKey) : src;
      const aspectClass =
        options && typeof options.aspectClass === "string" && options.aspectClass.trim()
          ? options.aspectClass.trim()
          : "aspect-[4/5]";

      return {
        onMouseEnter: (e) => {
          if (!src) return;
          setActive({ key, src, x: e.clientX, y: e.clientY, aspectClass });
        },
        onMouseMove: (e) => {
          if (!src) return;
          setActive((a) =>
            a && a.key === key ? { ...a, x: e.clientX, y: e.clientY } : a
          );
        },
        onMouseLeave: () => {
          setActive((a) => (a && a.key === key ? null : a));
        },
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

  // Do not clear on window scroll: Lenis (and smooth scroll) fires scroll events
  // often; clearing here made only the first hover feel “stuck” and hid other
  // members’ previews. Preview clears on mouse leave instead.

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
      className="pointer-events-none fixed z-[300] w-[min(280px,42vw)] overflow-hidden rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] shadow-[0_24px_80px_rgba(0,0,0,0.55)] transition-[opacity,transform,box-shadow] duration-200 ease-out"
      style={style}
      aria-hidden
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={active.key ?? active.src}
        src={active.src}
        alt=""
        className={`${active.aspectClass ?? "aspect-[4/5]"} w-full object-cover`}
        draggable={false}
      />
    </div>,
    document.body
  );
}
