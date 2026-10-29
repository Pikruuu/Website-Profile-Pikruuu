"use client";

import { useEffect } from "react";

export type ToastTone = "success" | "error";

interface ToastProps {
    message: string;
    tone: ToastTone;
    onClose: () => void;
}

export default function Toast({ message, tone, onClose }: ToastProps) {
    useEffect(() => {
        const timeout = window.setTimeout(onClose, 4500);

        return () => window.clearTimeout(timeout);
    }, [message, onClose]);

    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed bottom-4 left-4 right-4 z-[60] flex items-start justify-between gap-3 border px-4 py-3 font-body text-[13px] leading-relaxed shadow-[0_18px_45px_-24px_rgba(33,33,33,0.55)] sm:left-auto sm:w-[22rem] ${
                tone === "error"
                    ? "border-aksen bg-putih text-aksen"
                    : "border-hitam bg-hitam text-putih"
            }`}
        >
            <span>{message}</span>
            <button
                type="button"
                onClick={onClose}
                aria-label="Close notification"
                className="shrink-0 text-base leading-none opacity-70 transition-opacity hover:opacity-100"
            >
                ×
            </button>
        </div>
    );
}
