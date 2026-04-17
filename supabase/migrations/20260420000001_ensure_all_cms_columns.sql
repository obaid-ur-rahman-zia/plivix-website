-- Idempotent column backfill for DBs created before full CMS schema.
-- See supabase/ensure_all_cms_columns.sql (same statements).

alter table public.services
  add column if not exists icon_name text,
  add column if not exists image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;

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

alter table public.team
  add column if not exists image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;

alter table public.testimonials
  add column if not exists avatar_url text;
