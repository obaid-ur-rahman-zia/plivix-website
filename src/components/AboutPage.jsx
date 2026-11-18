"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { revealOnScroll } from "@/lib/scroll/reveal";
import { useI18n } from "@/components/I18nProvider";
import { getSocialLinkEntries } from "@/lib/siteSocials";

export default function AboutPage({ team = [], stats = [], beforeCta }) {
  const rootRef = useRef(null);
  const { t } = useI18n();
  const values = t("pages.about.values");
  const timeline = t("pages.about.timeline");

  useEffect(() => {
    if (!rootRef.current) return;
    return revealOnScroll(rootRef.current.querySelectorAll("[data-reveal]"));
  }, [values]);

  return (
    <div ref={rootRef} className="section-gradient pt-32 md:pt-40">
      {/* Hero */}
      <section className="container-edge pb-24 md:pb-32">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>{t("pages.about.eyebrow")}</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[18ch]">
          {t("pages.about.h1a")}{" "}
          <span className="italic text-heading-accent">{t("pages.about.h1b")}</span> {t("pages.about.h1c")}
        </h1>
        <p
          data-reveal
          className="mt-10 max-w-[62ch] text-lg text-[var(--color-fg-muted)] leading-relaxed"
        >
          {t("pages.about.lead")}
        </p>
      </section>

      {/* Brand story: what the name means */}
      <section className="container-edge border-t border-[var(--color-line)] py-20 md:py-28">
        <div className="grid grid-cols-12 gap-6 md:gap-10">
          <div className="col-span-12 md:col-span-4">
            <div className="eyebrow text-[var(--color-fg-muted)] mb-6">{t("pages.about.brand.eyebrow")}</div>
            <h2 className="heading-md text-[var(--color-fg)]">{t("pages.about.brand.title")}</h2>
            <p className="mt-4 text-[var(--color-fg-muted)] leading-relaxed max-w-[36ch]">{t("pages.about.brand.body")}</p>
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="grid sm:grid-cols-2 gap-px bg-[var(--color-line)] border border-[var(--color-line)]">
              {t("pages.about.brand.parts").map((p) => (
                <div key={p.k} data-reveal className="bg-[var(--color-bg)] p-6 md:p-8">
                  <div className="font-display text-[clamp(3rem,7vw,5.5rem)] leading-none tracking-[-0.03em] text-[var(--color-accent)]">
                    {p.k}
                  </div>
                  <div className="mt-5 font-display text-lg md:text-xl text-[var(--color-fg)]">{p.t}</div>
                  <p className="mt-2 text-sm text-[var(--color-fg-muted)] leading-relaxed">{p.d}</p>
                </div>
              ))}
            </div>
            <blockquote data-reveal className="mt-8 font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-tight tracking-[-0.02em] text-[var(--color-fg)]">
              “{t("pages.about.brand.motto")}”
            </blockquote>
          </div>
        </div>
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
            <div className="eyebrow text-[var(--color-fg-muted)] mb-6">{t("pages.about.howEyebrow")}</div>
            <h2 className="heading-md text-[var(--color-fg)]">
              {t("pages.about.valuesA")}{" "}
              <span className="italic text-heading-accent">{t("pages.about.valuesB")}</span>.
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
        <div className="eyebrow mb-10 text-[var(--color-fg-muted)]">{t("pages.about.timelineEyebrow")}</div>
        <ol className="flex flex-col">
          {timeline.map((row) => (
            <li
              key={row.year}
              data-reveal
              className="grid grid-cols-12 gap-6 border-t border-[var(--color-line)] py-8"
            >
              <span className="col-span-3 md:col-span-2 font-mono text-[var(--color-accent)]">
                {row.year}
              </span>
              <span className="col-span-9 md:col-span-10 font-display text-xl md:text-2xl leading-[1.2] tracking-[-0.02em] text-[var(--color-fg)]">
                {row.event}
              </span>
            </li>
          ))}
          <li className="border-t border-[var(--color-line)]" />
        </ol>
      </section>

      {/* Team */}
      {team?.length > 0 && (
        <section className="container-edge border-t border-[var(--color-line)] py-24 md:py-32">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <div className="eyebrow text-[var(--color-fg-muted)] mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
                <span>{t("pages.about.teamEyebrow")}</span>
                <span className="font-mono text-[var(--color-accent)]">{String(team.length).padStart(2, "0")}</span>
              </div>
              <h2 className="heading-md text-[var(--color-fg)]">
                {t("pages.about.teamA")}{" "}
                <span className="italic text-heading-accent">{t("pages.about.teamB")}</span>.
              </h2>
            </div>
            <p className="max-w-[38ch] text-[var(--color-fg-muted)]">{t("pages.about.teamLead")}</p>
          </div>

          {/* Lead member */}
          <article data-reveal className="group grid grid-cols-12 gap-6 md:gap-10 items-end border-t border-[var(--color-line)] pt-8 md:pt-10">
            <TeamPhoto member={team[0]} className="col-span-12 sm:col-span-5 md:col-span-4 aspect-[4/5]" big />
            <div className="col-span-12 sm:col-span-7 md:col-span-8 flex flex-col gap-4 pb-2">
              <div className="eyebrow text-[var(--color-accent)]">01</div>
              <h3 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1] tracking-[-0.03em] text-[var(--color-fg)]">
                {team[0].name}
              </h3>
              <div className="text-base md:text-lg text-[var(--color-fg)]">{team[0].role}</div>
              {team[0].bio ? <p className="max-w-[56ch] text-[var(--color-fg-muted)] leading-relaxed">{team[0].bio}</p> : null}
              <MemberSocials socials={team[0].socials} />
            </div>
          </article>

          {/* Everyone else */}
          {team.length > 1 && (
            <ul className="mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12 md:gap-x-6">
              {team.slice(1).map((m, i) => (
                <li key={m.id ?? m.name} data-reveal className="group flex flex-col">
                  <TeamPhoto member={m} className="aspect-[4/5]" />
                  <div className="mt-4 flex items-baseline gap-3">
                    <span className="font-mono text-[11px] text-[var(--color-accent)]">{String(i + 2).padStart(2, "0")}</span>
                    <h3 className="font-display text-lg md:text-xl leading-tight tracking-[-0.02em] text-[var(--color-fg)]">{m.name}</h3>
                  </div>
                  <div className="mt-1 text-sm text-[var(--color-fg-muted)]">{m.role}</div>
                  {m.bio ? <p className="mt-2 text-sm leading-relaxed text-[var(--color-fg-muted)] line-clamp-3">{m.bio}</p> : null}
                  <MemberSocials socials={m.socials} small />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* CTA */}
      {beforeCta}
      <section className="container-edge border-t border-[var(--color-line)] py-24 md:py-32 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
        <h2 className="heading-md text-[var(--color-fg)] max-w-[22ch]">
          {t("pages.about.ctaTitle")}
        </h2>
        <Link
          href="/contact"
          data-cursor="hover"
          className="inline-flex items-center gap-3 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-4 rounded-full hover:bg-[var(--color-accent-hover)] transition-colors"
        >
          {t("common.startProject")}
          <span aria-hidden>→</span>
        </Link>
      </section>
    </div>
  );
}

function initialsOf(name) {
  return String(name || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function TeamPhoto({ member, className = "", big = false }) {
  const img = member.image_url || member.thumbnail_url;
  return (
    <div className={`relative overflow-hidden rounded-sm border border-[var(--color-line)] bg-[var(--color-bg-soft)] ${className}`}>
      {img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={img}
          alt={member.name}
          loading={big ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover grayscale-[30%] transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:grayscale-0 group-hover:scale-[1.03]"
        />
      ) : (
        <span aria-hidden className={`absolute inset-0 flex items-center justify-center font-display text-[var(--color-fg-muted)] ${big ? "text-6xl" : "text-4xl"}`}>
          {initialsOf(member.name)}
        </span>
      )}
      {member.video_url ? (
        <a
          href={member.video_url}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 left-3 rounded-full bg-[var(--color-bg)] text-[var(--color-fg)] text-xs px-3 py-1.5 border border-[var(--color-line)] hover:border-[var(--color-accent)]"
        >
          ▶ Intro
        </a>
      ) : null}
    </div>
  );
}

function MemberSocials({ socials, small = false }) {
  const links = getSocialLinkEntries(socials);
  if (!links.length) return null;
  return (
    <div className={`flex flex-wrap gap-x-4 gap-y-1 ${small ? "mt-3 text-xs" : "mt-1 text-sm"}`}>
      {links.map((l) => (
        <a
          key={l.key}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-grow text-[var(--color-fg)] hover:text-[var(--color-accent)] transition-colors"
          data-cursor="hover"
        >
          {l.label} ↗
        </a>
      ))}
    </div>
  );
}
