-- Media columns for CMS: images, thumbnails, video URLs on services, projects, team.

alter table public.services
  add column if not exists image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;

alter table public.projects
  add column if not exists thumbnail_url text,
  add column if not exists video_urls text[] not null default '{}';

alter table public.team
  add column if not exists image_url text,
  add column if not exists thumbnail_url text,
  add column if not exists video_url text;
