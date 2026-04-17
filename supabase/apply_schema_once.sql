-- =============================================================================
-- ONE-SHOT APPLY (Supabase Dashboard → SQL Editor → paste → Run)
-- Same as running migrations in order:
--   20260417000001_plivix_content_schema.sql
--   20260418000002_storage_site_media.sql
--   20260417000003_content_media_columns.sql
-- After success:  npm run seed   (needs SUPABASE_SERVICE_ROLE_KEY in env)
-- =============================================================================

-- === 20260417000001_plivix_content_schema.sql ===

create extension if not exists "pgcrypto";

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  tagline text,
  category text not null,
  description text,
  features text[] not null default '{}',
  tech_stack text[] not null default '{}',
  icon_name text,
  image_url text,
  thumbnail_url text,
  video_url text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_order_idx on public.services(order_index);
create index if not exists services_category_idx on public.services(category);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client text,
  category text not null,
  cover_url text,
  thumbnail_url text,
  gallery_urls text[] not null default '{}',
  video_urls text[] not null default '{}',
  description text,
  tech_stack text[] not null default '{}',
  year int,
  live_url text,
  order_index int not null default 0,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_order_idx on public.projects(order_index);
create index if not exists projects_featured_idx on public.projects(featured);

create table if not exists public.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image_url text,
  thumbnail_url text,
  video_url text,
  socials jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author text not null,
  role text,
  company text,
  quote text not null,
  avatar_url text,
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value numeric not null,
  suffix text,
  order_index int not null default 0
);

create table if not exists public.internships (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration text,
  skills text[] not null default '{}',
  is_active boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.services      enable row level security;
alter table public.projects      enable row level security;
alter table public.team          enable row level security;
alter table public.testimonials  enable row level security;
alter table public.stats         enable row level security;
alter table public.internships   enable row level security;

drop policy if exists "public read services" on public.services;
drop policy if exists "public read projects" on public.projects;
drop policy if exists "public read team" on public.team;
drop policy if exists "public read testimonials" on public.testimonials;
drop policy if exists "public read stats" on public.stats;
drop policy if exists "public read internships" on public.internships;

create policy "public read services"
  on public.services for select
  to anon, authenticated
  using (published = true);

create policy "public read projects"
  on public.projects for select
  to anon, authenticated
  using (published = true);

create policy "public read team"
  on public.team for select
  to anon, authenticated
  using (active = true);

create policy "public read testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (published = true);

create policy "public read stats"
  on public.stats for select
  to anon, authenticated
  using (true);

create policy "public read internships"
  on public.internships for select
  to anon, authenticated
  using (is_active = true);

-- === 20260418000002_storage_site_media.sql ===

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read site-media" on storage.objects;

create policy "Public read site-media"
  on storage.objects for select
  to public
  using (bucket_id = 'site-media');

-- === 20260417000003_content_media_columns.sql ===
-- Idempotent adds for databases created before media columns existed.

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

-- === 20260418000004_site_settings.sql ===

create table if not exists public.site_settings (
  id int primary key check (id = 1),
  contact_email text,
  address text,
  location_tagline text,
  hours text,
  socials jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id, contact_email, address, location_tagline, hours, socials)
values (
  1,
  'hello@plivix-tech.com',
  null,
  'Remote · Global',
  'Mon – Sat · 8:00 – 17:00 UTC+5',
  '{"linkedin":"https://www.linkedin.com/company/plivix","instagram":"https://www.instagram.com/plivix.technologies/","x":"https://x.com/plivix_tech","upwork":"https://www.upwork.com/agencies/1814949357398654976/"}'::jsonb
)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "public read site settings" on public.site_settings;

create policy "public read site settings"
  on public.site_settings for select
  to anon, authenticated
  using (true);

-- === 20260420000001_ensure_all_cms_columns.sql ===
-- Backfill columns on old DBs (PostgREST schema cache / CMS PATCH).

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
