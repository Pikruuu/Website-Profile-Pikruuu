export const PROJECT_CATEGORY_IDS = [
    "web",
    "mobile",
    "iot/robotic",
    "data",
] as const;

export const PUBLICATION_CATEGORY_IDS = [
    "jurnal",
    "hki",
    "git",
    "media",
] as const;

export const CATEGORY_IDS = [
    ...PROJECT_CATEGORY_IDS,
    ...PUBLICATION_CATEGORY_IDS,
] as const;

export const EVIDENCE_TYPE_IDS = [
    "documentation",
    "certificate",
    "report",
    "other",
] as const;

export type ProjectCategory = (typeof CATEGORY_IDS)[number];
export type ProjectKind = "project" | "publication";
export type EvidenceType = (typeof EVIDENCE_TYPE_IDS)[number];

export interface ProjectEvidence {
    id: string;
    label: string;
    type: EvidenceType;
    url: string;
}

export interface ProjectRow {
    id: string;
    title: string;
    slug: string;
    description: string;
    category: ProjectCategory;
    tech_stack: string[];
    image_url: string | null;
    demo_url: string | null;
    repo_url: string | null;
    start_date: string | null;
    end_date: string | null;
    team_contribution: string | null;
    evidence: ProjectEvidence[];
    featured: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProjectInsert {
    id?: string;
    title: string;
    slug: string;
    description: string;
    category: ProjectCategory;
    tech_stack?: string[];
    image_url?: string | null;
    demo_url?: string | null;
    repo_url?: string | null;
    start_date?: string | null;
    end_date?: string | null;
    team_contribution?: string | null;
    evidence?: ProjectEvidence[];
    featured?: boolean;
    created_at?: string;
    updated_at?: string;
}

export type ProjectUpdate = Partial<ProjectInsert>;

export interface SiteSettingsRow {
    id: string;
    technologies: string[];
    about_name: string | null;
    about_nickname: string | null;
    about_education: string | null;
    about_location: string | null;
    about_email: string | null;
    about_summary: string | null;
    updated_at: string;
}

export interface AchievementRow {
    id: string;
    title: string;
    description: string | null;
    thumbnail_url: string | null;
    certificate_url: string | null;
    team_members: string[];
    created_at: string;
    updated_at: string;
}

export interface CollectionItem {
    id: string;
    title: string;
    href: string;
    deskripsi: string;
    photo: string;
    category: ProjectCategory;
}

export interface FilterTab {
    id: string;
    label: string;
}

export interface PortfolioStats {
    projects: number;
    publications: number;
    technologies: number;
    since: string;
}

export interface ProjectActionState {
    status: "idle" | "success" | "error";
    message: string;
    fieldErrors: Record<string, string[]>;
}

export type SettingsActionState = ProjectActionState;
export type AchievementActionState = ProjectActionState;

export interface UploadedImage {
    path: string;
    publicUrl: string;
}
