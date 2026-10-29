"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth";
import { ACHIEVEMENTS_CACHE_TAG } from "@/lib/data/achievements";
import type {
    AchievementActionState,
    AchievementRow,
} from "@/types/project";

const BUCKET = "project-images";
const MAX_CERTIFICATE_SIZE = 5 * 1024 * 1024;
const CERTIFICATE_MIME_TYPE = "application/pdf";
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const certificateUrlSchema = z
    .string()
    .trim()
    .max(500)
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null))
    .refine(
        (value) => value === null || /^https?:\/\/\S+$/i.test(value),
        "Certificate URL must start with http:// or https://."
    );

const achievementFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Achievement title must be at least 2 characters.")
        .max(160, "Achievement title must be at most 160 characters."),
    description: z
        .string()
        .trim()
        .max(1000, "Description must be at most 1000 characters.")
        .optional()
        .transform((value) => (value && value.length > 0 ? value : null)),
    certificate_url: certificateUrlSchema,
    team_members: z.string().max(1500).optional().default(""),
});

interface UploadedFile {
    path: string;
    publicUrl: string;
}

function errorMessage(error: unknown): string {
    return error instanceof Error
        ? error.message
        : "An error occurred. Please try again.";
}

function fieldErrorsFromZod(error: z.ZodError): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    error.issues.forEach((issue) => {
        const key = String(issue.path[0] ?? "form");
        result[key] = [...(result[key] ?? []), issue.message];
    });

    return result;
}

function parseTeamMembers(value: string): string[] {
    const seen = new Set<string>();

    return value
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter((item) => {
            const key = item.toLowerCase();

            if (!item || seen.has(key)) {
                return false;
            }

            seen.add(key);
            return true;
        })
        .slice(0, 20);
}

function getFile(formData: FormData, name: string): File | null {
    const entry = formData.get(name);

    return entry instanceof File && entry.size > 0 ? entry : null;
}

function validateCertificateFile(file: File | null): string | null {
    if (!file) {
        return null;
    }

    if (file.type !== CERTIFICATE_MIME_TYPE) {
        return "Certificate must be in PDF format.";
    }

    if (file.size > MAX_CERTIFICATE_SIZE) {
        return "Certificate size must be at most 5 MB.";
    }

    return null;
}

async function uploadCertificate(
    supabase: SupabaseClient,
    file: File,
    prefix: string
): Promise<UploadedFile> {
    const path = `${prefix}-${crypto.randomUUID()}.pdf`;

    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: CERTIFICATE_MIME_TYPE,
        cacheControl: "31536000",
        upsert: false,
    });

    if (error) {
        throw new Error(`Failed to upload certificate: ${error.message}`);
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

function revalidateAchievements(): void {
    revalidateTag(ACHIEVEMENTS_CACHE_TAG, { expire: 0 });
    revalidatePath("/about");
    revalidatePath("/admin");
}

export async function createAchievementAction(
    _previousState: AchievementActionState,
    formData: FormData
): Promise<AchievementActionState> {
    try {
        const { supabase } = await requireAdminAction();
        const parsed = achievementFormSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!parsed.success) {
            return {
                status: "error",
                message: "Please check the form again.",
                fieldErrors: fieldErrorsFromZod(parsed.error),
            };
        }

        const certificateFile = getFile(formData, "certificate");
        const certificateError =
            validateCertificateFile(certificateFile);

        if (certificateError) {
            return {
                status: "error",
                message: certificateError,
                fieldErrors: { certificate: [certificateError] },
            };
        }

        let uploadedCertificate: UploadedFile | null = null;

        try {
            if (certificateFile) {
                uploadedCertificate = await uploadCertificate(
                    supabase,
                    certificateFile,
                    "achievement-certificate"
                );
            }
        } catch (error) {
            return {
                status: "error",
                message: errorMessage(error),
                fieldErrors: {},
            };
        }

        const { error } = await supabase.from("achievements").insert({
            title: parsed.data.title,
            description: parsed.data.description,
            certificate_url:
                uploadedCertificate?.publicUrl ??
                parsed.data.certificate_url,
            team_members: parseTeamMembers(parsed.data.team_members),
        });

        if (error) {
            if (uploadedCertificate) {
                await removeImage(
                    supabase,
                    uploadedCertificate.publicUrl
                );
            }

            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        revalidateAchievements();

        return {
            status: "success",
            message: "Achievement added successfully.",
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

export async function updateAchievementAction(
    _previousState: AchievementActionState,
    formData: FormData
): Promise<AchievementActionState> {
    try {
        const { supabase } = await requireAdminAction();
        const id = String(formData.get("id") ?? "");

        if (!UUID_PATTERN.test(id)) {
            return {
                status: "error",
                message: "Invalid achievement ID.",
                fieldErrors: {},
            };
        }

        const parsed = achievementFormSchema.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!parsed.success) {
            return {
                status: "error",
                message: "Please check the form again.",
                fieldErrors: fieldErrorsFromZod(parsed.error),
            };
        }

        const certificateFile = getFile(formData, "certificate");
        const certificateError =
            validateCertificateFile(certificateFile);

        if (certificateError) {
            return {
                status: "error",
                message: certificateError,
                fieldErrors: { certificate: [certificateError] },
            };
        }

        const { data: existing, error: existingError } = await supabase
            .from("achievements")
            .select("certificate_url")
            .eq("id", id)
            .maybeSingle();

        if (existingError) {
            return {
                status: "error",
                message: existingError.message,
                fieldErrors: {},
            };
        }

        if (!existing) {
            return {
                status: "error",
                message: "Achievement not found.",
                fieldErrors: {},
            };
        }

        const { certificate_url: existingCertificate } =
            existing as Pick<AchievementRow, "certificate_url">;

        let uploadedCertificate: UploadedFile | null = null;

        try {
            if (certificateFile) {
                uploadedCertificate = await uploadCertificate(
                    supabase,
                    certificateFile,
                    "achievement-certificate"
                );
            }
        } catch (error) {
            return {
                status: "error",
                message: errorMessage(error),
                fieldErrors: {},
            };
        }

        const nextCertificate =
            uploadedCertificate?.publicUrl ??
            parsed.data.certificate_url;

        const { error } = await supabase
            .from("achievements")
            .update({
                title: parsed.data.title,
                description: parsed.data.description,
                certificate_url: nextCertificate,
                team_members: parseTeamMembers(
                    parsed.data.team_members
                ),
            })
            .eq("id", id);

        if (error) {
            if (uploadedCertificate) {
                await removeImage(
                    supabase,
                    uploadedCertificate.publicUrl
                );
            }

            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        if (nextCertificate !== existingCertificate) {
            await removeImage(supabase, existingCertificate);
        }

        revalidateAchievements();

        return {
            status: "success",
            message: "Achievement updated successfully.",
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

export async function deleteAchievementAction(
    id: string
): Promise<AchievementActionState> {
    try {
        const { supabase } = await requireAdminAction();

        if (!UUID_PATTERN.test(id)) {
            return {
                status: "error",
                message: "Invalid achievement ID.",
                fieldErrors: {},
            };
        }

        const { data: existing, error: existingError } = await supabase
            .from("achievements")
            .select("thumbnail_url, certificate_url")
            .eq("id", id)
            .maybeSingle();

        if (existingError) {
            return {
                status: "error",
                message: existingError.message,
                fieldErrors: {},
            };
        }

        if (!existing) {
            return {
                status: "error",
                message: "Achievement not found.",
                fieldErrors: {},
            };
        }

        const { error } = await supabase
            .from("achievements")
            .delete()
            .eq("id", id);

        if (error) {
            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        const { thumbnail_url: thumbnailUrl, certificate_url: certificateUrl } =
            existing as Pick<
                AchievementRow,
                "thumbnail_url" | "certificate_url"
            >;

        await removeImage(supabase, thumbnailUrl);
        await removeImage(supabase, certificateUrl);
        revalidateAchievements();

        return {
            status: "success",
            message: "Achievement deleted successfully.",
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
