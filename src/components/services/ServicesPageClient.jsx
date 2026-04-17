"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { HoverImagePreviewLayer, useHoverImagePreview } from "@/components/HoverImagePreview";

export default function ServicesPageClient({ services = [] }) {
  const { active: hoverImage, bind: bindHoverImage, clear: clearHoverImage } = useHoverImagePreview();
  const categories = useMemo(() => {
    const set = new Set(services.map((s) => s.category));
    return ["All", ...Array.from(set)];
  }, [services]);

  const [active, setActive] = useState("All");

  const visible = useMemo(() => {
    if (active === "All") return services;
    return services.filter((s) => s.category === active);
  }, [services, active]);

  return (
    <div className="pt-32 md:pt-40">
      {/* Header */}
      <section className="container-edge pb-16 md:pb-24">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>Services</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[18ch]">
          What we <span className="italic text-[var(--color-fg-muted)]">build</span>.
        </h1>
        <p className="mt-10 max-w-[56ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          Five practice areas, one senior team. We work as an embedded partner —
          discovery, design, delivery, and operate — with evals, observability
          and accessibility built in from the first commit.
        </p>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              data-cursor="hover"
              onClick={() => setActive(c)}
              className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                active === c
                  ? "bg-[var(--color-fg)] text-[var(--color-bg)] border-[var(--color-fg)]"
                  : "border-[var(--color-line-strong)] text-[var(--color-fg)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="container-edge pb-32 md:pb-48 relative">
        <HoverImagePreviewLayer active={hoverImage} onClear={clearHoverImage} />
        {visible.map((s, i) => {
          const img = s.image_url || s.thumbnail_url;
          return (
          <article
            key={s.slug}
            id={s.slug}
            className="scroll-mt-32 grid grid-cols-12 gap-6 md:gap-10 border-t border-[var(--color-line)] py-12 md:py-20"
            {...(img ? bindHoverImage(img) : {})}
          >
            <div className="col-span-12 md:col-span-2 flex md:flex-col items-baseline gap-4 md:gap-2 eyebrow text-[var(--color-fg-muted)]">
              <span className="text-[var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s.category}</span>
            </div>
            <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
              <h2 className="font-display text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.98] tracking-[-0.03em] text-[var(--color-fg)]">
                {s.title}
                <span className="text-[var(--color-fg-muted)] italic"> — {s.tagline}</span>
              </h2>
              <p className="max-w-[64ch] text-[var(--color-fg-muted)] text-lg leading-relaxed">
                {s.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2 max-w-[68ch] border-t border-[var(--color-line)] pt-6 mt-2">
                {s.features?.map((f) => (
                  <div
                    key={f}
                    className="flex items-start gap-2 text-sm text-[var(--color-fg)]"
                  >
                    <span className="text-[var(--color-accent)] mt-1">—</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-2 font-mono text-xs text-[var(--color-fg-muted)] mt-2">
                {s.tech_stack?.map((t) => (
                  <span
                    key={t}
                    className="border border-[var(--color-line)] rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="pt-4">
                <Link
                  href="/contact"
                  data-cursor="hover"
                  className="eyebrow underline-grow text-[var(--color-fg)]"
                >
                  Discuss {s.title.toLowerCase()} →
                </Link>
              </div>
            </div>
          </article>
          );
        })}
        <div className="border-t border-[var(--color-line)]" />
      </section>
    </div>
  );
}
