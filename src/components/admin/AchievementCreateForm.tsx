"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { createAchievementAction } from "@/app/admin/achievement-actions";
import Toast from "@/components/admin/Toast";
import type { AchievementActionState } from "@/types/project";

const initialState: AchievementActionState = {
    status: "idle",
    message: "",
    fieldErrors: {},
};

const fieldClass =
    "w-full border border-hitam/25 bg-putih px-3 py-2.5 font-body text-sm text-hitam outline-none transition-colors placeholder:text-abu/60 focus:border-aksen";
const labelClass =
    "font-body text-[10px] uppercase tracking-[0.18em] text-abu";
const hintClass = "font-body text-[10px] leading-relaxed text-abu";

export default function AchievementCreateForm() {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(
        createAchievementAction,
        initialState
    );
    const [dismissedState, setDismissedState] =
        useState<AchievementActionState | null>(null);

    const activeToast =
        state.status === "error" && state !== dismissedState
            ? { message: state.message, tone: "error" as const }
            : null;

    useEffect(() => {
        if (state.status === "success") {
            router.push("/admin");
            router.refresh();
        }
    }, [state, router]);

    const fieldError = (name: string): string | null =>
        state.fieldErrors[name]?.[0] ?? null;

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
                        Tambah Prestasi<span className="text-aksen">.</span>
                    </h1>
                </div>
                <p className="max-w-md font-body text-[13px] leading-relaxed text-abu">
                    Tambahkan sertifikat, judul, deskripsi, dan anggota tim.
                    Sertifikat bisa berupa gambar atau URL PDF.
                </p>
            </div>

            <form
                action={formAction}
                className="border border-hitam/20 bg-putih p-5 sm:p-7"
            >
                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>Judul prestasi</span>
                        <input
                            className={fieldClass}
                            name="title"
                            required
                            maxLength={160}
                            autoFocus
                            placeholder="Juara 1 kompetisi..."
                        />
                        {fieldError("title") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {fieldError("title")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>Deskripsi</span>
                        <textarea
                            className={`${fieldClass} min-h-24 resize-y`}
                            name="description"
                            maxLength={1000}
                            rows={4}
                            placeholder="Deskripsi singkat prestasi..."
                        />
                        {fieldError("description") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {fieldError("description")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>
                            Anggota tim / partner
                        </span>
                        <input
                            className={fieldClass}
                            name="team_members"
                            maxLength={1500}
                            placeholder="Nama 1, Nama 2, Nama 3"
                        />
                        <span className={hintClass}>
                            Pisahkan dengan koma. Kosongkan jika individu.
                        </span>
                        {fieldError("team_members") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {fieldError("team_members")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className={labelClass}>Thumbnail</span>
                        <input
                            className="block w-full cursor-pointer border border-hitam/25 bg-putih px-3 py-2.5 font-body text-[11px] text-abu file:mr-3 file:cursor-pointer file:border-0 file:bg-hitam file:px-3 file:py-1.5 file:font-body file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-putih hover:border-aksen"
                            type="file"
                            name="thumbnail"
                            accept="image/png,image/jpeg,image/webp"
                        />
                        <span className={hintClass}>
                            Foto utama prestasi. PNG, JPG, atau WebP. Maksimal
                            2 MB.
                        </span>
                        {fieldError("thumbnail") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {fieldError("thumbnail")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2">
                        <span className={labelClass}>Sertifikat gambar</span>
                        <input
                            className="block w-full cursor-pointer border border-hitam/25 bg-putih px-3 py-2.5 font-body text-[11px] text-abu file:mr-3 file:cursor-pointer file:border-0 file:bg-hitam file:px-3 file:py-1.5 file:font-body file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-putih hover:border-aksen"
                            type="file"
                            name="certificate"
                            accept="image/png,image/jpeg,image/webp"
                        />
                        <span className={hintClass}>
                            PNG, JPG, atau WebP. Maksimal 2 MB.
                        </span>
                        {fieldError("certificate") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {fieldError("certificate")}
                            </span>
                        ) : null}
                    </label>

                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>
                            URL sertifikat (opsional)
                        </span>
                        <input
                            className={fieldClass}
                            type="url"
                            name="certificate_url"
                            maxLength={500}
                            placeholder="https://..."
                        />
                        <span className={hintClass}>
                            Untuk PDF atau tautan eksternal. Upload gambar
                            sertifikat akan diprioritaskan.
                        </span>
                        {fieldError("certificate_url") ? (
                            <span className="font-body text-[11px] text-aksen">
                                {fieldError("certificate_url")}
                            </span>
                        ) : null}
                    </label>
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
                        {pending ? "Menyimpan..." : "Tambah Prestasi"}
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
