-- =============================================================================
-- Run once (or anytime): Supabase Dashboard → SQL Editor → Run
-- Or: npm run db:ensure   (needs DATABASE_URL in .env.local)
--
-- Fixes PostgREST errors such as:
--   "Could not find the 'thumbnail_url' column of 'team' in the schema cache"
--
-- Uses ADD COLUMN IF NOT EXISTS only — safe on existing DBs. Tables that were
-- created before media/CMS columns existed never get new columns from
-- CREATE TABLE IF NOT EXISTS; this block patches them.
-- =============================================================================

-- --- services (CMS + site) ---
alter table public.services
  add column if not exists icon_name text,
  add column if not exists image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;

-- --- projects (CMS + homepage / portfolio) ---
alter table public.projects
  add column if not exists client text,
  add column if not exists cover_url text,
  add column if not exists thumbnail_url text,
  add column if not exists gallery_urls text[] not null default '{}',
  add column if not exists video_urls text[] not null default '{}',
  add column if not exists description text,
  add column if not exists tech_stack text[] not null default '{}',
  add column if not exists year int,
  add column if not exists live_url text;

-- --- team (CMS + about page) — image_url was missing from older patch-only SQL ---
alter table public.team
  add column if not exists image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;

-- --- testimonials ---
alter table public.testimonials
  add column if not exists avatar_url text;
