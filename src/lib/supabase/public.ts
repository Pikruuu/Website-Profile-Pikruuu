import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

let publicClient: SupabaseClient | null | undefined;

export function createSupabasePublicClient(): SupabaseClient | null {
    if (publicClient !== undefined) {
        return publicClient;
    }

    const env = getSupabaseEnv();

    publicClient = env
        ? createClient(env.url, env.anonKey, {
              auth: {
                  persistSession: false,
                  autoRefreshToken: false,
                  detectSessionInUrl: false,
              },
          })
        : null;

    return publicClient;
}
