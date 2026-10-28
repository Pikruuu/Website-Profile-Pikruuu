"use client";

import { useRef } from "react";
import {
    clampPercent,
    DEFAULT_IMAGE_POSITION,
    DEFAULT_IMAGE_ZOOM,
    MAX_IMAGE_ZOOM,
    type ImageFocalPoint,
} from "@/lib/images";

interface ImageCropperProps {
    src: string | null;
    position: ImageFocalPoint;
    zoom: number;
    emptyLabel: string;
    onChangePosition: (position: ImageFocalPoint) => void;
    onChangeZoom: (zoom: number) => void;
}

interface DragState {
    pointerId: number;
    startX: number;
    startY: number;
    origin: ImageFocalPoint;
    width: number;
    height: number;
}

const labelClass =
    "font-body text-[10px] uppercase tracking-[0.18em] text-abu";

export default function ImageCropper({
    src,
    position,
    zoom,
    emptyLabel,
    onChangePosition,
    onChangeZoom,
}: ImageCropperProps) {
    const dragRef = useRef<DragState | null>(null);

    const handlePointerDown = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (!src) {
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            origin: position,
            width: rect.width,
            height: rect.height,
        };
    };

    const handlePointerMove = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        const drag = dragRef.current;

        if (!drag || drag.pointerId !== event.pointerId) {
            return;
        }

        const deltaX = event.clientX - drag.startX;
        const deltaY = event.clientY - drag.startY;

        onChangePosition({
            x: clampPercent(
                drag.origin.x - (deltaX / drag.width) * 100
            ),
            y: clampPercent(
                drag.origin.y - (deltaY / drag.height) * 100
            ),
        });
    };

    const handlePointerUp = (
        event: React.PointerEvent<HTMLDivElement>
    ) => {
        if (dragRef.current?.pointerId !== event.pointerId) {
            return;
        }

        dragRef.current = null;

        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    };

    const reset = () => {
        onChangePosition(DEFAULT_IMAGE_POSITION);
        onChangeZoom(DEFAULT_IMAGE_ZOOM);
    };

    return (
        <div className="flex flex-col gap-3">
            <div
                role="presentation"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative aspect-[16/10] w-full touch-none select-none overflow-hidden border border-hitam/20 bg-hitam/[0.04]"
            >
                {src ? (
                    <>
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-cover"
                            style={{
                                backgroundImage: `url("${src}")`,
                                backgroundPosition: `${position.x}% ${position.y}%`,
                                transform: `scale(${zoom})`,
                                transformOrigin: `${position.x}% ${position.y}%`,
                            }}
                        />
                        <span
                            aria-hidden="true"
                            className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-putih/80 bg-aksen/30 shadow-[0_0_0_1px_rgba(33,33,33,0.25)]"
                            style={{
                                left: `${position.x}%`,
                                top: `${position.y}%`,
                            }}
                        />
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center font-body text-[11px] uppercase tracking-[0.14em] text-abu">
                        {emptyLabel}
                    </div>
                )}
            </div>

            <p className="font-body text-[10px] leading-relaxed text-abu">
                Geser gambar untuk mengatur posisi crop.
            </p>

            <div className="grid gap-2">
                <label className="flex items-center gap-3">
                    <span className={labelClass}>Horizontal</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={position.x}
                        onChange={(event) =>
                            onChangePosition({
                                ...position,
                                x: Number(event.target.value),
                            })
                        }
                        className="h-1.5 flex-1 cursor-pointer accent-aksen"
                    />
                    <span className="w-10 shrink-0 text-right font-body text-[10px] tabular-nums text-abu">
                        {Math.round(position.x)}%
                    </span>
                </label>

                <label className="flex items-center gap-3">
                    <span className={labelClass}>Vertikal</span>
                    <input
                        type="range"
                        min={0}
                        max={100}
                        step={1}
                        value={position.y}
                        onChange={(event) =>
                            onChangePosition({
                                ...position,
                                y: Number(event.target.value),
                            })
                        }
                        className="h-1.5 flex-1 cursor-pointer accent-aksen"
                    />
                    <span className="w-10 shrink-0 text-right font-body text-[10px] tabular-nums text-abu">
                        {Math.round(position.y)}%
                    </span>
                </label>

                <label className="flex items-center gap-3">
                    <span className={labelClass}>Zoom</span>
                    <input
                        type="range"
                        min={DEFAULT_IMAGE_ZOOM}
                        max={MAX_IMAGE_ZOOM}
                        step={0.05}
                        value={zoom}
                        onChange={(event) =>
                            onChangeZoom(Number(event.target.value))
                        }
                        className="h-1.5 flex-1 cursor-pointer accent-aksen"
                    />
                    <span className="w-10 shrink-0 text-right font-body text-[10px] tabular-nums text-abu">
                        {zoom.toFixed(2)}x
                    </span>
                </label>
            </div>

            <button
                type="button"
                onClick={reset}
                disabled={!src}
                className="inline-flex min-h-9 w-fit items-center justify-center border border-hitam/25 px-3 py-2 font-body text-[10px] uppercase tracking-[0.14em] transition-colors hover:border-aksen hover:text-aksen disabled:cursor-not-allowed disabled:opacity-50"
            >
                Reset posisi
            </button>
        </div>
    );
}
