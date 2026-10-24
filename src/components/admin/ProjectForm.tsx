"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import {
    createProjectAction,
    updateProjectAction,
} from "@/app/admin/actions";
import Toast, { type ToastTone } from "@/components/admin/Toast";
import {
    CATEGORY_LABELS,
    EVIDENCE_TYPE_LABELS,
    slugify,
    usesTechStack,
} from "@/lib/projects";
import {
    EVIDENCE_TYPE_IDS,
    PROJECT_CATEGORY_IDS,
    PUBLICATION_CATEGORY_IDS,
    type ProjectActionState,
    type ProjectEvidence,
    type ProjectRow,
} from "@/types/project";

interface ProjectFormProps {
    mode: "create" | "edit";
    project?: ProjectRow;
    technologies: string[];
}

const initialState: ProjectActionState = {
    status: "idle",
    message: "",
    fieldErrors: {},
};

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
    "image/png",
    "image/jpeg",
    "image/webp",
] as const;

const fieldClass =
    "w-full border border-hitam/25 bg-putih px-3 py-2.5 font-body text-sm text-hitam outline-none transition-colors placeholder:text-abu/60 focus:border-aksen";
const labelClass =
    "font-body text-[10px] uppercase tracking-[0.18em] text-abu";
const hintClass = "font-body text-[10px] leading-relaxed text-abu";

export default function ProjectForm({
    mode,
    project,
    technologies,
}: ProjectFormProps) {
    const router = useRouter();
    const action =
        mode === "edit" ? updateProjectAction : createProjectAction;
    const [state, formAction, pending] = useActionState(
        action,
        initialState
    );
    const [title, setTitle] = useState(project?.title ?? "");
    const [slug, setSlug] = useState(project?.slug ?? "");
    const [category, setCategory] = useState(
        project?.category ?? "web"
    );
    const [evidence, setEvidence] = useState<ProjectEvidence[]>(
        project?.evidence ?? []
    );
    const [techStack, setTechStack] = useState<string[]>(
        project?.tech_stack ?? []
    );
    const [slugEdited, setSlugEdited] = useState(mode === "edit");
    const [preview, setPreview] = useState<string | null>(
        project?.image_url ?? null
    );
    const [objectUrl, setObjectUrl] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string | null>(null);
    const [dismissedState, setDismissedState] =
        useState<ProjectActionState | null>(null);

    const displayedSlug = slugEdited ? slug : slugify(title);
    const activeToast: { message: string; tone: ToastTone } | null =
        state.status !== "idle" && state !== dismissedState
            ? {
                  message: state.message,
                  tone: state.status === "success" ? "success" : "error",
              }
            : null;

    useEffect(() => {
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    useEffect(() => {
        if (state.status !== "success") {
            return;
        }

        if (mode === "edit") {
            router.refresh();
            return;
        }

        router.replace("/admin");
    }, [state, mode, router]);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            setImageError(null);
            return;
        }

        if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
            setImageError("Gambar harus berformat PNG, JPG, atau WebP.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setImageError("Ukuran gambar maksimal 2 MB.");
            event.target.value = "";
            return;
        }

        if (objectUrl) {
            URL.revokeObjectURL(objectUrl);
        }

        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        setPreview(url);
        setImageError(null);
    };

    const firstFieldError = (name: string): string | null =>
        state.fieldErrors[name]?.[0] ?? null;

    const imageFieldError = imageError ?? firstFieldError("image");

    const addEvidence = () => {
        setEvidence((current) => [
            ...current,
            {
                id: `ev-${Date.now()}-${Math.random()
                    .toString(36)
                    .slice(2, 10)}`,
                label: "",
                type: "documentation",
                url: "",
            },
        ]);
    };

    const updateEvidence = (
        id: string,
        updates: Partial<ProjectEvidence>
    ) => {
        setEvidence((current) =>
            current.map((item) =>
                item.id === id ? { ...item, ...updates } : item
            )
        );
    };

    const removeEvidence = (id: string) => {
        setEvidence((current) =>
            current.filter((item) => item.id !== id)
        );
    };

    const availableTechnologies = technologies.filter(
        (technology) =>
            !techStack.some(
                (selected) =>
                    selected.toLowerCase() === technology.toLowerCase()
            )
    );

    const addTechnology = (value: string) => {
        if (!value || techStack.length >= 20) {
            return;
        }

        setTechStack((current) =>
            current.some(
                (item) => item.toLowerCase() === value.toLowerCase()
            )
                ? current
                : [...current, value]
        );
    };

    const removeTechnology = (value: string) => {
        setTechStack((current) =>
            current.filter((item) => item !== value)
        );
    };

    return (
        <div className="mx-auto w-full max-w-4xl">
            <div className="mb-6 flex flex-col gap-3 border-b border-hitam/15 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <Link
                        href="/admin"
                        className="inline-flex min-h-9 items-center justify-center gap-2 border border-hitam bg-hitam px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen"
                    >
                        <span aria-hidden="true">←</span> Dashboard
                    </Link>
                    <h1 className="mt-3 font-display text-2xl leading-tight sm:text-3xl">
                        {mode === "edit" ? "Edit Project" : "Tambah Project"}
                        <span className="text-aksen">.</span>
                    </h1>
                </div>
                <p className="max-w-md font-body text-[13px] leading-relaxed text-abu">
                    {mode === "edit"
                        ? "Perbarui detail project. Gambar lama otomatis diganti jika kamu mengunggah gambar baru."
                        : "Isi detail project baru. Gambar bersifat opsional dan bisa ditambahkan nanti."}
                </p>
            </div>

            <form
                action={formAction}
                className="border border-hitam/20 bg-putih p-5 sm:p-7"
            >
                {project ? (
                    <input type="hidden" name="id" value={project.id} />
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>Judul</span>
                        <input
                            className={fieldClass}
                            name="title"
                            value={title}
                            onChange={(event) => setTitle(event.target.value)}
                            required
                            maxLength={140}
                            placeholder="Nama project"
                        />
                        {firstFieldError("title") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("title")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>Slug</span>
                        <input
                            className={fieldClass}
                            name="slug"
                            value={displayedSlug}
                            onChange={(event) => {
                                setSlugEdited(true);
                                setSlug(event.target.value);
                            }}
                            maxLength={140}
                            placeholder="nama-project"
                        />
                        <span className={hintClass}>
                            Otomatis dari judul, tetapi bisa diedit. Gunakan
                            huruf kecil, angka, dan tanda hubung.
                        </span>
                        {firstFieldError("slug") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("slug")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className={labelClass}>Kategori</span>
                        <select
                            className={fieldClass}
                            name="category"
                            value={category}
                            onChange={(event) =>
                                setCategory(
                                    event.target.value as ProjectRow["category"]
                                )
                            }
                            required
                        >
                            <optgroup label="Project">
                                {PROJECT_CATEGORY_IDS.map((category) => (
                                    <option key={category} value={category}>
                                        {CATEGORY_LABELS[category]}
                                    </option>
                                ))}
                            </optgroup>
                            <optgroup label="Publikasi">
                                {PUBLICATION_CATEGORY_IDS.map((category) => (
                                    <option key={category} value={category}>
                                        {CATEGORY_LABELS[category]}
                                    </option>
                                ))}
                            </optgroup>
                        </select>
                        {firstFieldError("category") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("category")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className={labelClass}>Tanggal Mulai</span>
                        <input
                            className={fieldClass}
                            type="date"
                            name="start_date"
                            defaultValue={project?.start_date ?? ""}
                            required
                        />
                        {firstFieldError("start_date") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("start_date")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className={labelClass}>Tanggal Selesai</span>
                        <input
                            className={fieldClass}
                            type="date"
                            name="end_date"
                            defaultValue={project?.end_date ?? ""}
                        />
                        <span className={hintClass}>
                            Kosongkan jika project masih berjalan.
                        </span>
                        {firstFieldError("end_date") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("end_date")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex items-center gap-3 border border-hitam/15 px-3 py-3">
                        <input
                            type="checkbox"
                            name="featured"
                            defaultChecked={project?.featured ?? false}
                            className="h-4 w-4 accent-aksen"
                        />
                        <span>
                            <span className="block font-body text-[11px] uppercase tracking-[0.14em]">
                                Featured
                            </span>
                            <span className="mt-1 block font-body text-[11px] text-abu">
                                Tandai sebagai project unggulan.
                            </span>
                        </span>
                    </label>

                    {usesTechStack(category) ? (
                        <div className="flex flex-col gap-4 border border-hitam/15 bg-white/30 p-4 sm:col-span-2">
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <span className={labelClass}>
                                        Tech stack
                                    </span>
                                    <p className={`${hintClass} mt-1`}>
                                        Pilih dari teknologi yang sudah kamu
                                        kuasai.
                                    </p>
                                </div>
                                <span className="font-body text-[10px] uppercase tracking-[0.14em] text-abu">
                                    {techStack.length}/20
                                </span>
                            </div>

                            {techStack.length > 0 ? (
                                <ul className="flex flex-wrap gap-2">
                                    {techStack.map((technology) => (
                                        <li
                                            key={technology}
                                            className="flex items-center gap-2 border border-hitam/20 bg-putih px-3 py-1.5"
                                        >
                                            <span className="font-body text-[10px] uppercase tracking-[0.12em]">
                                                {technology}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeTechnology(
                                                        technology
                                                    )
                                                }
                                                aria-label={`Hapus ${technology}`}
                                                className="flex h-4 w-4 items-center justify-center text-sm leading-none text-abu transition-colors hover:text-aksen"
                                            >
                                                ×
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="border border-dashed border-hitam/25 px-4 py-5 text-center font-body text-[11px] leading-relaxed text-abu">
                                    Belum ada teknologi dipilih.
                                </p>
                            )}

                            <label className="flex flex-col gap-2">
                                <span className={labelClass}>
                                    Tambah teknologi
                                </span>
                                <select
                                    className={fieldClass}
                                    value=""
                                    onChange={(event) =>
                                        addTechnology(event.target.value)
                                    }
                                    disabled={
                                        techStack.length >= 20 ||
                                        availableTechnologies.length === 0
                                    }
                                >
                                    <option value="">
                                        Pilih teknologi...
                                    </option>
                                    {availableTechnologies.map(
                                        (technology) => (
                                            <option
                                                key={technology}
                                                value={technology}
                                            >
                                                {technology}
                                            </option>
                                        )
                                    )}
                                </select>
                            </label>

                            {technologies.length === 0 ? (
                                <p className={hintClass}>
                                    Daftar teknologi masih kosong. Tambahkan
                                    dulu di dashboard bagian Technologies Used.
                                </p>
                            ) : availableTechnologies.length === 0 &&
                              techStack.length < 20 ? (
                                <p className={hintClass}>
                                    Semua teknologi sudah dipilih.
                                </p>
                            ) : null}

                            <input
                                type="hidden"
                                name="tech_stack"
                                value={techStack.join(", ")}
                            />

                            {firstFieldError("tech_stack") ? (
                                <span className="font-body text-[11px] text-aksen">
                                    {firstFieldError("tech_stack")}
                                </span>
                            ) : null}
                        </div>
                    ) : null}

                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>Deskripsi</span>
                        <textarea
                            className={`${fieldClass} min-h-28 resize-y`}
                            name="description"
                            defaultValue={project?.description ?? ""}
                            required
                            maxLength={2000}
                            rows={5}
                            placeholder="Ceritakan project ini secara singkat."
                        />
                        {firstFieldError("description") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("description")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>
                            Kontribusi Tim / Partner
                        </span>
                        <textarea
                            className={`${fieldClass} min-h-24 resize-y`}
                            name="team_contribution"
                            defaultValue={project?.team_contribution ?? ""}
                            maxLength={1000}
                            rows={3}
                            placeholder="Contoh: Tim pengabdian masyarakat Telkom University — riset AI dan integrasi perangkat."
                        />
                        {firstFieldError("team_contribution") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("team_contribution")}
                            </span>
                        ) : null}
                    </label>

                    <div className="flex flex-col gap-4 border border-hitam/15 p-4 sm:col-span-2">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <span className={labelClass}>Evidence</span>
                                <p className={`${hintClass} mt-1 max-w-xl`}>
                                    Dokumentasi, sertifikat, laporan, atau
                                    tautan pendukung lainnya. Bisa tambah
                                    sebanyak yang dibutuhkan.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={addEvidence}
                                className="inline-flex min-h-9 shrink-0 items-center justify-center border border-hitam/25 px-3 py-2 font-body text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-aksen hover:bg-aksen hover:text-putih"
                            >
                                + Tambah Evidence
                            </button>
                        </div>

                        <input
                            type="hidden"
                            name="evidence"
                            value={JSON.stringify(evidence)}
                        />

                        {evidence.length === 0 ? (
                            <p className="border border-dashed border-hitam/25 px-4 py-6 text-center font-body text-[11px] leading-relaxed text-abu">
                                Belum ada evidence.
                            </p>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {evidence.map((item, index) => (
                                    <li
                                        key={item.id}
                                        className="border border-hitam/15 bg-white/30 p-3"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="font-body text-[9px] uppercase tracking-[0.16em] text-abu">
                                                Evidence{" "}
                                                {String(index + 1).padStart(
                                                    2,
                                                    "0"
                                                )}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeEvidence(item.id)
                                                }
                                                className="font-body text-[9px] uppercase tracking-[0.16em] text-aksen transition-colors hover:text-hitam"
                                            >
                                                Hapus
                                            </button>
                                        </div>

                                        <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,1fr)_11rem]">
                                            <label className="flex flex-col gap-2">
                                                <span className={labelClass}>
                                                    Judul
                                                </span>
                                                <input
                                                    className={fieldClass}
                                                    value={item.label}
                                                    onChange={(event) =>
                                                        updateEvidence(
                                                            item.id,
                                                            {
                                                                label: event
                                                                    .target
                                                                    .value,
                                                            }
                                                        )
                                                    }
                                                    maxLength={120}
                                                    required
                                                    placeholder="Sertifikat, laporan, dokumentasi..."
                                                />
                                            </label>
                                            <label className="flex flex-col gap-2">
                                                <span className={labelClass}>
                                                    Tipe
                                                </span>
                                                <select
                                                    className={fieldClass}
                                                    value={item.type}
                                                    onChange={(event) =>
                                                        updateEvidence(
                                                            item.id,
                                                            {
                                                                type: event
                                                                    .target
                                                                    .value as ProjectEvidence["type"],
                                                            }
                                                        )
                                                    }
                                                >
                                                    {EVIDENCE_TYPE_IDS.map(
                                                        (type) => (
                                                            <option
                                                                key={type}
                                                                value={type}
                                                            >
                                                                {
                                                                    EVIDENCE_TYPE_LABELS[
                                                                        type
                                                                    ]
                                                                }
                                                            </option>
                                                        )
                                                    )}
                                                </select>
                                            </label>
                                        </div>

                                        <label className="mt-3 flex flex-col gap-2">
                                            <span className={labelClass}>
                                                URL
                                            </span>
                                            <input
                                                className={fieldClass}
                                                type="url"
                                                value={item.url}
                                                onChange={(event) =>
                                                    updateEvidence(item.id, {
                                                        url: event.target
                                                            .value,
                                                    })
                                                }
                                                maxLength={500}
                                                required
                                                placeholder="https://..."
                                            />
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {firstFieldError("evidence") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {firstFieldError("evidence")}
                            </span>
                        ) : null}
                    </div>

                    <div className="flex flex-col gap-3 sm:col-span-2">
                        <span className={labelClass}>Gambar</span>
                        <div className="relative aspect-[16/10] w-full overflow-hidden border border-hitam/20 bg-hitam/[0.04]">
                            {preview ? (
                                <div
                                    role="img"
                                    aria-label="Preview gambar project"
                                    className="h-full w-full bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url("${preview}")`,
                                    }}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center px-4 text-center font-body text-[11px] uppercase tracking-[0.14em] text-abu">
                                    Belum ada gambar
                                </div>
                            )}
                        </div>
                        <input
                            className="block w-full cursor-pointer border border-hitam/25 bg-putih px-3 py-2.5 font-body text-[11px] text-abu file:mr-3 file:cursor-pointer file:border-0 file:bg-hitam file:px-3 file:py-1.5 file:font-body file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-putih hover:border-aksen"
                            type="file"
                            name="image"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleImageChange}
                        />
                        <span className={hintClass}>
                            PNG, JPG, atau WebP. Maksimal 2 MB.
                        </span>
                        {imageFieldError ? (
                            <span className="font-body text-[11px] text-aksen">
                                {imageFieldError}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-2 border-t border-hitam/15 pt-5 sm:flex-row sm:justify-end">
                    <Link
                        href="/admin"
                        className="inline-flex min-h-10 items-center justify-center border border-hitam/25 px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex min-h-10 items-center justify-center gap-2 border border-hitam bg-hitam px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending
                            ? "Menyimpan..."
                            : mode === "edit"
                              ? "Simpan Perubahan"
                              : "Tambah Project"}
                        <span aria-hidden="true">→</span>
                    </button>
                </div>
            </form>

            {activeToast ? (
                <Toast
                    message={activeToast.message}
                    tone={activeToast.tone}
                    onClose={() => setDismissedState(state)}
                />
            ) : null}
        </div>
    );
}
