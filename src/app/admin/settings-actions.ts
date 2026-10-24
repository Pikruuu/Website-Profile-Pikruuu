"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth";
import { SETTINGS_CACHE_TAG, SETTINGS_ID } from "@/lib/data/settings";
import type { SettingsActionState } from "@/types/project";

const aboutSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Nama minimal 2 karakter.")
        .max(120, "Nama maksimal 120 karakter."),
    nickname: z
        .string()
        .trim()
        .min(1, "Nama panggilan wajib diisi.")
        .max(80, "Nama panggilan maksimal 80 karakter."),
    education: z
        .string()
        .trim()
        .min(2, "Pendidikan minimal 2 karakter.")
        .max(200, "Pendidikan maksimal 200 karakter."),
    location: z
        .string()
        .trim()
        .min(2, "Lokasi minimal 2 karakter.")
        .max(120, "Lokasi maksimal 120 karakter."),
    email: z
        .string()
        .trim()
        .email("Format email tidak valid.")
        .max(160, "Email maksimal 160 karakter."),
    summary: z
        .string()
        .trim()
        .min(10, "Ringkasan minimal 10 karakter.")
        .max(1500, "Ringkasan maksimal 1500 karakter."),
});

const listSchema = z
    .array(
        z
            .string()
            .trim()
            .min(1, "Nama teknologi tidak boleh kosong.")
            .max(40, "Nama teknologi maksimal 40 karakter.")
    )
    .max(30, "Maksimal 30 teknologi.");

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
        : "Terjadi kesalahan. Silakan coba lagi.";
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
                message: "Periksa kembali form.",
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
            message: "About berhasil diperbarui.",
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
                "Daftar teknologi tidak valid.";

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
            message: "Perubahan tersimpan otomatis.",
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


