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

function getServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  try {
    return createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (...args) => fetch(...args) },
    });
  } catch {
    return null;
  }
}

function sortBy(arr, field = "order_index") {
  return [...arr].sort((a, b) => (a[field] ?? 0) - (b[field] ?? 0));
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
  return query("team", localTeam, { active: true });
}

export async function getTestimonials() {
  return query("testimonials", localTestimonials, { published: true });
}

export async function getStats() {
  return query("stats", localStats);
}

export async function getActiveInternships() {
  return query("internships", localInternships, { is_active: true });
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
