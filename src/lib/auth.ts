import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { cache } from "react";
import { isAdminEmail } from "@/lib/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const getSessionUser = cache(async (): Promise<User | null> => {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        return null;
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
});

export async function requireAdmin(): Promise<User> {
    const user = await getSessionUser();

    if (!user || !isAdminEmail(user.email)) {
        redirect("/login");
    }

    return user;
}

export async function requireAdminAction(): Promise<{
    supabase: SupabaseClient;
    user: User;
}> {
    const supabase = await createSupabaseServerClient();

    if (!supabase) {
        throw new Error(
            "Supabase belum dikonfigurasi. Isi .env.local terlebih dahulu."
        );
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminEmail(user.email)) {
        throw new Error("Sesi admin tidak valid. Silakan login ulang.");
    }

    return { supabase, user };
}
