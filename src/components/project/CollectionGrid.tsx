"use client";

import { KartuTipeRow } from "@/components/Kartu";
import type { CollectionItem } from "@/lib/projects";

interface CollectionGridProps {
    items: readonly CollectionItem[];
    emptyMessage: string;
    onReset: () => void;
}

export default function CollectionGrid({
    items,
    emptyMessage,
    onReset,
}: CollectionGridProps) {
    if (items.length === 0) {
        return (
            <div
                role="status"
                className="flex flex-col items-center gap-4 border border-dashed border-hitam/25 px-6 py-12 text-center"
            >
                <p className="max-w-md font-body text-[13px] leading-relaxed text-abu sm:text-sm">
                    {emptyMessage}
                </p>
                <button
                    type="button"
                    onClick={onReset}
                    className="inline-flex min-h-10 cursor-pointer items-center justify-center border border-hitam px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 hover:border-aksen hover:bg-aksen hover:text-putih"
                >
                    Show all
                </button>
            </div>
        );
    }

    return (
        <ul className="grid grid-cols-1 border-b border-hitam/15">
            {items.map((item, index) => (
                <KartuTipeRow
                    key={`${item.category}-${item.id}`}
                    photo={item.photo}
                    nomor={String(index + 1).padStart(2, "0")}
                    title={item.title}
                    href={item.href}
                    deskripsi={item.deskripsi}
                />
            ))}
        </ul>
    );
}
