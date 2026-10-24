create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create table if not exists public.site_settings (
    id text primary key,
    technologies text[] not null default '{}',
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

insert into public.site_settings (id, technologies)
values (
    'about',
    array[
        'C++',
        'Python',
        'HTML',
        'CSS',
        'Next.js',
        'Vue',
        'SCSS',
        'Tailwind',
        'Flutter',
        'React-Native',
        'PostgreSQL',
        'VS Code'
    ]
)
on conflict (id) do nothing;
