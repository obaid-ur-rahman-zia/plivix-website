import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProjects,
  getProjectBySlug,
} from "@/lib/supabase/queries";

export const revalidate = 3600;

function toExternalHref(url) {
  const raw = String(url || "").trim();
  if (!raw) return null;
  if (/^(https?:)?\/\//i.test(raw)) return raw.startsWith("//") ? `https:${raw}` : raw;
  if (/^[a-z]+:/i.test(raw)) return raw;
  return `https://${raw}`;
}

function normalizeUrlList(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((v) => String(v || "").trim()).filter(Boolean))];
}

function isDirectVideoUrl(url) {
  return /\.(mp4|webm|mov|m4v|ogg)(\?|#|$)/i.test(url);
}

function isLikelyImageUrl(url) {
  if (!url) return false;
  if (isDirectVideoUrl(url)) return false;
  return /\.(jpg|jpeg|png|webp|gif|avif|svg)(\?|#|$)/i.test(url) || /^https?:\/\//i.test(url);
}

function getYouTubeEmbedUrl(url) {
  try {
    const u = new URL(toExternalHref(url));
    const host = u.hostname.toLowerCase();
    if (host.includes("youtu.be")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host.includes("youtube.com")) {
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {}
  return null;
}

function getVimeoEmbedUrl(url) {
  try {
    const u = new URL(toExternalHref(url));
    if (!u.hostname.toLowerCase().includes("vimeo.com")) return null;
    const id = u.pathname.split("/").filter(Boolean).find((p) => /^\d+$/.test(p));
    return id ? `https://player.vimeo.com/video/${id}` : null;
  } catch {}
  return null;
}

function toMediaItems(project) {
  const items = [];
  const gallery = normalizeUrlList(project.gallery_urls);
  const videos = normalizeUrlList(project.video_urls);

  for (const url of gallery) {
    const href = toExternalHref(url);
    if (!href) continue;
    if (isLikelyImageUrl(href)) {
      items.push({ kind: "image", url: href });
      continue;
    }
    if (isDirectVideoUrl(href)) {
      items.push({ kind: "video-file", url: href });
      continue;
    }
    const yt = getYouTubeEmbedUrl(href);
    if (yt) {
      items.push({ kind: "video-embed", url: yt, sourceUrl: href });
      continue;
    }
    const vimeo = getVimeoEmbedUrl(href);
    if (vimeo) {
      items.push({ kind: "video-embed", url: vimeo, sourceUrl: href });
      continue;
    }
    items.push({ kind: "link", url: href });
  }

  for (const url of videos) {
    const href = toExternalHref(url);
    if (!href) continue;
    if (isDirectVideoUrl(href)) {
      items.push({ kind: "video-file", url: href });
      continue;
    }
    const yt = getYouTubeEmbedUrl(href);
    if (yt) {
      items.push({ kind: "video-embed", url: yt, sourceUrl: href });
      continue;
    }
    const vimeo = getVimeoEmbedUrl(href);
    if (vimeo) {
      items.push({ kind: "video-embed", url: vimeo, sourceUrl: href });
      continue;
    }
    if (isLikelyImageUrl(href)) {
      items.push({ kind: "image", url: href });
      continue;
    }
    items.push({ kind: "link", url: href });
  }

  return items;
}

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
  const externalHref = toExternalHref(project.live_url);
  const mediaItems = toMediaItems(project);

  return (
    <article className="section-gradient pt-32 md:pt-40">
      <header className="section-gradient-alt container-edge pb-16 md:pb-24">
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
        {externalHref ? (
          <p className="mt-8">
            <a
              href={externalHref}
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

      <section className="section-gradient-warm container-edge pb-16 md:pb-24">
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

      {mediaItems.length > 0 && (
        <section className="container-edge pb-16 md:pb-24 space-y-6">
          <div className="eyebrow text-[var(--color-fg-muted)]">Project media</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {mediaItems.map((item, idx) => {
              const key = `${item.kind}-${item.url}-${idx}`;
              if (item.kind === "image") {
                return (
                  <div
                    key={key}
                    className="relative aspect-video w-full overflow-hidden border border-[var(--color-line)] rounded-xl bg-[var(--color-bg-soft)]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={`${project.title} media ${idx + 1}`}
                      className="absolute inset-0 h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                );
              }
              if (item.kind === "video-file") {
                return (
                  <div
                    key={key}
                    className="relative aspect-video w-full overflow-hidden border border-[var(--color-line)] bg-black rounded-xl"
                  >
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      src={item.url}
                      className="absolute inset-0 w-full h-full object-contain"
                      controls
                      playsInline
                      preload="metadata"
                    />
                  </div>
                );
              }
              if (item.kind === "video-embed") {
                return (
                  <div
                    key={key}
                    className="relative aspect-video w-full overflow-hidden border border-[var(--color-line)] bg-black rounded-xl"
                  >
                    <iframe
                      src={item.url}
                      title={`${project.title} video ${idx + 1}`}
                      className="absolute inset-0 h-full w-full"
                      loading="lazy"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                );
              }
              return (
                <a
                  key={key}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-5 flex flex-col justify-between hover:border-[var(--color-accent)] transition-colors"
                >
                  <span className="eyebrow text-[var(--color-fg-muted)]">External media</span>
                  <span className="text-sm text-[var(--color-fg)] break-all">{item.url}</span>
                </a>
              );
            })}
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
