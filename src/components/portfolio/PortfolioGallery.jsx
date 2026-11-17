"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/components/I18nProvider";
import { GalleryTile } from "@/components/home/ProjectsShowcase";

const PATTERN = ["md:col-span-7 md:row-span-2", "md:col-span-5", "md:col-span-5", "md:col-span-6", "md:col-span-6"];

/** /portfolio: filterable image gallery. */
export default function PortfolioGallery({ projects = [] }) {
  const { t } = useI18n();
  const [cat, setCat] = useState("all");
  const cats = useMemo(() => [...new Set(projects.map((p) => p.category).filter(Boolean))], [projects]);
  const shown = cat === "all" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section className="container-edge pb-32 md:pb-48">
      {cats.length > 1 && (
        <div role="tablist" className="flex flex-wrap gap-2 mb-8 md:mb-10">
          {["all", ...cats].map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={cat === c}
              onClick={() => setCat(c)}
              data-cursor="hover"
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                cat === c
                  ? "border-[var(--color-fg)] bg-[var(--color-fg)] text-[var(--color-bg)]"
                  : "border-[var(--color-line)] text-[var(--color-fg-muted)] hover:border-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
              }`}
            >
              {c === "all" ? t("projects.all") : c}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 md:auto-rows-[clamp(200px,20vw,320px)]">
        {shown.map((p, i) => {
          let span = PATTERN[i % PATTERN.length];
          const lastOdd = i === shown.length - 1 && i % 5 === 3;
          if (lastOdd) span = "md:col-span-12";
          if (shown.length === 1) span = "md:col-span-12 md:row-span-2";
          if (shown.length === 2) span = "md:col-span-6 md:row-span-2";
          return <GalleryTile key={p.slug} project={p} index={projects.indexOf(p)} className={span} big={i % 5 === 0} label={t("projects.view")} />;
        })}
      </div>
    </section>
  );
}
