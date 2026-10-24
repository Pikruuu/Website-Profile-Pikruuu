alter table public.projects
    add column if not exists start_date date,
    add column if not exists end_date date,
    add column if not exists team_contribution text;

update public.projects
set start_date = created_at::date
where start_date is null;

alter table public.projects drop constraint if exists projects_date_range_check;
alter table public.projects
    add constraint projects_date_range_check check (
        end_date is null
        or start_date is null
        or end_date >= start_date
    );

alter table public.projects drop column if exists sort_order;
drop index if exists public.projects_sort_order_idx;

create index if not exists projects_start_date_idx
on public.projects (start_date desc);
