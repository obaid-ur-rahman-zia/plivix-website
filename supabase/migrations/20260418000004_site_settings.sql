-- Singleton row (id = 1): contact email, address, hours, social URLs for footer / menu / contact page.

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
