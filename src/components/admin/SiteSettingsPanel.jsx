"use client";

import { useCallback, useEffect, useState } from "react";
import { formStringToSocialsObject, socialsObjectToFormString } from "@/lib/admin/socialLinksForm";
import SocialLinksField from "./SocialLinksField";

const base =
  "w-full rounded-xl border border-[var(--color-line)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]";

const socialFieldDef = {
  key: "socials",
  label: "Social & profile links",
  type: "social_links",
  hint: "Shown in the footer, mobile menu, and SEO (sameAs) where applicable.",
};

export default function SiteSettingsPanel() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [contact_email, setContactEmail] = useState("");
  const [address, setAddress] = useState("");
  const [location_tagline, setLocationTagline] = useState("");
  const [hours, setHours] = useState("");
  const [socialsForm, setSocialsForm] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/site-settings", { credentials: "include" });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Failed to load");
      const row = j.data;
      if (!row) throw new Error("No data");
      setContactEmail(row.contact_email ?? "");
      setAddress(row.address ?? "");
      setLocationTagline(row.location_tagline ?? "");
      setHours(row.hours ?? "");
      setSocialsForm(socialsObjectToFormString(row.socials));
    } catch (e) {
      setError(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setSocials = useCallback((key, val) => {
    if (key === "socials") setSocialsForm(val);
  }, []);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      let socials;
      try {
        socials = formStringToSocialsObject(socialsForm);
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : "Invalid social links");
      }
      const res = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_email: contact_email.trim() || null,
          address: address.trim() || null,
          location_tagline: location_tagline.trim() || null,
          hours: hours.trim() || null,
          socials,
        }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Save failed");
      await load();
    } catch (e) {
      setError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-[var(--color-fg-muted)]">Loading site settings…</p>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-[var(--color-line)] bg-[var(--color-bg-elev)] p-5 md:p-6 space-y-5">
        <h2 className="font-display text-lg text-[var(--color-fg)]">Contact &amp; visibility</h2>
        <p className="text-xs text-[var(--color-fg-muted)]">
          Updates the footer, contact page, mobile menu social row, and structured data (sameAs).
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs font-medium text-[var(--color-fg-muted)]">Contact email</label>
            <input
              type="email"
              value={contact_email}
              onChange={(e) => setContactEmail(e.target.value)}
              className={base}
              placeholder="contact@plivix-tech.com"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="block text-xs font-medium text-[var(--color-fg-muted)]">Address (optional)</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className={`${base} resize-y min-h-[72px]`}
              placeholder="Street, city, country — multiline OK"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-fg-muted)]">Location line</label>
            <input
              type="text"
              value={location_tagline}
              onChange={(e) => setLocationTagline(e.target.value)}
              className={base}
              placeholder="e.g. Remote · Global"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-xs font-medium text-[var(--color-fg-muted)]">Hours</label>
            <input
              type="text"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className={base}
              placeholder="Mon – Fri · 9–5"
            />
          </div>
        </div>

        <SocialLinksField
          fieldKey={socialFieldDef.key}
          label={socialFieldDef.label}
          hint={socialFieldDef.hint}
          value={socialsForm}
          onChange={setSocials}
        />

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={save}
            className="rounded-full bg-[var(--color-accent)] text-[var(--color-on-accent)] px-6 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save site settings"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={load}
            className="rounded-full border border-[var(--color-line)] px-6 py-2.5 text-sm text-[var(--color-fg-muted)]"
          >
            Reload
          </button>
        </div>
      </div>
    </div>
  );
}
