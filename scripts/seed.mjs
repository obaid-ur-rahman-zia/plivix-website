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
 *
 * Idempotency:
 * - `services` / `projects`: upsert on `slug` (unique) — safe to re-run.
 * - `team` / `testimonials` / `stats` / `internships`: each row has a stable
 *   `id` in `src/lib/content/*.js`; we upsert on `id` and delete any DB rows
 *   whose `id` is not in the seed file (removes duplicates from older runs
 *   that inserted without a conflict target).
 *
 * If you added rows only in the DB (not in `src/lib/content`), set
 * `SEED_NO_PURGE=1` so those rows are not deleted — duplicates must be
 * removed manually once, or copy those rows into the content files with
 * fixed `id`s.
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

const purgeOrphans = process.env.SEED_NO_PURGE !== "1";

async function upsertOnConflict(table, rows, onConflict) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    console.error(`[plivix:seed] ${table} failed:`, error.message);
    process.exit(1);
  }
  console.log(`[plivix:seed] ${table}: upserted ${rows.length} rows`);
}

/**
 * Upsert by primary key `id` and remove rows that are no longer in the seed
 * (also clears duplicate rows created by older seed versions that inserted
 * without `onConflict`).
 */
async function upsertById(table, rows) {
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) {
    console.error(`[plivix:seed] ${table} failed:`, error.message);
    process.exit(1);
  }

  const keepIds = new Set(rows.map((r) => r.id));
  const { data: existing, error: selErr } = await supabase.from(table).select("id");
  if (selErr) {
    console.warn(`[plivix:seed] ${table}: could not list ids for cleanup:`, selErr.message);
    console.log(`[plivix:seed] ${table}: upserted ${rows.length} rows`);
    return;
  }

  const orphans = (existing ?? []).map((r) => r.id).filter((id) => !keepIds.has(id));
  if (orphans.length === 0) {
    console.log(`[plivix:seed] ${table}: upserted ${rows.length} rows`);
    return;
  }

  if (!purgeOrphans) {
    console.warn(
      `[plivix:seed] ${table}: ${orphans.length} row(s) in DB are not in seed (skipped delete — SEED_NO_PURGE=1)`
    );
    console.log(`[plivix:seed] ${table}: upserted ${rows.length} rows`);
    return;
  }

  const { error: delErr } = await supabase.from(table).delete().in("id", orphans);
  if (delErr) {
    console.error(`[plivix:seed] ${table} orphan delete failed:`, delErr.message);
    process.exit(1);
  }
  console.log(
    `[plivix:seed] ${table}: upserted ${rows.length} rows, removed ${orphans.length} extra row(s) (duplicates or removed from seed)`
  );
}

await upsertOnConflict("services", services, "slug");
await upsertOnConflict("projects", projects, "slug");
await upsertById("team", team);
await upsertById("testimonials", testimonials);
await upsertById("stats", stats);
await upsertById("internships", internships);

console.log("[plivix:seed] done.");
