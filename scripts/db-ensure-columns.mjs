#!/usr/bin/env node
/**
 * Applies supabase/ensure_all_cms_columns.sql via Postgres (no Dashboard paste).
 * Same env as db:push: DIRECT_URL or DATABASE_URL (direct connection, port 5432).
 *
 *   npm run db:ensure
 */

import postgres from "postgres";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
config({ path: resolve(root, ".env.local") });
config({ path: resolve(root, ".env") });

const databaseUrl = (
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  ""
).trim();

const sqlFile = join(root, "supabase", "ensure_all_cms_columns.sql");

if (!databaseUrl) {
  console.error(
    "\n[db:ensure] Set DIRECT_URL or DATABASE_URL in .env.local (Supabase → Database → URI, direct / 5432).\n"
  );
  process.exit(1);
}

if (!existsSync(sqlFile)) {
  console.error("[db:ensure] Missing", sqlFile);
  process.exit(1);
}

const body = readFileSync(sqlFile, "utf8").trim();

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 45,
  ssl: "require",
});

try {
  console.log("[db:ensure] running ensure_all_cms_columns.sql …");
  await sql.unsafe(body);
  try {
    await sql.unsafe("notify pgrst, 'reload schema'");
  } catch {
    /* optional — ignore if role cannot notify */
  }
  console.log("[db:ensure] done. If the API still errors, wait ~30s or restart the project in Supabase.");
} catch (e) {
  console.error("[db:ensure] failed:", e.message || e);
  process.exit(1);
} finally {
  await sql.end({ timeout: 10 });
}
