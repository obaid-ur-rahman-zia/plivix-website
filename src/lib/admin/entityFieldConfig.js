/**
 * CMS field definitions aligned with supabase/migrations content tables.
 * `lines` = string[] stored as newline-separated in the form.
 * `json` = object in DB (e.g. team.socials) edited as JSON text.
 * `social_links` = object in DB; form uses a JSON string of rows (see socialLinksForm.js).
 */

import { formStringToSocialsObject, socialsObjectToFormString } from "@/lib/admin/socialLinksForm";

export const ENTITIES = ["services", "projects", "team", "testimonials", "stats", "internships"];

/**
 * @typedef {object} FieldDef
 * @property {string} key
 * @property {string} label
 * @property {'string'|'text'|'number'|'boolean'|'lines'|'json'|'url'|'social_links'} type
 * @property {boolean} [required]
 * @property {string} [hint]
 * @property {boolean} [media] — show upload control (fills URL or appends to lines)
 * @property {boolean} [mediaAppend] — for `lines`: append uploaded URL as a new line
 * @property {string} [accept] — `<input accept>` e.g. `image/*` or `video/*`
 * @property {'image' | 'gallery'} [preview] — show thumbnail preview in CMS (projects media)
 * @property {number} [cropAspect] — width÷height for crop UI before upload (e.g. 1 square, 16/9 hero)
 */

/** @type {Record<string, FieldDef[]>} */
export const ENTITY_FIELDS = {
  services: [
    { key: "slug", label: "Slug (URL)", type: "string", required: true },
    { key: "title", label: "Title", type: "string", required: true },
    { key: "tagline", label: "Tagline", type: "string" },
    { key: "category", label: "Category", type: "string", required: true },
    { key: "description", label: "Description", type: "text" },
    { key: "features", label: "Features", type: "lines", hint: "One bullet per line" },
    { key: "tech_stack", label: "Tech stack", type: "lines", hint: "One item per line" },
    { key: "icon_name", label: "Icon name (lucide id)", type: "string" },
    {
      key: "image_url",
      label: "Image URL",
      type: "url",
      media: true,
      hint: "Main image (or upload)",
    },
    {
      key: "thumbnail_url",
      label: "Thumbnail URL",
      type: "url",
      media: true,
      accept: "image/*",
      hint: "Smaller preview image (or upload)",
    },
    {
      key: "video_url",
      label: "Video URL",
      type: "url",
      media: true,
      accept: "video/*,image/*",
      hint: "Direct .mp4/.webm or hosted URL (or upload)",
    },
    { key: "order_index", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  projects: [
    {
      key: "slug",
      label: "Slug",
      type: "string",
      required: true,
      hint: "URL segment: /portfolio/your-slug. Uploads are stored under projects/your-slug/ in Supabase.",
    },
    { key: "title", label: "Title", type: "string", required: true },
    { key: "client", label: "Client", type: "string" },
    { key: "category", label: "Category", type: "string", required: true },
    {
      key: "cover_url",
      label: "Cover image",
      type: "url",
      media: true,
      accept: "image/*",
      preview: "image",
      hint: "Hero image on the case study page. Upload stores file in Supabase (site-media → projects/…).",
    },
    {
      key: "thumbnail_url",
      label: "Thumbnail",
      type: "url",
      media: true,
      accept: "image/*",
      preview: "image",
      hint: "Smaller image for homepage cards; falls back to cover if empty.",
    },
    {
      key: "gallery_urls",
      label: "Gallery images",
      type: "lines",
      hint: "One image URL per line. Upload appends; files go to Supabase storage.",
      media: true,
      mediaAppend: true,
      accept: "image/*",
      preview: "gallery",
    },
    {
      key: "video_urls",
      label: "Video URLs",
      type: "lines",
      hint: "One video URL per line (e.g. .mp4 or embed). Upload appends.",
      media: true,
      mediaAppend: true,
      accept: "video/*,image/*",
    },
    { key: "description", label: "Description", type: "text" },
    { key: "tech_stack", label: "Tech stack", type: "lines" },
    { key: "year", label: "Year", type: "number" },
    {
      key: "live_url",
      label: "Project link",
      type: "url",
      hint: "Live site, demo, repo, or app store — opens in a new tab from the homepage when set.",
    },
    { key: "order_index", label: "Sort order", type: "number" },
    { key: "featured", label: "Featured", type: "boolean" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  team: [
    { key: "name", label: "Name", type: "string", required: true },
    { key: "role", label: "Role", type: "string", required: true },
    { key: "bio", label: "Bio", type: "text" },
    {
      key: "image_url",
      label: "Photo URL",
      type: "url",
      media: true,
      accept: "image/*",
      preview: "image",
      cropAspect: 1,
      hint: "Main photo — crop to square, then preview below.",
    },
    {
      key: "thumbnail_url",
      label: "Thumbnail URL",
      type: "url",
      media: true,
      accept: "image/*",
      preview: "image",
      cropAspect: 1,
      hint: "Optional smaller headshot — square crop.",
    },
    {
      key: "video_url",
      label: "Intro video URL",
      type: "url",
      media: true,
      accept: "video/*",
      hint: "Optional short clip (.mp4)",
    },
    {
      key: "socials",
      label: "Social links",
      type: "social_links",
      hint: "Add one row per profile. Choose Other for a custom key (e.g. dribbble).",
    },
    { key: "order_index", label: "Sort order", type: "number" },
    { key: "active", label: "Active", type: "boolean" },
  ],
  testimonials: [
    { key: "author", label: "Author", type: "string", required: true },
    { key: "role", label: "Role", type: "string" },
    { key: "company", label: "Company", type: "string" },
    { key: "quote", label: "Quote", type: "text", required: true },
    { key: "avatar_url", label: "Avatar URL", type: "url" },
    { key: "order_index", label: "Sort order", type: "number" },
    { key: "published", label: "Published", type: "boolean" },
  ],
  stats: [
    { key: "label", label: "Label", type: "string", required: true },
    { key: "value", label: "Value", type: "number", required: true },
    { key: "suffix", label: "Suffix (e.g. +, %)", type: "string" },
    { key: "order_index", label: "Sort order", type: "number" },
  ],
  internships: [
    { key: "title", label: "Title", type: "string", required: true },
    { key: "description", label: "Description", type: "text" },
    { key: "duration", label: "Duration", type: "string" },
    { key: "skills", label: "Skills", type: "lines", hint: "One per line" },
    { key: "order_index", label: "Sort order", type: "number" },
    { key: "is_active", label: "Active", type: "boolean" },
  ],
};

/** Row → plain object for form (arrays → newline text, json → string) */
export function rowToFormValues(entity, row) {
  const fields = ENTITY_FIELDS[entity];
  if (!fields || !row) return {};
  const out = {};
  for (const f of fields) {
    const v = row[f.key];
    if (f.type === "lines") {
      out[f.key] = Array.isArray(v) ? v.join("\n") : "";
    } else if (f.type === "social_links") {
      out[f.key] = socialsObjectToFormString(v);
    } else if (f.type === "json") {
      out[f.key] = v && typeof v === "object" ? JSON.stringify(v, null, 2) : "{}";
    } else if (f.type === "boolean") {
      out[f.key] = Boolean(v);
    } else if (f.type === "number") {
      out[f.key] = v === null || v === undefined ? "" : String(v);
    } else {
      out[f.key] = v === null || v === undefined ? "" : String(v);
    }
  }
  return out;
}

/** Form values → API payload (parse lines, json, numbers) */
export function formValuesToPayload(entity, values) {
  const fields = ENTITY_FIELDS[entity];
  const payload = {};
  for (const f of fields) {
    let raw = values[f.key];
    if (f.type === "lines") {
      const lines = String(raw || "")
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
      payload[f.key] = lines;
    } else if (f.type === "social_links") {
      try {
        payload[f.key] = formStringToSocialsObject(String(raw ?? ""));
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : "Invalid social links");
      }
    } else if (f.type === "json") {
      try {
        payload[f.key] = JSON.parse(String(raw || "{}"));
      } catch {
        throw new Error(`Invalid JSON for ${f.label}`);
      }
    } else if (f.type === "boolean") {
      payload[f.key] = Boolean(raw);
    } else if (f.type === "number") {
      const s = String(raw ?? "").trim();
      if (s === "") {
        payload[f.key] = null;
      } else {
        const n = Number(s);
        if (Number.isNaN(n)) throw new Error(`${f.label} must be a number`);
        payload[f.key] = n;
      }
    } else {
      const s = String(raw ?? "").trim();
      payload[f.key] = s === "" ? null : s;
    }
  }
  return payload;
}

export function emptyDefaults(entity) {
  const base = {
    services: {
      slug: "new-service",
      title: "New service",
      tagline: "",
      category: "Engineering",
      description: "",
      features: [],
      tech_stack: [],
      icon_name: "code",
      image_url: null,
      thumbnail_url: null,
      video_url: null,
      order_index: 0,
      published: true,
    },
    projects: {
      slug: "new-project",
      title: "New project",
      client: "",
      category: "Case study",
      cover_url: null,
      thumbnail_url: null,
      gallery_urls: [],
      video_urls: [],
      description: "",
      tech_stack: [],
      year: new Date().getFullYear(),
      live_url: null,
      order_index: 0,
      featured: false,
      published: true,
    },
    team: {
      name: "Name",
      role: "Role",
      bio: "",
      image_url: null,
      thumbnail_url: null,
      video_url: null,
      socials: {},
      order_index: 0,
      active: true,
    },
    testimonials: {
      author: "Author",
      role: "",
      company: "",
      quote: "",
      avatar_url: null,
      order_index: 0,
      published: true,
    },
    stats: {
      label: "Metric",
      value: 0,
      suffix: "",
      order_index: 0,
    },
    internships: {
      title: "Internship",
      description: "",
      duration: "",
      skills: [],
      order_index: 0,
      is_active: true,
    },
  };
  return base[entity] ? { ...base[entity] } : {};
}
