"use client";

import { useState, useTransition } from "react";
import { updateTechnologiesAction } from "@/app/admin/settings-actions";
import Toast from "@/components/admin/Toast";
import type { SettingsActionState } from "@/types/project";

const initialState: SettingsActionState = {
    status: "idle",
    message: "",
    fieldErrors: {},
};

const MAX_ITEMS = 30;
const MAX_LENGTH = 40;

export default function TechnologiesForm({
    initialTechnologies,
}: {
    initialTechnologies: string[];
}) {
    const [technologies, setTechnologies] =
        useState<string[]>(initialTechnologies);
    const [draft, setDraft] = useState("");
    const [addError, setAddError] = useState<string | null>(null);
    const [state, setState] = useState<SettingsActionState>(initialState);
    const [dismissedState, setDismissedState] =
        useState<SettingsActionState | null>(null);
    const [isPending, startTransition] = useTransition();

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

    const persist = (next: string[], previous: string[]) => {
        setTechnologies(next);
        setState(initialState);
        startTransition(async () => {
            const result = await updateTechnologiesAction(next);
            setState(result);

            if (result.status === "error") {
                setTechnologies(previous);
            }
        });
    };

    const addTechnology = () => {
        if (isPending) {
            return;
        }

        const value = draft.trim();

        if (!value) {
            setAddError("Nama teknologi tidak boleh kosong.");
            return;
        }

        if (value.length > MAX_LENGTH) {
            setAddError(`Nama teknologi maksimal ${MAX_LENGTH} karakter.`);
            return;
        }

        if (technologies.length >= MAX_ITEMS) {
            setAddError(`Maksimal ${MAX_ITEMS} teknologi.`);
            return;
        }

        if (
            technologies.some(
                (item) => item.toLowerCase() === value.toLowerCase()
            )
        ) {
            setAddError("Teknologi tersebut sudah ada.");
            return;
        }

        const previous = technologies;
        const next = [...technologies, value];
        setDraft("");
        setAddError(null);
        persist(next, previous);
    };

    const removeTechnology = (index: number) => {
        if (isPending) {
            return;
        }

        const previous = technologies;
        const next = technologies.filter(
            (_, itemIndex) => itemIndex !== index
        );
        persist(next, previous);
    };

    const fieldError = state.fieldErrors.technologies?.[0] ?? null;
    const statusLabel = isPending
        ? "Menyimpan..."
        : state.status === "error"
          ? "Gagal menyimpan"
          : state.status === "success"
            ? "Tersimpan otomatis"
            : "Auto-save aktif";

    return (
        <div className="flex flex-col gap-6">
            <div className="border border-hitam/20 bg-putih p-5 sm:p-7">
                <div className="flex flex-col gap-2 border-b border-hitam/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.18em] text-aksen">
                            Teknologi
                        </p>
                        <h3 className="mt-2 font-display text-xl leading-tight">
                            Tambah Teknologi
                            <span className="text-aksen">.</span>
                        </h3>
                    </div>
                    <p className="max-w-md font-body text-[12px] leading-relaxed text-abu">
                        Tambahkan tools atau bahasa yang kamu gunakan.
                        Perubahan tersimpan otomatis.
                    </p>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                    <label
                        htmlFor="technology-draft"
                        className="font-body text-[10px] uppercase tracking-[0.18em] text-abu"
                    >
                        Nama teknologi
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <input
                            id="technology-draft"
                            className="min-h-10 w-full border border-hitam/25 bg-putih px-3 py-2.5 font-body text-sm text-hitam outline-none transition-colors placeholder:text-abu/60 focus:border-aksen"
                            type="text"
                            value={draft}
                            onChange={(event) => {
                                setDraft(event.target.value);
                                setAddError(null);
                            }}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    addTechnology();
                                }
                            }}
                            maxLength={MAX_LENGTH}
                            placeholder="Mis. Next.js, Python, Figma"
                        />
                        <button
                            type="button"
                            onClick={addTechnology}
                            disabled={isPending}
                            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 border border-hitam bg-hitam px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isPending ? "Menyimpan..." : "Tambah Teknologi"}
                            <span aria-hidden="true">→</span>
                        </button>
                    </div>
                    <span className="font-body text-[10px] leading-relaxed text-abu">
                        Maksimal 30 teknologi, masing-masing 40 karakter.
                    </span>
                    {addError ? (
                        <p className="font-body text-[11px] text-aksen">
                            {addError}
                        </p>
                    ) : null}
                </div>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-end gap-3">
                    <span className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.14em] text-abu">
                        <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 rounded-full ${
                                state.status === "error"
                                    ? "bg-aksen"
                                    : isPending
                                      ? "animate-denyut bg-abu"
                                      : "bg-aksen"
                            }`}
                        />
                        {statusLabel}
                    </span>
                    <span className="font-body text-[10px] uppercase tracking-[0.14em] text-abu">
                        {technologies.length}/{MAX_ITEMS}
                    </span>
                </div>

                {technologies.length > 0 ? (
                    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {technologies.map((technology, index) => (
                            <li
                                key={`${technology}-${index}`}
                                className="group flex min-w-0 items-center justify-between gap-2 border border-hitam/15 bg-putih px-3 py-2.5 transition-colors hover:bg-white/40"
                            >
                                <span className="flex min-w-0 items-center gap-2">
                                    <span className="font-display text-[9px] tracking-tight text-abu transition-colors group-hover:text-aksen">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="min-w-0 font-body text-xs uppercase tracking-[0.06em] [overflow-wrap:anywhere]">
                                        {technology}
                                    </span>
                                </span>
                                <button
                                    type="button"
                                    onClick={() => removeTechnology(index)}
                                    disabled={isPending}
                                    aria-label={`Hapus ${technology}`}
                                    className="flex h-8 w-8 shrink-0 items-center justify-center text-base leading-none text-abu transition-colors hover:text-aksen disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="border border-dashed border-hitam/25 px-6 py-10 text-center">
                        <p className="font-body text-[12px] leading-relaxed text-abu">
                            Belum ada teknologi. Tambahkan lewat form di atas.
                        </p>
                    </div>
                )}

                {fieldError ? (
                    <p className="font-body text-[11px] text-aksen">
                        {fieldError}
                    </p>
                ) : null}
            </div>

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
