"use client";

import { AsciiSkeleton } from "ascii-reveal";

/**
 * Loading placeholders drawn in shimmering glyphs (ascii-reveal). They render
 * on the server, keep the footprint of the real content, and the shimmer runs
 * on a small canvas once mounted.
 */

export function AsciiPageSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="container-edge pt-32 md:pt-40 pb-24 min-h-[70svh]">
      <AsciiSkeleton variant="terminal" lines={1} widths={["9rem"]} seed={1} className="mb-8 text-sm" />
      <AsciiSkeleton variant="dither" lines={2} widths={["min(36rem,90%)", "min(24rem,70%)"]} seed={2} className="text-[clamp(2rem,5vw,4rem)]" />
      <AsciiSkeleton variant="scan" lines={3} widths={["min(40rem,95%)", "min(34rem,85%)", "min(20rem,60%)"]} seed={3} className="mt-10 text-base" />
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[4, 5, 6].map((s) => (
          <AsciiSkeleton key={s} variant="dither" rows={10} width="100%" seed={s} className="text-[10px]" />
        ))}
      </div>
    </div>
  );
}

/** Placeholder for the ERP 3D scene while it loads. */
export function AsciiStackSkeleton({ className = "" }) {
  return (
    <div aria-hidden className={`flex items-center justify-center w-full h-full ${className}`}>
      <AsciiSkeleton variant="braille" rows={22} width="80%" seed={7} className="text-[10px]" />
    </div>
  );
}
