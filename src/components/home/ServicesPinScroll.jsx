"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HoverImagePreviewLayer, useHoverImagePreview } from "@/components/HoverImagePreview";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

/**
 * Rich pinned services showcase.
 *
 * Desktop (md+):
 *   - Section pins while the user scrolls through each service.
 *   - Left column: service index with animated active marker.
 *   - Right column: active service's full editorial detail (big 01,
 *     headline + tagline, description, features, tech stack chips, CTA).
 * Mobile (<md):
 *   - Stacked cards with full detail, no pin.
 *
 * Layout uses min-h:100svh on pinned panel (content allowed to be slightly
 * taller than viewport — overflow-y:auto within panel prevents clipping on
 * shorter laptops).
 */
export default function ServicesPinScroll({ services = [] }) {
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const detailRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const count = services.length;
  const { active: hoverImage, bind: bindHoverImage, clear: clearHoverImage } = useHoverImagePreview();

  useEffect(() => {
    if (!sectionRef.current || count === 0) return;
    if (prefersReducedMotion()) return;

    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    let trigger;

    const setup = () => {
      if (trigger) {
        trigger.kill();
        trigger = null;
      }
      if (!pinRef.current) return;
      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${count * window.innerHeight * 0.9}`,
        pin: pinRef.current,
        pinSpacing: true,
        scrub: 0.6,
        invalidateOnRefresh: true,
        snap: {
          snapTo: (value) => {
            const step = 1 / count;
            return Math.round(value / step) * step;
          },
          duration: 0.35,
          ease: "expo.out",
        },
        onUpdate: (self) => {
          const idx = Math.min(
            count - 1,
            Math.floor(self.progress * count + 0.0001)
          );
          setActiveIdx(idx);
        },
      });
    };

    const ctx = gsap.context(() => {
      setup();
      window.addEventListener("resize", setup);
    }, sectionRef);

    return () => {
      window.removeEventListener("resize", setup);
      if (trigger) trigger.kill();
      ctx.revert();
    };
  }, [count]);

  // Re-run entrance animation on the detail panel each time the active
  // service changes. The old version tweened opacity 0 → 1 on the entire
  // panel — but because activeIdx updates continuously while the user
  // scrubs through the pin, interrupted tweens could strand inline
  // `opacity: 0` on the panel, leaving the right side stuck blank.
  //
  // New approach: clear any stale opacity/transform first, then run a tight
  // Y-slide with autoAlpha floored at 0.6 — the content is always legible
  // even if the tween is killed mid-flight.
  useEffect(() => {
    if (!detailRef.current) return;
    if (prefersReducedMotion()) return;
    const items = detailRef.current.querySelectorAll("[data-detail-item]");
    // Wipe any stale inline styles left by a previous interrupted tween.
    gsap.set(items, { clearProps: "opacity,transform,visibility" });
    gsap.fromTo(
      items,
      { y: 14, autoAlpha: 0.6 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.35,
        stagger: 0.03,
        ease: "expo.out",
        overwrite: true,
      }
    );
  }, [activeIdx]);

  if (count === 0) return null;
  const active = services[activeIdx];

  return (
    <section
      ref={sectionRef}
      id="services"
      className="section-gradient-alt relative border-t border-[var(--color-line)]"
    >
      <HoverImagePreviewLayer active={hoverImage} onClear={clearHoverImage} />
      {/* Desktop pinned panel — content capped at 80vh so it never overflows
          the viewport. The outer pin wrapper still takes the full svh so
          the pin behaves correctly; the inner .pin-body fits within 80vh. */}
      <div
        ref={pinRef}
        className="hidden md:flex items-center min-h-[100svh] container-edge py-12 lg:py-16"
      >
        <div className="grid grid-cols-12 gap-8 lg:gap-10 w-full max-h-[70vh] h-[70vh]">
        {/* Left: index list */}
        <aside className="col-span-5 flex flex-col justify-between min-h-0 overflow-hidden">
          <div className="min-h-0 overflow-hidden flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-6 shrink-0">
              <div>
                <div className="eyebrow mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
                  <span>What we do</span>
                </div>
                <h2 className="font-display text-[clamp(2rem,4.4vw,3.75rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-fg)]">
                  Services.
                </h2>
              </div>
              <Link
                href="/services"
                className="eyebrow underline-grow text-[var(--color-fg)] shrink-0 mt-1"
                data-cursor="hover"
              >
                View all services →
              </Link>
            </div>
            <ul className="flex flex-col min-h-0 overflow-hidden">
              {services.map((s, i) => {
                const isActive = i === activeIdx;
                const rowImg = s.image_url || s.thumbnail_url;
                return (
                  <li
                    key={s.slug}
                    className="border-t border-[var(--color-line)]"
                    {...(rowImg ? bindHoverImage(rowImg) : {})}
                  >
                    <Link
                      href={`/services#${s.slug}`}
                      className="group relative flex items-center gap-5 py-3 lg:py-4"
                      aria-current={isActive ? "true" : undefined}
                      data-cursor="hover"
                    >
                      <span
                        className={`font-mono text-xs w-8 transition-colors ${
                          isActive
                            ? "text-[var(--color-accent)]"
                            : "text-[var(--color-fg-muted)]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-xl lg:text-2xl xl:text-3xl tracking-[-0.025em] transition-colors ${
                          isActive
                            ? "text-[var(--color-fg)]"
                            : "text-[var(--color-fg-subtle)] group-hover:text-[var(--color-fg-muted)]"
                        }`}
                      >
                        {s.title}
                      </span>
                      <span
                        className={`ml-auto block h-px bg-[var(--color-accent)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                          isActive ? "w-10 opacity-100" : "w-0 opacity-0"
                        }`}
                      />
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-[var(--color-line)]" />
            </ul>
          </div>
          <div className="eyebrow flex items-center justify-between mt-5 shrink-0">
            <span>{String(activeIdx + 1).padStart(2, "0")}</span>
            <div className="flex-1 mx-4 h-px bg-[var(--color-line)] relative overflow-hidden">
              <span
                className="absolute left-0 top-0 h-full bg-[var(--color-accent)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ width: `${((activeIdx + 1) / count) * 100}%` }}
              />
            </div>
            <span>{String(count).padStart(2, "0")}</span>
          </div>
        </aside>

        {/* Right: detail panel */}
        <div
          ref={detailRef}
          className="col-span-7 flex flex-col min-h-0 overflow-hidden"
        >
          <div className="eyebrow mb-3 text-[var(--color-fg-muted)] shrink-0" data-detail-item>
            {active.category}
          </div>
          <div key={active.slug} className="flex flex-col gap-3 lg:gap-4 min-h-0">
            <div
              data-detail-item
              className="font-display italic text-[clamp(3rem,7vw,6.5rem)] leading-[0.9] text-[var(--color-accent)] shrink-0"
            >
              {String(activeIdx + 1).padStart(2, "0")}
            </div>
            <h3
              data-detail-item
              className="font-display text-[clamp(1.5rem,2.8vw,2.5rem)] leading-[1.02] tracking-[-0.03em] text-[var(--color-fg)] shrink-0"
            >
              {active.title}
              <span className="text-[var(--color-fg-muted)]">
                {" "}
                — {active.tagline}
              </span>
            </h3>
            <p
              data-detail-item
              className="max-w-[62ch] text-[var(--color-fg-muted)] text-sm lg:text-base leading-relaxed line-clamp-3"
            >
              {active.description}
            </p>
            {(active.image_url || active.thumbnail_url || active.video_url) && (
              <div
                data-detail-item
                className="relative w-full max-w-xl aspect-video rounded-xl overflow-hidden border border-[var(--color-line)] bg-[var(--color-bg-soft)] shrink-0"
              >
                {active.video_url ? (
                  // eslint-disable-next-line jsx-a11y/media-has-caption -- marketing clip; no transcript
                  <video
                    src={active.video_url}
                    className="absolute inset-0 w-full h-full object-cover"
                    controls
                    playsInline
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={active.image_url || active.thumbnail_url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            )}
            <div
              data-detail-item
              className="grid grid-cols-2 gap-x-6 gap-y-1 max-w-[56ch] border-t border-[var(--color-line)] pt-3 shrink-0"
            >
              {active.features?.slice(0, 4).map((f) => (
                <div
                  key={f}
                  className="flex items-start gap-2 text-sm text-[var(--color-fg)]"
                >
                  <span className="text-[var(--color-accent)] mt-1">—</span>
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <div
              data-detail-item
              className="flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[11px] text-[var(--color-fg-muted)] shrink-0"
            >
              {active.tech_stack?.slice(0, 7).map((t) => (
                <span
                  key={t}
                  className="border border-[var(--color-line)] rounded-full px-2.5 py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>
            <div data-detail-item className="pt-1 shrink-0">
              <Link
                href={`/services#${active.slug}`}
                data-cursor="hover"
                className="eyebrow underline-grow text-[var(--color-fg)]"
              >
                Learn more →
              </Link>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Mobile stacked fallback */}
      <div className="md:hidden container-edge py-16 flex flex-col gap-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="eyebrow mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-fg-muted)]" />
              <span>What we do</span>
            </div>
            <h2 className="heading-lg text-[var(--color-fg)]">Services.</h2>
          </div>
          <Link
            href="/services"
            className="eyebrow underline-grow text-[var(--color-fg)] self-end shrink-0"
            data-cursor="hover"
          >
            View all services →
          </Link>
        </div>
        {services.map((s, i) => {
          const rowImg = s.image_url || s.thumbnail_url;
          return (
          <article
            key={s.slug}
            className="border-t border-[var(--color-line)] pt-6 flex flex-col gap-4"
            {...(rowImg ? bindHoverImage(rowImg) : {})}
          >
            <div className="flex items-baseline justify-between eyebrow text-[var(--color-fg-muted)]">
              <span className="text-[var(--color-accent)]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{s.category}</span>
            </div>
            <h3 className="font-display text-[clamp(2rem,8vw,3rem)] leading-[1] tracking-[-0.03em] text-[var(--color-fg)]">
              {s.title}
              <span className="text-[var(--color-fg-muted)] italic"> — {s.tagline}</span>
            </h3>
            <p className="text-[var(--color-fg-muted)] text-base leading-relaxed">
              {s.description}
            </p>
            <div className="flex flex-wrap gap-2 font-mono text-[11px] text-[var(--color-fg-muted)] pt-2">
              {s.tech_stack?.slice(0, 6).map((t) => (
                <span
                  key={t}
                  className="border border-[var(--color-line)] rounded-full px-2 py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>
          </article>
          );
        })}
      </div>
    </section>
  );
}
