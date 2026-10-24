interface KapsulProps {
    deskripsi: string;
}

export default function Kapsul({ deskripsi }: KapsulProps) {
    return (
        <div className="w-fit rounded-full border border-hitam/25 px-3 py-1.5 transition-colors duration-300 hover:border-aksen hover:bg-aksen hover:text-putih">
            <p className="font-body text-[10px] uppercase tracking-[0.14em] sm:text-xs">
                {deskripsi}
            </p>
        </div>
    );
}
