export interface ImageFocalPoint {
    x: number;
    y: number;
}

export const DEFAULT_IMAGE_POSITION: ImageFocalPoint = { x: 50, y: 50 };
export const DEFAULT_IMAGE_ZOOM = 1;
export const MAX_IMAGE_ZOOM = 2.5;

export function clampPercent(value: number): number {
    if (!Number.isFinite(value)) {
        return 50;
    }

    return Math.min(100, Math.max(0, value));
}

export function parseImagePosition(
    value: string | null | undefined
): ImageFocalPoint {
    if (!value) {
        return DEFAULT_IMAGE_POSITION;
    }

    const match = value.match(
        /^\s*(\d{1,3}(?:\.\d+)?)%\s+(\d{1,3}(?:\.\d+)?)%\s*$/
    );

    if (!match) {
        return DEFAULT_IMAGE_POSITION;
    }

    return {
        x: clampPercent(Number(match[1])),
        y: clampPercent(Number(match[2])),
    };
}

export function formatImagePosition(point: ImageFocalPoint): string {
    return `${clampPercent(point.x)}% ${clampPercent(point.y)}%`;
}

export function normalizeImageZoom(
    value: number | string | null | undefined
): number {
    const zoom = Number(value);

    if (!Number.isFinite(zoom)) {
        return DEFAULT_IMAGE_ZOOM;
    }

    return Math.min(
        MAX_IMAGE_ZOOM,
        Math.max(DEFAULT_IMAGE_ZOOM, Math.round(zoom * 100) / 100)
    );
}
