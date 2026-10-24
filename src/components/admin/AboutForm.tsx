"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { updateAboutAction } from "@/app/admin/settings-actions";
import Toast from "@/components/admin/Toast";
import type { AboutContent } from "@/lib/about";
import type { SettingsActionState } from "@/types/project";

const initialState: SettingsActionState = {
    status: "idle",
    message: "",
    fieldErrors: {},
};

const fieldClass =
    "w-full border border-hitam/25 bg-putih px-3 py-2.5 font-body text-sm text-hitam outline-none transition-colors placeholder:text-abu/60 focus:border-aksen";
const labelClass =
    "font-body text-[10px] uppercase tracking-[0.18em] text-abu";
const hintClass = "font-body text-[10px] leading-relaxed text-abu";

type AboutField = keyof AboutContent;

export default function AboutForm({
    initial,
}: {
    initial: AboutContent;
}) {
    const router = useRouter();
    const [form, setForm] = useState(initial);
    const [state, formAction, pending] = useActionState(
        updateAboutAction,
        initialState
    );
    const [dismissedState, setDismissedState] =
        useState<SettingsActionState | null>(null);

    const activeToast =
        state.status !== "idle" && state !== dismissedState
            ? {
                  message: state.message,
                  tone:
                      state.status === "success"
                          ? ("success" as const)
                          : ("error" as const),
              }
            : null;

    useEffect(() => {
        if (state.status === "success") {
            router.refresh();
        }
    }, [state, router]);

    const update = (field: AboutField, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const fieldError = (name: string): string | null =>
        state.fieldErrors[name]?.[0] ?? null;

    return (
        <>
            <form
                action={formAction}
                className="border border-hitam/20 bg-putih p-5 sm:p-7"
            >
            <div className="flex flex-col gap-2 border-b border-hitam/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.18em] text-aksen">
                        About
                    </p>
                    <h3 className="mt-2 font-display text-xl leading-tight">
                        Edit About
                        <span className="text-aksen">.</span>
                    </h3>
                </div>
                <p className="max-w-md font-body text-[12px] leading-relaxed text-abu">
                    Ubah informasi utama yang tampil di halaman About.
                </p>
            </div>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label className="flex flex-col gap-2">
                    <span className={labelClass}>Nama lengkap</span>
                    <input
                        className={fieldClass}
                        name="name"
                        value={form.name}
                        onChange={(event) =>
                            update("name", event.target.value)
                        }
                        maxLength={120}
                        required
                    />
                    {fieldError("name") ? (
                        <span className="font-body text-[11px] text-aksen">
                            {fieldError("name")}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2">
                    <span className={labelClass}>Nama panggilan</span>
                    <input
                        className={fieldClass}
                        name="nickname"
                        value={form.nickname}
                        onChange={(event) =>
                            update("nickname", event.target.value)
                        }
                        maxLength={80}
                        required
                    />
                    <span className={hintClass}>
                        Dipakai untuk heading besar di halaman About.
                    </span>
                    {fieldError("nickname") ? (
                        <span className="font-body text-[11px] text-aksen">
                            {fieldError("nickname")}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2">
                    <span className={labelClass}>Pendidikan</span>
                    <input
                        className={fieldClass}
                        name="education"
                        value={form.education}
                        onChange={(event) =>
                            update("education", event.target.value)
                        }
                        maxLength={200}
                        required
                    />
                    {fieldError("education") ? (
                        <span className="font-body text-[11px] text-aksen">
                            {fieldError("education")}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2">
                    <span className={labelClass}>Lokasi</span>
                    <input
                        className={fieldClass}
                        name="location"
                        value={form.location}
                        onChange={(event) =>
                            update("location", event.target.value)
                        }
                        maxLength={120}
                        required
                    />
                    {fieldError("location") ? (
                        <span className="font-body text-[11px] text-aksen">
                            {fieldError("location")}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={labelClass}>Email</span>
                    <input
                        className={fieldClass}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={(event) =>
                            update("email", event.target.value)
                        }
                        maxLength={160}
                        required
                    />
                    {fieldError("email") ? (
                        <span className="font-body text-[11px] text-aksen">
                            {fieldError("email")}
                        </span>
                    ) : null}
                </label>

                <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className={labelClass}>Ringkasan</span>
                    <textarea
                        className={`${fieldClass} min-h-28 resize-y`}
                        name="summary"
                        value={form.summary}
                        onChange={(event) =>
                            update("summary", event.target.value)
                        }
                        maxLength={1500}
                        rows={5}
                        required
                    />
                    {fieldError("summary") ? (
                        <span className="font-body text-[11px] text-aksen">
                            {fieldError("summary")}
                        </span>
                    ) : null}
                </label>
            </div>

                <div className="mt-7 flex flex-col-reverse gap-2 border-t border-hitam/15 pt-5 sm:flex-row sm:justify-end">
                    <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex min-h-10 items-center justify-center gap-2 border border-hitam bg-hitam px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending ? "Menyimpan..." : "Simpan About"}
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
        </>
    );
}
