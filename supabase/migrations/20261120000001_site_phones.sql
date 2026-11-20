-- Contact phone numbers per country (site settings).
alter table public.site_settings add column if not exists phone_bd text;
alter table public.site_settings add column if not exists phone_pk text;
