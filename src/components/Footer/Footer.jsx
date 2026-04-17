"use client";

import Link from "next/link";
import Logo from "../Logo";
import ThemeToggle from "../theme/ThemeToggle";

const columns = [
  {
    title: "Sitemap",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/portfolio" },
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Careers", href: "/internships" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Full-Stack Web", href: "/services#full-stack-web" },
      { label: "Application Dev", href: "/services#application-development" },
      { label: "AI Automation", href: "/services#ai-automation" },
      { label: "Machine Learning", href: "/services#machine-learning" },
      { label: "Data Science", href: "/services#data-science" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/plivix", external: true },
      { label: "Instagram", href: "https://www.instagram.com/plivix.technologies/", external: true },
      { label: "X / Twitter", href: "https://x.com/plivix_tech", external: true },
      { label: "Upwork", href: "https://www.upwork.com/agencies/1814949357398654976/", external: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="section-gradient-alt relative border-t border-[var(--color-line)]">
      <div className="container-edge pt-24 md:pt-32 pb-10 flex flex-col gap-16 md:gap-24 relative z-10">
        {/* Top: logo + manifesto + CTA */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <Logo variant="mark" width={40} height={40} className="h-10 w-10 object-contain" />
              <span className="font-display text-2xl tracking-[-0.02em] text-[var(--color-fg)]">
                Plivix<span className="text-[var(--color-accent)]">.</span>
              </span>
            </div>
            <div className="eyebrow text-[var(--color-fg-muted)] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
              <span>Let&apos;s build</span>
            </div>
            <h2 className="font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.02] tracking-[-0.03em] text-[var(--color-fg)]">
              Engineering intelligent{" "}
              <span className="italic text-[var(--color-fg-muted)]">systems</span>,
              shipped with care.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 flex items-end">
            <Link
              href="/contact"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-[var(--color-fg)] text-lg md:text-xl underline-grow"
            >
              Start a project
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-12 gap-6 border-t border-[var(--color-line)] pt-12">
          <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
            <div className="eyebrow text-[var(--color-fg-muted)]">Contact</div>
            <a
              href="mailto:hello@plivix-tech.com"
              data-cursor="hover"
              className="text-[var(--color-fg)] underline-grow"
            >
              hello@plivix-tech.com
            </a>
            <div className="text-sm text-[var(--color-fg-muted)]">
              Remote · Global
            </div>
          </div>
          {columns.map((col) => (
            <div key={col.title} className="col-span-6 md:col-span-3 flex flex-col gap-3">
              <div className="eyebrow text-[var(--color-fg-muted)]">
                {col.title}
              </div>
              <ul className="flex flex-col gap-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="text-[var(--color-fg)] underline-grow"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        data-cursor="hover"
                        className="text-[var(--color-fg)] underline-grow"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Giant wordmark */}
        <div aria-hidden className="relative overflow-hidden">
          <div className="font-display italic text-[var(--color-fg)] text-[20vw] leading-[0.82] tracking-[-0.06em] whitespace-nowrap">
            Plivix<span className="text-[var(--color-accent)]">.</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between pt-8 border-t border-[var(--color-line)] eyebrow text-[var(--color-fg-muted)]">
          <span>© {new Date().getFullYear()} Plivix Technologies</span>
          <div className="flex items-center gap-6">
            <span>Available for new engagements</span>
            <ThemeToggle variant="segmented" />
          </div>
        </div>
      </div>
    </footer>
  );
}
