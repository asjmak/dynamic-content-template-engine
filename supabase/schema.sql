-- ============================================================
--  Dynamic Content Template Engine — Skema Supabase (Postgres)
--  Jalankan seluruh script ini di Supabase > SQL Editor.
-- ============================================================

-- 1) site_settings : pengaturan global (1 baris)
create table if not exists public.site_settings (
  id                   integer primary key default 1,
  site_name            text    not null default 'Dynamic Template',
  default_title        text    not null default 'Selamat datang',
  default_description  text    not null default 'Website dinamis yang dikelola dari database.',
  default_og_image     text,
  site_url             text
);
alter table public.site_settings enable row level security;

-- 2) sections : struktur / tata letak halaman
create table if not exists public.sections (
  id         uuid primary key default gen_random_uuid(),
  block_type text not null check (block_type in ('hero','grid','slider','single_column','footer')),
  title      text,
  ordering   integer not null default 0,
  settings   jsonb not null default '{}'::jsonb,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists sections_ordering_idx on public.sections (ordering);
alter table public.sections enable row level security;

-- 3) contents : isi yang ditampilkan di dalam blok
create table if not exists public.contents (
  id            uuid primary key default gen_random_uuid(),
  section_id    uuid references public.sections(id) on delete cascade,
  category      text,
  title         text,
  body          text,
  image_url     text,
  video_url     text,
  cta_text      text,
  ordering      integer not null default 0,
  og_title      text,
  og_description text,
  og_image_url  text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists contents_section_idx on public.contents (section_id);
create index if not exists contents_ordering_idx on public.contents (ordering);
alter table public.contents enable row level security;

-- 4) links : database link pusat (affiliate dsb)
create table if not exists public.links (
  id          uuid primary key default gen_random_uuid(),
  label       text,
  url         text not null,
  tracking_id text unique,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.links enable row level security;

-- 5) content_links : relasi many-to-many (konten <-> link)
create table if not exists public.content_links (
  id          uuid primary key default gen_random_uuid(),
  content_id  uuid not null references public.contents(id) on delete cascade,
  link_id     uuid not null references public.links(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (content_id, link_id)
);
create index if not exists content_links_content_idx on public.content_links (content_id);
create index if not exists content_links_link_idx on public.content_links (link_id);
alter table public.content_links enable row level security;

-- ------------------------------------------------------------
--  Trigger updated_at otomatis
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

drop trigger if exists sections_updated_at on public.sections;
create trigger sections_updated_at before update on public.sections
  for each row execute function public.set_updated_at();

drop trigger if exists contents_updated_at on public.contents;
create trigger contents_updated_at before update on public.contents
  for each row execute function public.set_updated_at();

drop trigger if exists links_updated_at on public.links;
create trigger links_updated_at before update on public.links
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
--  Row Level Security (RLS)
--  - Publik (anon) : hanya boleh SELECT (website template membaca)
--  - Terautentikasi (admin) : boleh SELECT/INSERT/UPDATE/DELETE
--  - Service role (webhook) : bypass RLS (pakai SUPABASE_SERVICE_ROLE_KEY)
-- ------------------------------------------------------------
-- Baca publik
drop policy if exists "public read site_settings" on public.site_settings;
create policy "public read site_settings" on public.site_settings for select using (true);
drop policy if exists "public read sections" on public.sections;
create policy "public read sections"      on public.sections      for select using (true);
drop policy if exists "public read contents" on public.contents;
create policy "public read contents"      on public.contents      for select using (true);
drop policy if exists "public read links" on public.links;
create policy "public read links"         on public.links         for select using (true);
drop policy if exists "public read content_links" on public.content_links;
create policy "public read content_links" on public.content_links for select using (true);

-- Tulis (admin)
drop policy if exists "auth write site_settings" on public.site_settings;
create policy "auth write site_settings" on public.site_settings for all to authenticated using (true) with check (true);
drop policy if exists "auth write sections" on public.sections;
create policy "auth write sections"      on public.sections      for all to authenticated using (true) with check (true);
drop policy if exists "auth write contents" on public.contents;
create policy "auth write contents"      on public.contents      for all to authenticated using (true) with check (true);
drop policy if exists "auth write links" on public.links;
create policy "auth write links"         on public.links         for all to authenticated using (true) with check (true);
drop policy if exists "auth write content_links" on public.content_links;
create policy "auth write content_links" on public.content_links for all to authenticated using (true) with check (true);

-- ------------------------------------------------------------
--  Seed data contoh (agar situs langsung tampil)
-- ------------------------------------------------------------
insert into public.site_settings (id, site_name, default_title, default_description, default_og_image, site_url)
values (1, 'Dynamic Template', 'Templat Konten Dinamis', 'Website yang tampilan & isinya dikelola sepenuhnya dari database.', null, null)
on conflict (id) do nothing;

insert into public.sections (id, block_type, title, ordering, settings, is_active) values
  ('11111111-1111-1111-1111-111111111111', 'hero',   'Hero',   1,  '{"heading":"Solusi Cerdas untuk Konten Dinamis","subheading":"Kelola tampilan & isi dari satu database.","cta_label":"Pelajari"}', true),
  ('22222222-2222-2222-2222-222222222222', 'grid',   'Fitur',  2,  '{"columns":3}', true),
  ('33333333-3333-3333-3333-333333333333', 'footer', 'Footer', 99, '{"text":"© 2026 Dynamic Template Engine"}', true)
on conflict (id) do nothing;

insert into public.links (id, label, url, tracking_id) values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Affiliate Utama', 'https://example.com/affiliate', 'AFF_MAIN'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Promo',          'https://example.com/promo',     'AFF_PROMO')
on conflict (id) do nothing;

insert into public.contents (id, section_id, category, title, body, image_url, cta_text, ordering) values
  ('c1111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'feature', 'Cepat',    'Rendering server-side untuk SEO & preview sosmed optimal.', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'Coba Sekarang', 1),
  ('c2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'feature', 'Fleksibel', 'Blok grid, slider, hero — semua diatur dari database.',        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600', 'Lihat Fitur',  2),
  ('c3333333-3333-3333-3333-333333333333', '22222222-2222-2222-2222-222222222222', 'feature', 'Gratis',    'Supabase + Vercel free tier. Biaya Rp 0.',                     'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600', 'Mulai Gratis', 3)
on conflict (id) do nothing;

insert into public.content_links (content_id, link_id) values
  ('c1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('c2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('c3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
on conflict do nothing;

-- ============================================================
--  UPDATE FITUR TEMPLATES & LEAD CAPTURE (idempoten — aman dijalankan ulang)
-- ============================================================
alter table public.sections add column if not exists template text not null default 'classic-sales';
alter table public.site_settings add column if not exists active_template text not null default 'classic-sales';

alter table public.sections drop constraint if exists sections_block_type_check;
alter table public.sections add constraint sections_block_type_check
  check (block_type in ('hero','grid','slider','single_column','footer','lead_form'));

-- tabel leads (prospek dari form lead-gen)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  source text,
  created_at timestamptz not null default now()
);
alter table public.leads enable row level security;
drop policy if exists "auth read leads" on public.leads;
create policy "auth read leads" on public.leads for select to authenticated using (true);
