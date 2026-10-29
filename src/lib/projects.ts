import {
    PROJECT_CATEGORY_IDS,
    PROJECT_NATURE_IDS,
    PUBLICATION_CATEGORY_IDS,
    type CollectionItem,
    type EvidenceType,
    type FilterTab,
    type PortfolioStats,
    type ProjectCategory,
    type ProjectKind,
    type ProjectNature,
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
    { id: "hki", label: "Intellectual Property" },
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
    hki: "Intellectual Property",
    git: "GitHub",
    media: "Media",
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
    documentation: "Documentation",
    certificate: "Certificate",
    report: "Report",
    other: "Other",
};

export const PROJECT_NATURE_LABELS: Record<ProjectNature, string> = {
    pengmas: "Community Service",
    real: "Real Project",
    personal: "Dummy / Personal",
};

const PROJECT_NATURE_PRIORITY: Record<ProjectNature, number> = {
    pengmas: 0,
    real: 1,
    personal: 2,
};

export function getCategoryLabel(category: ProjectCategory): string {
    return CATEGORY_LABELS[category];
}

export function getProjectNature(
    value: ProjectNature | null | undefined
): ProjectNature {
    return value && (PROJECT_NATURE_IDS as readonly string[]).includes(value)
        ? value
        : "real";
}

export function getProjectMarker(
    nature: ProjectNature | null | undefined
): string | null {
    const normalized = getProjectNature(nature);

    return normalized === "real"
        ? null
        : PROJECT_NATURE_LABELS[normalized];
}

export function sortByProjectNature<T extends { projectType: ProjectNature }>(
    items: readonly T[]
): T[] {
    return [...items].sort(
        (a, b) =>
            PROJECT_NATURE_PRIORITY[a.projectType] -
            PROJECT_NATURE_PRIORITY[b.projectType]
    );
}

export function collectTechnologies(
    rows: readonly ProjectRow[]
): string[] {
    const seen = new Map<string, string>();

    rows.forEach((row) => {
        row.tech_stack.forEach((technology) => {
            const value = technology.trim();

            if (value) {
                const key = value.toLowerCase();

                if (!seen.has(key)) {
                    seen.set(key, value);
                }
            }
        });
    });

    return [...seen.values()].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: "base" })
    );
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
    const projectType = getProjectNature(row.project_type);

    return {
        id: row.id,
        title: row.title,
        href: getProjectPath(row.slug),
        deskripsi: row.description,
        photo: row.image_url ?? FALLBACK_PROJECT_IMAGE,
        category: row.category,
        projectType,
        marker: getProjectMarker(projectType),
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
