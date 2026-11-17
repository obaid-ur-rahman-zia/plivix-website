"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { revealOnScroll } from "@/lib/scroll/reveal";
import { useI18n } from "@/components/I18nProvider";
import ProjectCover from "@/components/work/ProjectCover";

/** Grid tile spans: one large lead image, then a mixed grid. */
function spanFor(i, count) {
  if (i === 0) return "md:col-span-7 md:row-span-2";
  if (i < 3) return "md:col-span-5";
  const isLastOdd = i === count - 1 && (count - 3) % 2 === 1;
  return isLastOdd ? "md:col-span-12" : "md:col-span-6";
}

/** Home "Selected work": an image-first bento gallery. */
export default function ProjectsShowcase({ projects = [] }) {
  const { t } = useI18n();
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    return revealOnScroll(ref.current.querySelectorAll("[data-tile]"), { y: 40, stagger: 0.07 });
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section ref={ref} id="work" className="section-gradient relative container-edge py-24 md:py-36 border-t border-[var(--color-line)]">
      <div className="flex items-end justify-between gap-6 mb-10 md:mb-14">
        <div>
          <div className="eyebrow mb-5 flex items-center gap-3">
            <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
            <span>{t("projects.eyebrow")}</span>
          </div>
          <h2 className="heading-lg text-[var(--color-fg)]">{t("projects.title")}.</h2>
        </div>
        <Link href="/portfolio" className="eyebrow underline-grow text-[var(--color-fg)] shrink-0" data-cursor="hover">
          {t("common.viewAll")} →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:auto-rows-[clamp(200px,20vw,320px)]">
        {projects.map((p, i) => (
          <GalleryTile key={p.slug} project={p} index={i} className={spanFor(i, projects.length)} big={i === 0} label={t("projects.view")} />
        ))}
      </div>
    </section>
  );
}

export function GalleryTile({ project: p, index, className = "", big = false, label, aspect = "aspect-[4/3] md:aspect-auto" }) {
  return (
    <Link
      href={`/portfolio/${p.slug}`}
      data-tile
      data-cursor="hover"
      className={`group relative block overflow-hidden rounded-sm border border-[var(--color-line)] ${aspect} ${className} focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]`}
    >
      <ProjectCover project={p} priority={big} />
      <span className="absolute top-3 left-3 font-mono text-[11px] px-2 py-1 rounded-sm bg-[color-mix(in_oklab,var(--color-bg)_85%,transparent)] text-[var(--color-fg-muted)]">
        {String(index + 1).padStart(2, "0")} · {p.category}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
        <div className="flex items-end justify-between gap-3 rounded-sm bg-[color-mix(in_oklab,var(--color-bg)_90%,transparent)] px-4 py-3 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:translate-y-1 md:group-hover:translate-y-0">
          <div className="min-w-0">
            <h3 className={`font-display leading-tight text-[var(--color-fg)] truncate ${big ? "text-xl md:text-3xl" : "text-lg md:text-xl"}`}>
              {String(p.title).split(/\s[—-]\s/)[0]}
            </h3>
            <div className="text-xs text-[var(--color-fg-muted)] mt-0.5">{p.year}</div>
          </div>
          <span className="shrink-0 text-xs text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors whitespace-nowrap">
            {label} <span aria-hidden>↗</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
