"use client";

import { useEffect, useMemo, useState } from "react";
import emailjs from "emailjs-com";
import { useSiteSettings } from "@/components/SiteSettingsContext";
import { useI18n } from "@/components/I18nProvider";

const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_h5px9eg";
const EMAILJS_TEMPLATE_OWNER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_OWNER || "template_s7qxn9l";
const EMAILJS_TEMPLATE_SENDER = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_SENDER || "template_4rnbj33";
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "fnuDw7BBMoDaMZA6t";

export default function ContactPage() {
  const site = useSiteSettings();
  const { t } = useI18n();
  const SERVICE_OPTIONS = t("contact.serviceOpts");
  const BUDGETS = t("contact.budgetOpts");
  const contactMethods = useMemo(() => {
    const email = site.contact_email?.trim() || "contact@plivix-tech.com";
    const hours = site.hours?.trim() || t("loc.hours");
    const locLine = site.location_tagline?.trim() || t("loc.tagline");
    const addr = site.address?.trim();
    const locationValue = addr ? `${locLine}\n\n${addr}` : locLine;
    return [
      { label: t("contact.email"), value: email, href: `mailto:${email}` },
      { label: t("contact.hours"), value: hours },
      { label: t("contact.location"), value: locationValue },
    ];
  }, [site, t]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    budget: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState({ loading: false, submitted: false, error: null });

  // Prefill from ?service=erp / ?plan=erp-suite links on the site.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const plan = q.get("plan");
    const svc = q.get("service");
    const idx = svc === "erp" || plan === "erp-suite" || plan === "enterprise" ? 0 : plan === "website" ? 1 : plan === "app" ? 3 : -1;
    if (idx >= 0) setFormData((d) => (d.service ? d : { ...d, service: SERVICE_OPTIONS[idx] }));
    if (plan) setFormData((d) => (d.message ? d : { ...d, message: `[Plan: ${plan}]
` }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setStatus({ loading: false, submitted: false, error: t("contact.error") });
    }
  };

  return (
    <div className="section-gradient pt-32 md:pt-40">
      <section className="section-gradient-alt container-edge pb-16 md:pb-24">
        <div className="eyebrow mb-6 flex items-center gap-3">
          <span className="w-8 h-px bg-[var(--color-fg-muted)]" />
          <span>{t("contact.eyebrow")}</span>
        </div>
        <h1 className="heading-xl text-[var(--color-fg)] max-w-[18ch]">
          {t("contact.h1a")}{" "}
          <span className="italic text-heading-accent">{t("contact.h1b")}</span>.
        </h1>
        <p className="mt-10 max-w-[56ch] text-lg text-[var(--color-fg-muted)] leading-relaxed">
          {t("contact.lead")}
        </p>
      </section>

      <section className="section-gradient-warm container-edge pb-32 md:pb-48 border-t border-[var(--color-line)] pt-16 md:pt-24">
        <div className="grid grid-cols-12 gap-10 md:gap-16">
          {/* Form */}
          <div className="col-span-12 md:col-span-8">
            {status.submitted ? (
              <div className="border border-[var(--color-line-strong)] rounded-lg p-10 text-center">
                <div className="font-display text-3xl md:text-4xl text-[var(--color-fg)] mb-4">
                  {t("contact.sent")}
                </div>
                <p className="text-[var(--color-fg-muted)]">
                  {t("contact.sentText")}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label={t("contact.name")}
                    name="name"
                    value={formData.name}
                    onChange={onChange}
                    required
                  />
                  <Field
                    label={t("contact.email")}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field
                    label={t("contact.company")}
                    name="company"
                    value={formData.company}
                    onChange={onChange}
                  />
                  <div className="flex flex-col gap-2">
                    <label className="eyebrow text-[var(--color-fg-muted)]">
                      {t("contact.service")}
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={onChange}
                      className="bg-transparent border-b border-[var(--color-line-strong)] text-[var(--color-fg)] py-3 outline-none focus:border-[var(--color-accent)] transition-colors"
                    >
                      <option value="" className="bg-[var(--color-bg)]">
                        {t("contact.select")}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label={t("contact.phone")} name="phone" type="tel" value={formData.phone} onChange={onChange} />
                  <div className="flex flex-col gap-2">
                    <label className="eyebrow text-[var(--color-fg-muted)]">{t("contact.budget")}</label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={onChange}
                      className="bg-transparent border-b border-[var(--color-line-strong)] text-[var(--color-fg)] py-3 outline-none focus:border-[var(--color-accent)] transition-colors"
                    >
                      <option value="" className="bg-[var(--color-bg)]">{t("contact.select")}</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b} className="bg-[var(--color-bg)]">{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="eyebrow text-[var(--color-fg-muted)]">
                    {t("contact.message")}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={onChange}
                    rows={6}
                    required
                    className="bg-transparent border-b border-[var(--color-line-strong)] text-[var(--color-fg)] py-3 outline-none focus:border-[var(--color-accent)] transition-colors resize-none"
                    placeholder={t("contact.placeholder")}
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
                    {status.loading ? t("contact.sending") : t("contact.send")}
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
                {t("contact.direct")}
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
                {t("contact.next")}
              </div>
              <ol className="flex flex-col gap-3 text-sm text-[var(--color-fg)]">
                {t("contact.steps").map((st, i) => (
                  <li key={st}>
                    <span className="text-[var(--color-accent)] font-mono mr-2">{String(i + 1).padStart(2, "0")}</span>
                    {st}
                  </li>
                ))}
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
