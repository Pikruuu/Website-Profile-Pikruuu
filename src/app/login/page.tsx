import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/app/login/LoginForm";
import { isAdminEmail } from "@/lib/admin";
import { getSessionUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
    const user = await getSessionUser();

    if (user && isAdminEmail(user.email)) {
        redirect("/admin");
    }

    return (
        <main className="relative flex min-h-dvh flex-col overflow-hidden bg-putih">
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)] [-webkit-mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
            />

            <div className="relative z-10 flex items-center justify-between gap-4 px-4 py-5 sm:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-hitam font-display text-[10px] tracking-tight text-putih">
                        MF
                    </span>
                    <span className="font-display text-[10px] uppercase tracking-[0.16em]">
                        M. Fikri Al Fathoni
                    </span>
                </Link>
                <Link
                    href="/"
                    className="font-body text-[10px] uppercase tracking-[0.16em] text-abu transition-colors hover:text-aksen"
                >
                    ← Kembali
                </Link>
            </div>

            <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:py-16">
                <div className="w-full max-w-md">
                    <div className="mb-5 flex items-center gap-3 font-body text-[10px] uppercase tracking-[0.22em] text-abu">
                        <span className="text-aksen">✦</span>
                        Dashboard access
                        <span className="h-px flex-1 bg-hitam/15" />
                    </div>

                    <div className="border border-hitam/20 bg-putih p-6 shadow-[18px_18px_0_-1px_rgba(33,33,33,0.05)] sm:p-8">
                        <h1 className="font-display text-3xl leading-tight">
                            Sign In<span className="text-aksen">.</span>
                        </h1>
                        <p className="mt-3 font-body text-[13px] leading-relaxed text-abu">
                            Masuk untuk mengelola project dan publikasi di
                            portfolio.
                        </p>

                        <LoginForm />

                        <p className="mt-6 border-t border-hitam/10 pt-4 font-body text-[10px] uppercase tracking-[0.14em] text-abu">
                            Akun dibuat manual oleh administrator.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
