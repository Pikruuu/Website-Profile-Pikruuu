import SumProject from "@/components/SumProject";
import CollectionSection from "@/components/project/CollectionSection";
import { getPortfolioData } from "@/lib/data/projects";
import { TABS_PROJECT, TABS_PUBLIKASI } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function ProjectPage() {
    const { projects, publications, stats } = await getPortfolioData();

    return (
        <main className="flex flex-1 flex-col">
            <section className="relative mx-auto w-full max-w-[90rem] overflow-hidden px-4 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-20">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-grid opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent_80%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_80%)]"
                />
                <div className="relative z-10 flex items-center gap-4 font-body text-[10px] uppercase tracking-[0.22em] text-abu">
                    <span className="text-aksen">02</span>
                    <span>Portfolio</span>
                    <span className="h-px flex-1 bg-hitam/15" aria-hidden="true" />
                </div>

                <header className="relative z-10 mt-8 grid gap-6 border-b border-hitam/15 pb-10 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:gap-12 lg:pb-14">
                    <div className="min-w-0">
                        <h1 className="font-display text-[clamp(2.4rem,6.2vw,5rem)] leading-[0.95] tracking-tight">
                            My Project
                            <span className="text-aksen">.</span>
                        </h1>
                        <div className="mt-4 flex flex-wrap items-center gap-3 font-body text-[10px] uppercase tracking-[0.2em] text-abu">
                            <span>
                                {String(projects.length).padStart(2, "0")}{" "}
                                Projects
                            </span>
                            <span
                                aria-hidden="true"
                                className="h-1 w-1 rounded-full bg-aksen"
                            />
                            <span>
                                {String(publications.length).padStart(2, "0")}{" "}
                                Publications
                            </span>
                        </div>
                    </div>
                    <p className="max-w-xl font-body text-[13px] leading-relaxed text-hitam/80 sm:text-base">
                        Welcome to my project portfolio. Here, you will find a
                        carefully curated collection of my past and ongoing
                        work. Each project represents a unique challenge I have
                        tackled, reflecting my continuous learning process and
                        dedication to building effective solutions.
                    </p>
                </header>
            </section>

            <section
                className="mx-auto w-full max-w-[90rem] px-4 py-10 sm:px-8 sm:py-12 lg:px-12 lg:py-14"
                aria-label="Ringkasan portofolio"
            >
                <SumProject stats={stats} />
            </section>

            <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-14 px-4 pb-20 sm:gap-20 sm:px-8 lg:gap-24 lg:px-12">
                <CollectionSection
                    heading="Projects"
                    tabs={TABS_PROJECT}
                    items={projects}
                    paramKey="project"
                    emptyMessage="No projects in this category yet. Try another filter or show all projects."
                />

                <CollectionSection
                    heading="Publications"
                    tabs={TABS_PUBLIKASI}
                    items={publications}
                    paramKey="publikasi"
                    emptyMessage="No publications in this category yet. Try another filter or show all publications."
                />
            </div>
        </main>
    );
}
