/**
 * Display order + labels for `site_settings.socials` keys (footer, menu).
 */

const ORDER = ["linkedin", "instagram", "x", "upwork", "github", "youtube", "website"];

const LABELS = {
  linkedin: "LinkedIn",
  instagram: "Instagram",
  x: "X / Twitter",
  upwork: "Upwork",
  github: "GitHub",
  youtube: "YouTube",
  website: "Website",
};

/** @param {Record<string, string> | null | undefined} socials */
export function getSocialLinkEntries(socials) {
  if (!socials || typeof socials !== "object") return [];
  const keys = Object.keys(socials).filter((k) => String(socials[k] ?? "").trim());
  const ordered = ORDER.filter((k) => keys.includes(k));
  const rest = keys.filter((k) => !ORDER.includes(k));
  const all = [...ordered, ...rest];
  return all.map((key) => ({
    key,
    label: LABELS[key] || capitalizeKey(key),
    href: String(socials[key]).trim(),
  }));
}

function capitalizeKey(key) {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Values for JSON-LD `sameAs` */
export function sameAsFromSocials(socials) {
  return getSocialLinkEntries(socials)
    .map((e) => e.href)
    .filter(Boolean);
}
