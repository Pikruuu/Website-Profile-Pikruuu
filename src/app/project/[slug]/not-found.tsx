import Link from "next/link";

export default function ProjectNotFound() {
    return (
        <main className="flex flex-1 items-center justify-center px-4 py-20">
            <div className="w-full max-w-xl border border-hitam/20 bg-putih p-6 sm:p-10">
                <p className="font-body text-[10px] uppercase tracking-[0.22em] text-aksen">
                    <span className="mr-2">✦</span>
                    404 / Not found
                </p>
                <h1 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
                    Project tidak ditemukan<span className="text-aksen">.</span>
                </h1>
                <p className="mt-4 font-body text-[13px] leading-relaxed text-abu sm:text-sm">
                    Halaman ini mungkin sudah dipindahkan, diganti slug-nya,
                    atau dihapus dari portofolio.
                </p>
                <Link
                    href="/project"
                    className="mt-6 inline-flex min-h-10 items-center justify-center gap-2 border border-hitam bg-hitam px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.16em] text-putih transition-colors hover:border-aksen hover:bg-aksen"
                >
                    Lihat semua project
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </main>
    );
}
