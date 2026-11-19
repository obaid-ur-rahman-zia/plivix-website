/**
 * Display order + labels for `site_settings.socials` keys (footer, menu).
 */

/**
 * Every social / profile platform the CMS offers, in display order.
 * The CMS dropdown, the form parser and the footer/menu all read this list.
 */
export const SOCIAL_PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", placeholder: "https://www.linkedin.com/company/…" },
  { key: "facebook", label: "Facebook", placeholder: "https://www.facebook.com/…" },
  { key: "instagram", label: "Instagram", placeholder: "https://www.instagram.com/…" },
  { key: "tiktok", label: "TikTok", placeholder: "https://www.tiktok.com/@…" },
  { key: "youtube", label: "YouTube", placeholder: "https://www.youtube.com/@…" },
  { key: "x", label: "X / Twitter", placeholder: "https://x.com/…" },
  { key: "threads", label: "Threads", placeholder: "https://www.threads.net/@…" },
  { key: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/8801XXXXXXXXX" },
  { key: "telegram", label: "Telegram", placeholder: "https://t.me/…" },
  { key: "messenger", label: "Messenger", placeholder: "https://m.me/…" },
  { key: "pinterest", label: "Pinterest", placeholder: "https://www.pinterest.com/…" },
  { key: "snapchat", label: "Snapchat", placeholder: "https://www.snapchat.com/add/…" },
  { key: "reddit", label: "Reddit", placeholder: "https://www.reddit.com/user/…" },
  { key: "discord", label: "Discord", placeholder: "https://discord.gg/…" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/…" },
  { key: "gitlab", label: "GitLab", placeholder: "https://gitlab.com/…" },
  { key: "behance", label: "Behance", placeholder: "https://www.behance.net/…" },
  { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/…" },
  { key: "medium", label: "Medium", placeholder: "https://medium.com/@…" },
  { key: "upwork", label: "Upwork", placeholder: "https://www.upwork.com/…" },
  { key: "fiverr", label: "Fiverr", placeholder: "https://www.fiverr.com/…" },
  { key: "clutch", label: "Clutch", placeholder: "https://clutch.co/profile/…" },
  { key: "google_business", label: "Google Business", placeholder: "https://g.page/…" },
  { key: "website", label: "Website", placeholder: "https://…" },
];

const ORDER = SOCIAL_PLATFORMS.map((p) => p.key);
const LABELS = Object.fromEntries(SOCIAL_PLATFORMS.map((p) => [p.key, p.label]));

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
