"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

const initialState: LoginState = { error: "" };

const fieldClass =
    "w-full border border-hitam/25 bg-putih px-3 py-3 font-body text-sm text-hitam outline-none transition-colors placeholder:text-abu/60 focus:border-aksen";

export default function LoginForm() {
    const [state, formAction, pending] = useActionState(
        loginAction,
        initialState
    );

    return (
        <form action={formAction} className="mt-6 flex flex-col gap-4">
            {state.error ? (
                <p
                    role="alert"
                    className="border border-aksen/40 bg-aksen/5 px-3 py-2.5 font-body text-xs leading-relaxed text-aksen"
                >
                    {state.error}
                </p>
            ) : null}

            <label className="flex flex-col gap-2">
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-abu">
                    Email
                </span>
                <input
                    className={fieldClass}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="name@email.com"
                />
            </label>

            <label className="flex flex-col gap-2">
                <span className="font-body text-[10px] uppercase tracking-[0.2em] text-abu">
                    Password
                </span>
                <input
                    className={fieldClass}
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                />
            </label>

            <button
                type="submit"
                disabled={pending}
                className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 border border-hitam bg-hitam px-5 py-3 font-body text-[11px] uppercase tracking-[0.16em] text-putih transition-colors duration-300 hover:border-aksen hover:bg-aksen disabled:cursor-not-allowed disabled:opacity-60"
            >
                {pending ? "Processing..." : "Sign In"}
                <span aria-hidden="true">→</span>
            </button>
        </form>
    );
}
