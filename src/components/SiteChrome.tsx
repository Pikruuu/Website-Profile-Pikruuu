"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function SiteChrome({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const hideChrome =
        pathname === "/login" ||
        pathname === "/cv" ||
        pathname.startsWith("/admin");

    if (hideChrome) {
        return <>{children}</>;
    }

    return (
        <div className="flex min-h-dvh flex-col">
            <a
                href="#konten"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-hitam focus:px-4 focus:py-2 focus:font-body focus:text-xs focus:text-putih"
            >
                Skip to content
            </a>
            <Navbar />
            <div id="konten" className="flex flex-1 flex-col">
                {children}
            </div>
            <Footer />
        </div>
    );
}
