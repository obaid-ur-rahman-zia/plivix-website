"use client";

import Link from "next/link";
import Logo from "../Logo";
import ThemeToggle from "../theme/ThemeToggle";
import { useSiteSettings } from "../SiteSettingsContext";
import { getSocialLinkEntries } from "@/lib/siteSocials";
import { useI18n } from "../I18nProvider";


export default function Footer() {
  const settings = useSiteSettings();
  const { t } = useI18n();
  const staticColumns = [
    {
      title: t("footer.sitemap"),
      links: [
        { label: t("nav.home"), href: "/" },
        { label: t("nav.products"), href: "/products" },
        { label: t("nav.work"), href: "/portfolio" },
        { label: t("nav.services"), href: "/services" },
        { label: t("nav.solutions"), href: "/solutions" },
        { label: t("nav.pricing"), href: "/pricing" },
        { label: t("nav.about"), href: "/about" },
        { label: t("nav.careers"), href: "/internships" },
        { label: t("nav.contact"), href: "/contact" },
      ],
    },
    {
      title: t("footer.services"),
      links: [
        { label: t("footer.links.erp"), href: "/solutions" },
        { label: t("footer.links.web"), href: "/services#full-stack-web" },
        { label: t("footer.links.app"), href: "/services#application-development" },
        { label: t("footer.links.ai"), href: "/services#ai-automation" },
        { label: t("footer.links.data"), href: "/services#data-science" },
        { label: t("footer.links.pricing"), href: "/pricing" },
      ],
    },
  ];
  const socialLinks = getSocialLinkEntries(settings.socials).map((s) => ({
    label: s.label,
    href: s.href,
    external: true,
  }));
  const columns =
    socialLinks.length > 0
      ? [...staticColumns, { title: t("footer.social"), links: socialLinks }]
      : staticColumns;

  const email = settings.contact_email?.trim() || "contact@plivix-tech.com";
  const locationLine = settings.location_tagline?.trim() || t("loc.tagline");

  return (
    <footer className="section-gradient-alt relative border-t border-[var(--color-line)]">
      <div className="container-edge pt-24 md:pt-32 pb-10 flex flex-col gap-16 md:gap-24 relative z-10">
        {/* Top: logo + manifesto + CTA */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-8">
            <div className="flex items-center gap-3 mb-8">
              <Logo variant="mark" width={30} height={57} className="h-12 w-auto object-contain" />
              <span className="font-display text-2xl tracking-[-0.02em] text-[var(--color-fg)]">
                Plivix<span className="text-[var(--color-accent)]">.</span>
              </span>
            </div>
            <div className="eyebrow text-[var(--color-fg-muted)] mb-6 flex items-center gap-3">
              <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
              <span>{t("cta.eyebrow")}</span>
            </div>
            <h2 className="font-display text-[clamp(2.25rem,6vw,5rem)] leading-[1.02] tracking-[-0.03em] text-[var(--color-fg)]">
              {t("footer.tagline")}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 flex items-end">
            <Link
              href="/contact"
              data-cursor="hover"
              className="group inline-flex items-center gap-3 text-[var(--color-fg)] text-lg md:text-xl underline-grow"
            >
              {t("common.startProject")}
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-12 gap-6 border-t border-[var(--color-line)] pt-12">
          <div className="col-span-12 md:col-span-3 flex flex-col gap-3">
            <div className="eyebrow text-[var(--color-fg-muted)]">{t("footer.contact")}</div>
            <a
              href={`mailto:${email}`}
              data-cursor="hover"
              className="text-[var(--color-fg)] underline-grow"
            >
              {email}
            </a>
            {[
              [t("loc.bd"), settings.phone_bd],
              [t("loc.pk"), settings.phone_pk],
            ]
              .filter(([, n]) => n)
              .map(([country, n]) => (
                <a
                  key={country}
                  href={`tel:${String(n).replace(/[^+\d]/g, "")}`}
                  data-cursor="hover"
                  className="text-sm text-[var(--color-fg)] underline-grow"
                >
                  <span className="text-[var(--color-fg-muted)]">{country} · </span>
                  {n}
                </a>
              ))}
            <div className="text-sm text-[var(--color-fg-muted)] whitespace-pre-line">
              {locationLine}
              {settings.address?.trim() ? (
                <>
                  {"\n"}
                  {settings.address.trim()}
                </>
              ) : null}
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
          <span>© {new Date().getFullYear()} {t("footer.rights")}</span>
          <div className="flex gap-5">
            <Link href="/privacy" className="underline-grow" data-cursor="hover">{t("legal.privacy")}</Link>
            <Link href="/terms" className="underline-grow" data-cursor="hover">{t("legal.terms")}</Link>
          </div>
          <div className="flex items-center gap-6">
            <span>{t("footer.reg")}</span>
            <ThemeToggle variant="segmented" />
          </div>
        </div>
      </div>
    </footer>
  );
}
