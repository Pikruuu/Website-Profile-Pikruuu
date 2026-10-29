"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdminAction } from "@/lib/auth";
import { PROJECTS_CACHE_TAG } from "@/lib/data/projects";
import { slugify } from "@/lib/projects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
    CATEGORY_IDS,
    EVIDENCE_TYPE_IDS,
    PROJECT_NATURE_IDS,
    type ProjectActionState,
    type ProjectEvidence,
    type ProjectInsert,
    type ProjectNature,
    type ProjectRow,
    type ProjectUpdate,
    type UploadedImage,
} from "@/types/project";

const BUCKET = "project-images";
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
] as const;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDateOnly(value: string): boolean {
    const date = new Date(`${value}T00:00:00Z`);

    return (
        !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value
    );
}

const startDateSchema = z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? "")
    .refine((value) => value.length > 0, "Start date is required.")
    .refine(
        (value) => DATE_ONLY_PATTERN.test(value) && isValidDateOnly(value),
        "Invalid start date."
    );

const optionalDateSchema = z
    .string()
    .trim()
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null))
    .refine(
        (value) =>
            value === null ||
            (DATE_ONLY_PATTERN.test(value) && isValidDateOnly(value)),
        "Invalid end date."
    );

const evidenceItemSchema = z.object({
    id: z
        .string()
        .trim()
        .max(80)
        .regex(/^[a-zA-Z0-9-]*$/)
        .optional()
        .default(""),
    label: z
        .string()
        .trim()
        .min(1, "Evidence title is required.")
        .max(120, "Evidence title must be at most 120 characters."),
    type: z.enum(EVIDENCE_TYPE_IDS),
    url: z
        .string()
        .trim()
        .max(500)
        .refine(
            (value) => /^https?:\/\/\S+$/i.test(value),
            "Evidence URL must start with http:// or https://."
        ),
});

const evidenceListSchema = z
    .array(evidenceItemSchema)
    .max(50, "Maximum of 50 evidence items per project.");

const projectFormSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(2, "Title must be at least 2 characters.")
            .max(140, "Title must be at most 140 characters."),
        slug: z.string().trim().max(140).optional().default(""),
        description: z
            .string()
            .trim()
            .min(10, "Description must be at least 10 characters.")
            .max(2000, "Description must be at most 2000 characters."),
        category: z.enum(CATEGORY_IDS),
        project_type: z.enum(PROJECT_NATURE_IDS).optional().default("real"),
        tech_stack: z.string().max(1000).optional().default(""),
        start_date: startDateSchema,
        end_date: optionalDateSchema,
        team_contribution: z
            .string()
            .trim()
            .max(1000, "Contribution must be at most 1000 characters.")
            .optional()
            .transform((value) => (value && value.length > 0 ? value : null)),
        evidence: z.string().max(60000).optional().default("[]"),
        featured: z.preprocess(
            (value) => value === "on" || value === "true",
            z.boolean()
        ),
    })
    .refine(
        (data) =>
            !data.end_date ||
            !data.start_date ||
            data.end_date >= data.start_date,
        {
            path: ["end_date"],
            message: "End date cannot be before start date.",
        }
    );

interface ParsedProject {
    title: string;
    slug: string;
    description: string;
    category: ProjectRow["category"];
    project_type: ProjectNature;
    tech_stack: string[];
    start_date: string;
    end_date: string | null;
    team_contribution: string | null;
    evidence: ProjectEvidence[];
    featured: boolean;
}

type ParseResult =
    | { ok: true; data: ParsedProject }
    | { ok: false; state: ProjectActionState };

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

function parseTechStack(value: string): string[] {
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

function parseProjectForm(formData: FormData): ParseResult {
    const parsed = projectFormSchema.safeParse(
        Object.fromEntries(formData.entries())
    );

    if (!parsed.success) {
        return {
            ok: false,
            state: {
                status: "error",
                message: "Please check the form again.",
                fieldErrors: fieldErrorsFromZod(parsed.error),
            },
        };
    }

    const slug = (parsed.data.slug || slugify(parsed.data.title)).trim();

    if (!SLUG_PATTERN.test(slug)) {
        return {
            ok: false,
            state: {
                status: "error",
                message: "Invalid slug.",
                fieldErrors: {
                    slug: [
                        "Slug may only contain lowercase letters, numbers, and hyphens.",
                    ],
                },
            },
        };
    }

    let evidence: ProjectEvidence[] = [];

    try {
        const evidenceParsed = evidenceListSchema.safeParse(
            JSON.parse(parsed.data.evidence)
        );

        if (!evidenceParsed.success) {
            return {
                ok: false,
                state: {
                    status: "error",
                    message: "Please check the evidence again.",
                    fieldErrors: {
                        evidence: [
                            evidenceParsed.error.issues[0]?.message ??
                                "Invalid evidence.",
                        ],
                    },
                },
            };
        }

        evidence = evidenceParsed.data.map((item, index) => ({
            ...item,
            id:
                item.id ||
                `ev-${Date.now()}-${String(index + 1).padStart(2, "0")}`,
        }));
    } catch {
        return {
            ok: false,
            state: {
                status: "error",
                message: "Invalid evidence format.",
                fieldErrors: {
                    evidence: ["Invalid evidence format."],
                },
            },
        };
    }

    return {
        ok: true,
        data: {
            title: parsed.data.title,
            slug,
            description: parsed.data.description,
            category: parsed.data.category,
            project_type: parsed.data.project_type,
            tech_stack: parseTechStack(parsed.data.tech_stack),
            start_date: parsed.data.start_date,
            end_date: parsed.data.end_date,
            team_contribution: parsed.data.team_contribution,
            evidence,
            featured: parsed.data.featured,
        },
    };
}

function getImageFile(formData: FormData): File | null {
    const entry = formData.get("image");

    return entry instanceof File && entry.size > 0 ? entry : null;
}

function validateImageFile(file: File | null): string | null {
    if (!file) {
        return null;
    }

    if (
        !(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)
    ) {
        return "Image must be in PNG, JPG, or WebP format.";
    }

    if (file.size > MAX_IMAGE_SIZE) {
        return "Image size must be at most 2 MB.";
    }

    return null;
}

async function uploadImage(
    supabase: SupabaseClient,
    file: File,
    slug: string
): Promise<UploadedImage> {
    const rawExtension = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const extension = ["png", "jpg", "jpeg", "webp"].includes(rawExtension)
        ? rawExtension
        : "png";
    const path = `${slug}-${crypto.randomUUID()}.${extension}`;

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

function revalidatePortfolio(slugs: string[] = []): void {
    revalidateTag(PROJECTS_CACHE_TAG, { expire: 0 });
    revalidatePath("/");
    revalidatePath("/project");
    revalidatePath("/about");
    revalidatePath("/cv");
    revalidatePath("/admin");

    new Set(slugs.filter(Boolean)).forEach((slug) => {
        revalidatePath(`/project/${slug}`);
    });
}

function uniqueSlugError(): ProjectActionState {
    return {
        status: "error",
        message: "Slug is already used by another project.",
        fieldErrors: { slug: ["Slug is already used by another project."] },
    };
}

export async function createProjectAction(
    _previousState: ProjectActionState,
    formData: FormData
): Promise<ProjectActionState> {
    try {
        const { supabase } = await requireAdminAction();
        const parsed = parseProjectForm(formData);

        if (!parsed.ok) {
            return parsed.state;
        }

        const imageFile = getImageFile(formData);
        const imageError = validateImageFile(imageFile);

        if (imageError) {
            return {
                status: "error",
                message: imageError,
                fieldErrors: { image: [imageError] },
            };
        }

        let uploaded: UploadedImage | null = null;

        if (imageFile) {
            uploaded = await uploadImage(
                supabase,
                imageFile,
                parsed.data.slug
            );
        }

        const payload: ProjectInsert = {
            ...parsed.data,
            image_url: uploaded?.publicUrl ?? null,
        };

        const { error } = await supabase.from("projects").insert(payload);

        if (error) {
            if (uploaded) {
                await removeImage(supabase, uploaded.publicUrl);
            }

            if (error.code === "23505") {
                return uniqueSlugError();
            }

            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        revalidatePortfolio([parsed.data.slug]);

        return {
            status: "success",
            message: "Project added successfully.",
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

export async function updateProjectAction(
    _previousState: ProjectActionState,
    formData: FormData
): Promise<ProjectActionState> {
    try {
        const { supabase } = await requireAdminAction();
        const id = String(formData.get("id") ?? "");

        if (!UUID_PATTERN.test(id)) {
            return {
                status: "error",
                message: "Invalid project ID.",
                fieldErrors: {},
            };
        }

        const parsed = parseProjectForm(formData);

        if (!parsed.ok) {
            return parsed.state;
        }

        const imageFile = getImageFile(formData);
        const imageError = validateImageFile(imageFile);

        if (imageError) {
            return {
                status: "error",
                message: imageError,
                fieldErrors: { image: [imageError] },
            };
        }

        const { data: existing, error: existingError } = await supabase
            .from("projects")
            .select("image_url, slug")
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
                message: "Project not found.",
                fieldErrors: {},
            };
        }

        const { image_url: existingImage, slug: existingSlug } =
            existing as Pick<ProjectRow, "image_url" | "slug">;
        let uploaded: UploadedImage | null = null;

        if (imageFile) {
            uploaded = await uploadImage(
                supabase,
                imageFile,
                parsed.data.slug
            );
        }

        const payload: ProjectUpdate = {
            ...parsed.data,
            image_url: uploaded?.publicUrl ?? existingImage,
        };

        const { error } = await supabase
            .from("projects")
            .update(payload)
            .eq("id", id);

        if (error) {
            if (uploaded) {
                await removeImage(supabase, uploaded.publicUrl);
            }

            if (error.code === "23505") {
                return uniqueSlugError();
            }

            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        if (uploaded) {
            await removeImage(supabase, existingImage);
        }

        revalidatePortfolio([existingSlug, parsed.data.slug]);

        return {
            status: "success",
            message: "Project updated successfully.",
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

export async function deleteProjectAction(
    id: string
): Promise<ProjectActionState> {
    try {
        const { supabase } = await requireAdminAction();

        if (!UUID_PATTERN.test(id)) {
            return {
                status: "error",
                message: "Invalid project ID.",
                fieldErrors: {},
            };
        }

        const { data: existing, error: existingError } = await supabase
            .from("projects")
            .select("image_url, slug")
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
                message: "Project not found.",
                fieldErrors: {},
            };
        }

        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (error) {
            return {
                status: "error",
                message: error.message,
                fieldErrors: {},
            };
        }

        const { image_url: existingImage, slug: existingSlug } =
            existing as Pick<ProjectRow, "image_url" | "slug">;

        await removeImage(supabase, existingImage);
        revalidatePortfolio([existingSlug]);

        return {
            status: "success",
            message: "Project deleted successfully.",
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

export async function logoutAction(): Promise<void> {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
        await supabase.auth.signOut();
    }

    revalidatePath("/", "layout");
    redirect("/login");
}
