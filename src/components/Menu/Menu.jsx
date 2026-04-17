"use client";

import Link from "next/link";
import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { useSiteSettings } from "../SiteSettingsContext";
import { getSocialLinkEntries } from "@/lib/siteSocials";
import { prefersReducedMotion } from "@/lib/scroll/useScrollTriggerSync";

const menuLinks = [
  { path: "/", label: "Home", index: "01" },
  { path: "/portfolio", label: "Work", index: "02" },
  { path: "/services", label: "Services", index: "03" },
  { path: "/about", label: "About", index: "04" },
  { path: "/internships", label: "Careers", index: "05" },
  { path: "/contact", label: "Contact", index: "06" },
];

export default function Menu({ open, onClose }) {
  const settings = useSiteSettings();
  const socialLinks = useMemo(
    () => getSocialLinkEntries(settings.socials),
    [settings.socials]
  );
  const overlayRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    const root = overlayRef.current;
    const reduce = prefersReducedMotion();

    const reveal = reduce ? 0.02 : 0.42;
    const linkDur = reduce ? 0.02 : 0.4;
    const linkStagger = reduce ? 0 : 0.03;
    const metaDur = reduce ? 0.02 : 0.32;
    const metaStagger = reduce ? 0 : 0.04;

    tlRef.current = gsap
      .timeline({ paused: true, defaults: { ease: "power3.out" } })
      .set(root, { pointerEvents: "auto" })
      .to(root, { clipPath: "inset(0 0 0 0)", duration: reveal })
      .from(
        root.querySelectorAll("[data-menu-link]"),
        {
          yPercent: reduce ? 0 : 85,
          opacity: reduce ? 1 : 0,
          duration: linkDur,
          stagger: linkStagger,
        },
        reduce ? 0 : "-=0.32"
      )
      .from(
        root.querySelectorAll("[data-menu-meta]"),
        {
          opacity: reduce ? 1 : 0,
          y: reduce ? 0 : 10,
          duration: metaDur,
          stagger: metaStagger,
        },
        reduce ? 0 : "-=0.26"
      );

    return () => tlRef.current?.kill();
  }, []);

  useEffect(() => {
    if (!tlRef.current || !overlayRef.current) return;
    if (open) {
      document.body.style.overflow = "hidden";
      tlRef.current.play(0);
    } else {
      document.body.style.overflow = "";
      tlRef.current.reverse();
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={overlayRef}
      aria-hidden={!open}
      style={{
        clipPath: "inset(0 0 100% 0)",
        pointerEvents: open ? "auto" : "none",
      }}
      className="fixed inset-0 z-50 bg-[var(--color-bg)] flex flex-col"
    >
      <div className="container-edge flex-1 flex flex-col min-h-0 pt-[max(5.5rem,env(safe-area-inset-top)+4rem)] md:pt-[max(6.5rem,env(safe-area-inset-top)+5rem)] pb-8 md:pb-12">
        <div className="flex-1 flex flex-col md:grid md:grid-cols-12 md:gap-x-10 lg:gap-x-14 md:min-h-0 md:items-stretch">
          {/* Primary nav — left column, balanced type scale on large screens */}
          <nav className="flex flex-col md:col-span-7 lg:col-span-6 md:justify-center md:min-h-[min(72vh,calc(100svh-9rem))]">
            {menuLinks.map((l) => (
              <div
                key={l.path}
                className="border-t border-[var(--color-line)] overflow-hidden"
              >
                <Link
                  href={l.path}
                  onClick={onClose}
                  data-menu-link
                  data-cursor="hover"
                  className="group flex items-baseline gap-4 sm:gap-6 py-3.5 md:py-4 lg:py-[1.125rem]"
                >
                  <span className="font-mono text-xs text-[var(--color-fg-muted)] w-10 sm:w-12 shrink-0 tabular-nums">
                    {l.index}
                  </span>
                  <span className="font-display text-[clamp(1.75rem,5vw,3.25rem)] md:text-[clamp(2rem,3.8vw,3.75rem)] lg:text-[clamp(2.25rem,3.4vw,4.25rem)] leading-[0.98] tracking-[-0.03em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
                    {l.label}
                  </span>
                </Link>
              </div>
            ))}
            <div className="border-t border-[var(--color-line)]" />
          </nav>

          {/* Meta — desktop: right column, uses empty space; mobile: below nav */}
          <aside className="mt-8 md:mt-0 md:col-span-5 lg:col-span-6 flex flex-col gap-6 md:gap-8 md:justify-end md:border-l md:border-[var(--color-line)] md:pl-8 lg:pl-10 pt-8 md:pt-0 border-t border-[var(--color-line)] md:border-t-0">
            <p data-menu-meta className="text-sm md:text-base text-[var(--color-fg-muted)] leading-relaxed max-w-[42ch]">
              Plivix Technologies builds production web, mobile, AI and data
              platforms.
            </p>
            <div
              data-menu-meta
              className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-sm text-[var(--color-fg)]"
            >
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="underline-grow"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
