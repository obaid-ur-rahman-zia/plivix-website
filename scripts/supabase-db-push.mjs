#!/usr/bin/env node
/**
 * Apply `supabase/migrations/*.sql` to your Supabase Postgres (like `prisma migrate deploy`).
 *
 * Tracks applied files in `public.plivix_applied_migrations` so each file runs once.
 *
 * Setup:
 *   1. Supabase → Project Settings → Database → copy the direct connection URI
 *      (port 5432, "Direct connection", not transaction pooler if DDL fails).
 *   2. Add to `.env.local`:
 *        DATABASE_URL="postgresql://postgres.[ref]:[PASSWORD]@db.[ref].supabase.co:5432/postgres"
 *      or use DIRECT_URL (same value).
 *
 * Run:
 *   npm run db:push
 *
 * Existing database that already has schema (you pasted SQL before):
 *   npm run db:push:baseline
 *   → marks all current migration files as applied without running them.
 *   Then `npm run db:push` only runs new files later.
 */

import postgres from "postgres";
import { config } from "dotenv";
import { readFileSync, readdirSync, existsSync } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });

const baseline = process.argv.includes("--baseline");

const databaseUrl = (
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  ""
).trim();

if (!databaseUrl) {
  console.error(
    "\n[db:push] Set DIRECT_URL or DATABASE_URL in .env.local\n\n" +
      "Supabase → Project Settings → Database → Connection string → URI\n" +
      "Use direct connection (port 5432) for migrations.\n"
  );
  process.exit(1);
}

const migrationsDir = join(root, "supabase", "migrations");

async function main() {
  if (!existsSync(migrationsDir)) {
    console.error("[db:push] Missing folder:", migrationsDir);
    process.exit(1);
  }

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  const sql = postgres(databaseUrl, {
    max: 1,
    connect_timeout: 45,
    idle_timeout: 5,
    ssl: "require",
  });

  try {
    await sql`
      create table if not exists public.plivix_applied_migrations (
        filename text primary key,
        applied_at timestamptz not null default now()
      )
    `;

    if (baseline) {
      let n = 0;
      for (const name of files) {
        await sql`
          insert into public.plivix_applied_migrations (filename)
          values (${name})
          on conflict (filename) do nothing
        `;
        n += 1;
      }
      console.log(`[db:push] baseline: marked ${n} migration file(s) as applied (SQL not run).`);
      return;
    }

    if (files.length === 0) {
      console.log("[db:push] no .sql files in supabase/migrations");
      return;
    }

    let applied = 0;
    let skipped = 0;

    for (const name of files) {
      const already = await sql`
        select 1 as x from public.plivix_applied_migrations where filename = ${name} limit 1
      `;
      if (already.length > 0) {
        skipped += 1;
        console.log("[db:push] skip", name);
        continue;
      }

      const body = readFileSync(join(migrationsDir, name), "utf8").trim();

      if (!body) {
        await sql`
          insert into public.plivix_applied_migrations (filename) values (${name})
        `;
        console.log("[db:push] skip empty", name);
        skipped += 1;
        continue;
      }

      await sql.begin(async (tx) => {
        await tx.unsafe(body);
        await tx`
          insert into public.plivix_applied_migrations (filename) values (${name})
        `;
      });

      applied += 1;
      console.log("[db:push] applied", name);
    }

    console.log(`\n[db:push] done. applied ${applied}, skipped ${skipped}`);

    // Optional: refresh PostgREST schema cache (safe if role has permission)
    try {
      await sql.unsafe("notify pgrst, 'reload schema'");
    } catch {
      /* ignore */
    }
  } catch (e) {
    console.error("[db:push] failed:", e.message || e);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 10 });
  }
}

main();
