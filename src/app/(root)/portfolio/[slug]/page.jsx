import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProjects,
  getProjectBySlug,
} from "@/lib/supabase/queries";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Plivix Technologies`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const allProjects = await getAllProjects();
  const currentIdx = allProjects.findIndex((p) => p.slug === slug);
  const next = allProjects[(currentIdx + 1) % allProjects.length];

  return (
    <article className="pt-32 md:pt-40">
      <header className="container-edge pb-16 md:pb-24">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>
            Case study · {project.category} · {project.year}
          </span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[22ch]">
          {project.title}
        </h1>
        <p className="mt-10 max-w-[56ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          {project.description}
        </p>
        {project.live_url ? (
          <p className="mt-8">
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="hover"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-line)] bg-[var(--color-bg-elev)] px-5 py-2.5 text-sm text-[var(--color-fg)] hover:border-[var(--color-accent)] transition-colors"
            >
              Open project link
              <span aria-hidden>↗</span>
            </a>
          </p>
        ) : null}
      </header>

      <section className="container-edge pb-16 md:pb-24">
        <div className="relative aspect-[16/9] overflow-hidden border border-[var(--color-line)]">
          {project.cover_url || project.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover_url || project.thumbnail_url}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_30%,rgba(44,33,101,0.35),transparent_60%),linear-gradient(140deg,#111,#0a0a0a)]" />
          )}
        </div>
      </section>

      {Array.isArray(project.video_urls) && project.video_urls.length > 0 && (
        <section className="container-edge pb-16 md:pb-24 space-y-6">
          <div className="eyebrow text-[var(--color-fg-muted)]">Video</div>
          <div className="flex flex-col gap-8">
            {project.video_urls.map((url) => (
              <div
                key={url}
                className="relative aspect-video w-full overflow-hidden border border-[var(--color-line)] bg-black rounded-xl"
              >
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video src={url} className="absolute inset-0 w-full h-full object-contain" controls playsInline />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="container-edge pb-24 md:pb-32">
        <div className="grid grid-cols-12 gap-6 md:gap-10 border-t border-[var(--color-line)] pt-12">
          <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
            <div>
              <div className="eyebrow text-[var(--color-fg-muted)] mb-2">
                Client
              </div>
              <div className="text-[var(--color-fg)]">{project.client}</div>
            </div>
            <div>
              <div className="eyebrow text-[var(--color-fg-muted)] mb-2">
                Year
              </div>
              <div className="text-[var(--color-fg)]">{project.year}</div>
            </div>
            <div>
              <div className="eyebrow text-[var(--color-fg-muted)] mb-2">
                Stack
              </div>
              <div className="flex flex-wrap gap-2 font-mono text-xs text-[var(--color-fg-muted)]">
                {project.tech_stack?.map((t) => (
                  <span
                    key={t}
                    className="border border-[var(--color-line)] rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-8">
            <p className="font-display text-[clamp(1.5rem,3vw,2.5rem)] leading-[1.15] tracking-[-0.02em] text-[var(--color-fg)] max-w-[30ch]">
              {project.description}
            </p>
          </div>
        </div>
      </section>

      {next && next.slug !== project.slug && (
        <section className="container-edge border-t border-[var(--color-line)] py-16 md:py-24">
          <div className="eyebrow mb-6 text-[var(--color-fg-muted)]">Next</div>
          <Link
            href={`/portfolio/${next.slug}`}
            data-cursor="hover"
            className="group flex items-baseline justify-between gap-6"
          >
            <h3 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[1] tracking-[-0.03em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors duration-500">
              {next.title}
            </h3>
            <span aria-hidden className="text-2xl text-[var(--color-fg)] transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </section>
      )}
    </article>
  );
}
