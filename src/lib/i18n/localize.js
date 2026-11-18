/** Replace `field` with `field_bn` on Bengali when that translation is filled in. */
export function localizeRow(row, fields, locale) {
  if (locale !== "bn" || !row) return row;
  const out = { ...row };
  for (const f of fields) {
    const v = row[`${f}_bn`];
    if (Array.isArray(v) ? v.length : v) out[f] = v;
  }
  return out;
}
export const localizeRows = (rows, fields, locale) => (rows || []).map((r) => localizeRow(r, fields, locale));

export const SERVICE_FIELDS = ["title", "tagline", "description"];
export const PROJECT_FIELDS = ["title", "description"];
export const TESTIMONIAL_FIELDS = ["quote", "role", "company"];
export const PRICING_FIELDS = ["name", "tagline", "price_note", "features"];
export const FAQ_FIELDS = ["question", "answer"];
export const TEAM_FIELDS = ["role", "bio"];
