import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicProjectBySlug } from "@/lib/data/projects";
import {
    EVIDENCE_TYPE_LABELS,
    FALLBACK_PROJECT_IMAGE,
    getCategoryLabel,
    getProjectKind,
    getProjectMarker,
    usesTechStack,
} from "@/lib/projects";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

function formatDateOnly(value: string | null): string | null {
    if (!value) {
        return null;
    }

    const date = new Date(`${value}T00:00:00`);

    return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function formatPeriod(start: string | null, end: string | null): string {
    const startLabel = formatDateOnly(start);
    const endLabel = formatDateOnly(end);

    if (!startLabel && !endLabel) {
        return "Belum ditentukan";
    }

    if (startLabel && !endLabel) {
        return `${startLabel} — Sekarang`;
    }

    if (!startLabel && endLabel) {
        return `Selesai ${endLabel}`;
    }

    return `${startLabel} — ${endLabel}`;
}

interface ProjectDetailPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({
    params,
}: ProjectDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = await getPublicProjectBySlug(slug);

    if (!project) {
        return {
            title: "Project tidak ditemukan — M. Fikri Al Fathoni",
        };
    }

    return {
        title: `${project.title} — M. Fikri Al Fathoni`,
        description: project.description.slice(0, 160),
        openGraph: {
            title: project.title,
            description: project.description.slice(0, 160),
            type: "article",
            images: project.image_url ? [project.image_url] : undefined,
        },
    };
}

export default async function ProjectDetailPage({
    params,
}: ProjectDetailPageProps) {
    const { slug } = await params;
    const project = await getPublicProjectBySlug(slug);

    if (!project) {
        notFound();
    }

    const isPublication = getProjectKind(project.category) === "publication";
    const showTechStack = usesTechStack(project.category);
    const kindLabel = isPublication ? "Publication" : "Project";
    const categoryLabel = getCategoryLabel(project.category);
    const projectMarker = getProjectMarker(project.project_type);
    const evidenceItems = (project.evidence ?? []).map((item) => ({
        id: item.id,
        label: item.label,
        note: EVIDENCE_TYPE_LABELS[item.type] ?? "Evidence",
        url: item.url,
    }));

    return (
        <main className="flex flex-1 flex-col">
            <section className="relative overflow-hidden border-b border-hitam/15">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
                />

                <div className="relative z-10 mx-auto w-full max-w-[90rem] px-4 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pt-14">
                    <Link
                        href="/project"
                        className="inline-flex min-h-9 items-center justify-center gap-2 border border-hitam bg-hitam px-4 py-2 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen"
                    >
                        <span aria-hidden="true">←</span>
                        Project &amp; Publikasi
                    </Link>

                    <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
                        <div className="min-w-0 pb-10 lg:pb-14">
                            <div className="flex flex-wrap items-center gap-3 font-body text-[10px] uppercase tracking-[0.2em] text-abu">
                                <span className="text-aksen">✦</span>
                                <span>{kindLabel}</span>
                                <span
                                    aria-hidden="true"
                                    className="h-1 w-1 rounded-full bg-aksen"
                                />
                                <span>{categoryLabel}</span>
                                {projectMarker ? (
                                    <>
                                        <span
                                            aria-hidden="true"
                                            className="h-1 w-1 rounded-full bg-aksen"
                                        />
                                        <span className="text-aksen">
                                            {projectMarker}
                                        </span>
                                    </>
                                ) : null}
                            </div>

                            <h1 className="mt-4 font-display text-[clamp(2rem,5vw,4rem)] leading-[1.02] tracking-tight [overflow-wrap:anywhere]">
                                {project.title}
                                <span className="text-aksen">.</span>
                            </h1>

                            <dl className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                <div className="border border-hitam/15 bg-putih p-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)]">
                                    <dt className="font-body text-[9px] uppercase tracking-[0.18em] text-abu">
                                        Kategori
                                    </dt>
                                    <dd className="mt-2 font-display text-sm leading-snug">
                                        {categoryLabel}
                                    </dd>
                                </div>
                                <div className="border border-hitam/15 bg-putih p-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)]">
                                    <dt className="font-body text-[9px] uppercase tracking-[0.18em] text-abu">
                                        Periode
                                    </dt>
                                    <dd className="mt-2 font-display text-sm leading-snug">
                                        {formatPeriod(
                                            project.start_date,
                                            project.end_date
                                        )}
                                    </dd>
                                </div>
                                <div className="col-span-2 border border-hitam/15 bg-putih p-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)] sm:col-span-1">
                                    <dt className="font-body text-[9px] uppercase tracking-[0.18em] text-abu">
                                        Status
                                    </dt>
                                    <dd className="mt-2 font-display text-sm leading-snug">
                                        {project.end_date
                                            ? "Selesai"
                                            : "Berjalan"}
                                    </dd>
                                </div>
                            </dl>

                            {showTechStack ? (
                                <div className="mt-4 border border-hitam/15 bg-putih p-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)]">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <p className="font-body text-[9px] uppercase tracking-[0.18em] text-abu">
                                            Tech stack
                                        </p>
                                        <span className="font-body text-[9px] uppercase tracking-[0.14em] text-abu">
                                            {project.tech_stack.length} item
                                        </span>
                                    </div>

                                    {project.tech_stack.length > 0 ? (
                                        <ul className="mt-3 flex flex-wrap gap-2">
                                            {project.tech_stack.map(
                                                (technology, index) => (
                                                    <li
                                                        key={technology}
                                                        style={{
                                                            animationDelay: `${index * 70}ms`,
                                                        }}
                                                        className="animate-masuk-mulus cursor-default border border-hitam/25 px-3 py-1.5 font-body text-[10px] uppercase tracking-[0.12em] transition-colors duration-300 hover:border-aksen hover:bg-aksen hover:text-putih sm:text-[11px]"
                                                    >
                                                        {technology}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="mt-3 font-body text-[12px] leading-relaxed text-abu">
                                            Belum ada teknologi yang
                                            dicantumkan.
                                        </p>
                                    )}
                                </div>
                            ) : null}
                        </div>

                        <figure className="min-w-0 pb-10 lg:pb-14">
                            <div className="relative overflow-hidden border border-hitam/20 bg-hitam/[0.04]">
                                <Image
                                    src={
                                        project.image_url ??
                                        FALLBACK_PROJECT_IMAGE
                                    }
                                    alt={project.title}
                                    width={1200}
                                    height={900}
                                    sizes="(max-width: 1024px) 100vw, 45vw"
                                    className="aspect-[4/3] w-full object-cover"
                                    priority
                                />
                                <span className="absolute left-3 top-3 bg-putih/90 px-2.5 py-1 font-body text-[9px] uppercase tracking-[0.14em] text-hitam">
                                    {projectMarker ??
                                        (project.featured
                                            ? "✦ Featured"
                                            : kindLabel)}
                                </span>
                            </div>
                            <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-2 font-body text-[9px] uppercase tracking-[0.16em] text-abu">
                                <span className="[overflow-wrap:anywhere]">
                                    /{project.slug}
                                </span>
                                <span>{formatPeriod(project.start_date, project.end_date)}</span>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </section>

            <section
                aria-labelledby="project-about"
                className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16"
            >
                <div className="max-w-3xl">
                    <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                        <span className="mr-2">✦</span>
                        Detail
                    </p>
                    <h2
                        id="project-about"
                        className="mt-2 font-display text-2xl leading-tight sm:text-3xl"
                    >
                        Tentang {isPublication ? "publikasi" : "project"}
                    </h2>
                    <p className="mt-4 whitespace-pre-line font-body text-[13px] leading-relaxed text-hitam/80 sm:text-base">
                        {project.description}
                    </p>
                </div>
            </section>

            {project.team_contribution ? (
                <section
                    aria-labelledby="project-contribution"
                    className="border-t border-hitam/15"
                >
                    <div className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
                        <div className="max-w-3xl">
                            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                                <span className="mr-2">✦</span>
                                Kontribusi
                            </p>
                            <h2
                                id="project-contribution"
                                className="mt-2 font-display text-2xl leading-tight sm:text-3xl"
                            >
                                Tim / Partner
                            </h2>
                            <p className="mt-4 whitespace-pre-line font-body text-[13px] leading-relaxed text-hitam/80 sm:text-base">
                                {project.team_contribution}
                            </p>
                        </div>
                    </div>
                </section>
            ) : null}

            <section
                aria-labelledby="project-evidence"
                className="border-t border-hitam/15"
            >
                <div className="mx-auto w-full max-w-[90rem] px-4 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            <span className="mr-2">✦</span>
                            Lampiran
                        </p>
                        <h2
                            id="project-evidence"
                            className="mt-2 font-display text-2xl leading-tight sm:text-3xl"
                        >
                            Evidence
                        </h2>
                        <p className="mt-3 max-w-xl font-body text-[13px] leading-relaxed text-abu">
                            Dokumentasi, sertifikat, laporan, dan tautan
                            pendukung lainnya.
                        </p>
                    </div>

                    {evidenceItems.length > 0 ? (
                        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                            {evidenceItems.map((item) => (
                                <li key={item.id}>
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="group flex items-center justify-between gap-4 border border-hitam/20 px-5 py-4 transition-colors hover:border-aksen hover:bg-aksen hover:text-putih"
                                    >
                                        <span className="min-w-0">
                                            <span className="block font-body text-[9px] uppercase tracking-[0.16em] text-abu group-hover:text-putih/70">
                                                {item.note}
                                            </span>
                                            <span className="mt-1 block font-display text-sm leading-snug sm:text-base">
                                                {item.label}
                                            </span>
                                        </span>
                                        <span
                                            aria-hidden="true"
                                            className="shrink-0 font-body text-lg transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                        >
                                            ↗
                                        </span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-6 border border-dashed border-hitam/25 px-5 py-8 font-body text-[13px] leading-relaxed text-abu">
                            Belum ada evidence untuk{" "}
                            {isPublication ? "publikasi" : "project"} ini.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
