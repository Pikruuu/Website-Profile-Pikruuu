"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdminEmail } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LoginState {
    error: string;
}

const loginSchema = z.object({
    email: z.email("Format email tidak valid."),
    password: z.string().min(1, "Password wajib diisi."),
});

export async function loginAction(
    _previousState: LoginState,
    formData: FormData
): Promise<LoginState> {
    const parsed = loginSchema.safeParse({
        email: String(formData.get("email") ?? ""),
        password: String(formData.get("password") ?? ""),
    });

    if (!parsed.success) {
        return {
            error:
                parsed.error.issues[0]?.message ??
                "Email atau password tidak valid.",
        };
    }

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return {
            error: "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu.",
        };
    }

    const { data, error } = await supabase.auth.signInWithPassword(
        parsed.data
    );

    if (error || !data.user) {
        return {
            error: error?.message.toLowerCase().includes("invalid login")
                ? "Email atau password salah."
                : (error?.message ?? "Gagal masuk. Silakan coba lagi."),
        };
    }

    if (!isAdminEmail(data.user.email)) {
        await supabase.auth.signOut();

        return { error: "Akun ini tidak memiliki akses admin." };
    }

    redirect("/admin");
}
