"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";
import { useTheme } from "@/components/theme/ThemeProvider";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), { ssr: false });

const CAPABILITIES = [
  "Full-Stack Web",
  "App Development",
  "AI Automation",
  "Machine Learning",
  "Data Science",
];

/**
 * Hero — a single-viewport section (100svh).
 *
 * Previously the hero was 200svh with a sticky pin-zone. That caused two
 * problems the user was hitting:
 *   1. A large "extra space" block after the visible hero.
 *   2. Occasional blank-screen flashes while smooth-scrolling (the sticky
 *      child + fixed canvas + Lenis transforms fought each other on mobile).
 *
 * The new layout is a plain 100svh section. The 3D canvas is absolutely
 * positioned within it, and camera progress is driven directly by the page's
 * scrollY normalized over one viewport — giving us the same camera animation
 * without any sticky/pinning machinery.
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const progressRef = useRef(0);
  const [capIdx, setCapIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const { resolved: theme } = useTheme();

  useEffect(() => {
    const mq = () => setIsMobile(window.innerWidth < 768);
    mq();
    window.addEventListener("resize", mq, { passive: true });
    return () => window.removeEventListener("resize", mq);
  }, []);

  /* Scroll progress: 0 at top of page, 1 after one viewport of scroll. */
  useEffect(() => {
    const onScroll = () => {
      const vh = window.innerHeight || 1;
      const p = Math.max(0, Math.min(1, window.scrollY / vh));
      progressRef.current = p;

      if (contentRef.current) {
        contentRef.current.style.opacity = `${Math.max(0.0, 1 - p * 1.2)}`;
        contentRef.current.style.transform = `translateY(${p * -40}px)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Entrance animation. */
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (prefersReducedMotion()) return;

      gsap.set(".hero-line", { yPercent: 110 });
      gsap.set("[data-fade]", { opacity: 0, y: 16 });

      const tl = gsap.timeline({ defaults: { ease: "expo.out" }, delay: 0.2 });
      tl.to(".hero-line", { yPercent: 0, duration: 1.05, stagger: 0.07 }).to(
        "[data-fade]",
        { opacity: 1, y: 0, duration: 0.75, stagger: 0.06 },
        "-=0.65"
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      setCapIdx((i) => (i + 1) % CAPABILITIES.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero relative w-full isolate overflow-hidden"
      style={{ height: "100svh", minHeight: "min(100svh, 640px)" }}
    >
      {/* ───── BACKDROP ───── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-bg-dark" />
      {/* <div aria-hidden className="pointer-events-none absolute inset-0 hero-bg-light" /> */}
      {/* <div aria-hidden className="pointer-events-none absolute inset-0 hero-chroma-bleed" /> */}

      {/* 3D scene — right column on desktop; on mobile: short bottom strip so it never covers CTAs/chips */}
      <div
        aria-hidden
        className="pointer-events-none z-[1] absolute bottom-0 left-1/2 w-[min(88%,360px)] -translate-x-1/2 h-[min(18vh,148px)] sm:h-[min(28vh,220px)] sm:left-auto sm:translate-x-0 sm:right-0 sm:w-full md:h-[min(38vh,320px)] lg:bottom-auto lg:top-0 lg:left-auto lg:h-full lg:w-[min(50%,620px)]"
      >
        <HeroCanvas progressRef={progressRef} theme={theme} isMobile={isMobile} />
      </div>

      {/* Grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.12]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundSize: "180px 180px",
        }}
      />

      {/* Feather into next section */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 md:h-40"
        style={{
          background: "linear-gradient(to bottom, transparent 0%, var(--color-bg) 100%)",
        }}
      />

      {/* ───── CONTENT ───── */}
      <div
        ref={contentRef}
        className="absolute inset-0 z-[3] grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8 container-edge pt-[4.5rem] sm:pt-20 md:pt-24 pb-[min(28vh,220px)] lg:pb-10 will-change-[transform,opacity]"
      >
        <div className="lg:col-span-7 flex flex-col min-w-0 min-h-0 relative max-lg:gap-5">
          {/* Availability pill */}
          <div data-fade className="flex shrink-0">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--color-line-strong)] bg-[var(--color-bg-elev)]/60 backdrop-blur-md px-3.5 py-1.5 font-mono text-[11px] tracking-[0.04em] uppercase text-[var(--color-fg-muted)]">
              <span className="hidden sm:inline">Available for new engagements · 2026</span>
              <span className="sm:hidden">Available · 2026</span>
            </span>
          </div>

          {/* Headline — on mobile: no flex-1 grow so CTAs/chips never compress into each other */}
          <div className="flex flex-col justify-start lg:justify-center gap-4 sm:gap-5 md:gap-6 py-2 sm:py-4 md:py-6 min-h-0 max-lg:flex-none lg:flex-1">
            <h1 className="font-display font-semibold text-[var(--color-fg)] tracking-[-0.035em] text-[clamp(2rem,min(5.6vw,9.5svh),4.75rem)] flex flex-col gap-[0.12em] shrink-0 [line-height:1.02]">
              <span className="block overflow-hidden py-[0.04em] [line-height:inherit]">
                <span className="hero-line block [line-height:inherit]">Engineering</span>
              </span>
              <span className="block overflow-hidden py-[0.04em] [line-height:inherit]">
                <span className="hero-line block [line-height:inherit]">
                  <span className="inline font-bold rounded-none bg-[var(--color-accent)] px-[0.12em] py-[0.04em] text-[var(--color-on-accent)]">
                    intelligent
                  </span>{" "}
                  <span className="text-[var(--color-fg)]">systems.</span>
                </span>
              </span>
            </h1>

            <p
              data-fade
              className="max-w-[52ch] shrink-0 text-sm md:text-base lg:text-lg leading-relaxed text-[var(--color-fg-muted)]"
            >
              Plivix Technologies is a boutique studio building production-grade
              web, mobile, AI and data platforms for modern teams — design-led,
              performance-obsessed, and backed by senior engineering.
            </p>

            <div
              data-fade
              className="flex flex-col max-lg:w-full max-lg:gap-3 sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 md:gap-4 max-lg:relative max-lg:z-[1]"
            >
              <Link
                href="/contact"
                data-cursor="hover"
                className="group inline-flex w-full sm:w-auto justify-center items-center gap-2.5 rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] px-5 md:px-6 py-3 md:py-3.5 text-sm font-medium transition-all hover:bg-[var(--color-accent-hover)] hover:shadow-[0_8px_30px_color-mix(in_oklab,var(--color-accent)_45%,transparent)]"
              >
                Start a project
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/portfolio"
                data-cursor="hover"
                className="group inline-flex w-full sm:w-auto justify-center items-center gap-2.5 rounded-full border border-[var(--color-line-strong)] text-[var(--color-fg)] px-5 md:px-6 py-3 md:py-3.5 text-sm font-medium hover:border-[var(--color-fg)] transition-colors"
              >
                See our work
                <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>

          {/* Capability chips — own row below CTAs so nothing overlaps on narrow screens */}
          <div
            data-fade
            className="flex flex-wrap items-center gap-2 md:gap-2.5 shrink-0 max-lg:mt-1 max-lg:border-t max-lg:border-[var(--color-line)] max-lg:pt-5 sm:pt-4 max-lg:relative max-lg:z-[1]"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)] mr-1 md:mr-3">
              / Services
            </span>
            {CAPABILITIES.map((c, i) => (
              <span
                key={c}
                className={`rounded-full border px-3 py-1 text-xs transition-all duration-500 ${
                  i === capIdx
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                    : "border-[var(--color-line)] text-[var(--color-fg-muted)]"
                }`}
              >
                {c}
              </span>
            ))}
          </div>

          {/* Meta row */}
          <div
            data-fade
            className="flex items-end justify-between gap-4 pt-4 mt-4 border-t border-[var(--color-line)] shrink-0"
          >
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--color-fg-subtle)]">
                Plivix Technologies
              </span>
              <span className="font-mono text-[11px] text-[var(--color-fg-muted)] hidden sm:block">
                Sargodha → Global · est. 2024
              </span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--color-fg-muted)]">
              <span className="hidden sm:inline">Scroll to explore</span>
              <span
                aria-hidden
                className="relative inline-block w-10 h-px bg-[var(--color-fg-muted)] overflow-hidden"
              >
                <span className="absolute inset-y-0 left-0 w-3 bg-[var(--color-accent)] animate-[heroDash_2.4s_ease-in-out_infinite]" />
              </span>
            </div>
          </div>
        </div>
        <div className="hidden lg:block lg:col-span-5" aria-hidden />
      </div>
    </section>
  );
}
