import Link from "next/link";
import { getActiveInternships, getSiteSettings } from "@/lib/supabase/queries";

export const revalidate = 3600;

export const metadata = {
  title: "Careers — Plivix Technologies",
  description:
    "Internship and apprenticeship roles at Plivix Technologies across full-stack, AI/ML and data engineering.",
};

export default async function InternshipsPage() {
  const [roles, site] = await Promise.all([getActiveInternships(), getSiteSettings()]);
  const applyEmail = site.contact_email?.trim() || "hello@plivix-tech.com";

  return (
    <div className="section-gradient pt-32 md:pt-40">
      <section className="section-gradient-alt container-edge pb-20 md:pb-32">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>Careers</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[18ch]">
          Learn by{" "}
          <span className="italic text-heading-accent">shipping</span>.
        </h1>
        <p className="mt-10 max-w-[60ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          Our internships are scoped slices of real client engagements. You will
          write production code, pair with senior engineers, and ship features
          to users — not tutorial exercises.
        </p>
      </section>

      <section className="section-gradient-warm container-edge pb-32 md:pb-48">
        {roles.length === 0 ? (
          <div className="border-t border-[var(--color-line)] py-24 text-center text-[var(--color-fg-muted)]">
            No open roles right now. Check back soon.
          </div>
        ) : (
          roles.map((r, i) => (
            <article
              key={r.title}
              className="grid grid-cols-12 gap-6 md:gap-10 border-t border-[var(--color-line)] py-12 md:py-16"
            >
              <div className="col-span-12 md:col-span-2 eyebrow text-[var(--color-fg-muted)]">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                <h2 className="font-display text-[clamp(2rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.03em] text-[var(--color-fg)]">
                  {r.title}
                </h2>
                <p className="max-w-[62ch] text-[var(--color-fg-muted)] text-lg leading-relaxed">
                  {r.description}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 eyebrow text-[var(--color-fg-muted)]">
                  <span>{r.duration}</span>
                  <span>·</span>
                  {r.skills?.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                <div className="pt-2">
                  <Link
                    href="/contact"
                    data-cursor="hover"
                    className="underline-grow text-[var(--color-fg)]"
                  >
                    Apply → {applyEmail}
                  </Link>
                </div>
              </div>
            </article>
          ))
        )}
        <div className="border-t border-[var(--color-line)]" />
      </section>
    </div>
  );
}
