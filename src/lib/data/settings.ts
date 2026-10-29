import { unstable_cache } from "next/cache";
import { createSupabasePublicClient } from "@/lib/supabase/public";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteSettingsRow } from "@/types/project";

export const SETTINGS_CACHE_TAG = "portfolio-settings";
export const SETTINGS_ID = "about";

const emptySettings: SiteSettingsRow = {
    id: SETTINGS_ID,
    technologies: [],
    about_name: null,
    about_nickname: null,
    about_education: null,
    about_location: null,
    about_email: null,
    about_summary: null,
    profile_image_url: null,
    updated_at: "",
};

function normalizeSettings(
    settings: SiteSettingsRow | null
): SiteSettingsRow {
    if (!settings) {
        return emptySettings;
    }

    return {
        id: settings.id ?? SETTINGS_ID,
        technologies: settings.technologies ?? [],
        about_name: settings.about_name ?? null,
        about_nickname: settings.about_nickname ?? null,
        about_education: settings.about_education ?? null,
        about_location: settings.about_location ?? null,
        about_email: settings.about_email ?? null,
        about_summary: settings.about_summary ?? null,
        profile_image_url: settings.profile_image_url ?? null,
        updated_at: settings.updated_at ?? "",
    };
}

async function fetchSiteSettings(): Promise<SiteSettingsRow | null> {
    const supabase = createSupabasePublicClient();

    if (!supabase) {
        return null;
    }

    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to load site settings: ${error.message}`);
    }

    return normalizeSettings(data as SiteSettingsRow | null);
}

const getCachedSiteSettings = unstable_cache(
    fetchSiteSettings,
    ["portfolio-settings"],
    {
        tags: [SETTINGS_CACHE_TAG],
        revalidate: 300,
    }
);

export async function getSiteSettings(): Promise<SiteSettingsRow> {
    try {
        return (await getCachedSiteSettings()) ?? emptySettings;
    } catch {
        return emptySettings;
    }
}

export interface AdminSiteSettingsResult {
    settings: SiteSettingsRow;
    error: string | null;
}

export async function getAdminSiteSettings(): Promise<AdminSiteSettingsResult> {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return {
            settings: emptySettings,
            error: "Supabase is not configured yet. Fill in .env.local first.",
        };
    }

    const { data, error } = await supabase
        .from("site_settings")
        .select("*")
        .eq("id", SETTINGS_ID)
        .maybeSingle();

    if (error) {
        return { settings: emptySettings, error: error.message };
    }

    return {
        settings: normalizeSettings(data as SiteSettingsRow | null),
        error: null,
    };
}
