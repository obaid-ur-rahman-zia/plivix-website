import { getAllProjects } from "@/lib/supabase/queries";
import PortfolioProjectRows from "@/components/portfolio/PortfolioProjectRows";

export const revalidate = 3600;

export const metadata = {
  title: "Work — Plivix Technologies",
  description:
    "Selected work by Plivix Technologies — production web, mobile, AI and data platforms.",
};

export default async function PortfolioPage() {
  const projects = await getAllProjects();

  return (
    <div className="section-gradient pt-32 md:pt-40">
      <section className="section-gradient-alt container-edge pb-16 md:pb-24">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>Selected work</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[20ch]">
          Systems we&rsquo;ve{" "}
          <span className="italic text-heading-accent">shipped</span>.
        </h1>
        <p className="mt-10 max-w-[56ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          A sample of recent engagements across web, mobile, AI automation,
          machine learning and data. Each one shipped, monitored, and handed
          over to a team that can run it.
        </p>
      </section>

      <PortfolioProjectRows projects={projects} />
    </div>
  );
}
