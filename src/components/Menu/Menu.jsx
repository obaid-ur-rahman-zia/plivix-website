"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const menuLinks = [
  { path: "/", label: "Home", index: "01" },
  { path: "/portfolio", label: "Work", index: "02" },
  { path: "/services", label: "Services", index: "03" },
  { path: "/about", label: "About", index: "04" },
  { path: "/internships", label: "Careers", index: "05" },
  { path: "/contact", label: "Contact", index: "06" },
];

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/plivix" },
  { label: "Instagram", href: "https://www.instagram.com/plivix.technologies/" },
  { label: "X / Twitter", href: "https://x.com/plivix_tech" },
];

export default function Menu({ open, onClose }) {
  const overlayRef = useRef(null);
  const tlRef = useRef(null);

  useEffect(() => {
    if (!overlayRef.current) return;
    const root = overlayRef.current;

    tlRef.current = gsap
      .timeline({ paused: true, defaults: { ease: "expo.inOut" } })
      .set(root, { pointerEvents: "auto" })
      .to(root, { clipPath: "inset(0 0 0 0)", duration: 0.9 })
      .from(
        root.querySelectorAll("[data-menu-link]"),
        { yPercent: 120, opacity: 0, duration: 0.9, stagger: 0.05 },
        "-=0.45"
      )
      .from(
        root.querySelectorAll("[data-menu-meta]"),
        { opacity: 0, y: 20, duration: 0.6, stagger: 0.06 },
        "-=0.55"
      );

    return () => tlRef.current?.kill();
  }, []);

  useEffect(() => {
    if (!tlRef.current || !overlayRef.current) return;
    if (open) {
      document.body.style.overflow = "hidden";
      tlRef.current.play();
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
      <div className="container-edge pt-24 md:pt-32 flex-1 flex flex-col justify-between pb-10">
        <nav className="flex flex-col">
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
                className="group flex items-baseline gap-6 py-4 md:py-6"
              >
                <span className="font-mono text-xs text-[var(--color-fg-muted)] w-12">
                  {l.index}
                </span>
                <span className="font-display text-[clamp(2.5rem,9vw,7rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors duration-500">
                  {l.label}
                </span>
              </Link>
            </div>
          ))}
          <div className="border-t border-[var(--color-line)]" />
        </nav>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mt-10">
          <div data-menu-meta className="eyebrow text-[var(--color-fg-muted)] max-w-[36ch]">
            Plivix Technologies builds production web, mobile, AI and data
            platforms.
          </div>
          <div data-menu-meta className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-[var(--color-fg)]">
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
        </div>
      </div>
    </div>
  );
}
