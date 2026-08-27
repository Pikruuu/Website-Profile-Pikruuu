import Link from "next/link";

interface TombolProps {
    text: string;
    link?: string;
    bg?: string;
    textColor?: string;
}

export default function Tombol({
    text,
    link = "#",
    bg = "bg-hitam",
    textColor = "text-putih",
}: TombolProps) {
    return (
        <button
            className={`px-6 py-2 font-['Komika'] flex flex-row gap-4 rounded transition-all duration-300 hover:scale-110 active:scale-90 cursor-pointer ${bg} ${textColor}`}>
            <Link href={link}>{text}</Link>
        </button>
    );
}