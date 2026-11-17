/**
 * Server-safe content queries.
 *
 * Strategy: try Supabase first (if env is wired up and the project is
 * healthy); otherwise gracefully fall back to the local content files
 * in src/lib/content. This keeps the site fully operational on first
 * run and lets us migrate to a live database without any call-site
 * changes.
 */

import { createClient } from "@supabase/supabase-js";

import { services as localServices } from "@/lib/content/services";
import { projects as localProjects } from "@/lib/content/projects";
import { team as localTeam } from "@/lib/content/team";
import { testimonials as localTestimonials } from "@/lib/content/testimonials";
import { stats as localStats } from "@/lib/content/stats";
import { internships as localInternships } from "@/lib/content/internships";
import { defaultSiteSettings } from "@/lib/content/siteSettings";
import { pricingPlans as localPricing } from "@/lib/content/pricing";
import { faqs as localFaqs } from "@/lib/content/faqs";

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  try {
    return createClient(url, key, {
      auth: { persistSession: false },
      // Cache CMS reads for 5 minutes in Next's data cache so every page view
      // does not hit Supabase. CMS saves call revalidateTag("cms").
      global: {
        fetch: (input, init = {}) =>
          fetch(input, { ...init, next: { revalidate: 300, tags: ["cms"] } }),
      },
    });
  } catch {
    return null;
  }
}

function sortBy(arr, field = "order_index") {
  return [...arr].sort((a, b) => (a[field] ?? 0) - (b[field] ?? 0));
}

/** Matches `id` values in `src/lib/content/stats.js` (seed upsert). */
const STAT_SEED_ID_PREFIX = "10000003-0001-4000-8000-";

function isStatSeedPlaceholder(id) {
  return typeof id === "string" && id.startsWith(STAT_SEED_ID_PREFIX);
}

/** When the DB has duplicate `order_index` rows (old seed + CMS edits), prefer the live row. */
function pickPreferredStatRow(a, b) {
  const aPh = isStatSeedPlaceholder(a.id);
  const bPh = isStatSeedPlaceholder(b.id);
  if (aPh && !bPh) return b;
  if (!aPh && bPh) return a;
  return String(a.id ?? "").localeCompare(String(b.id ?? "")) <= 0 ? a : b;
}

function dedupeStatsRows(rows) {
  if (!rows?.length) return [];
  const byOrder = new Map();
  for (const r of rows) {
    const oi = r.order_index ?? 0;
    if (!byOrder.has(oi)) {
      byOrder.set(oi, r);
      continue;
    }
    byOrder.set(oi, pickPreferredStatRow(byOrder.get(oi), r));
  }
  return sortBy([...byOrder.values()], "order_index");
}

/** Seed UUIDs in src/lib/content/team.js — prefer live CMS rows when order_index clashes. */
const TEAM_SEED_ID_PREFIX = "10000001-0001-4000-8000-";

function isTeamSeedPlaceholder(id) {
  return typeof id === "string" && id.startsWith(TEAM_SEED_ID_PREFIX);
}

function pickPreferredTeamRow(a, b) {
  const aPh = isTeamSeedPlaceholder(a.id);
  const bPh = isTeamSeedPlaceholder(b.id);
  if (aPh && !bPh) return b;
  if (!aPh && bPh) return a;
  return String(a.id ?? "").localeCompare(String(b.id ?? "")) <= 0 ? a : b;
}

function dedupeTeamRows(rows) {
  if (!rows?.length) return [];
  const byOrder = new Map();
  for (const r of sortBy(rows, "order_index")) {
    const oi = r.order_index ?? 0;
    if (!byOrder.has(oi)) {
      byOrder.set(oi, r);
      continue;
    }
    byOrder.set(oi, pickPreferredTeamRow(byOrder.get(oi), r));
  }
  return sortBy([...byOrder.values()], "order_index");
}

async function query(table, localFallback, filter = {}) {
  const client = getServerClient();
  if (!client) return sortBy(localFallback);

  try {
    let q = client.from(table).select("*").order("order_index", { ascending: true });
    for (const [k, v] of Object.entries(filter)) {
      q = q.eq(k, v);
    }
    const { data, error } = await q;
    if (error || !data || data.length === 0) return sortBy(localFallback);
    return data;
  } catch {
    return sortBy(localFallback);
  }
}

export async function getServices() {
  return query("services", localServices, { published: true });
}

export async function getFeaturedProjects() {
  const all = await query("projects", localProjects, { published: true });
  return all.filter((p) => p.featured);
}

export async function getAllProjects() {
  return query("projects", localProjects, { published: true });
}

export async function getProjectBySlug(slug) {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getServiceBySlug(slug) {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getTeam() {
  const rows = await query("team", localTeam, { active: true });
  return dedupeTeamRows(rows);
}

export async function getTestimonials() {
  return query("testimonials", localTestimonials, { published: true });
}

export async function getPricingPlans() {
  return query("pricing_plans", localPricing, { published: true });
}

export async function getFaqs() {
  return query("faqs", localFaqs, { published: true });
}

export async function getStats() {
  const rows = await query("stats", localStats);
  return dedupeStatsRows(rows);
}

export async function getActiveInternships() {
  return query("internships", localInternships, { is_active: true });
}

function mergeSiteSettings(row) {
  const socials = {
    ...defaultSiteSettings.socials,
    ...(row?.socials && typeof row.socials === "object" ? row.socials : {}),
  };
  const merged = { ...defaultSiteSettings, ...row, socials };
  // Older rows were saved with the pre-Bangladesh defaults. Treat those as
  // "unset" so the new defaults (email, bilingual location/hours) apply.
  // Anything the team has typed into the CMS since then is left alone.
  if (!merged.contact_email || merged.contact_email.trim().toLowerCase() === "hello@plivix-tech.com") {
    merged.contact_email = defaultSiteSettings.contact_email;
  }
  if (/^remote\s*[·.-]\s*global$/i.test((merged.location_tagline || "").trim())) merged.location_tagline = "";
  if (/utc\+5/i.test(merged.hours || "")) merged.hours = "";
  return merged;
}

/** Public site contact block: email, address, hours, social URLs (footer, menu, contact page). */
export async function getSiteSettings() {
  const client = getServerClient();
  if (!client) return mergeSiteSettings(null);

  try {
    const { data, error } = await client.from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error || !data) return mergeSiteSettings(null);
    return mergeSiteSettings(data);
  } catch {
    return mergeSiteSettings(null);
  }
}

/**
 * Client-side fetcher — used by the Loader / home page to simulate
 * real async loading via /api/content/[entity]. This ensures the
 * Loader genuinely gates on data readiness without needing Supabase
 * to be online.
 */
export async function fetchContent(entity) {
  const res = await fetch(`/api/content/${entity}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${entity}`);
  const json = await res.json();
  return json.data;
}
