import Image from "next/image";
import Link from "next/link";
import Tombol from "@/components/Tombol";
import { KartuTipeCol } from "@/components/Kartu";
import SumProject from "@/components/SumProject";
import { getPortfolioData } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

const INTERESTS = [
    "Artificial Intelligence",
    "Machine Learning",
    "Data",
    "IoT",
    "Robotics",
    "Web Development",
    "Mobile Apps",
];

export default async function Home() {
    const [{ selected, stats }, settings] = await Promise.all([
        getPortfolioData(),
        getSiteSettings(),
    ]);
    const profileImage =
        settings.profile_image_url ?? "/images/myPhoto.png";

    return (
        <main className="flex flex-1 flex-col">
            <section className="relative overflow-hidden border-b border-hitam/15 lg:h-[calc(100svh-4rem)] lg:min-h-[40rem]">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-grid opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_88%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
                />
                <div className="relative z-10 mx-auto grid h-full max-w-[90rem] grid-cols-1 items-center gap-6 px-4 py-6 sm:grid-cols-[1.1fr_0.9fr] sm:gap-8 sm:px-8 sm:py-12 lg:grid-cols-2 lg:grid-rows-[1fr] lg:items-stretch lg:gap-16 lg:px-12 lg:py-10">
                    <div className="flex min-w-0 animate-masuk-mulus flex-col justify-center gap-4 sm:gap-6 lg:gap-5">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-body text-[10px] uppercase tracking-[0.18em] text-abu sm:text-[10px] lg:text-[11px]">
                            <span className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 animate-denyut rounded-full bg-aksen" />
                                Available for work
                            </span>
                            <span className="hidden h-px w-6 bg-hitam/20 sm:block" />
                            <span>Portfolio / 2026</span>
                        </div>

                        <h1 className="font-display text-[clamp(2.3rem,5.4vw,5.5rem)] font-bold leading-[0.98] tracking-tight">
                            HELLO,
                            <br />
                            WELCOME!
                            <br />
                            <span className="text-aksen">I&apos;M FIKRI.</span>
                        </h1>

                        <p className="max-w-md font-body text-[13px] leading-relaxed text-hitam/80 text-pretty sm:text-sm lg:text-base">
                            I&apos;m an IT student, developer, and problem
                            solver who enjoys researching technology and
                            turning ideas into practical solutions. My
                            interests span AI, ML, data, IoT, and robotics.
                        </p>

                        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-start sm:gap-3">
                            <Tombol
                                text="View My Work"
                                link="/project"
                                className="w-full sm:w-auto"
                            />
                            <Tombol
                                text="Download CV"
                                link="/cv"
                                bg="bg-transparent"
                                textColor="text-hitam"
                                className="w-full sm:w-auto"
                            />
                        </div>

                        <div className="mt-1 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.2em] text-abu sm:text-[9px] sm:tracking-[0.22em]">
                                <span className="h-6 w-px bg-hitam/20" />
                                Surabaya, Indonesia
                            </div>
                            <div className="hidden items-center gap-2 lg:flex">
                                <span className="font-body text-[9px] uppercase tracking-[0.22em] text-abu">
                                    Scroll
                                </span>
                                <span className="relative block h-8 w-px overflow-hidden bg-hitam/20">
                                    <span className="absolute inset-x-0 top-0 h-full animate-turun bg-aksen" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex w-full animate-masuk-mulus flex-col lg:mx-auto lg:h-full lg:min-h-0">
                        <div className="flex lg:min-h-0 lg:flex-1 lg:items-center lg:justify-center">
                            <div className="relative w-full sm:mx-auto sm:max-w-md lg:h-full lg:w-fit lg:max-w-full">
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -left-1 -top-1 z-20 h-3 w-3 border-l border-t border-aksen"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -right-1 -top-1 z-20 h-3 w-3 border-r border-t border-aksen"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -bottom-1 -left-1 z-20 h-3 w-3 border-b border-l border-aksen"
                                />
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -bottom-1 -right-1 z-20 h-3 w-3 border-b border-r border-aksen"
                                />
                                <div className="relative aspect-[4/5] w-full overflow-hidden border border-hitam/20 bg-hitam/[0.04] lg:aspect-auto lg:h-full lg:w-fit lg:max-w-full">
                                    <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-hitam/15 bg-putih/80 px-3 py-2 font-body text-[9px] uppercase tracking-[0.18em] text-abu backdrop-blur sm:text-[9px]">
                                        <span>Portrait</span>
                                        <span className="text-aksen">01</span>
                                    </div>
                                    <Image
                                        src={profileImage}
                                        alt="Photo of Muhammad Fikri Al Fathoni"
                                        width={3806}
                                        height={5450}
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 40vw"
                                        className="h-full w-full object-contain object-bottom px-3 pb-3 pt-10 sm:px-6 sm:pb-4 sm:pt-12 lg:w-auto lg:max-w-full"
                                        priority
                                    />
                                </div>
                                <div className="absolute -bottom-3 left-2 flex items-center gap-2 border border-hitam/20 bg-putih px-2 py-1.5 sm:left-4 sm:px-3">
                                    <span className="h-1.5 w-1.5 rounded-full bg-aksen" />
                                    <p className="font-body text-[8px] uppercase tracking-[0.14em] sm:text-[9px]">
                                        Open to collaborate
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-hitam/15 pt-2 font-body text-[9px] uppercase tracking-[0.16em] text-abu sm:mt-5 sm:text-[9px]">
                            <span>M. Fikri Al Fathoni</span>
                            <span>Surabaya, ID</span>
                        </div>
                    </div>
                </div>
            </section>

            <div className="overflow-hidden border-b border-hitam/15 bg-hitam py-3.5 text-putih">
                <p className="sr-only">
                    Fields I work in: {INTERESTS.join(", ")}.
                </p>
                <div className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
                    <div
                        className="flex w-max animate-pita items-center whitespace-nowrap"
                        aria-hidden="true"
                    >
                        {[...INTERESTS, ...INTERESTS].map((interest, index) => (
                            <span
                                key={`${interest}-${index}`}
                                className="mr-5 flex items-center gap-5 sm:mr-10 sm:gap-10"
                            >
                                <span className="font-display text-[10px] uppercase tracking-[0.24em] sm:text-[10px] sm:tracking-[0.28em]">
                                    {interest}
                                </span>
                                <span className="text-aksen-terang">✦</span>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            <section
                className="border-b border-hitam/15"
                aria-label="Portfolio summary"
            >
                <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-16">
                    <div className="mb-6 flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.22em] text-abu">
                        <span className="text-aksen">00</span>
                        <span>At a glance</span>
                        <span className="h-px flex-1 bg-hitam/15" />
                    </div>
                    <SumProject stats={stats} />
                </div>
            </section>

            <section
                className="relative mx-auto w-full max-w-[90rem] overflow-hidden px-4 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-24"
                aria-labelledby="selected-projects"
            >
                <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-hitam/15 pb-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            <span className="mr-2">✦</span>
                            01 — Selected Work
                        </p>
                        <h2
                            id="selected-projects"
                            className="mt-3 font-display text-[clamp(1.6rem,4vw,2.25rem)] leading-tight"
                        >
                            Selected Project
                        </h2>
                    </div>
                    <Link
                        href="/project"
                        className="group inline-flex w-fit items-center gap-2 border-b border-hitam/30 pb-1 font-body text-[11px] uppercase tracking-[0.16em] transition-colors duration-300 hover:border-aksen hover:text-aksen"
                    >
                        View all projects
                        <span
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                            →
                        </span>
                    </Link>
                </div>

                {selected.length > 0 ? (
                    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                        {selected.map((item, index) => (
                            <KartuTipeCol
                                key={`${item.category}-${item.id}`}
                                photo={item.photo}
                                nomor={String(index + 1).padStart(2, "0")}
                                title={item.title}
                                href={item.href}
                                deskripsi={item.deskripsi}
                                marker={item.marker}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="border border-dashed border-hitam/25 px-6 py-12 text-center font-body text-[13px] leading-relaxed text-abu">
                        No projects have been published yet.
                    </p>
                )}
            </section>
        </main>
    );
}
