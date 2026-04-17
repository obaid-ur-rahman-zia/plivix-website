-- Run this in Supabase Dashboard → SQL Editor → Run (once).
-- Fixes: "Could not find the 'thumbnail_url' column of 'team' in the schema cache"
-- Safe to re-run: uses IF NOT EXISTS.

alter table public.services
  add column if not exists image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;

alter table public.projects
  add column if not exists thumbnail_url text,
  add column if not exists video_urls text[] not null default '{}';

alter table public.team
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;

-- If team was created before image_url existed, ensure it:
alter table public.team
  add column if not exists image_url text;
