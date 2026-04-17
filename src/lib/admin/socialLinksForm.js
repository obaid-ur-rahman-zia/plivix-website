/**
 * CMS form ↔ DB jsonb `socials` object { linkedin: "https://...", x: "..." }.
 * Form stores a JSON string of row objects for FieldInput state.
 */

const PRESET_KEYS = new Set(["linkedin", "x", "github", "instagram", "website"]);

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `r-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** @param {Record<string, unknown> | null | undefined} obj */
export function socialsObjectToFormString(obj) {
  const rows = [];
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    const entries = Object.entries(obj);
    if (entries.length === 0) {
      rows.push({ id: newId(), key: "linkedin", url: "", customKey: "" });
    } else {
      for (const [k, v] of entries) {
        const url = String(v ?? "").trim();
        const key = PRESET_KEYS.has(k) ? k : "custom";
        rows.push({
          id: newId(),
          key,
          url,
          customKey: key === "custom" ? k : "",
        });
      }
    }
  } else {
    rows.push({ id: newId(), key: "linkedin", url: "", customKey: "" });
  }
  return JSON.stringify(rows);
}

/** @param {string} str */
export function formStringToSocialsObject(str) {
  let rows;
  try {
    rows = JSON.parse(String(str || "[]"));
  } catch {
    throw new Error("Invalid social links data");
  }
  if (!Array.isArray(rows)) throw new Error("Invalid social links data");

  /** @type {Record<string, string>} */
  const out = {};
  for (const r of rows) {
    const url = String(r?.url ?? "").trim();
    if (!url) continue;
    let objectKey =
      r?.key === "custom"
        ? String(r?.customKey ?? "")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_")
            .replace(/^_+|_+$/g, "")
        : String(r?.key ?? "").trim();
    if (!objectKey) continue;
    out[objectKey] = url;
  }
  return out;
}
