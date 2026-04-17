"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Menu from "./Menu/Menu";
import Logo from "./Logo";
import ThemeToggle from "./theme/ThemeToggle";

/**
 * NavHeader — theme-aware, always. At the top of the page the nav is
 * transparent (letting the hero shine through); after the user scrolls a
 * bit, it gains a translucent glass panel with backdrop-blur and a border.
 * Text colours always follow the site theme — no forced-dark override.
 */
export default function NavHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        ref={rootRef}
        className={`fixed top-0 left-0 right-0 z-[60] transition-colors duration-500 ${
          scrolled
            ? "bg-[var(--color-nav-bg)] backdrop-blur-xl border-b border-[var(--color-line)]"
            : "bg-transparent"
        }`}
      >
        <div className="container-edge flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            data-cursor="hover"
            aria-label="Plivix home"
            className="flex items-center gap-2 text-[var(--color-fg)]"
          >
            <Logo
              variant="full"
              width={100}
              height={100}
              className="h-10 w-auto object-contain"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-fg-muted)]">
            <Link
              href="/portfolio"
              className="underline-grow text-[var(--color-fg)] transition-opacity hover:opacity-80"
              data-cursor="hover"
            >
              Work
            </Link>
            <Link
              href="/services"
              className="underline-grow text-[var(--color-fg)] transition-opacity hover:opacity-80"
              data-cursor="hover"
            >
              Services
            </Link>
            <Link
              href="/about"
              className="underline-grow text-[var(--color-fg)] transition-opacity hover:opacity-80"
              data-cursor="hover"
            >
              About
            </Link>
            <Link
              href="/internships"
              className="underline-grow text-[var(--color-fg)] transition-opacity hover:opacity-80"
              data-cursor="hover"
            >
              Careers
            </Link>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle variant="cycle" />

            <Link
              href="/contact"
              data-cursor="hover"
              className="hidden md:inline-flex items-center gap-2 border border-[var(--color-line-strong)] text-[var(--color-fg)] rounded-full px-4 py-2 text-sm hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
            >
              Let&apos;s talk
              <span aria-hidden>→</span>
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              data-cursor="hover"
              className="relative w-10 h-10 flex items-center justify-center border border-[var(--color-line-strong)] rounded-full text-[var(--color-fg)] hover:border-[var(--color-accent)] transition-colors"
            >
              <span className="relative block w-4 h-[10px]">
                <span
                  className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
                    menuOpen ? "top-1/2 rotate-45" : "top-0"
                  }`}
                />
                <span
                  className={`absolute left-0 right-0 h-px bg-current transition-all duration-300 ${
                    menuOpen ? "top-1/2 -rotate-45" : "bottom-0"
                  }`}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
