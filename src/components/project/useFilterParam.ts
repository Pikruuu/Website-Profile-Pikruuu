"use client";

import { useCallback, useSyncExternalStore } from "react";

const FALLBACK_TAB = "all";

const urlListeners = new Set<() => void>();

function subscribeToUrl(onStoreChange: () => void) {
    urlListeners.add(onStoreChange);
    window.addEventListener("popstate", onStoreChange);

    return () => {
        urlListeners.delete(onStoreChange);
        window.removeEventListener("popstate", onStoreChange);
    };
}

function notifyUrlChange() {
    urlListeners.forEach((listener) => listener());
}

function readTabFromUrl(key: string, validIds: readonly string[]) {
    if (typeof window === "undefined") {
        return FALLBACK_TAB;
    }

    const value = new URLSearchParams(window.location.search).get(key);

    return value && validIds.includes(value) ? value : FALLBACK_TAB;
}

export function useFilterParam(key: string, validIds: readonly string[]) {
    const activeTab = useSyncExternalStore(
        subscribeToUrl,
        () => readTabFromUrl(key, validIds),
        () => FALLBACK_TAB
    );

    const changeTab = useCallback(
        (nextTab: string) => {
            const params = new URLSearchParams(window.location.search);

            if (nextTab === FALLBACK_TAB) {
                params.delete(key);
            } else {
                params.set(key, nextTab);
            }

            const query = params.toString();
            const url = `${window.location.pathname}${query ? `?${query}` : ""}`;

            window.history.replaceState(null, "", url);
            notifyUrlChange();
        },
        [key]
    );

    return [activeTab, changeTab] as const;
}
