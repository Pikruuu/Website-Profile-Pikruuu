import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AchievementRow } from "@/types/project";

export const ACHIEVEMENTS_CACHE_TAG = "portfolio-achievements";

async function fetchPublicAchievements(): Promise<AchievementRow[]> {
    const supabase = createSupabasePublicClient();

    if (!supabase) {
        return [];
    }

    const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(`Failed to load achievements: ${error.message}`);
    }

    return (data ?? []) as AchievementRow[];
}

const getCachedAchievements = unstable_cache(
    fetchPublicAchievements,
    ["portfolio-achievements"],
    {
        tags: [ACHIEVEMENTS_CACHE_TAG],
        revalidate: 300,
    }
);

export async function getAchievements(): Promise<AchievementRow[]> {
    try {
        return await getCachedAchievements();
    } catch (error) {
        console.error(
            error instanceof Error ? error.message : "Failed to load achievements."
        );

        return [];
    }
}

export interface AdminAchievementsResult {
    achievements: AchievementRow[];
    error: string | null;
}

export async function getAdminAchievementById(
    id: string
): Promise<AchievementRow | null> {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        console.error("Failed to load achievement:", error.message);
        return null;
    }

    return (data as AchievementRow | null) ?? null;
}

export async function getAdminAchievements(): Promise<AdminAchievementsResult> {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return {
            achievements: [],
            error: "Supabase is not configured yet. Fill in .env.local first.",
        };
    }

    const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return { achievements: [], error: error.message };
    }

    return {
        achievements: (data ?? []) as AchievementRow[],
        error: null,
    };
}
