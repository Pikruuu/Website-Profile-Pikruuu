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
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
] as const;
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
        "URL sertifikat harus diawali http:// atau https://."
    );

const achievementFormSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Judul prestasi minimal 2 karakter.")
        .max(160, "Judul prestasi maksimal 160 karakter."),
    description: z
        .string()
        .trim()
        .max(1000, "Deskripsi maksimal 1000 karakter.")
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
        : "Terjadi kesalahan. Silakan coba lagi.";
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

function validateImageFile(
    file: File | null,
    label: string
): string | null {
    if (!file) {
        return null;
    }

    if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
        return `${label} harus berformat PNG, JPG, atau WebP.`;
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return `Ukuran gambar ${label.toLowerCase()} maksimal 2 MB.`;
    }

    return null;
}

async function uploadImage(
    supabase: SupabaseClient,
    file: File,
    prefix: string,
    label: string
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
        throw new Error(`Upload ${label} gagal: ${error.message}`);
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
                message: "Periksa kembali form.",
                fieldErrors: fieldErrorsFromZod(parsed.error),
            };
        }

        const thumbnailFile = getFile(formData, "thumbnail");
        const certificateFile = getFile(formData, "certificate");
        const thumbnailError = validateImageFile(
            thumbnailFile,
            "Thumbnail"
        );
        const certificateError = validateImageFile(
            certificateFile,
            "Sertifikat"
        );

        if (thumbnailError) {
            return {
                status: "error",
                message: thumbnailError,
                fieldErrors: { thumbnail: [thumbnailError] },
            };
        }

        if (certificateError) {
            return {
                status: "error",
                message: certificateError,
                fieldErrors: { certificate: [certificateError] },
            };
        }

        let uploadedThumbnail: UploadedFile | null = null;
        let uploadedCertificate: UploadedFile | null = null;

        try {
            if (thumbnailFile) {
                uploadedThumbnail = await uploadImage(
                    supabase,
                    thumbnailFile,
                    "achievement-thumb",
                    "thumbnail"
                );
            }

            if (certificateFile) {
                uploadedCertificate = await uploadImage(
                    supabase,
                    certificateFile,
                    "achievement-certificate",
                    "sertifikat"
                );
            }
        } catch (error) {
            if (uploadedThumbnail) {
                await removeImage(supabase, uploadedThumbnail.publicUrl);
            }

            return {
                status: "error",
                message: errorMessage(error),
                fieldErrors: {},
            };
        }

        const { error } = await supabase.from("achievements").insert({
            title: parsed.data.title,
            description: parsed.data.description,
            thumbnail_url: uploadedThumbnail?.publicUrl ?? null,
            certificate_url:
                uploadedCertificate?.publicUrl ??
                parsed.data.certificate_url,
            team_members: parseTeamMembers(parsed.data.team_members),
        });

        if (error) {
            if (uploadedThumbnail) {
                await removeImage(supabase, uploadedThumbnail.publicUrl);
            }

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
            message: "Prestasi berhasil ditambahkan.",
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
                message: "ID prestasi tidak valid.",
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
                message: "Prestasi tidak ditemukan.",
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
            message: "Prestasi berhasil dihapus.",
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
