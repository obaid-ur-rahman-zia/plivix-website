"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

/**
 * ProjectsShowcase — horizontal scroll gallery.
 *
 * Desktop (md+):
 *   - Section pins; cards scroll sideways as the page scrolls vertically.
 *   - Classic GSAP xPercent pattern synced with Lenis.
 * Mobile:
 *   - Native horizontal snap scroll (touch-friendly).
 */
export default function ProjectsShowcase({ projects = [] }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current || projects.length === 0) return;
    if (prefersReducedMotion()) return;

    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    let trigger;

    const setup = () => {
      if (trigger) {
        trigger.kill();
        trigger = null;
      }
      if (!trackRef.current || !pinRef.current) return;

      const track = trackRef.current;
      // Distance to travel so the last card's right edge aligns with the
      // viewport's right edge.
      const distance = track.scrollWidth - window.innerWidth;
      if (distance <= 0) return;

      gsap.set(track, { x: 0 });
      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${distance + window.innerHeight * 0.5}`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        animation: gsap.to(track, {
          x: -distance,
          ease: "none",
        }),
      });
    };

    const ctx = gsap.context(() => {
      // Give layout a tick so scrollWidth is final
      requestAnimationFrame(setup);
      window.addEventListener("resize", setup);
    }, sectionRef);

    return () => {
      window.removeEventListener("resize", setup);
      if (trigger) trigger.kill();
      ctx.revert();
    };
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
        className="hidden md:flex flex-col h-[100svh] overflow-hidden"
      >
        <div className="container-edge pt-24 lg:pt-28 pb-10 flex items-end justify-between gap-6">
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
              View all →
            </Link>
          </div>
        </div>

        <div className="flex-1 relative overflow-hidden">
          <div
            ref={trackRef}
            className="absolute inset-y-0 left-0 flex items-center gap-6 lg:gap-8 pl-[clamp(1.25rem,4vw,3rem)] pr-[25vw] will-change-transform"
          >
            {projects.map((p, i) => (
              <div
                key={p.slug}
                className="group relative flex-none w-[80vw] sm:w-[60vw] md:w-[48vw] lg:w-[38vw] xl:w-[32vw] max-w-[640px] h-[70%] flex flex-col"
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
                  className="flex min-h-0 flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm"
                >
                  <div className="relative flex-1 min-h-0 overflow-hidden border border-[var(--color-line)] rounded-sm">
                    <ProjectCover project={p} />
                  </div>
                  <div className="flex flex-col gap-2 mt-5">
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
                {p.live_url ? (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs font-medium text-[var(--color-accent)] hover:underline self-start"
                  >
                    Project link ↗
                  </a>
                ) : null}
              </div>
            ))}
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
            View all →
          </Link>
        </div>

        <div className="overflow-x-auto snap-x snap-mandatory -mx-[clamp(1.25rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3rem)] pb-10">
          <div className="flex gap-4 w-max">
            {projects.map((p, i) => (
              <div key={p.slug} className="group snap-start flex-none w-[78vw] flex flex-col">
                <div className="flex items-baseline justify-between eyebrow text-[var(--color-fg-muted)] mb-3">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    {p.category} · {p.year}
                  </span>
                </div>
                <Link href={`/portfolio/${p.slug}`} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded-sm">
                  <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-line)] rounded-sm">
                    <ProjectCover project={p} />
                  </div>
                  <h3 className="font-display text-xl leading-[1.05] tracking-[-0.02em] text-[var(--color-fg)] mt-4 group-hover:text-[var(--color-accent)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[var(--color-fg-muted)] mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </Link>
                {p.live_url ? (
                  <a
                    href={p.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 text-xs font-medium text-[var(--color-accent)] hover:underline"
                  >
                    Project link ↗
                  </a>
                ) : null}
              </div>
            ))}
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
