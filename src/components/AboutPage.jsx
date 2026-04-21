"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HoverImagePreviewLayer, useHoverImagePreview } from "@/components/HoverImagePreview";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

const values = [
  {
    title: "Craft over volume",
    body: "We take fewer engagements, deeper. Every commit goes through review, every deploy through evals.",
  },
  {
    title: "Shipped, not demoed",
    body: "Production systems, measured by the outcomes they produce — not the slides they appear in.",
  },
  {
    title: "Measurable quality",
    body: "Lighthouse ≥ 95, WCAG 2.2 AA, typed end-to-end, observable in production.",
  },
  {
    title: "AI with guardrails",
    body: "Every AI workflow we build has evaluations, tracing and cost controls from day one.",
  },
];

const timeline = [
  { year: "2022", event: "Founded. First production engagement shipped in 8 weeks." },
  { year: "2023", event: "Team grows to five senior engineers across web, mobile and ML." },
  { year: "2024", event: "AI automation practice launches; 9 production workflows deployed." },
  { year: "2025", event: "Data science practice launches; reach 42+ systems shipped to date." },
];

export default function AboutPage({ team = [], stats = [] }) {
  const rootRef = useRef(null);
  const { active: hoverImage, bind: bindHoverImage, clear: clearHoverImage } = useHoverImagePreview();

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-reveal]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="section-gradient pt-32 md:pt-40">
      {/* Hero */}
      <section className="container-edge pb-24 md:pb-32">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>About</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[18ch]">
          A small team,{" "}
          <span className="italic text-heading-accent">deep</span> craft.
        </h1>
        <p
          data-reveal
          className="mt-10 max-w-[62ch] text-lg text-[var(--color-fg-muted)] leading-relaxed"
        >
          Plivix Technologies is a senior engineering collective. We build and
          operate production systems across web, mobile, AI automation, machine
          learning and data science — as an embedded partner, not a vendor.
        </p>
      </section>

      {/* Stats */}
      {stats?.length > 0 && (
        <section className="section-gradient-alt border-t border-[var(--color-line)]">
          <div className="container-edge grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => (
              <div
                key={s.id ?? `stat-${i}`}
                data-reveal
                className={`flex flex-col gap-3 py-8 px-2 md:px-6 ${
                  i < stats.length - 1 ? "md:border-r md:border-[var(--color-line)]" : ""
                } ${i < 2 ? "border-b border-[var(--color-line)] md:border-b-0" : ""}`}
              >
                <div className="font-display text-[clamp(2rem,5vw,4rem)] leading-none tracking-[-0.03em] text-[var(--color-fg)] flex items-baseline">
                  <span>{s.value}</span>
                  <span className="text-[var(--color-accent)] ml-1">{s.suffix}</span>
                </div>
                <div className="eyebrow text-[var(--color-fg-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Values */}
      <section className="section-gradient-warm container-edge border-t border-[var(--color-line)] py-24 md:py-32">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="eyebrow text-[var(--color-fg-muted)] mb-6">How we work</div>
            <h2 className="heading-md text-[var(--color-fg)]">
              Values{" "}
              <span className="italic text-heading-accent">we live by</span>.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
            {values.map((v, i) => (
              <div
                key={v.title}
                data-reveal
                className="flex flex-col gap-4 border-t border-[var(--color-line)] pt-6"
              >
                <div className="eyebrow text-[var(--color-fg-muted)]">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="font-display text-2xl md:text-3xl tracking-[-0.025em] text-[var(--color-fg)]">
                  {v.title}
                </h3>
                <p className="text-[var(--color-fg-muted)] leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="container-edge border-t border-[var(--color-line)] py-24 md:py-32">
        <div className="eyebrow mb-10 text-[var(--color-fg-muted)]">Timeline</div>
        <ol className="flex flex-col">
          {timeline.map((t) => (
            <li
              key={t.year}
              data-reveal
              className="grid grid-cols-12 gap-6 border-t border-[var(--color-line)] py-8"
            >
              <span className="col-span-3 md:col-span-2 font-mono text-[var(--color-accent)]">
                {t.year}
              </span>
              <span className="col-span-9 md:col-span-10 font-display text-xl md:text-2xl leading-[1.2] tracking-[-0.02em] text-[var(--color-fg)]">
                {t.event}
              </span>
            </li>
          ))}
          <li className="border-t border-[var(--color-line)]" />
        </ol>
      </section>

      {/* Team */}
      {team?.length > 0 && (
        <section className="container-edge border-t border-[var(--color-line)] py-24 md:py-32">
          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-4">
              <div className="eyebrow text-[var(--color-fg-muted)] mb-6">Team</div>
              <h2 className="heading-md text-[var(--color-fg)]">
                People behind{" "}
                <span className="italic text-heading-accent">the work</span>.
              </h2>
            </div>
            <div className="col-span-12 md:col-span-8 flex flex-col relative">
              <HoverImagePreviewLayer active={hoverImage} onClear={clearHoverImage} />
              {team.map((m) => {
                const img = m.image_url || m.thumbnail_url;
                return (
                  <div
                    key={m.id ?? m.name}
                    data-reveal
                    className="group/row grid grid-cols-12 gap-6 border-t border-[var(--color-line)] py-8 transition-colors duration-300 hover:bg-[color-mix(in_oklab,var(--color-fg)_4%,transparent)]"
                    {...(img ? bindHoverImage(img, m.id ?? m.name) : {})}
                  >
                    <h3 className="col-span-12 md:col-span-6 font-display text-2xl md:text-3xl tracking-[-0.025em] text-[var(--color-fg)]">
                      {m.name}
                    </h3>
                    <div className="col-span-12 md:col-span-6 text-[var(--color-fg-muted)]">
                      {m.role}
                      {m.bio ? (
                        <p className="mt-2 text-sm leading-relaxed">{m.bio}</p>
                      ) : null}
                      {m.video_url ? (
                        <div className="mt-4 relative w-full max-w-lg aspect-video rounded-xl overflow-hidden border border-[var(--color-line)] bg-black">
                          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                          <video
                            src={m.video_url}
                            className="absolute inset-0 w-full h-full object-cover"
                            controls
                            playsInline
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
              <div className="border-t border-[var(--color-line)]" />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container-edge border-t border-[var(--color-line)] py-24 md:py-32 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <h2 className="heading-md text-[var(--color-fg)] max-w-[22ch]">
          Want to work with us?
        </h2>
        <Link
          href="/contact"
          data-cursor="hover"
          className="inline-flex items-center gap-3 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-4 rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          Start a project
          <span aria-hidden>→</span>
        </Link>
      </section>
    </div>
  );
}
