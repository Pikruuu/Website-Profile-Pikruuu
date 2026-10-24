import Link from "next/link";

const NAV_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/project", label: "Project" },
];

const CONNECT_ITEMS = [
    {
        href: "https://github.com/Pikruuu",
        label: "GitHub",
        external: true,
    },
    {
        href: "https://linkedin.com/in/muhammad-fikri-al-fathoni-6ab0b529a",
        label: "LinkedIn",
        external: true,
    },
    {
        href: "mailto:alfathonimuhammadfikri@gmail.com",
        label: "Email",
        external: false,
    },
];

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative overflow-hidden border-t border-hitam/15 bg-hitam text-putih">
            <div className="relative z-10 mx-auto max-w-[90rem] px-4 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
                <div className="grid gap-10 border-b border-putih/15 pb-10 sm:gap-12 sm:pb-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
                    <div>
                        <p className="font-body text-[10px] uppercase tracking-[0.24em] text-putih/60">
                            <span className="mr-2 text-aksen-terang">↗</span>
                            Have a project in mind?
                        </p>
                        <a
                            href="mailto:alfathonimuhammadfikri@gmail.com"
                            className="mt-5 block break-words font-display text-[clamp(1.15rem,2.4vw,2.5rem)] leading-tight transition-colors duration-300 hover:text-aksen-terang sm:mt-6"
                        >
                            alfathonimuhammadfikri<wbr />@gmail.com
                        </a>
                        <p className="mt-5 max-w-md font-body text-[13px] leading-relaxed text-putih/70 sm:mt-6 sm:text-sm">
                            Membangun solusi IoT, AI/ML, dan aplikasi mobile
                            dengan pendekatan yang rapi dan fungsional.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 sm:gap-8">
                        <div>
                            <h3 className="font-body text-[10px] uppercase tracking-[0.22em] text-putih/50">
                                Navigasi
                            </h3>
                            <ul className="mt-4 flex flex-col gap-1">
                                {NAV_ITEMS.map((item) => (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className="group inline-flex min-h-9 items-center gap-2 font-body text-sm transition-colors hover:text-aksen-terang"
                                        >
                                            <span
                                                className="h-px w-3 bg-putih/30 transition-all duration-300 group-hover:w-5 group-hover:bg-aksen-terang"
                                                aria-hidden="true"
                                            />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-body text-[10px] uppercase tracking-[0.22em] text-putih/50">
                                Connect
                            </h3>
                            <ul className="mt-4 flex flex-col gap-1">
                                {CONNECT_ITEMS.map((item) => (
                                    <li key={item.label}>
                                        <Link
                                            href={item.href}
                                            target={
                                                item.external
                                                    ? "_blank"
                                                    : undefined
                                            }
                                            rel={
                                                item.external
                                                    ? "noopener noreferrer"
                                                    : undefined
                                            }
                                            className="group inline-flex min-h-9 items-center gap-2 font-body text-sm transition-colors hover:text-aksen-terang"
                                        >
                                            <span
                                                className="h-px w-3 bg-putih/30 transition-all duration-300 group-hover:w-5 group-hover:bg-aksen-terang"
                                                aria-hidden="true"
                                            />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 pt-6 font-body text-[10px] uppercase tracking-[0.16em] text-putih/50 sm:flex-row sm:items-center sm:justify-between">
                    <p>
                        <Link
                            href="/login"
                            aria-label="Login"
                            className="cursor-default focus-visible:text-aksen-terang"
                        >
                            ©
                        </Link>{" "}
                        {year} Muhammad Fikri Al Fathoni
                    </p>
                    <p>Built with Next.js &amp; Tailwind CSS</p>
                </div>
            </div>
        </footer>
    );
}
