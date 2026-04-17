#!/usr/bin/env node
/**
 * Supabase seed script.
 *
 * Requires the environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run with:  node scripts/seed.mjs
 *
 * Upserts the canonical site content (services, projects, team,
 * testimonials, stats, internships) into the Supabase tables created
 * by supabase/migrations/20260417000001_plivix_content_schema.sql.
 */

import { createClient } from "@supabase/supabase-js";
import { services } from "../src/lib/content/services.js";
import { projects } from "../src/lib/content/projects.js";
import { team } from "../src/lib/content/team.js";
import { testimonials } from "../src/lib/content/testimonials.js";
import { stats } from "../src/lib/content/stats.js";
import { internships } from "../src/lib/content/internships.js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "\n[plivix:seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false },
});

async function upsert(table, rows, onConflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    console.error(`[plivix:seed] ${table} failed:`, error.message);
    process.exit(1);
  }
  console.log(`[plivix:seed] ${table}: upserted ${rows.length} rows`);
}

await upsert("services", services, "slug");
await upsert("projects", projects, "slug");
await upsert("team", team);
await upsert("testimonials", testimonials);
await upsert("stats", stats);
await upsert("internships", internships);

console.log("[plivix:seed] done.");
