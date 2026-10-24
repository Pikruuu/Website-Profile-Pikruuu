alter table public.site_settings
    add column if not exists about_name text,
    add column if not exists about_nickname text,
    add column if not exists about_education text,
    add column if not exists about_location text,
    add column if not exists about_email text,
    add column if not exists about_summary text;
