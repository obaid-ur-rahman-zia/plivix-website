-- Public bucket for CMS uploads (covers, avatars). Service role uploads via API.
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read site-media" on storage.objects;

create policy "Public read site-media"
  on storage.objects for select
  to public
  using (bucket_id = 'site-media');
