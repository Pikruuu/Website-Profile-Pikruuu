import Icon from "@/components/Icon";
import type { PortfolioStats } from "@/types/project";

interface SumProjectProps {
    stats: PortfolioStats;
}

export default function SumProject({ stats }: SumProjectProps) {
    const summaries = [
        {
            icon: "projects",
            value: String(stats.projects),
            label: "Projects",
            detail: "Published",
        },
        {
            icon: "publications",
            value: String(stats.publications),
            label: "Publications",
            detail: "Published",
        },
        {
            icon: "technologies",
            value: String(stats.technologies),
            label: "Technologies",
            detail: "Used",
        },
        {
            icon: "calendar",
            value: stats.since,
            label: "Since",
            detail: "Building solutions with dedication",
        },
    ] as const;

    return (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {summaries.map((summary) => (
                <div
                    key={summary.icon}
                    className="group relative min-w-0 border border-hitam/15 bg-putih p-4 shadow-[8px_8px_0_-1px_rgba(33,33,33,0.04)] transition-colors duration-300 hover:bg-white/40 sm:p-6 lg:p-8"
                >
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-3 right-3 h-2 w-2 border-b border-r border-aksen opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                    <div className="flex items-center justify-between gap-2">
                        <p className="font-body text-[10px] uppercase tracking-[0.18em] text-abu sm:text-[10px] sm:tracking-[0.2em]">
                            {summary.label}
                        </p>
                        <Icon
                            name={summary.icon}
                            size={18}
                            className="shrink-0 text-aksen"
                        />
                    </div>
                    <p className="mt-3 font-display text-2xl leading-none sm:mt-4 sm:text-4xl lg:text-5xl">
                        {summary.value}
                    </p>
                    <p className="mt-2 font-body text-[11px] leading-snug text-abu sm:mt-3 sm:text-xs">
                        {summary.detail}
                    </p>
                </div>
            ))}
        </div>
    );
}
