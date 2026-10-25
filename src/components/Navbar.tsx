"use client";

import { useState } from "react";
import Tombol from "./Tombol";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/project", label: "Project" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-hitam/15 bg-putih/85 backdrop-blur-md">
            <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-0.5 bg-aksen"
            />
            <nav
                className="mx-auto flex max-w-[90rem] items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-8 lg:px-12"
                aria-label="Navigasi utama"
            >
                <Link
                    href="/"
                    className="group flex min-w-0 items-center gap-3"
                    onClick={() => setMenuOpen(false)}
                >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hitam font-display text-[10px] tracking-tight text-putih transition-colors duration-300 group-hover:bg-aksen sm:h-10 sm:w-10">
                        MF
                    </span>
                    <span className="min-w-0">
                        <span className="block truncate font-display text-[10px] uppercase tracking-[0.12em] sm:hidden">
                            M. Fikri Al Fathoni
                        </span>
                        <span className="hidden truncate font-display text-xs uppercase tracking-[0.16em] sm:block">
                            Muhammad Fikri Al Fathoni
                        </span>
                        <span className="mt-0.5 block font-body text-[8px] uppercase tracking-[0.2em] text-abu sm:mt-1 sm:text-[9px] sm:tracking-[0.24em]">
                            IT Student · Developer
                        </span>
                    </span>
                </Link>

                <button
                    type="button"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hitam/25 transition-colors hover:border-aksen hover:text-aksen sm:h-10 sm:w-10 lg:hidden"
                    aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
                    aria-controls="main-navigation"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                >
                    <span className="relative block h-3 w-4" aria-hidden="true">
                        <span
                            className={`absolute left-0 top-0 h-px w-4 bg-current transition-transform duration-300 ${
                                menuOpen ? "translate-y-[5px] rotate-45" : ""
                            }`}
                        />
                        <span
                            className={`absolute left-0 top-[5px] h-px w-4 bg-current transition-opacity duration-300 ${
                                menuOpen ? "opacity-0" : ""
                            }`}
                        />
                        <span
                            className={`absolute left-0 top-[10px] h-px w-4 bg-current transition-transform duration-300 ${
                                menuOpen ? "-translate-y-[5px] -rotate-45" : ""
                            }`}
                        />
                    </span>
                </button>

                <div
                    id="main-navigation"
                    className={`${
                        menuOpen ? "flex" : "hidden"
                    } absolute inset-x-0 top-full max-h-[calc(100dvh-4.25rem)] flex-col gap-5 overflow-y-auto border-b border-hitam/15 bg-putih px-4 pb-6 pt-4 shadow-[0_24px_48px_-32px_rgba(33,33,33,0.45)] lg:static lg:max-h-none lg:flex lg:w-auto lg:flex-row lg:items-center lg:gap-10 lg:overflow-visible lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
                >
                    <ul className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
                        {NAV_ITEMS.map((item) => {
                            const isActive = pathname === item.href;

                            return (
                                <li
                                    key={item.href}
                                    className="border-b border-hitam/10 last:border-b-0 lg:border-0"
                                >
                                    <Link
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        aria-current={
                                            isActive ? "page" : undefined
                                        }
                                        className="group flex min-h-11 items-center py-3 font-body text-[15px] transition-colors hover:text-aksen lg:min-h-0 lg:py-0 lg:text-sm"
                                    >
                                        <span
                                            className={`relative ${
                                                isActive ? "text-aksen" : ""
                                            }`}
                                        >
                                            {item.label}
                                            <span
                                                className={`absolute -bottom-1 left-0 h-px bg-aksen transition-all duration-300 ${
                                                    isActive
                                                        ? "w-full"
                                                        : "w-0 group-hover:w-full"
                                                }`}
                                            />
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                    <span className="hidden items-center gap-2 font-body text-[9px] uppercase tracking-[0.18em] text-abu xl:flex">
                        <span className="h-1.5 w-1.5 animate-denyut rounded-full bg-aksen" />
                        Available
                    </span>
                    <Tombol
                        text="Let's Contact"
                        link="mailto:alfathonimuhammadfikri@gmail.com"
                        className="w-full justify-between lg:w-auto lg:justify-center"
                    />
                </div>
            </nav>
        </header>
    );
}
