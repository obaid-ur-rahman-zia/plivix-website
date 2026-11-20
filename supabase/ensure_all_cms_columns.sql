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

-- --- pricing / faqs / Bengali columns ---
-- Pricing plans, FAQs, and Bengali (_bn) columns. Idempotent.

create table if not exists public.pricing_plans (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  name text not null,
  name_bn text,
  tagline text,
  tagline_bn text,
  category text,
  price_usd numeric,
  price_note text,
  price_note_bn text,
  features text[] not null default '{}',
  features_bn text[] not null default '{}',
  highlighted boolean not null default false,
  cta_label text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  question_bn text,
  answer text,
  answer_bn text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.pricing_plans enable row level security;
alter table public.faqs enable row level security;

drop policy if exists "public read published pricing_plans" on public.pricing_plans;
create policy "public read published pricing_plans" on public.pricing_plans
  for select to anon, authenticated using (published = true);

drop policy if exists "public read published faqs" on public.faqs;
create policy "public read published faqs" on public.faqs
  for select to anon, authenticated using (published = true);

alter table public.services
  add column if not exists title_bn text,
  add column if not exists tagline_bn text,
  add column if not exists description_bn text;

alter table public.testimonials
  add column if not exists quote_bn text,
  add column if not exists role_bn text,
  add column if not exists company_bn text;

alter table public.projects
  add column if not exists title_bn text,
  add column if not exists description_bn text;
alter table public.projects
  add column if not exists title_bn text,
  add column if not exists description_bn text;

-- Contact email moved to contact@ ; clear old location/hours defaults so the
-- bilingual (Bangladesh-based) defaults on the site apply. Safe to re-run.
update public.site_settings set contact_email = 'contact@plivix-tech.com'
  where id = 1 and lower(coalesce(contact_email, '')) = 'hello@plivix-tech.com';
update public.site_settings set location_tagline = null
  where id = 1 and location_tagline ilike 'remote%global';
update public.site_settings set hours = null
  where id = 1 and hours ilike '%utc+5%';

-- Bengali fields for team members (About page).
alter table public.team add column if not exists role_bn text;
alter table public.team add column if not exists bio_bn text;

-- Contact phone numbers per country (site settings).
alter table public.site_settings add column if not exists phone_bd text;
alter table public.site_settings add column if not exists phone_pk text;
