create extension if not exists pgcrypto;

create table if not exists public.projects (
    id uuid primary key default gen_random_uuid(),
    title text not null check (char_length(title) between 1 and 140),
    slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
    description text not null,
    category text not null check (
        category in (
            'web',
            'mobile',
            'iot/robotic',
            'data',
            'jurnal',
            'hki',
            'git',
            'media'
        )
    ),
    tech_stack text[] not null default '{}',
    image_url text,
    demo_url text,
    repo_url text,
    start_date date,
    end_date date,
    team_contribution text,
    evidence jsonb not null default '[]'::jsonb,
    featured boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint projects_date_range_check check (
        end_date is null
        or start_date is null
        or end_date >= start_date
    ),
    constraint projects_evidence_array_check check (
        jsonb_typeof(evidence) = 'array'
    )
);

create index if not exists projects_category_idx on public.projects (category);
create index if not exists projects_start_date_idx on public.projects (start_date desc);
create index if not exists projects_featured_idx on public.projects (featured);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row
execute function public.handle_updated_at();

alter table public.projects enable row level security;

drop policy if exists "Public can read projects" on public.projects;
create policy "Public can read projects"
on public.projects
for select
using (true);

drop policy if exists "Authenticated can insert projects" on public.projects;
create policy "Authenticated can insert projects"
on public.projects
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update projects" on public.projects;
create policy "Authenticated can update projects"
on public.projects
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete projects" on public.projects;
create policy "Authenticated can delete projects"
on public.projects
for delete
to authenticated
using (true);

grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;

create table if not exists public.achievements (
    id uuid primary key default gen_random_uuid(),
    title text not null check (char_length(title) between 1 and 160),
    description text,
    thumbnail_url text,
    certificate_url text,
    team_members text[] not null default '{}',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists achievements_created_at_idx
on public.achievements (created_at desc);

drop trigger if exists set_achievements_updated_at on public.achievements;
create trigger set_achievements_updated_at
before update on public.achievements
for each row
execute function public.handle_updated_at();

alter table public.achievements enable row level security;

drop policy if exists "Public can read achievements" on public.achievements;
create policy "Public can read achievements"
on public.achievements
for select
using (true);

drop policy if exists "Authenticated can insert achievements" on public.achievements;
create policy "Authenticated can insert achievements"
on public.achievements
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update achievements" on public.achievements;
create policy "Authenticated can update achievements"
on public.achievements
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete achievements" on public.achievements;
create policy "Authenticated can delete achievements"
on public.achievements
for delete
to authenticated
using (true);

grant select on public.achievements to anon, authenticated;
grant insert, update, delete on public.achievements to authenticated;

create table if not exists public.site_settings (
    id text primary key,
    technologies text[] not null default '{}',
    about_name text,
    about_nickname text,
    about_education text,
    about_location text,
    about_email text,
    about_summary text,
    updated_at timestamptz not null default now()
);

drop trigger if exists set_site_settings_updated_at on public.site_settings;
create trigger set_site_settings_updated_at
before update on public.site_settings
for each row
execute function public.handle_updated_at();

alter table public.site_settings enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
using (true);

drop policy if exists "Authenticated can insert site settings" on public.site_settings;
create policy "Authenticated can insert site settings"
on public.site_settings
for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update site settings" on public.site_settings;
create policy "Authenticated can update site settings"
on public.site_settings
for update
to authenticated
using (true)
with check (true);

grant select on public.site_settings to anon, authenticated;
grant insert, update on public.site_settings to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
    'project-images',
    'project-images',
    true,
    2097152,
    array['image/png', 'image/jpeg', 'image/webp']
)
on conflict (id) do update
set
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read project images" on storage.objects;
create policy "Public can read project images"
on storage.objects
for select
using (bucket_id = 'project-images');

drop policy if exists "Authenticated can upload project images" on storage.objects;
create policy "Authenticated can upload project images"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can update project images" on storage.objects;
create policy "Authenticated can update project images"
on storage.objects
for update
to authenticated
using (bucket_id = 'project-images')
with check (bucket_id = 'project-images');

drop policy if exists "Authenticated can delete project images" on storage.objects;
create policy "Authenticated can delete project images"
on storage.objects
for delete
to authenticated
using (bucket_id = 'project-images');
