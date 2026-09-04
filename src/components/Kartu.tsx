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

export function KartuTipeCol({
    photo,
    nomor,
    title,
    href,
    deskripsi,
    radius = "rounded-3xl",
    border = "border-2"
}: KartuProps) {
    return (
        <li className={`group flex flex-col ${border} w-64 h-fit ${radius} shadow shadow-black/50 overflow-hidden transition-all hover:w-100 origin-top-left cursor-pointer duration-2000`}>
            <Link href={href}>
                <Image src={photo} alt="project1" width={256} height={256} priority className="w-full h-auto" ></Image>
                <div className="flex flex-row">
                    <h1 className="font-['Nulshock'] text-xl text-abu p-2">{nomor}</h1>
                    <h2 className="font-['Nulshock'] text-base text-hitam px-2 py-2.5">{title}</h2>
                </div>
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-2000 p-2">
                    <p className="text-sm font-['Komika'] text-hitam overflow-hidden p-1"> {deskripsi}</p>
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
    radius = "rounded-xl",
    border = "border-2"
}: KartuProps) {
    return (
        <li>
            <Link href={href} className={`group flex flex-row ${border} w-96 h-32 ${radius} shadow shadow-black/50 overflow-hidden transition-all hover:w-160 origin-left cursor-pointer duration-2000 bg-putih`}>
                <Image src={photo} alt={title} width={80} height={80} priority className="w-fit h-auto object-cover" />
                <div className="flex flex-col justify-center w-full p-2">
                    <div className="flex flex-row items-center p-2">
                        <h1 className="font-['Nulshock'] text-xl text-abu p-2">{nomor}</h1>
                        <h2 className="font-['Nulshock'] text-base text-hitam px-2 py-2.5">{title}</h2>
                    </div>
                    <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-2000 p-1">
                        <p className="text-sm font-['Komika'] text-hitam overflow-hidden px-2">
                            {deskripsi}
                        </p>
                    </div>
                </div>
            </Link>
        </li>
    );
}
