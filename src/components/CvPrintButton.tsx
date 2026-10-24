"use client";

export default function CvPrintButton() {
    return (
        <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex min-h-9 items-center justify-center gap-2 border border-neutral-900 bg-neutral-900 px-4 py-2 font-sans text-[10px] uppercase tracking-[0.16em] text-white transition-colors hover:bg-neutral-700"
        >
            Print / Save PDF
            <span aria-hidden="true">↗</span>
        </button>
    );
}
