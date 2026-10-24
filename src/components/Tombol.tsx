import Link from "next/link";

interface TombolProps {
    text: string;
    link?: string;
    bg?: string;
    textColor?: string;
    className?: string;
}

export default function Tombol({
    text,
    link = "#",
    bg = "bg-hitam",
    textColor = "text-putih",
    className = "",
}: TombolProps) {
    const isExternal = /^https?:\/\//i.test(link);

    return (
        <Link
            href={link}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className={`group inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap border border-hitam px-4 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] transition-colors duration-300 hover:border-aksen hover:bg-aksen hover:text-putih active:translate-y-px sm:px-5 sm:text-[11px] ${bg} ${textColor} ${className}`}
        >
            <span>{text}</span>
            <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
            >
                →
            </span>
        </Link>
    );
}
