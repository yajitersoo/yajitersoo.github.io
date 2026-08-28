create extension if not exists pgcrypto;

create table if not exists public.portfolio_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text not null,
  headline text not null,
  introduction text not null,
  short_bio text not null,
  location text not null,
  email text not null,
  linkedin_url text not null,
  github_url text not null,
  resume_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null,
  summary text not null,
  category text not null,
  category_label text not null,
  kind text not null,
  tags text[] not null default '{}'::text[],
  tools text[] not null default '{}'::text[],
  sectors text[] not null default '{}'::text[],
  year integer,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  display_order integer not null default 0,
  thumbnail_url text,
  media_url text,
  repository_url text,
  role text,
  challenge text,
  contribution text,
  approach text,
  decision_value text,
  outputs text[] not null default '{}'::text[],
  confidentiality_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  storage_path text not null unique,
  media_type text not null default 'image',
  alt_text text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists projects_public_listing_idx
  on public.projects (status, featured desc, display_order asc);
create index if not exists projects_category_idx on public.projects (category);
create index if not exists project_assets_project_idx on public.project_assets (project_id, display_order);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

create or replace function public.is_portfolio_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.portfolio_admins
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

alter table public.portfolio_admins enable row level security;
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_assets enable row level security;

revoke all on table public.portfolio_admins from anon, authenticated;
revoke all on table public.profiles from anon, authenticated;
revoke all on table public.projects from anon, authenticated;
revoke all on table public.project_assets from anon, authenticated;

grant select on table public.portfolio_admins to authenticated;
grant select on table public.profiles to anon, authenticated;
grant insert, update, delete on table public.profiles to authenticated;
grant select on table public.projects to anon, authenticated;
grant insert, update, delete on table public.projects to authenticated;
grant select on table public.project_assets to anon, authenticated;
grant insert, update, delete on table public.project_assets to authenticated;

drop policy if exists "Administrators can verify their access" on public.portfolio_admins;
create policy "Administrators can verify their access"
on public.portfolio_admins for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can read the portfolio profile" on public.profiles;
create policy "Public can read the portfolio profile"
on public.profiles for select
to anon, authenticated
using (true);

drop policy if exists "Administrators can create their profile" on public.profiles;
create policy "Administrators can create their profile"
on public.profiles for insert
to authenticated
with check (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Administrators can update their profile" on public.profiles;
create policy "Administrators can update their profile"
on public.profiles for update
to authenticated
using (public.is_portfolio_admin() and owner_id = auth.uid())
with check (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Administrators can delete their profile" on public.profiles;
create policy "Administrators can delete their profile"
on public.profiles for delete
to authenticated
using (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (status = 'published' or (public.is_portfolio_admin() and owner_id = auth.uid()));

drop policy if exists "Administrators can create projects" on public.projects;
create policy "Administrators can create projects"
on public.projects for insert
to authenticated
with check (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Administrators can update projects" on public.projects;
create policy "Administrators can update projects"
on public.projects for update
to authenticated
using (public.is_portfolio_admin() and owner_id = auth.uid())
with check (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Administrators can delete projects" on public.projects;
create policy "Administrators can delete projects"
on public.projects for delete
to authenticated
using (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Public can read assets for published projects" on public.project_assets;
create policy "Public can read assets for published projects"
on public.project_assets for select
to anon, authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = project_assets.project_id
      and (projects.status = 'published' or (public.is_portfolio_admin() and projects.owner_id = auth.uid()))
  )
);

drop policy if exists "Administrators can create asset records" on public.project_assets;
create policy "Administrators can create asset records"
on public.project_assets for insert
to authenticated
with check (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Administrators can update asset records" on public.project_assets;
create policy "Administrators can update asset records"
on public.project_assets for update
to authenticated
using (public.is_portfolio_admin() and owner_id = auth.uid())
with check (public.is_portfolio_admin() and owner_id = auth.uid());

drop policy if exists "Administrators can delete asset records" on public.project_assets;
create policy "Administrators can delete asset records"
on public.project_assets for delete
to authenticated
using (public.is_portfolio_admin() and owner_id = auth.uid());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  true,
  52428800,
  array['image/png', 'image/jpeg', 'image/webp', 'application/pdf']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read portfolio files" on storage.objects;
create policy "Public can read portfolio files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio-assets');

drop policy if exists "Administrators can upload portfolio files" on storage.objects;
create policy "Administrators can upload portfolio files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and public.is_portfolio_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Administrators can update portfolio files" on storage.objects;
create policy "Administrators can update portfolio files"
on storage.objects for update
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and public.is_portfolio_admin()
  and owner_id = auth.uid()::text
)
with check (
  bucket_id = 'portfolio-assets'
  and public.is_portfolio_admin()
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Administrators can delete portfolio files" on storage.objects;
create policy "Administrators can delete portfolio files"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'portfolio-assets'
  and public.is_portfolio_admin()
  and owner_id = auth.uid()::text
);

