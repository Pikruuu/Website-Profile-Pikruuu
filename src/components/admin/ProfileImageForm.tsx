"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { updateProfileImageAction } from "@/app/admin/settings-actions";
import Toast from "@/components/admin/Toast";
import type { SettingsActionState } from "@/types/project";

interface ProfileImageFormProps {
    imageUrl: string | null;
}

const initialState: SettingsActionState = {
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
const FALLBACK_IMAGE = "/images/myPhoto.png";

const hintClass = "font-body text-[10px] leading-relaxed text-abu";
const fileClass =
    "block w-full cursor-pointer border border-hitam/25 bg-putih px-3 py-2.5 font-body text-[11px] text-abu file:mr-3 file:cursor-pointer file:border-0 file:bg-hitam file:px-3 file:py-1.5 file:font-body file:text-[10px] file:uppercase file:tracking-[0.14em] file:text-putih hover:border-aksen";

export default function ProfileImageForm({
    imageUrl,
}: ProfileImageFormProps) {
    const router = useRouter();
    const [state, formAction, pending] = useActionState(
        updateProfileImageAction,
        initialState
    );
    const [dismissedState, setDismissedState] =
        useState<SettingsActionState | null>(null);
    const [preview, setPreview] = useState(imageUrl ?? FALLBACK_IMAGE);
    const [error, setError] = useState<string | null>(null);
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

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
        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [objectUrl]);

    useEffect(() => {
        if (state.status === "success") {
            router.refresh();
        }
    }, [state, router]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) {
            setError(null);
            return;
        }

        if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
            setError("Foto harus berformat PNG, JPG, atau WebP.");
            event.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setError("Ukuran foto maksimal 2 MB.");
            event.target.value = "";
            return;
        }

        const url = URL.createObjectURL(file);
        setObjectUrl(url);
        setPreview(url);
        setError(null);
    };

    const fieldError = (name: string): string | null =>
        state.fieldErrors[name]?.[0] ?? null;

    const imageError = error ?? fieldError("profile_image");

    return (
        <>
            <form
                action={formAction}
                className="border border-hitam/20 bg-putih p-5 sm:p-7"
            >
                <div className="grid gap-6 sm:grid-cols-[12rem_minmax(0,1fr)] sm:items-start">
                    <div className="relative aspect-[4/5] w-full overflow-hidden border border-hitam/20 bg-hitam/[0.04]">
                        <div
                            role="img"
                            aria-label="Preview foto profil"
                            className="h-full w-full bg-cover bg-top"
                            style={{
                                backgroundImage: `url("${preview}")`,
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        <p className="font-body text-[12px] leading-relaxed text-abu">
                            Satu foto ini dipakai di halaman Home dan About.
                        </p>
                        <input
                            className={fileClass}
                            type="file"
                            name="profile_image"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleChange}
                        />
                        <span className={hintClass}>
                            PNG, JPG, atau WebP. Maksimal 2 MB.
                        </span>
                        {imageError ? (
                            <span className="font-body text-[11px] text-aksen">
                                {imageError}
                            </span>
                        ) : null}
                    </div>
                </div>

                <div className="mt-7 flex flex-col-reverse gap-2 border-t border-hitam/15 pt-5 sm:flex-row sm:justify-end">
                    <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex min-h-10 items-center justify-center gap-2 border border-hitam bg-hitam px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {pending ? "Menyimpan..." : "Simpan Foto"}
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
