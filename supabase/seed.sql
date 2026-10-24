insert into public.projects (
    title,
    slug,
    description,
    category,
    tech_stack,
    image_url,
    demo_url,
    repo_url,
    start_date,
    end_date,
    team_contribution,
    evidence,
    featured,
    created_at,
    updated_at
)
values
    (
        'IoT/Robotics',
        'voxsight-ai',
        'VoxSight AI adalah kacamata pintar berbasis AI untuk membantu penyandang tunanetra mengenali lingkungan sekitar secara real-time melalui suara.',
        'iot/robotic',
        array['Python', 'TensorFlow', 'Computer Vision', 'Raspberry Pi'],
        '/images/iot01.png',
        'https://voxsight.id/',
        null,
        '2026-01-15',
        null,
        'Tim Pengabdian Masyarakat Telkom University Surabaya — riset AI, computer vision, dan integrasi perangkat.',
        '[{"id": "demo-voxsight-ai", "label": "Live demo", "type": "other", "url": "https://voxsight.id/"}]'::jsonb,
        true,
        '2026-01-15T08:00:00Z',
        '2026-01-15T08:00:00Z'
    ),
    (
        'Article',
        'article-voxsight-modul',
        'Modul Implementasi Dan Sosialisasi Teknologi Kacamata Pintar Berbasis Ai Interaktif Bagi Penyandang Disabilitas Netra Di Lingkungan Slb A Yayasan Pendidikan Anak Buta Surabaya.',
        'media',
        array[]::text[],
        '/images/Article01.png',
        'https://share.google/hRmtIKI7AgaHt9w4C',
        null,
        '2026-03-06',
        null,
        null,
        '[{"id": "demo-article-voxsight-modul", "label": "Buka publikasi", "type": "other", "url": "https://share.google/hRmtIKI7AgaHt9w4C"}]'::jsonb,
        false,
        '2026-03-06T08:00:00Z',
        '2026-03-06T08:00:00Z'
    ),
    (
        'Article',
        'article-voxsight-slb-ypab',
        'Surabaya, 6 Maret 2026 — Tim Pengabdian Masyarakat Telkom University Surabaya Kenalkan Kacamata Pintar VoxSight AI kepada Siswa Tunanetra di SLB A YPAB Surabaya',
        'media',
        array[]::text[],
        '/images/Article02.png',
        'https://share.google/bqT0Cl4RZZ8Cf3bNC',
        null,
        '2026-03-07',
        null,
        null,
        '[{"id": "demo-article-voxsight-slb-ypab", "label": "Buka publikasi", "type": "other", "url": "https://share.google/bqT0Cl4RZZ8Cf3bNC"}]'::jsonb,
        false,
        '2026-03-07T08:00:00Z',
        '2026-03-07T08:00:00Z'
    )
on conflict (slug) do nothing;

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
