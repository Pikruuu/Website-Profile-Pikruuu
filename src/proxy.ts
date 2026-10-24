import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAdminEmail } from "@/lib/admin";
import { getSupabaseEnv } from "@/lib/supabase/config";

function redirectWithCookies(url: URL, response: NextResponse): NextResponse {
    const redirectResponse = NextResponse.redirect(url);

    response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
    const env = getSupabaseEnv();
    const pathname = request.nextUrl.pathname;

    if (!env) {
        if (pathname.startsWith("/admin")) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        return NextResponse.next();
    }

    let response = NextResponse.next({ request });

    const supabase = createServerClient(env.url, env.anonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) => {
                    request.cookies.set(name, value);
                });

                response = NextResponse.next({ request });

                cookiesToSet.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });

    let isAdmin = false;

    try {
        const {
            data: { user },
        } = await supabase.auth.getUser();
        isAdmin = Boolean(user && isAdminEmail(user.email));
    } catch {
        isAdmin = false;
    }

    if (pathname.startsWith("/admin") && !isAdmin) {
        return redirectWithCookies(new URL("/login", request.url), response);
    }

    if (pathname === "/login" && isAdmin) {
        return redirectWithCookies(new URL("/admin", request.url), response);
    }

    return response;
}

export const config = {
    matcher: ["/admin/:path*", "/login"],
};
