create table if not exists public.achievements (
    id uuid primary key default gen_random_uuid(),
    title text not null check (char_length(title) between 1 and 160),
    description text,
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
