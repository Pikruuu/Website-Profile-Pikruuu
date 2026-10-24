alter table public.projects
    add column if not exists evidence jsonb not null default '[]'::jsonb;

alter table public.projects
    drop constraint if exists projects_evidence_array_check;

alter table public.projects
    add constraint projects_evidence_array_check check (
        jsonb_typeof(evidence) = 'array'
    );
