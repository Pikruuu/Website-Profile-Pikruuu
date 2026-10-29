-- Translate Indonesian content stored in Supabase to English.
-- Run in Supabase Dashboard -> SQL Editor.
-- Safe to re-run: each statement targets a specific slug and known strings.

begin;

-- 1) Project "Hak Cipta" -> "Copyright" and its certificate evidence label
update public.projects
set
  title = 'Copyright',
  evidence = jsonb_set(
    evidence,
    '{1,label}',
    '"Certificate of Copyright Registration"'
  ),
  updated_at = now()
where slug = 'article-voxsight-modul';

-- 2) Evidence label "Buka publikasi" -> "Open publication"
update public.projects
set
  evidence = jsonb_set(
    evidence,
    '{0,label}',
    '"Open publication"'
  ),
  updated_at = now()
where slug = 'article-voxsight-slb-ypab';

-- 3) Indonesian team contribution on the VoxSight AI project
update public.projects
set
  team_contribution = 'Telkom University Surabaya Community Service Team — AI research, computer vision, and device integration.
-Muhammad Fikri Al Fathoni
-Floren Fransiska Elisabeth Sihite
-Laura Djasmine Putri Tandiawan
-Hans Harold Barus
-Krisna Maulana',
  updated_at = now()
where slug = 'voxsight-ai';

commit;
