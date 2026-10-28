"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import {
    createAchievementAction,
    updateAchievementAction,
} from "@/app/admin/achievement-actions";
import Toast from "@/components/admin/Toast";
import type {
    AchievementActionState,
    AchievementRow,
} from "@/types/project";

interface AchievementFormProps {
    mode: "create" | "edit";
    achievement?: AchievementRow;
}

const initialState: AchievementActionState = {
    status: "idle",
    message: "",
    fieldErrors: {},
};

const MAX_CERTIFICATE_SIZE = 5 * 1024 * 1024;
const CERTIFICATE_MIME_TYPE = "application/pdf";

const fieldClass =
    "w-full border border-hitam/25 bg-putih px-3 py-2.5 font-body text-sm text-hitam outline-none transition-colors placeholder:text-abu/60 focus:border-aksen";
const labelClass =
    "font-body text-[10px] uppercase tracking-[0.18em] text-abu";
const hintClass = "font-body text-[10px] leading-relaxed text-abu";
const fileClass =
    "block w-full cursor-pointer border border-hitam/25 bg-putih px-3 py-2.5 font-body text-[11px] text-abu file:mr-3 file:cursor-pointer file:border-0 file:bg-hitam file:px-3 file:py-1.5 file:font-body file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-putih hover:border-aksen";

export default function AchievementForm({
    mode,
    achievement,
}: AchievementFormProps) {
    const router = useRouter();
    const action =
        mode === "edit"
            ? updateAchievementAction
            : createAchievementAction;
    const [state, formAction, pending] = useActionState(
        action,
        initialState
    );
    const [dismissedState, setDismissedState] =
        useState<AchievementActionState | null>(null);
    const [certificateFileName, setCertificateFileName] = useState<
        string | null
    >(null);
    const [certificateError, setCertificateError] = useState<
        string | null
    >(null);

    const activeToast =
        state.status === "error" && state !== dismissedState
            ? { message: state.message, tone: "error" as const }
            : state.status === "success" && state !== dismissedState
              ? { message: state.message, tone: "success" as const }
              : null;

    useEffect(() => {
        if (state.status !== "success") {
            return;
        }

        router.replace("/admin");
        router.refresh();
    }, [state, router]);

    const fieldError = (name: string): string | null =>
        state.fieldErrors[name]?.[0] ?? null;

    const handleCertificateChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            setCertificateFileName(null);
            setCertificateError(null);
            return;
        }

        if (file.type !== CERTIFICATE_MIME_TYPE) {
            setCertificateError("Sertifikat harus berformat PDF.");
            setCertificateFileName(null);
            event.target.value = "";
            return;
        }

        if (file.size > MAX_CERTIFICATE_SIZE) {
            setCertificateError("Ukuran sertifikat maksimal 5 MB.");
            setCertificateFileName(null);
            event.target.value = "";
            return;
        }

        setCertificateFileName(file.name);
        setCertificateError(null);
    };

    const certificateFieldError =
        certificateError ?? fieldError("certificate");

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
                        {mode === "edit"
                            ? "Edit Prestasi"
                            : "Tambah Prestasi"}
                        <span className="text-aksen">.</span>
                    </h1>
                </div>
                <p className="max-w-md font-body text-[13px] leading-relaxed text-abu">
                    {mode === "edit"
                        ? "Perbarui detail prestasi. Sertifikat lama otomatis diganti jika kamu mengunggah berkas baru."
                        : "Tambahkan judul, deskripsi, anggota tim, dan unggah sertifikat dalam format PDF."}
                </p>
            </div>

            <form
                action={formAction}
                className="border border-hitam/20 bg-putih p-5 sm:p-7"
            >
                {achievement ? (
                    <input type="hidden" name="id" value={achievement.id} />
                ) : null}

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>Judul prestasi</span>
                        <input
                            className={fieldClass}
                            name="title"
                            defaultValue={achievement?.title ?? ""}
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
                            defaultValue={achievement?.description ?? ""}
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
                            defaultValue={achievement?.team_members.join(
                                ", "
                            )}
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

                    <div className="flex flex-col gap-3 sm:col-span-2">
                        <span className={labelClass}>Sertifikat PDF</span>
                        <div className="flex min-h-24 w-full flex-col justify-center gap-2 border border-hitam/20 bg-hitam/[0.04] px-4 py-5">
                            {certificateFileName ? (
                                <>
                                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-abu">
                                        File dipilih
                                    </p>
                                    <p className="font-body text-[12px] leading-relaxed [overflow-wrap:anywhere]">
                                        {certificateFileName}
                                    </p>
                                </>
                            ) : achievement?.certificate_url ? (
                                <a
                                    href={achievement.certificate_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-fit border-b border-hitam/30 pb-1 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen hover:text-aksen"
                                >
                                    Lihat sertifikat saat ini ↗
                                </a>
                            ) : (
                                <p className="font-body text-[11px] uppercase tracking-[0.14em] text-abu">
                                    Belum ada sertifikat PDF
                                </p>
                            )}
                        </div>
                        <input
                            className={fileClass}
                            type="file"
                            name="certificate"
                            accept="application/pdf"
                            onChange={handleCertificateChange}
                        />
                        <span className={hintClass}>
                            PDF. Maksimal 5 MB.
                        </span>
                        {certificateFieldError ? (
                            <span className="font-body text-[11px] text-aksen">
                                {certificateFieldError}
                            </span>
                        ) : null}
                    </div>

                    <label className="flex flex-col gap-2 sm:col-span-2">
                        <span className={labelClass}>
                            URL sertifikat (opsional)
                        </span>
                        <input
                            className={fieldClass}
                            type="url"
                            name="certificate_url"
                            defaultValue={
                                achievement?.certificate_url ?? ""
                            }
                            maxLength={500}
                            placeholder="https://..."
                        />
                        <span className={hintClass}>
                            Tautan eksternal PDF. Upload sertifikat akan
                            diprioritaskan. Kosongkan untuk menghapus
                            sertifikat.
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
                        {pending
                            ? "Menyimpan..."
                            : mode === "edit"
                              ? "Simpan Perubahan"
                              : "Tambah Prestasi"}
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
