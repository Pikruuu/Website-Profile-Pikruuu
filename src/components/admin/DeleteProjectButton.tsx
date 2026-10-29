"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteProjectAction } from "@/app/admin/actions";
import Toast, { type ToastTone } from "@/components/admin/Toast";

interface DeleteProjectButtonProps {
    id: string;
    title: string;
}

interface ToastState {
    message: string;
    tone: ToastTone;
}

export default function DeleteProjectButton({
    id,
    title,
}: DeleteProjectButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [toast, setToast] = useState<ToastState | null>(null);
    const [pending, startTransition] = useTransition();

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open]);

    const handleDelete = () => {
        startTransition(() => {
            void (async () => {
                const result = await deleteProjectAction(id);

                setToast({
                    message: result.message,
                    tone: result.status === "success" ? "success" : "error",
                });

                if (result.status === "success") {
                    setOpen(false);
                    window.setTimeout(() => router.refresh(), 1000);
                }
            })();
        });
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="inline-flex min-h-9 items-center justify-center border border-aksen/30 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-aksen transition-colors hover:border-aksen hover:bg-aksen hover:text-putih"
            >
                Delete
            </button>

            {open ? (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-hitam/60 p-4"
                    role="presentation"
                    onClick={() => !pending && setOpen(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={`delete-title-${id}`}
                        className="w-full max-w-md border border-hitam/20 bg-putih p-6 shadow-[20px_20px_0_-1px_rgba(33,33,33,0.08)]"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            ✦ Confirmation
                        </p>
                        <h2
                            id={`delete-title-${id}`}
                            className="mt-3 font-display text-2xl leading-tight"
                        >
                            Delete project?
                        </h2>
                        <p className="mt-3 font-body text-[13px] leading-relaxed text-abu">
                            <span className="font-body text-hitam">
                                {title}
                            </span>{" "}
                            will be permanently deleted along with its image in Storage.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                disabled={pending}
                                className="inline-flex min-h-10 items-center justify-center border border-hitam/25 px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={pending}
                                className="inline-flex min-h-10 items-center justify-center border border-aksen bg-aksen px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-hitam hover:bg-hitam disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {pending ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}

            {toast ? (
                <Toast
                    message={toast.message}
                    tone={toast.tone}
                    onClose={() => setToast(null)}
                />
            ) : null}
        </>
    );
}
