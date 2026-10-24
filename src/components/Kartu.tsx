import Image from "next/image";
import Link from "next/link";

interface KartuProps {
    photo: string;
    nomor?: string;
    title: string;
    deskripsi: string;
    href: string;
    radius?: string;
    border?: string;
}

function isExternalLink(href: string) {
    return /^(https?:)?\/\//i.test(href) || href.startsWith("mailto:");
}

const externalLinkProps = (href: string) =>
    isExternalLink(href)
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {};

export function KartuTipeCol({
    photo,
    nomor,
    title,
    href,
    deskripsi,
    radius = "rounded-none",
    border = "border",
}: KartuProps) {
    return (
        <li className="group min-w-0">
            <Link
                href={href}
                {...externalLinkProps(href)}
                className="flex h-full flex-col"
            >
                <div
                    className={`relative overflow-hidden bg-hitam/[0.04] ${border} border-hitam/20 ${radius}`}
                >
                    <Image
                        src={photo}
                        alt={title}
                        width={600}
                        height={600}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-3 top-3 bg-putih/90 px-2 py-1 font-display text-[10px] tracking-[0.14em] text-hitam">
                        {nomor}
                    </span>
                    <span
                        aria-hidden="true"
                        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-aksen font-body text-[11px] text-putih opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    >
                        ↗
                    </span>
                </div>

                <div className="flex flex-1 flex-col gap-2 border-b border-hitam/20 py-4">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 font-display text-[17px] leading-snug transition-colors duration-300 group-hover:text-aksen sm:text-lg [overflow-wrap:anywhere]">
                            {title}
                        </h3>
                        <span
                            className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aksen"
                            aria-hidden="true"
                        />
                    </div>
                    <p className="font-body text-[13px] leading-relaxed text-abu sm:text-sm [overflow-wrap:anywhere]">
                        {deskripsi}
                    </p>
                </div>
            </Link>
        </li>
    );
}

export function KartuTipeRow({
    photo,
    nomor,
    title,
    href,
    deskripsi,
    radius = "rounded-none",
    border = "border",
}: KartuProps) {
    return (
        <li className="min-w-0">
            <Link
                href={href}
                {...externalLinkProps(href)}
                className="group grid min-w-0 gap-3 border-t border-hitam/15 py-5 sm:grid-cols-[2.5rem_11rem_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-6"
            >
                <div className="flex items-center justify-between sm:block">
                    <span className="font-display text-xs tracking-[0.14em] text-aksen sm:text-sm">
                        {nomor}
                    </span>
                    <span className="font-body text-[10px] uppercase tracking-[0.18em] text-abu sm:hidden">
                        View
                    </span>
                </div>

                <div
                    className={`min-w-0 overflow-hidden bg-hitam/[0.04] ${border} border-hitam/20 ${radius}`}
                >
                    <Image
                        src={photo}
                        alt={title}
                        width={320}
                        height={320}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 20vw"
                        className="aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 sm:aspect-[4/3]"
                    />
                </div>

                <div className="min-w-0">
                    <div className="flex items-baseline justify-between gap-3">
                        <h3 className="min-w-0 font-display text-lg leading-snug transition-colors duration-300 group-hover:text-aksen sm:text-xl [overflow-wrap:anywhere]">
                            {title}
                        </h3>
                        <span
                            aria-hidden="true"
                            className="shrink-0 font-body text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        >
                            ↗
                        </span>
                    </div>
                    <p className="mt-2 max-w-2xl font-body text-[13px] leading-relaxed text-abu sm:text-sm [overflow-wrap:anywhere]">
                        {deskripsi}
                    </p>
                </div>
            </Link>
        </li>
    );
}
