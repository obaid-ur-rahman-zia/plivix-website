"use client";

import { AsciiReveal } from "ascii-reveal";

/**
 * Page transition: on every client-side navigation the new page decodes
 * into place from ASCII glyphs, starting where the visitor clicked.
 * Server-rendered first loads are never hidden (revealOnHydrate is off),
 * and visitors who prefer reduced motion see the page immediately.
 * Only what is on screen animates; sections further down are left to the
 * normal scroll reveals so nothing can end up hidden.
 */
export default function RootTemplate({ children }) {
  return (
    <AsciiReveal preset="decode" duration="fast" origin="pointer" lazy={false}>
      {children}
    </AsciiReveal>
  );
}
