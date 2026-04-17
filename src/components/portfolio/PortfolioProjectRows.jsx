"use client";

import Link from "next/link";
import { HoverImagePreviewLayer, useHoverImagePreview } from "@/components/HoverImagePreview";

/**
 * Portfolio index rows with pointer-follow image preview (same pattern as About / team).
 */
export default function PortfolioProjectRows({ projects = [] }) {
  const { active, bind: bindHoverImage, clear: clearHoverImage } = useHoverImagePreview();

  return (
    <section className="container-edge pb-32 md:pb-48 relative">
      <HoverImagePreviewLayer active={active} onClear={clearHoverImage} />
      {projects.map((p, i) => {
        const img = p.thumbnail_url || p.cover_url;
        return (
          <Link
            key={p.slug}
            href={`/portfolio/${p.slug}`}
            data-cursor="hover"
            {...(img
              ? bindHoverImage(img, p.id ?? p.slug, { aspectClass: "aspect-video" })
              : {})}
            className="group grid grid-cols-12 gap-6 md:gap-10 border-t border-[var(--color-line)] py-10 md:py-16 items-center transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--color-fg)_4%,transparent)] -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)]"
          >
            <div className="col-span-12 md:col-span-1 eyebrow text-[var(--color-fg-muted)]">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="col-span-12 md:col-span-5 flex flex-col gap-2">
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] tracking-[-0.025em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors duration-500">
                {p.title}
              </h2>
              <div className="text-sm text-[var(--color-fg-muted)]">{p.client}</div>
            </div>
            <div className="col-span-6 md:col-span-3 text-sm text-[var(--color-fg)]">
              {p.category}
            </div>
            <div className="col-span-6 md:col-span-2 text-sm text-[var(--color-fg-muted)]">
              {p.year}
            </div>
            <div className="col-span-12 md:col-span-1 flex md:justify-end text-[var(--color-fg)]">
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 group-hover:translate-x-1"
              >
                →
              </span>
            </div>
          </Link>
        );
      })}
      <div className="border-t border-[var(--color-line)]" />
    </section>
  );
}
