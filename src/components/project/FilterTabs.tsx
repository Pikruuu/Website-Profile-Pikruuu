"use client";

import { useRef, type KeyboardEvent } from "react";
import type { FilterTab } from "@/lib/projects";

interface FilterTabsProps {
    tabs: readonly FilterTab[];
    activeTab: string;
    onChange: (tabId: string) => void;
    label: string;
    idPrefix: string;
    panelId: string;
}

export default function FilterTabs({
    tabs,
    activeTab,
    onChange,
    label,
    idPrefix,
    panelId,
}: FilterTabsProps) {
    const tabRefs = useRef(new Map<string, HTMLButtonElement>());

    const focusTab = (index: number) => {
        const tab = tabs[index];

        if (!tab) {
            return;
        }

        onChange(tab.id);

        const element = tabRefs.current.get(tab.id);
        element?.focus();
        element?.scrollIntoView({ block: "nearest", inline: "nearest" });
    };

    const handleKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        switch (event.key) {
            case "ArrowRight":
            case "ArrowDown":
                event.preventDefault();
                focusTab((index + 1) % tabs.length);
                break;
            case "ArrowLeft":
            case "ArrowUp":
                event.preventDefault();
                focusTab((index - 1 + tabs.length) % tabs.length);
                break;
            case "Home":
                event.preventDefault();
                focusTab(0);
                break;
            case "End":
                event.preventDefault();
                focusTab(tabs.length - 1);
                break;
        }
    };

    return (
        <div className="scrollbar-none -mx-4 overflow-x-auto border-y border-hitam/15 px-4 sm:mx-0 sm:px-0">
            <div
                role="tablist"
                aria-label={label}
                className="flex w-max min-w-full items-center gap-5 sm:gap-8"
            >
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            ref={(element) => {
                                if (element) {
                                    tabRefs.current.set(tab.id, element);
                                } else {
                                    tabRefs.current.delete(tab.id);
                                }
                            }}
                            id={`${idPrefix}-tab-${tab.id}`}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={panelId}
                            tabIndex={isActive ? 0 : -1}
                            onClick={() => onChange(tab.id)}
                            onKeyDown={(event) => handleKeyDown(event, index)}
                            className={`group relative flex min-h-11 shrink-0 cursor-pointer items-center gap-2 py-3 font-body text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 sm:text-[11px] sm:tracking-[0.16em] ${
                                isActive
                                    ? "text-aksen"
                                    : "text-abu hover:text-hitam"
                            }`}
                        >
                            <span className="font-display text-[9px] tracking-tight text-abu transition-colors group-hover:text-aksen">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            {tab.label}
                            <span
                                aria-hidden="true"
                                className={`absolute inset-x-0 bottom-0 h-px origin-left bg-aksen transition-transform duration-300 ${
                                    isActive
                                        ? "scale-x-100"
                                        : "scale-x-0 group-hover:scale-x-100"
                                }`}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
