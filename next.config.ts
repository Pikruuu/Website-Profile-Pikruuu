import type { NextConfig } from "next";

interface SupabaseImagePattern {
    protocol: "http" | "https";
    hostname: string;
    pathname: string;
}

function getSupabaseImagePatterns(): SupabaseImagePattern[] {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();

    if (!supabaseUrl) {
        return [];
    }

    try {
        const url = new URL(supabaseUrl);

        return [
            {
                protocol: url.protocol === "http:" ? "http" : "https",
                hostname: url.hostname,
                pathname: "/storage/v1/object/public/**",
            },
        ];
    } catch {
        return [];
    }
}

const nextConfig: NextConfig = {
    allowedDevOrigins: ["localhost", "192.168.*.*", "10.*.*.*"],
    images: {
        remotePatterns: getSupabaseImagePatterns(),
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "3mb",
        },
    },
};

export default nextConfig;
