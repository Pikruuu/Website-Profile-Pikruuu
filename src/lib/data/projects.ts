import { unstable_cache } from "next/cache";
import {
    collectTechnologies,
    computePortfolioStats,
    isProjectCategory,
    isPublicationCategory,
    sortRowsByNewest,
    toCollectionItem,
} from "@/lib/projects";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
    CollectionItem,
    PortfolioStats,
    ProjectRow,
} from "@/types/project";

export const PROJECTS_CACHE_TAG = "portfolio-projects";

async function fetchPublicProjects(): Promise<ProjectRow[]> {
    const supabase = createSupabasePublicClient();

    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("start_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Gagal memuat projects: ${error.message}`);
    }

    return (data ?? []) as ProjectRow[];
}

const getCachedProjects = unstable_cache(
    fetchPublicProjects,
    ["portfolio-projects"],
    {
        tags: [PROJECTS_CACHE_TAG],
        revalidate: 300,
    }
);

export interface PortfolioData {
    projects: CollectionItem[];
    publications: CollectionItem[];
    selected: CollectionItem[];
    stats: PortfolioStats;
    technologies: string[];
}

export async function getPublicProjectBySlug(
    slug: string
): Promise<ProjectRow | null> {
    if (!slug) {
        return null;
    }

    try {
        const rows = await getCachedProjects();

        return rows.find((row) => row.slug === slug) ?? null;
    } catch (error) {
        console.error(
            error instanceof Error
                ? error.message
                : "Gagal memuat project."
        );

        return null;
    }
}

export async function getPortfolioData(): Promise<PortfolioData> {
    let rows: ProjectRow[] = [];

    try {
        rows = await getCachedProjects();
    } catch (error) {
        console.error(
            error instanceof Error
                ? error.message
                : "Gagal memuat projects."
        );
    }

    return {
        projects: rows
            .filter((row) => isProjectCategory(row.category))
            .map(toCollectionItem),
        publications: rows
            .filter((row) => isPublicationCategory(row.category))
            .map(toCollectionItem),
        selected: sortRowsByNewest(rows).slice(0, 3).map(toCollectionItem),
        stats: computePortfolioStats(rows),
        technologies: collectTechnologies(rows),
    };
}

export interface AdminProjectsResult {
    projects: ProjectRow[];
    error: string | null;
}

export async function getAdminProjects(): Promise<AdminProjectsResult> {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return {
            projects: [],
            error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.",
        };
    }

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("start_date", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

    if (error) {
        return { projects: [], error: error.message };
    }

    return { projects: (data ?? []) as ProjectRow[], error: null };
}

export async function getAdminProjectById(
    id: string
): Promise<ProjectRow | null> {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Gagal memuat project:", error.message);
        return null;
    }

    return (data as ProjectRow | null) ?? null;
}
