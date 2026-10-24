"use client";

import { useMemo } from "react";
import CollectionGrid from "@/components/project/CollectionGrid";
import FilterTabs from "@/components/project/FilterTabs";
import { useFilterParam } from "@/components/project/useFilterParam";
import type { CollectionItem, FilterTab } from "@/lib/projects";

interface CollectionSectionProps {
    heading: string;
    tabs: readonly FilterTab[];
    items: readonly CollectionItem[];
    paramKey: string;
    emptyMessage: string;
}

export default function CollectionSection({
    heading,
    tabs,
    items,
    paramKey,
    emptyMessage,
}: CollectionSectionProps) {
    const validIds = useMemo(() => tabs.map((tab) => tab.id), [tabs]);
    const [activeTab, changeTab] = useFilterParam(paramKey, validIds);

    const filteredItems = useMemo(
        () =>
            activeTab === "all"
                ? items
                : items.filter((item) => item.category === activeTab),
        [activeTab, items]
    );

    const headingId = `${paramKey}-heading`;
    const panelId = `${paramKey}-panel`;

    return (
        <section
            aria-labelledby={headingId}
            className="flex flex-col gap-6 sm:gap-8"
        >
            <div className="border-t border-hitam/15 pt-6">
                <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                    <span className="mr-2">✦</span>
                    Collection
                </p>
                <h2
                    id={headingId}
                    className="mt-2 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl"
                >
                    {heading}
                    <sup className="ml-2 align-super font-body text-[10px] font-normal tracking-normal text-abu">
                        {String(items.length).padStart(2, "0")}
                    </sup>
                </h2>
            </div>

            <FilterTabs
                tabs={tabs}
                activeTab={activeTab}
                onChange={changeTab}
                label={`Filter ${heading.toLowerCase()}`}
                idPrefix={paramKey}
                panelId={panelId}
            />

            <div
                id={panelId}
                role="tabpanel"
                aria-labelledby={`${paramKey}-tab-${activeTab}`}
                className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-aksen"
            >
                <CollectionGrid
                    items={filteredItems}
                    emptyMessage={emptyMessage}
                    onReset={() => changeTab("all")}
                />
            </div>
        </section>
    );
}
