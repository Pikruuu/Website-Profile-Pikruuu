"use client";

import { useFormStatus } from "react-dom";
import { logoutAction } from "@/app/admin/actions";

function LogoutSubmit() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex min-h-9 items-center justify-center border border-hitam/25 px-3 py-2 font-body text-[10px] uppercase tracking-[0.16em] transition-colors hover:border-aksen hover:bg-aksen hover:text-putih disabled:cursor-not-allowed disabled:opacity-60"
        >
            {pending ? "Signing out..." : "Logout"}
        </button>
    );
}

export default function LogoutButton() {
    return (
        <form action={logoutAction}>
            <LogoutSubmit />
        </form>
    );
}
