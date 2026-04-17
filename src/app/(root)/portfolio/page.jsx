import Link from "next/link";
import { getAllProjects } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata = {
  title: "Work — Plivix Technologies",
  description:
    "Selected work by Plivix Technologies — production web, mobile, AI and data platforms.",
};

export default async function PortfolioPage() {
  const projects = await getAllProjects();

  return (
    <div className="pt-32 md:pt-40">
      <section className="container-edge pb-16 md:pb-24">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>Selected work</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[20ch]">
          Systems we&rsquo;ve{" "}
          <span className="italic text-[var(--color-fg-muted)]">shipped</span>.
        </h1>
        <p className="mt-10 max-w-[56ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          A sample of recent engagements across web, mobile, AI automation,
          machine learning and data. Each one shipped, monitored, and handed
          over to a team that can run it.
        </p>
      </section>

      <section className="container-edge pb-32 md:pb-48">
        {projects.map((p, i) => (
          <Link
            key={p.slug}
            href={`/portfolio/${p.slug}`}
            data-cursor="hover"
            className="group grid grid-cols-12 gap-6 md:gap-10 border-t border-[var(--color-line)] py-10 md:py-16 items-center hover:bg-[var(--color-bg-elev)] transition-colors duration-500 -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)]"
          >
            <div className="col-span-12 md:col-span-1 eyebrow text-[var(--color-fg-muted)]">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div className="col-span-12 md:col-span-5 flex flex-col gap-2">
              <h2 className="font-display text-[clamp(1.75rem,3.5vw,3rem)] leading-[1.05] tracking-[-0.025em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors duration-500">
                {p.title}
              </h2>
              <div className="text-sm text-[var(--color-fg-muted)]">
                {p.client}
              </div>
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
        ))}
        <div className="border-t border-[var(--color-line)]" />
      </section>
    </div>
  );
}
