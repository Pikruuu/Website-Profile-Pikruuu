import Link from "next/link";
import LogoutButton from "@/components/admin/LogoutButton";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await requireAdmin();

    return (
        <div className="flex min-h-dvh flex-col bg-putih">
            <header className="sticky top-0 z-40 border-b border-hitam/15 bg-putih/90 backdrop-blur-md">
                <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-0.5 bg-aksen"
                />
                <div className="mx-auto flex max-w-[90rem] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8 lg:px-12">
                    <div className="flex min-w-0 items-center gap-3">
                        <Link
                            href="/admin"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-hitam font-display text-[10px] tracking-tight text-putih transition-colors hover:bg-aksen sm:h-10 sm:w-10"
                        >
                            MF
                        </Link>
                        <div className="min-w-0">
                            <p className="font-display text-[10px] uppercase tracking-[0.16em]">
                                Dashboard
                            </p>
                            <p className="mt-1 hidden max-w-[18rem] truncate font-body text-[9px] uppercase tracking-[0.14em] text-abu sm:block">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <nav className="flex flex-wrap items-center gap-2">
                        <Link
                            href="/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-9 items-center justify-center gap-1 border border-hitam/25 px-3 py-2 font-body text-[10px] uppercase tracking-[0.14em] text-abu transition-colors hover:border-aksen hover:text-aksen"
                        >
                            View site <span aria-hidden="true">↗</span>
                        </Link>
                        <LogoutButton />
                    </nav>
                </div>
            </header>

            <main className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                {children}
            </main>
        </div>
    );
}
