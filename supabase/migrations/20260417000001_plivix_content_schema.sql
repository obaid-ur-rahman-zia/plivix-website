-- ============================================================
-- Plivix Technologies — Content schema
-- ============================================================
-- Tables powering the marketing site: services, projects, team,
-- testimonials, stats, internships.
--
-- Public read is granted only to rows explicitly marked as
-- published / active. Writes are restricted to the service role.
-- ============================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- services
-- ----------------------------------------------------------------
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
  order_index int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_order_idx on public.services(order_index);
create index if not exists services_category_idx on public.services(category);

-- ----------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  client text,
  category text not null,
  cover_url text,
  gallery_urls text[] not null default '{}',
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

-- ----------------------------------------------------------------
-- team
-- ----------------------------------------------------------------
create table if not exists public.team (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text,
  image_url text,
  socials jsonb not null default '{}'::jsonb,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- testimonials
-- ----------------------------------------------------------------
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

-- ----------------------------------------------------------------
-- stats
-- ----------------------------------------------------------------
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value numeric not null,
  suffix text,
  order_index int not null default 0
);

-- ----------------------------------------------------------------
-- internships
-- ----------------------------------------------------------------
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

-- ============================================================
-- Row Level Security
-- ============================================================
alter table public.services      enable row level security;
alter table public.projects      enable row level security;
alter table public.team          enable row level security;
alter table public.testimonials  enable row level security;
alter table public.stats         enable row level security;
alter table public.internships   enable row level security;

-- Public read of published/active content only
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

-- Writes are implicitly service-role only (no policy granted to anon/authenticated).
