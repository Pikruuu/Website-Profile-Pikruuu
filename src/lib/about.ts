import type { SiteSettingsRow } from "@/types/project";

export interface AboutContent {
    name: string;
    nickname: string;
    education: string;
    location: string;
    email: string;
    summary: string;
}

export const DEFAULT_ABOUT: AboutContent = {
    name: "Muhammad Fikri Al Fathoni",
    nickname: "Fikri",
    education: "S1 Teknologi Informasi Telkom University (Semester 5)",
    location: "Surabaya",
    email: "alfathonimuhammadfikri@gmail.com",
    summary:
        "I'm an Information Technology student, developer, and problem solver who loves turning ideas into real impact. I enjoy exploring new technologies and building digital solutions that are useful, efficient, and meaningful.",
};

export function getAboutContent(settings: SiteSettingsRow): AboutContent {
    return {
        name: settings.about_name?.trim() || DEFAULT_ABOUT.name,
        nickname: settings.about_nickname?.trim() || DEFAULT_ABOUT.nickname,
        education:
            settings.about_education?.trim() || DEFAULT_ABOUT.education,
        location:
            settings.about_location?.trim() || DEFAULT_ABOUT.location,
        email: settings.about_email?.trim() || DEFAULT_ABOUT.email,
        summary: settings.about_summary?.trim() || DEFAULT_ABOUT.summary,
    };
}
