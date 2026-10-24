import {
    PROJECT_CATEGORY_IDS,
    PUBLICATION_CATEGORY_IDS,
    type CollectionItem,
    type EvidenceType,
    type FilterTab,
    type PortfolioStats,
    type ProjectCategory,
    type ProjectKind,
    type ProjectRow,
} from "@/types/project";

export type { CollectionItem, FilterTab } from "@/types/project";

export const TABS_PROJECT: readonly FilterTab[] = [
    { id: "all", label: "All" },
    { id: "web", label: "Web App" },
    { id: "mobile", label: "Mobile App" },
    { id: "iot/robotic", label: "IoT/Robotic" },
    { id: "data", label: "Data / ML" },
];

export const TABS_PUBLIKASI: readonly FilterTab[] = [
    { id: "all", label: "All" },
    { id: "jurnal", label: "Journal" },
    { id: "hki", label: "Property" },
    { id: "git", label: "GitHub" },
    { id: "media", label: "Media" },
];

export const FALLBACK_PROJECT_IMAGE = "/images/project1.png";

export const CATEGORY_LABELS: Record<ProjectCategory, string> = {
    web: "Web App",
    mobile: "Mobile App",
    "iot/robotic": "IoT/Robotic",
    data: "Data / ML",
    jurnal: "Journal",
    hki: "Property",
    git: "GitHub",
    media: "Media",
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
    documentation: "Dokumentasi",
    certificate: "Sertifikat",
    report: "Laporan",
    other: "Lainnya",
};

export function getCategoryLabel(category: ProjectCategory): string {
    return CATEGORY_LABELS[category];
}

export function isProjectCategory(category: ProjectCategory): boolean {
    return (PROJECT_CATEGORY_IDS as readonly string[]).includes(category);
}

export function isPublicationCategory(category: ProjectCategory): boolean {
    return (PUBLICATION_CATEGORY_IDS as readonly string[]).includes(category);
}

export function getProjectKind(category: ProjectCategory): ProjectKind {
    return isPublicationCategory(category) ? "publication" : "project";
}

const NO_TECH_STACK_CATEGORY_IDS = ["jurnal", "hki", "media"] as const;

export function usesTechStack(category: ProjectCategory): boolean {
    return !(NO_TECH_STACK_CATEGORY_IDS as readonly string[]).includes(
        category
    );
}

export function slugify(value: string): string {
    return value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 140);
}

export function getProjectPath(slug: string): string {
    return `/project/${slug}`;
}

export function toCollectionItem(row: ProjectRow): CollectionItem {
    return {
        id: row.id,
        title: row.title,
        href: getProjectPath(row.slug),
        deskripsi: row.description,
        photo: row.image_url ?? FALLBACK_PROJECT_IMAGE,
        category: row.category,
    };
}

function getProjectTimestamp(row: ProjectRow): number {
    const value = row.start_date
        ? `${row.start_date}T00:00:00`
        : row.created_at;
    const timestamp = new Date(value).getTime();

    return Number.isFinite(timestamp) ? timestamp : 0;
}

export function sortRowsByNewest(
    rows: readonly ProjectRow[]
): ProjectRow[] {
    return [...rows].sort(
        (a, b) => getProjectTimestamp(b) - getProjectTimestamp(a)
    );
}

export function computePortfolioStats(
    rows: readonly ProjectRow[]
): PortfolioStats {
    const technologies = new Set<string>();

    rows.forEach((row) => {
        row.tech_stack.forEach((technology) => {
            const value = technology.trim();

            if (value) {
                technologies.add(value);
            }
        });
    });

    const years = rows
        .map((row) => new Date(row.created_at).getFullYear())
        .filter((year) => Number.isFinite(year));

    return {
        projects: rows.filter((row) => isProjectCategory(row.category)).length,
        publications: rows.filter((row) =>
            isPublicationCategory(row.category)
        ).length,
        technologies: technologies.size,
        since: String(
            years.length > 0 ? Math.min(...years) : new Date().getFullYear()
        ),
    };
}
