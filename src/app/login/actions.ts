"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { isAdminEmail } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface LoginState {
    error: string;
}

const loginSchema = z.object({
    email: z.email("Invalid email format."),
    password: z.string().min(1, "Password is required."),
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
                "Invalid email or password.",
        };
    }

    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return {
            error: "Supabase is not configured yet. Fill in .env.local first.",
        };
    }

    const { data, error } = await supabase.auth.signInWithPassword(
        parsed.data
    );

    if (error || !data.user) {
        return {
            error: error?.message.toLowerCase().includes("invalid login")
                ? "Incorrect email or password."
                : (error?.message ?? "Failed to sign in. Please try again."),
        };
    }

    if (!isAdminEmail(data.user.email)) {
        await supabase.auth.signOut();

        return { error: "This account does not have admin access." };
    }

    redirect("/admin");
}
