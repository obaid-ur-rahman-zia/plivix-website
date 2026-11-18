-- Bengali fields for team members (About page).
alter table public.team add column if not exists role_bn text;
alter table public.team add column if not exists bio_bn text;
