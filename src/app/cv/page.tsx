import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CvPrintButton from "@/components/CvPrintButton";
import { getAboutContent } from "@/lib/about";
import { getPortfolioData } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import { getCategoryLabel, sortByProjectNature } from "@/lib/projects";
import type { CollectionItem } from "@/types/project";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "CV — Muhammad Fikri Al Fathoni",
    description:
        "Curriculum Vitae Muhammad Fikri Al Fathoni, Information Technology student and developer.",
};

const CONTACT = {
    website: "https://fikri.voxsight.id/",
    github: "https://github.com/Pikruuu",
    linkedin:
        "https://linkedin.com/in/muhammad-fikri-al-fathoni-6ab0b529a",
};

const EDUCATION = {
    school: "Telkom University",
    program: "Bachelor of Information Technology",
    period: "Semester 5",
    location: "Surabaya, Indonesia",
};

function truncate(value: string, max = 320): string {
    return value.length > max ? `${value.slice(0, max).trim()}…` : value;
}

function ProjectEntry({ item }: { item: CollectionItem }) {
    return (
        <li className="break-inside-avoid border-b border-neutral-200 py-3 last:border-b-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-[13px] font-semibold leading-snug text-neutral-900">
                    {item.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                    {item.marker ? (
                        <span className="border border-neutral-400 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.12em] text-neutral-700">
                            {item.marker}
                        </span>
                    ) : null}
                    <span className="text-[10px] uppercase tracking-[0.12em] text-neutral-500">
                        {getCategoryLabel(item.category)}
                    </span>
                </div>
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-neutral-600">
                {truncate(item.deskripsi)}
            </p>
        </li>
    );
}

export default async function CvPage() {
    const [{ projects, publications, technologies }, settings] =
        await Promise.all([getPortfolioData(), getSiteSettings()]);
    const about = getAboutContent(settings);
    const skills = technologies;
    const realProjects = sortByProjectNature(
        projects.filter((item) => item.projectType !== "personal")
    );
    const personalProjects = projects.filter(
        (item) => item.projectType === "personal"
    );

    return (
        <main className="min-h-dvh bg-neutral-100 font-sans text-neutral-900 print:bg-white">
            <div className="mx-auto w-full max-w-[210mm] bg-white px-6 py-8 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)] sm:px-10 sm:py-10 print:max-w-none print:px-0 print:py-0 print:shadow-none">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
                    <Link
                        href="/"
                        className="inline-flex min-h-9 items-center justify-center gap-2 border border-neutral-300 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-neutral-600 transition-colors hover:border-neutral-900 hover:text-neutral-900"
                    >
                        <span aria-hidden="true">←</span> Portfolio
                    </Link>
                    <CvPrintButton />
                </div>

                <header className="flex flex-col-reverse items-start justify-between gap-6 border-b-2 border-neutral-900 pb-6 sm:flex-row">
                    <div className="min-w-0">
                        <h1 className="text-[clamp(1.8rem,4vw,2.4rem)] font-bold leading-tight tracking-tight">
                            {about.name}
                        </h1>
                        <p className="mt-1.5 text-[13px] font-medium text-neutral-700">
                            Information Technology Student · Developer · AI,
                            ML, Data, IoT &amp; Robotics
                        </p>

                        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-[11px] leading-relaxed text-neutral-600">
                            <li>{about.location}</li>
                            <li aria-hidden="true">•</li>
                            <li>
                                <a
                                    href={`mailto:${about.email}`}
                                    className="hover:text-neutral-900"
                                >
                                    {about.email}
                                </a>
                            </li>
                            <li aria-hidden="true">•</li>
                            <li>
                                <a
                                    href={CONTACT.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-neutral-900"
                                >
                                    fikri.voxsight.id
                                </a>
                            </li>
                            <li aria-hidden="true">•</li>
                            <li>
                                <a
                                    href={CONTACT.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-neutral-900"
                                >
                                    github.com/Pikruuu
                                </a>
                            </li>
                            <li aria-hidden="true">•</li>
                            <li>
                                <a
                                    href={CONTACT.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-neutral-900"
                                >
                                    LinkedIn
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className="relative h-36 w-28 shrink-0 overflow-hidden border border-neutral-300 bg-neutral-100 print:h-28 print:w-20">
                        <Image
                            src="/images/photoCv.png"
                            alt="Muhammad Fikri Al Fathoni"
                            fill
                            sizes="112px"
                            className="object-cover object-top"
                            priority
                        />
                    </div>
                </header>

                <div className="mt-6 flex flex-col gap-6">
                    <section className="break-inside-avoid">
                        <h2 className="border-b border-neutral-300 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800">
                            Professional Summary
                        </h2>
                        <p className="mt-2.5 text-[12px] leading-relaxed text-neutral-700">
                            {about.summary}
                        </p>
                    </section>

                    <section className="break-inside-avoid">
                        <h2 className="border-b border-neutral-300 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800">
                            Education
                        </h2>
                        <div className="mt-2.5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                            <div>
                                <h3 className="text-[13px] font-semibold">
                                    {EDUCATION.school}
                                </h3>
                                <p className="text-[12px] text-neutral-600">
                                    {EDUCATION.program}
                                </p>
                            </div>
                            <p className="text-right text-[11px] leading-relaxed text-neutral-500">
                                {EDUCATION.period}
                                <br />
                                {EDUCATION.location}
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="border-b border-neutral-300 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800">
                            Projects &amp; Community Service
                        </h2>
                        {realProjects.length > 0 ? (
                            <ul className="mt-1">
                                {realProjects.map((item) => (
                                    <ProjectEntry
                                        key={item.id}
                                        item={item}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2.5 text-[12px] leading-relaxed text-neutral-500">
                                No real projects yet.
                            </p>
                        )}
                    </section>

                    {personalProjects.length > 0 ? (
                        <section>
                            <h2 className="border-b border-neutral-300 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800">
                                Personal / Dummy Projects
                            </h2>
                            <ul className="mt-1">
                                {personalProjects.map((item) => (
                                    <ProjectEntry
                                        key={item.id}
                                        item={item}
                                    />
                                ))}
                            </ul>
                        </section>
                    ) : null}

                    <section>
                        <h2 className="border-b border-neutral-300 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800">
                            Publications
                        </h2>
                        {publications.length > 0 ? (
                            <ul className="mt-1">
                                {publications.map((item) => (
                                    <ProjectEntry
                                        key={item.id}
                                        item={item}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-2.5 text-[12px] leading-relaxed text-neutral-500">
                                No publications yet.
                            </p>
                        )}
                    </section>

                    <section className="break-inside-avoid">
                        <h2 className="border-b border-neutral-300 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800">
                            Technical Skills
                        </h2>
                        {skills.length > 0 ? (
                            <p className="mt-2.5 text-[12px] leading-relaxed text-neutral-700">
                                {skills.join(" · ")}
                            </p>
                        ) : (
                            <p className="mt-2.5 text-[12px] leading-relaxed text-neutral-500">
                                No skill data yet.
                            </p>
                        )}
                    </section>

                    <section className="break-inside-avoid">
                        <h2 className="border-b border-neutral-300 pb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-800">
                            Links
                        </h2>
                        <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-neutral-600">
                            <a
                                href={CONTACT.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-neutral-900"
                            >
                                fikri.voxsight.id
                            </a>
                            <a
                                href={CONTACT.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-neutral-900"
                            >
                                github.com/Pikruuu
                            </a>
                            <a
                                href={CONTACT.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-neutral-900"
                            >
                                LinkedIn
                            </a>
                        </div>
                    </section>
                </div>

                <footer className="mt-8 border-t border-neutral-300 pt-3 text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                    Muhammad Fikri Al Fathoni · Surabaya, Indonesia
                </footer>
            </div>
        </main>
    );
}
