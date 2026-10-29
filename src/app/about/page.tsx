import Image from "next/image";
import Icon from "@/components/Icon";
import { getAboutContent } from "@/lib/about";
import { getAchievements } from "@/lib/data/achievements";
import { getPortfolioData } from "@/lib/data/projects";
import { getSiteSettings } from "@/lib/data/settings";
import type { AchievementRow } from "@/types/project";

export const dynamic = "force-dynamic";

function AchievementCard({ achievement }: { achievement: AchievementRow }) {
    return (
        <li className="flex flex-col border border-hitam/15 bg-putih p-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)]">
            <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 font-display text-lg leading-snug [overflow-wrap:anywhere]">
                    {achievement.title}
                </h3>
                {achievement.certificate_url ? (
                    <a
                        href={achievement.certificate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open certificate ${achievement.title}`}
                        className="shrink-0 font-body text-lg leading-none text-aksen transition-transform duration-300 hover:-translate-y-0.5 hover:translate-x-0.5"
                    >
                        ↗
                    </a>
                ) : null}
            </div>

            {achievement.description ? (
                <p className="mt-2 font-body text-[12px] leading-relaxed text-abu">
                    {achievement.description}
                </p>
            ) : null}

            {achievement.team_members.length > 0 ? (
                <div className="mt-3 border-t border-hitam/10 pt-3">
                    <p className="font-body text-[9px] uppercase tracking-[0.16em] text-abu">
                        Team members
                    </p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                        {achievement.team_members.map((member) => (
                            <li
                                key={member}
                                className="border border-hitam/15 px-2 py-1 font-body text-[10px] leading-snug text-hitam/80"
                            >
                                {member}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : null}

            {achievement.certificate_url ? (
                <a
                    href={achievement.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex w-fit items-center gap-1 border-b border-hitam/30 pb-1 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen hover:text-aksen"
                >
                    View certificate
                    <span aria-hidden="true">↗</span>
                </a>
            ) : null}
        </li>
    );
}

export default async function About() {
    const [settings, achievements, portfolio] = await Promise.all([
        getSiteSettings(),
        getAchievements(),
        getPortfolioData(),
    ]);
    const about = getAboutContent(settings);
    const { technologies } = portfolio;
    const aboutImage =
        settings.profile_image_url ?? "/images/myPhoto.png";
    const details = [
        { icon: "user", label: "Name", value: about.name },
        { icon: "education", label: "Education", value: about.education },
        { icon: "location", label: "Location", value: about.location },
        { icon: "email", label: "Email", value: about.email },
    ] as const;

    return (
        <main className="flex flex-1 flex-col">
            <section className="relative mx-auto w-full max-w-[90rem] px-4 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-20">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_75%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
                />
                <div className="relative z-10 flex items-center gap-4 font-body text-[10px] uppercase tracking-[0.22em] text-abu">
                    <span className="text-aksen">01</span>
                    <span>About</span>
                    <span className="h-px flex-1 bg-hitam/15" aria-hidden="true" />
                </div>

                <div className="relative z-10 mt-8 grid gap-8 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-start md:gap-10 lg:gap-16">
                    <div className="order-2 mx-auto w-full max-w-xs sm:max-w-sm md:order-1 md:mx-0 md:max-w-none lg:sticky lg:top-24 lg:self-start">
                        <div className="relative">
                            <div
                                aria-hidden="true"
                                className="absolute inset-0 translate-x-2 translate-y-2 border border-hitam/25"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -left-1 -top-1 z-20 h-3 w-3 border-l border-t border-aksen"
                            />
                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute -right-1 -top-1 z-20 h-3 w-3 border-r border-t border-aksen"
                            />
                            <div className="relative overflow-hidden border border-hitam/20 bg-hitam/[0.04]">
                                <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-hitam/15 bg-putih/80 px-3 py-2 font-body text-[9px] uppercase tracking-[0.18em] text-abu backdrop-blur">
                                    <span>Portrait</span>
                                    <span className="text-aksen">02</span>
                                </div>
                                <Image
                                    src={aboutImage}
                                    alt={`Photo of ${about.name}`}
                                    width={3806}
                                    height={5450}
                                    sizes="(max-width: 768px) 80vw, (max-width: 1024px) 35vw, 40vw"
                                    className="aspect-[4/5] w-full object-contain object-bottom px-4 pb-3 pt-12 sm:px-8 sm:pb-6 sm:pt-16"
                                    priority
                                />
                            </div>
                            <div className="absolute -bottom-3 left-3 flex items-center gap-2 border border-hitam/20 bg-putih px-3 py-1.5">
                                <span className="h-1.5 w-1.5 animate-denyut rounded-full bg-aksen" />
                                <p className="font-body text-[9px] uppercase tracking-[0.14em]">
                                    Open to collaborate
                                </p>
                            </div>
                        </div>
                        <div className="mt-5 flex items-baseline justify-between gap-2 border-t border-hitam/15 pt-2 font-body text-[9px] uppercase tracking-[0.16em] text-abu">
                            <span>{about.name}</span>
                            <span>{about.location}</span>
                        </div>
                    </div>

                    <div className="order-1 flex min-w-0 flex-col gap-8 md:order-2">
                        <div>
                            <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                                <span className="mr-2">✦</span>
                                Hello, I&apos;m
                            </p>
                            <h1 className="mt-3 font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.95]">
                                {about.nickname}
                                <span className="text-aksen">.</span>
                            </h1>
                        </div>

                        <p className="max-w-2xl font-body text-[13px] leading-relaxed text-hitam/80 sm:text-base lg:text-lg">
                            {about.summary}
                        </p>

                        <dl className="border-t border-hitam/15">
                            {details.map((detail) => (
                                <div
                                    key={detail.label}
                                    className="group grid min-w-0 grid-cols-[1.75rem_minmax(0,1fr)] gap-x-3 gap-y-1 border-b border-hitam/15 py-4 transition-colors hover:bg-white/30 lg:grid-cols-[2.5rem_7rem_minmax(0,1fr)] lg:items-center lg:gap-x-6"
                                >
                                    <span className="text-aksen transition-transform duration-300 group-hover:-translate-y-0.5">
                                        <Icon name={detail.icon} size={20} />
                                    </span>
                                    <dt className="font-body text-[10px] uppercase tracking-[0.2em] text-abu">
                                        {detail.label}
                                    </dt>
                                    <dd className="col-start-2 font-body text-sm leading-relaxed [overflow-wrap:anywhere] lg:col-start-3">
                                        {detail.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            <section className="relative mx-auto w-full max-w-[90rem] overflow-hidden px-4 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
                <div className="relative z-10 grid gap-8 border-t border-hitam/15 pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            <span className="mr-2">✦</span>
                            02 — Toolkit
                        </p>
                        <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
                            Technologies Used
                        </h2>
                        <p className="mt-4 max-w-xs font-body text-[13px] leading-relaxed text-abu sm:text-sm">
                            Tools and languages I use to design, build, and
                            ship ideas into working products.
                        </p>
                    </div>

                    {technologies.length > 0 ? (
                        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {technologies.map((technology, index) => (
                                <li
                                    key={`${technology}-${index}`}
                                    className="group relative flex items-center justify-between gap-2 overflow-hidden border border-hitam/15 bg-putih px-3 py-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)] transition-colors duration-300 hover:bg-white/40 sm:px-4"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-aksen transition-transform duration-300 group-hover:scale-y-100"
                                    />
                                    <span className="font-display text-[9px] tracking-tight text-abu transition-colors group-hover:text-aksen">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <span className="font-body text-xs uppercase tracking-[0.06em] sm:text-sm">
                                        {technology}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="border border-dashed border-hitam/25 px-6 py-12 text-center font-body text-[13px] leading-relaxed text-abu">
                            The technology list has not been filled in yet.
                        </p>
                    )}
                </div>
            </section>

            <section className="relative mx-auto w-full max-w-[90rem] overflow-hidden px-4 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-24">
                <div className="relative z-10 grid gap-8 border-t border-hitam/15 pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                            <span className="mr-2">✦</span>
                            03 — Achievements
                        </p>
                        <h2 className="mt-3 font-display text-2xl leading-tight sm:text-3xl lg:text-4xl">
                            Achievements
                        </h2>
                        <p className="mt-4 max-w-xs font-body text-[13px] leading-relaxed text-abu sm:text-sm">
                            Awards, certificates, and collaborative
                            achievements I am proud to be part of.
                        </p>
                    </div>

                    {achievements.length > 0 ? (
                        <ul className="grid gap-3 sm:grid-cols-2">
                            {achievements.map((achievement) => (
                                <AchievementCard
                                    key={achievement.id}
                                    achievement={achievement}
                                />
                            ))}
                        </ul>
                    ) : (
                        <p className="border border-dashed border-hitam/25 px-6 py-12 text-center font-body text-[13px] leading-relaxed text-abu">
                            No achievements have been added yet.
                        </p>
                    )}
                </div>
            </section>
        </main>
    );
}
