#!/usr/bin/env node
/**
 * Supabase seed script.
 *
 * Loads `.env.local` then `.env` from the project root (plain `node` does not
 * read these files — only Next.js does unless we load them here).
 *
 * Requires:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run: npm run seed
 */

import { config } from "dotenv";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { services } from "../src/lib/content/services.js";
import { projects } from "../src/lib/content/projects.js";
import { team } from "../src/lib/content/team.js";
import { testimonials } from "../src/lib/content/testimonials.js";
import { stats } from "../src/lib/content/stats.js";
import { internships } from "../src/lib/content/internships.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error(
    "\n[plivix:seed] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.\n" +
      "  → Put them in .env.local at the project root, then run: npm run seed\n"
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
