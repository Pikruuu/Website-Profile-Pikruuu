"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteAchievementAction } from "@/app/admin/achievement-actions";
import Toast from "@/components/admin/Toast";
import type {
    AchievementActionState,
    AchievementRow,
} from "@/types/project";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

export default function AchievementsList({
    achievements,
}: {
    achievements: AchievementRow[];
}) {
    const router = useRouter();
    const [deleteState, setDeleteState] =
        useState<AchievementActionState | null>(null);
    const [deletePending, startDeleteTransition] = useTransition();

    const handleDelete = (achievement: AchievementRow) => {
        const confirmed = window.confirm(
            `Hapus prestasi "${achievement.title}"?`
        );

        if (!confirmed) {
            return;
        }

        startDeleteTransition(() => {
            void (async () => {
                const result = await deleteAchievementAction(
                    achievement.id
                );
                setDeleteState(result);

                if (result.status === "success") {
                    router.refresh();
                }
            })();
        });
    };

    return (
        <div className="flex flex-col gap-3">
            {achievements.length === 0 ? (
                <div className="border border-dashed border-hitam/25 px-5 py-10 text-center">
                    <p className="font-body text-[12px] leading-relaxed text-abu">
                        Belum ada prestasi. Tekan tombol Tambah Prestasi untuk
                        menambahkan.
                    </p>
                </div>
            ) : (
                <ul className="border-t border-hitam/15">
                    {achievements.map((achievement) => (
                        <li
                            key={achievement.id}
                            className="grid gap-3 border-b border-hitam/15 py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                        >
                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2 font-body text-[9px] uppercase tracking-[0.14em] text-abu">
                                    <span>
                                        {dateFormatter.format(
                                            new Date(achievement.created_at)
                                        )}
                                    </span>
                                </div>
                                <h4 className="mt-2 font-display text-base leading-snug [overflow-wrap:anywhere]">
                                    {achievement.title}
                                </h4>
                                {achievement.description ? (
                                    <p className="mt-1 font-body text-[12px] leading-relaxed text-abu">
                                        {achievement.description}
                                    </p>
                                ) : null}
                                {achievement.team_members.length > 0 ? (
                                    <p className="mt-1 font-body text-[11px] leading-relaxed text-abu">
                                        <span className="text-hitam">
                                            Tim:
                                        </span>{" "}
                                        {achievement.team_members.join(", ")}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <Link
                                    href={`/admin/achievements/${achievement.id}/edit`}
                                    className="inline-flex min-h-9 items-center justify-center border border-hitam/25 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen hover:bg-aksen hover:text-putih"
                                >
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(achievement)}
                                    disabled={deletePending}
                                    className="inline-flex min-h-9 items-center justify-center border border-aksen/30 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-aksen transition-colors hover:border-aksen hover:bg-aksen hover:text-putih disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    Hapus
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {deleteState ? (
                <Toast
                    message={deleteState.message}
                    tone={
                        deleteState.status === "success"
                            ? "success"
                            : "error"
                    }
                    onClose={() => setDeleteState(null)}
                />
            ) : null}
        </div>
    );
}
