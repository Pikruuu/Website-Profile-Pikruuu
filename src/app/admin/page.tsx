import Image from "next/image";
import Link from "next/link";
import AboutForm from "@/components/admin/AboutForm";
import AchievementsList from "@/components/admin/AchievementsList";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import ProfileImageForm from "@/components/admin/ProfileImageForm";
import { getAboutContent } from "@/lib/about";
import { getAdminAchievements } from "@/lib/data/achievements";
import { getAdminProjects } from "@/lib/data/projects";
import { getAdminSiteSettings } from "@/lib/data/settings";
import {
    FALLBACK_PROJECT_IMAGE,
    computePortfolioStats,
    getCategoryLabel,
    getProjectMarker,
} from "@/lib/projects";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

function formatDate(value: string): string {
    return dateFormatter.format(new Date(value));
}

function formatDateOnly(value: string | null): string | null {
    return value
        ? dateFormatter.format(new Date(`${value}T00:00:00`))
        : null;
}

function formatPeriod(start: string | null, end: string | null): string {
    const startLabel = formatDateOnly(start);
    const endLabel = formatDateOnly(end);

    if (!startLabel && !endLabel) {
        return "Tanggal belum diisi";
    }

    if (startLabel && !endLabel) {
        return `${startLabel} — Sekarang`;
    }

    if (!startLabel && endLabel) {
        return `Selesai ${endLabel}`;
    }

    return `${startLabel} — ${endLabel}`;
}

export default async function AdminPage() {
    const [{ projects, error }, settingsResult, achievementsResult] =
        await Promise.all([
            getAdminProjects(),
            getAdminSiteSettings(),
            getAdminAchievements(),
        ]);
    const stats = computePortfolioStats(projects);
    const achievements = achievementsResult.achievements.length;
    const aboutContent = getAboutContent(settingsResult.settings);

    const summary = [
        {
            label: "Total",
            value: String(projects.length),
            detail: "Project & publikasi",
        },
        {
            label: "Projects",
            value: String(stats.projects),
            detail: "Karya",
        },
        {
            label: "Publications",
            value: String(stats.publications),
            detail: "Publikasi",
        },
        {
            label: "Prestasi",
            value: String(achievements),
            detail: "Pencapaian",
        },
    ];

    return (
        <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-4 border-b border-hitam/15 pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                        <span className="mr-2">✦</span>
                        Portfolio CMS
                    </p>
                    <h1 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">
                        Projects<span className="text-aksen">.</span>
                    </h1>
                    <p className="mt-3 max-w-xl font-body text-[13px] leading-relaxed text-abu">
                        Kelola project dan publikasi yang tampil di halaman
                        publik. Perubahan langsung divalidasi dan disimpan ke
                        Supabase.
                    </p>
                </div>
            </header>

            {error || settingsResult.error || achievementsResult.error ? (
                <p
                    role="alert"
                    className="border border-aksen/40 bg-aksen/5 px-4 py-3 font-body text-xs leading-relaxed text-aksen"
                >
                    {error ??
                        settingsResult.error ??
                        achievementsResult.error}
                </p>
            ) : null}

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {summary.map((item) => (
                    <div
                        key={item.label}
                        className="border border-hitam/15 bg-putih p-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)] sm:p-6"
                    >
                        <p className="font-body text-[10px] uppercase tracking-[0.18em] text-abu">
                            {item.label}
                        </p>
                        <p className="mt-3 font-display text-3xl leading-none sm:text-4xl">
                            {item.value}
                        </p>
                        <p className="mt-2 font-body text-[11px] text-abu">
                            {item.detail}
                        </p>
                    </div>
                ))}
            </div>

            <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            <span className="mr-2">✦</span>
                            Profil
                        </p>
                        <h2 className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                            Foto Profil
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-[12px] leading-relaxed text-abu">
                        Satu foto dipakai untuk halaman Home dan About.
                    </p>
                </div>
                <ProfileImageForm
                    imageUrl={settingsResult.settings.profile_image_url ?? null}
                />
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            <span className="mr-2">✦</span>
                            About
                        </p>
                        <h2 className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                            About
                        </h2>
                    </div>
                    <p className="max-w-md font-body text-[12px] leading-relaxed text-abu">
                        Edit informasi utama yang tampil di halaman About.
                    </p>
                </div>
                <AboutForm initial={aboutContent} />
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-display text-xl leading-tight sm:text-2xl">
                        Daftar Project
                    </h2>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-body text-[10px] uppercase tracking-[0.16em] text-abu">
                            {projects.length} item
                        </span>
                        <Link
                            href="/admin/new"
                            className="inline-flex min-h-9 items-center justify-center gap-2 border border-hitam bg-hitam px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen"
                        >
                            Tambah Project <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 border border-dashed border-hitam/25 px-6 py-14 text-center">
                        <p className="max-w-md font-body text-[13px] leading-relaxed text-abu">
                            Belum ada project. Tambahkan project pertama untuk
                            menampilkannya di halaman publik.
                        </p>
                        <Link
                            href="/admin/new"
                            className="inline-flex min-h-10 items-center justify-center border border-hitam px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen hover:bg-aksen hover:text-putih"
                        >
                            Tambah Project
                        </Link>
                    </div>
                ) : (
                    <ul className="border-t border-hitam/15">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="grid gap-4 border-b border-hitam/15 py-5 sm:grid-cols-[9rem_minmax(0,1fr)] lg:grid-cols-[10rem_minmax(0,1fr)_auto] lg:items-center"
                            >
                                <div className="relative aspect-[16/10] overflow-hidden border border-hitam/20 bg-hitam/[0.04]">
                                    <Image
                                        src={
                                            project.image_url ??
                                            FALLBACK_PROJECT_IMAGE
                                        }
                                        alt={project.title}
                                        width={320}
                                        height={200}
                                        sizes="(max-width: 640px) 100vw, 160px"
                                        className="h-full w-full object-cover"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="bg-hitam/[0.06] px-2 py-1 font-body text-[9px] uppercase tracking-[0.14em] text-abu">
                                            {getCategoryLabel(project.category)}
                                        </span>
                                        {getProjectMarker(project.project_type) ? (
                                            <span className="border border-aksen/30 px-2 py-1 font-body text-[9px] uppercase tracking-[0.14em] text-aksen">
                                                {getProjectMarker(project.project_type)}
                                            </span>
                                        ) : null}
                                        {project.featured ? (
                                            <span className="font-body text-[9px] uppercase tracking-[0.14em] text-aksen">
                                                ✦ Featured
                                            </span>
                                        ) : null}
                                        <span className="font-body text-[9px] uppercase tracking-[0.14em] text-abu">
                                            {formatPeriod(
                                                project.start_date,
                                                project.end_date
                                            )}
                                        </span>
                                    </div>
                                    <h3 className="mt-2 font-display text-lg leading-snug sm:text-xl [overflow-wrap:anywhere]">
                                        {project.title}
                                    </h3>
                                    <p className="mt-1 line-clamp-2 font-body text-[12px] leading-relaxed text-abu">
                                        {project.description}
                                    </p>
                                    {project.team_contribution ? (
                                        <p className="mt-1 line-clamp-1 font-body text-[11px] leading-relaxed text-abu">
                                            <span className="text-hitam">
                                                Tim/partner:
                                            </span>{" "}
                                            {project.team_contribution}
                                        </p>
                                    ) : null}
                                    <p className="mt-2 font-body text-[9px] uppercase tracking-[0.16em] text-abu">
                                        Diperbarui {formatDate(project.updated_at)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Link
                                        href={`/admin/${project.id}/edit`}
                                        className="inline-flex min-h-9 items-center justify-center border border-hitam/25 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen hover:bg-aksen hover:text-putih"
                                    >
                                        Edit
                                    </Link>
                                    <DeleteProjectButton
                                        id={project.id}
                                        title={project.title}
                                    />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            <span className="mr-2">✦</span>
                            Pencapaian
                        </p>
                        <h2 className="mt-2 font-display text-xl leading-tight sm:text-2xl">
                            Prestasi
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="font-body text-[10px] uppercase tracking-[0.16em] text-abu">
                            {achievementsResult.achievements.length} item
                        </span>
                        <Link
                            href="/admin/achievements/new"
                            className="inline-flex min-h-9 items-center justify-center gap-2 border border-hitam bg-hitam px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen"
                        >
                            Tambah Prestasi{" "}
                            <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
                <AchievementsList
                    achievements={achievementsResult.achievements}
                />
            </section>
        </div>
    );
}
