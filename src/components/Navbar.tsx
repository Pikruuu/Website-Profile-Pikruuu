"use client";

import Tombol from "./Tombol";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/skill", label: "Skill" },
    { href: "/project", label: "Project" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-row items-center justify-between px-8 py-6 bg-putih text-hitam font-['Komika']">
            <div className="flex flex-row items-center gap-8">
                <h2 className="font-['Nulshock'] text-base font-bold">
                    Muhammad Fikri Al Fathoni
                </h2>
            </div>

            <ul className="flex flex-row gap-8">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <li key={item.href} className="relative flex flex-col items-center">
                            <Link
                                href={item.href}
                                className={`inline-block transition-all duration-600 hover:opacity-75 hover:scale-120 ${
                                    isActive ? "font-bold" : ""
                                }`}
                            >
                                {item.label}
                            </Link>
                            <div
                                className={`mt-1 h-0.5 bg-hitam transition-all duration-1000 ${
                                    isActive ? "w-4/3 opacity-100" : "w-0 opacity-0"
                                }`}
                            />
                            <div
                                className={`absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-hitam transition-all duration-500 -translate-y-0.5 
                                    ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}
                                `}
                            />
                        </li>
                    );
                })}
            </ul>
            <Tombol text="Let&apos;s Contact" />
        </nav>
    );
}