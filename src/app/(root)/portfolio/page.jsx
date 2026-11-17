import { getAllProjects } from "@/lib/supabase/queries";
import { getT } from "@/lib/i18n/server";
import { localizeRows, PROJECT_FIELDS } from "@/lib/i18n/localize";
import PortfolioGallery from "@/components/portfolio/PortfolioGallery";

export const revalidate = 3600;

export const metadata = {
  title: "Work — Plivix Technologies",
  description:
    "Selected work by Plivix Technologies — production web, mobile, AI and data platforms.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const { t, locale } = await getT();
  const projects = localizeRows(await getAllProjects(), PROJECT_FIELDS, locale);

  return (
    <div className="section-gradient pt-32 md:pt-40">
      <section className="section-gradient-alt container-edge pb-10 md:pb-14">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>{t("pages.portfolio.eyebrow")}</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[20ch]">
          {t("pages.portfolio.h1a")}{" "}
          <span className="italic text-heading-accent">{t("pages.portfolio.h1b")}</span>.
        </h1>
        <p className="mt-6 max-w-[56ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          {t("pages.portfolio.lead")}
        </p>
      </section>

      <PortfolioGallery projects={projects} />
    </div>
  );
}
