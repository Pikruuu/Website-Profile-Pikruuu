"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth";
import { SETTINGS_CACHE_TAG, SETTINGS_ID } from "@/lib/data/settings";
import type { SettingsActionState } from "@/types/project";

const BUCKET = "project-images";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
] as const;

const aboutSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(120, "Name must be at most 120 characters."),
    nickname: z
        .string()
        .trim()
        .min(1, "Nickname is required.")
        .max(80, "Nickname must be at most 80 characters."),
    education: z
        .string()
        .trim()
        .min(2, "Education must be at least 2 characters.")
        .max(200, "Education must be at most 200 characters."),
    location: z
        .string()
        .trim()
        .min(2, "Location must be at least 2 characters.")
        .max(120, "Location must be at most 120 characters."),
    email: z
        .string()
        .trim()
        .email("Invalid email format.")
        .max(160, "Email must be at most 160 characters."),
    summary: z
        .string()
        .trim()
        .min(10, "Summary must be at least 10 characters.")
        .max(1500, "Summary must be at most 1500 characters."),
});

const listSchema = z
    .array(
        z
            .string()
            .trim()
            .min(1, "Technology name cannot be empty.")
            .max(40, "Technology name must be at most 40 characters.")
    )
    .max(30, "Maximum of 30 technologies.");

function normalizeTechnologies(values: string[]): string[] {
    const seen = new Set<string>();

    return values
        .map((item) => item.trim())
        .filter((item) => {
            const key = item.toLowerCase();

            if (!item || seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        });
}

function errorMessage(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "An error occurred. Please try again.";
}

function getFile(formData: FormData, name: string): File | null {
    const entry = formData.get(name);

    return entry instanceof File && entry.size > 0 ? entry : null;
}

function validateImageFile(file: File | null, label: string): string | null {
    if (!file) {
        return null;
    }

    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        return `${label} must be in PNG, JPG, or WebP format.`;
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return `${label.toLowerCase()} size must be at most 2 MB.`;
    }

    return null;
}

interface UploadedFile {
    path: string;
    publicUrl: string;
}

async function uploadImage(
    supabase: SupabaseClient,
    file: File,
    prefix: string
): Promise<UploadedFile> {
    const rawExtension = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const extension = ["png", "jpg", "jpeg", "webp"].includes(rawExtension)
        ? rawExtension
        : "png";
    const path = `${prefix}-${crypto.randomUUID()}.${extension}`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: "31536000",
        upsert: false,
    });

    if (error) {
        throw new Error(`Failed to upload image: ${error.message}`);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return { path, publicUrl: data.publicUrl };
}

function getStoragePath(publicUrl: string | null): string | null {
    if (!publicUrl) {
        return null;
    }

    const marker = `/storage/v1/object/public/${BUCKET}/`;
    const index = publicUrl.indexOf(marker);

    if (index === -1) {
        return null;
    }

    return decodeURIComponent(
        publicUrl.slice(index + marker.length).split("?")[0] ?? ""
    );
}

async function removeImage(
    supabase: SupabaseClient,
    publicUrl: string | null
): Promise<void> {
    const path = getStoragePath(publicUrl);

    if (!path) {
        return;
    }

    await supabase.storage.from(BUCKET).remove([path]);
}

export async function updateAboutAction(
    _previousState: SettingsActionState,
    formData: FormData
): Promise<SettingsActionState> {
    try {
        const { supabase } = await requireAdminAction();
        const parsed = aboutSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!parsed.success) {
            const result: Record<string, string[]> = {};

            parsed.error.issues.forEach((issue) => {
                const key = String(issue.path[0] ?? "form");
                result[key] = [
                    ...(result[key] ?? []),
                    issue.message,
                ];
            });

            return {
                status: "error",
                message: "Please check the form again.",
                fieldErrors: result,
            };
        }

        const { error } = await supabase.from("site_settings").upsert(
            {
                id: SETTINGS_ID,
                about_name: parsed.data.name,
                about_nickname: parsed.data.nickname,
                about_education: parsed.data.education,
                about_location: parsed.data.location,
                about_email: parsed.data.email,
                about_summary: parsed.data.summary,
            },
            { onConflict: "id" }
        );

        if (error) {
            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        revalidateTag(SETTINGS_CACHE_TAG, { expire: 0 });
        revalidatePath("/about");
        revalidatePath("/admin");

        return {
            status: "success",
            message: "About updated successfully.",
            fieldErrors: {},
        };
    } catch (error) {
        return {
            status: "error",
            message: errorMessage(error),
            fieldErrors: {},
        };
    }
}

export async function updateProfileImageAction(
    _previousState: SettingsActionState,
    formData: FormData
): Promise<SettingsActionState> {
    try {
        const { supabase } = await requireAdminAction();
        const profileFile = getFile(formData, "profile_image");
        const profileError = validateImageFile(profileFile, "Profile photo");

        if (profileError) {
            return {
                status: "error",
                message: profileError,
                fieldErrors: { profile_image: [profileError] },
            };
        }

        if (!profileFile) {
            return {
                status: "error",
                message: "Please select a profile photo first.",
                fieldErrors: {},
            };
        }

        const { data: existing, error: existingError } = await supabase
            .from("site_settings")
            .select("profile_image_url")
            .eq("id", SETTINGS_ID)
            .maybeSingle();

        if (existingError) {
            return {
                status: "error",
                message: existingError.message,
                fieldErrors: {},
            };
        }

        const existingProfile =
            (existing?.profile_image_url as
                | string
                | null
                | undefined) ?? null;

        let uploadedProfile: UploadedFile | null = null;

        try {
            uploadedProfile = await uploadImage(
                supabase,
                profileFile,
                "profile"
            );
        } catch (error) {
            return {
                status: "error",
                message: errorMessage(error),
                fieldErrors: {},
            };
        }

        const { error } = await supabase.from("site_settings").upsert(
            {
                id: SETTINGS_ID,
                profile_image_url: uploadedProfile.publicUrl,
            },
            { onConflict: "id" }
        );

        if (error) {
            await removeImage(supabase, uploadedProfile.publicUrl);

            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        await removeImage(supabase, existingProfile);

        revalidateTag(SETTINGS_CACHE_TAG, { expire: 0 });
        revalidatePath("/");
        revalidatePath("/about");
        revalidatePath("/admin");

        return {
            status: "success",
            message: "Profile photo updated successfully.",
            fieldErrors: {},
        };
    } catch (error) {
        return {
            status: "error",
            message: errorMessage(error),
            fieldErrors: {},
        };
    }
}

export async function updateTechnologiesAction(
    technologies: string[]
): Promise<SettingsActionState> {
    try {
        const { supabase } = await requireAdminAction();
        const list = listSchema.safeParse(
            normalizeTechnologies(technologies)
        );

        if (!list.success) {
            const message =
                list.error.issues[0]?.message ??
                "Invalid technology list.";

            return {
                status: "error",
                message,
                fieldErrors: { technologies: [message] },
            };
        }

        const { error } = await supabase.from("site_settings").upsert(
            {
                id: SETTINGS_ID,
                technologies: list.data,
            },
            { onConflict: "id" }
        );

        if (error) {
            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        revalidateTag(SETTINGS_CACHE_TAG, { expire: 0 });
        revalidatePath("/about");
        revalidatePath("/admin");

        return {
            status: "success",
            message: "Changes saved automatically.",
            fieldErrors: {},
        };
    } catch (error) {
        return {
            status: "error",
            message: errorMessage(error),
            fieldErrors: {},
        };
    }
}


