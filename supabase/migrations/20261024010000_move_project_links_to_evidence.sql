update public.projects
set evidence = coalesce(evidence, '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object(
        'id', 'demo-' || id::text,
        'label',
        case
            when category in ('jurnal', 'hki', 'git', 'media')
                then 'Buka publikasi'
            else 'Live demo'
        end,
        'type', 'other',
        'url', demo_url
    )
)
where demo_url is not null
    and not exists (
        select 1
        from jsonb_array_elements(coalesce(evidence, '[]'::jsonb)) as item
        where item->>'url' = demo_url
    );

update public.projects
set evidence = coalesce(evidence, '[]'::jsonb) || jsonb_build_array(
    jsonb_build_object(
        'id', 'repo-' || id::text,
        'label', 'Repository',
        'type', 'other',
        'url', repo_url
    )
)
where repo_url is not null
    and not exists (
        select 1
        from jsonb_array_elements(coalesce(evidence, '[]'::jsonb)) as item
        where item->>'url' = repo_url
    );
