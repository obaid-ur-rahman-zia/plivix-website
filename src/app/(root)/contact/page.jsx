"use client";

import { useMemo, useState } from "react";
import emailjs from "emailjs-com";
import { useSiteSettings } from "@/components/SiteSettingsContext";

const SERVICE_OPTIONS = [
  "Full-Stack Web",
  "Application Development",
  "AI Automation",
  "Machine Learning",
  "Data Science",
  "Other",
];

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_h5px9eg";
const EMAILJS_TEMPLATE_OWNER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER || "template_s7qxn9l";
const EMAILJS_TEMPLATE_SENDER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_SENDER || "template_4rnbj33";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "fnuDw7BBMoDaMZA6t";

export default function ContactPage() {
  const site = useSiteSettings();
  const contactMethods = useMemo(() => {
    const email = site.contact_email?.trim() || "hello@plivix-tech.com";
    const hours = site.hours?.trim() || "Mon – Sat · 8:00 – 17:00 UTC+5";
    const locLine = site.location_tagline?.trim() || "Remote · Global";
    const addr = site.address?.trim();
    const locationValue = addr ? `${locLine}\n\n${addr}` : locLine;
    return [
      { label: "Email", value: email, href: `mailto:${email}` },
      { label: "Hours", value: hours },
      { label: "Location", value: locationValue },
    ];
  }, [site]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, submitted: false, error: null });

  const onChange = (e) => {
    setFormData((d) => ({ ...d, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus({ loading: true, submitted: false, error: null });
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_OWNER,
        formData,
        EMAILJS_PUBLIC_KEY
      );
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_SENDER,
        {
          name: formData.name,
          email: formData.email,
          title: formData.service,
        },
        EMAILJS_PUBLIC_KEY
      );
      setStatus({ loading: false, submitted: true, error: null });
    } catch (error) {
      setStatus({ loading: false, submitted: false, error: "Something went wrong. Please email us directly." });
    }
  };

  return (
    <div className="section-gradient pt-32 md:pt-40">
      <section className="section-gradient-alt container-edge pb-16 md:pb-24">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>Contact</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[18ch]">
          Tell us what you want to{" "}
          <span className="italic text-heading-accent">build</span>.
        </h1>
        <p className="mt-10 max-w-[56ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          We reply within one business day — usually faster. Share what you
          know, we&apos;ll fill in the rest.
        </p>
      </section>

      <section className="section-gradient-warm container-edge pb-32 md:pb-48 border-t border-[var(--color-line)] pt-16 md:pt-24">
        <div className="grid grid-cols-12 gap-10 md:gap-16">
          {/* Form */}
          <div className="col-span-12 md:col-span-8">
            {status.submitted ? (
              <div className="border border-[var(--color-line-strong)] rounded-lg p-10 text-center">
                <div className="font-display text-3xl md:text-4xl text-[var(--color-fg)] mb-4">
                  Message sent.
                </div>
                <p className="text-[var(--color-fg-muted)]">
                  We&apos;ll be in touch within one business day.
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label="Company (optional)"
                    name="company"
                    value={formData.company}
                    onChange={onChange}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="eyebrow text-[var(--color-fg-muted)]">
                      Service
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={onChange}
                      className="bg-transparent border-b border-[var(--color-line-strong)] text-[var(--color-fg)] py-3 outline-none focus:border-[var(--color-accent)] transition-colors"
                    >
                      <option value="" className="bg-[var(--color-bg)]">
                        — select —
                      </option>
                      {SERVICE_OPTIONS.map((s) => (
                        <option
                          key={s}
                          value={s}
                          className="bg-[var(--color-bg)]"
                        >
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-[var(--color-fg-muted)]">
                    Tell us about your project
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={onChange}
                    rows={6}
                    required
                    className="bg-transparent border-b border-[var(--color-line-strong)] text-[var(--color-fg)] py-3 outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                    placeholder="What are you building? Timeline? Constraints?"
                  />
                </div>

                {status.error && (
                  <div className="text-sm text-red-400">{status.error}</div>
                )}

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={status.loading}
                    data-cursor="hover"
                    className="inline-flex items-center gap-3 bg-[var(--color-accent)] text-[var(--color-on-accent)] px-8 py-4 rounded-full hover:bg-[var(--color-accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  >
                    {status.loading ? "Sending…" : "Send message"}
                    <span aria-hidden>→</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Contact info */}
          <aside className="col-span-12 md:col-span-4 flex flex-col gap-10">
            <div>
              <div className="eyebrow text-[var(--color-fg-muted)] mb-6">
                Direct
              </div>
              <ul className="flex flex-col gap-5">
                {contactMethods.map((m) => (
                  <li key={m.label} className="border-t border-[var(--color-line)] pt-4">
                    <div className="eyebrow text-[var(--color-fg-muted)] mb-1">
                      {m.label}
                    </div>
                    {m.href ? (
                      <a
                        href={m.href}
                        data-cursor="hover"
                        className="text-[var(--color-fg)] underline-grow"
                      >
                        {m.value}
                      </a>
                    ) : (
                      <span className="text-[var(--color-fg)] whitespace-pre-line">
                        {m.value}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-[var(--color-line)] pt-6">
              <div className="eyebrow text-[var(--color-fg-muted)] mb-3">
                What happens next
              </div>
              <ol className="flex flex-col gap-3 text-sm text-[var(--color-fg)]">
                <li>
                  <span className="text-[var(--color-accent)] font-mono mr-2">
                    01
                  </span>
                  Intro call within one business day.
                </li>
                <li>
                  <span className="text-[var(--color-accent)] font-mono mr-2">
                    02
                  </span>
                  Scoping doc + fixed-price proposal in 3–5 days.
                </li>
                <li>
                  <span className="text-[var(--color-accent)] font-mono mr-2">
                    03
                  </span>
                  Kick-off within the week if it&apos;s a fit.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, required }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="eyebrow text-[var(--color-fg-muted)]">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="bg-transparent border-b border-[var(--color-line-strong)] text-[var(--color-fg)] py-3 outline-none focus:border-[var(--color-accent)] transition-colors"
      />
    </div>
  );
}
