"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

function toExternalHref(url) {
  const raw = String(url || "").trim();
  if (!raw) return null;
  if (/^(https?:)?\/\//i.test(raw)) return raw.startsWith("//") ? `https:${raw}` : raw;
  if (/^[a-z]+:/i.test(raw)) return raw;
  return `https://${raw}`;
}

/**
 * ProjectsShowcase — horizontal scroll gallery.
 *
 * Desktop (md+):
 *   - Section pins; cards move sideways as you scroll vertically (Lenis + ScrollTrigger).
 *   - Distance uses the **track's overflow parent width**, not `window.innerWidth`
 *     (wrong distance was shifting cards off-screen / empty strip).
 *   - `x` / `end` are function-based so `ScrollTrigger.refresh()` after images/fonts
 *     recalculates correctly.
 * Mobile:
 *   - Native horizontal snap scroll (touch-friendly).
 */
export default function ProjectsShowcase({ projects = [] }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);
  const trackWrapRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || projects.length === 0) return;
    if (prefersReducedMotion()) return;

    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      const pin = pinRef.current;
      const wrap = trackWrapRef.current ?? track.parentElement;
      if (!section || !track || !pin || !wrap) return () => {};

      const getDistance = () => {
        const w = wrap.clientWidth;
        if (!w) return 0;
        return Math.max(0, track.scrollWidth - w);
      };

      gsap.set(track, { x: 0 });

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const d = getDistance();
            return `+=${d + Math.max(240, window.innerHeight * 0.35)}`;
          },
          pin,
          pinSpacing: true,
          scrub: 0.65,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const refresh = () => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
      };

      const ro = new ResizeObserver(refresh);
      ro.observe(section);
      ro.observe(wrap);
      ro.observe(track);

      window.addEventListener("resize", refresh);
      window.addEventListener("load", refresh, { once: true });

      const imgs = track.querySelectorAll("img");
      imgs.forEach((img) => {
        if (!img.complete) img.addEventListener("load", refresh, { once: true });
      });

      const t1 = requestAnimationFrame(refresh);
      const t2 = setTimeout(refresh, 120);
      const t3 = setTimeout(refresh, 600);

      return () => {
        cancelAnimationFrame(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        ro.disconnect();
        window.removeEventListener("resize", refresh);
        imgs.forEach((img) => img.removeEventListener("load", refresh));
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, [projects.length]);

  if (projects.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      id="work"
      className="section-gradient relative border-t border-[var(--color-line)]"
    >
      {/* Desktop pinned horizontal scroll */}
      <div
        ref={pinRef}
        className="hidden md:flex flex-col h-[100svh] min-h-0 overflow-hidden"
      >
        <div className="container-edge pt-24 lg:pt-28 pb-6 md:pb-8 flex items-end justify-between gap-6 shrink-0">
          <div>
            <div className="eyebrow mb-4 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
              <span>Selected work</span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-fg)]">
              Recent <span className="italic text-[var(--color-fg-muted)]">projects</span>.
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="eyebrow text-[var(--color-fg-muted)] hidden lg:flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
              <span>Scroll →</span>
            </div>
            <Link
              href="/portfolio"
              className="eyebrow underline-grow text-[var(--color-fg)]"
              data-cursor="hover"
            >
              View all projects →
            </Link>
          </div>
        </div>

        <div
          ref={trackWrapRef}
          className="flex-1 relative min-h-0 overflow-hidden"
        >
          <div
            ref={trackRef}
            className="absolute inset-y-0 left-0 flex items-start pt-2 gap-6 lg:gap-8 pl-[clamp(1.25rem,4vw,3rem)] pr-[25vw] will-change-transform"
          >
            {projects.map((p, i) => {
              const externalHref = toExternalHref(p.live_url);
              return (
                <div
                  key={p.slug}
                  className="group relative flex-none w-[80vw] sm:w-[60vw] md:w-[48vw] lg:w-[38vw] xl:w-[32vw] max-w-[640px] h-[86%] max-h-full min-h-0 flex flex-col"
                >
                <div className="flex items-baseline justify-between eyebrow text-[var(--color-fg-muted)] mb-4">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    {p.category} · {p.year}
                  </span>
                </div>
                <Link
                  href={`/portfolio/${p.slug}`}
                  data-cursor="hover"
                  className="flex min-h-0 flex-1 flex-col justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
                >
                  <div className="relative mx-auto w-full max-w-[min(100%,calc(30svh*16/9))] shrink-0 aspect-video overflow-hidden border border-[var(--color-line)] rounded-sm">
                    <ProjectCover project={p} />
                  </div>
                  <div className="flex min-h-0 flex-col gap-2 mt-1">
                    <h3 className="font-display text-xl lg:text-2xl xl:text-3xl leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-sm text-[var(--color-fg-muted)] line-clamp-2">
                      {p.description}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] text-[var(--color-fg-muted)] mt-1">
                      {p.tech_stack?.slice(0, 4).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </Link>
                {externalHref ? (
                  <a
                    href={externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs font-medium text-[var(--color-accent)] hover:underline self-start"
                  >
                    Project link ↗
                  </a>
                ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile: native horizontal scroll with snap   __*/}
      <div className="md:hidden">
        <div className="container-edge pt-16 pb-8 flex items-end justify-between gap-6">
          <div>
            <div className="eyebrow mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-fg-muted)]" />
              <span>Selected work</span>
            </div>
            <h2 className="heading-lg text-[var(--color-fg)]">
              Recent <span className="italic text-[var(--color-fg-muted)]">projects</span>.
            </h2>
          </div>
          <Link
            href="/portfolio"
            className="eyebrow underline-grow text-[var(--color-fg)] self-end"
            data-cursor="hover"
          >
            View all projects →
          </Link>
        </div>

        <div className="overflow-x-auto snap-x snap-mandatory -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)] pb-10">
          <div className="flex gap-4 w-max">
            {projects.map((p, i) => {
              const externalHref = toExternalHref(p.live_url);
              return (
                <div key={p.slug} className="group snap-start flex-none w-[78vw] flex flex-col">
                <div className="flex items-baseline justify-between eyebrow text-[var(--color-fg-muted)] mb-3">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    {p.category} · {p.year}
                  </span>
                </div>
                <Link href={`/portfolio/${p.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm">
                  <div className="relative w-full aspect-video overflow-hidden border border-[var(--color-line)] rounded-sm">
                    <ProjectCover project={p} />
                  </div>
                  <h3 className="font-display text-xl leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)] mt-4 group-hover:text-[var(--color-accent)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)] mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </Link>
                {externalHref ? (
                  <a
                    href={externalHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs font-medium text-[var(--color-accent)] hover:underline"
                  >
                    Project link ↗
                  </a>
                ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCover({ project }) {
  const src = project.thumbnail_url || project.cover_url;
  if (src) {
    return (
      <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={project.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-[var(--color-bg)] opacity-20 transition-opacity duration-700 group-hover:opacity-0" />
      </>
    );
  }
  // Fallback gradient placeholder derived from theme tokens + chroma.
  const idx = (project.slug?.length ?? 0) % 3;
  const gradientByIdx = [
    "radial-gradient(ellipse at 20% 30%, var(--color-accent-soft), transparent 55%), radial-gradient(ellipse at 80% 70%, color-mix(in oklab, var(--chroma-violet) 40%, transparent), transparent 60%), linear-gradient(140deg, var(--color-bg-soft), var(--color-bg))",
    "radial-gradient(ellipse at 70% 20%, color-mix(in oklab, var(--chroma-pink) 35%, transparent), transparent 60%), radial-gradient(ellipse at 20% 80%, color-mix(in oklab, var(--chroma-cyan) 35%, transparent), transparent 60%), linear-gradient(160deg, var(--color-bg-soft), var(--color-bg))",
    "radial-gradient(ellipse at 30% 70%, color-mix(in oklab, var(--chroma-cyan) 38%, transparent), transparent 60%), radial-gradient(ellipse at 80% 30%, color-mix(in oklab, var(--chroma-violet) 35%, transparent), transparent 60%), linear-gradient(120deg, var(--color-bg-soft), var(--color-bg))",
  ];
  return (
    <>
      <div
        className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
        style={{ backgroundImage: gradientByIdx[idx] }}
      />
      <div className="absolute inset-0 bg-[var(--color-bg)] opacity-10 transition-opacity duration-700 group-hover:opacity-0" />
    </>
  );
}
