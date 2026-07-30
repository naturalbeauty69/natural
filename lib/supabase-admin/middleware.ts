import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isValidSupabaseUrl(value: string | undefined): value is string {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Misconfigured env vars must never crash every /admin request —
  // fail safe as "not authenticated" so the route below can redirect
  // to /login with a clear reason, instead of a blank 500 page.
  if (!isValidSupabaseUrl(url) || !anonKey) {
    // eslint-disable-next-line no-console
    console.error("[middleware] Supabase env vars missing or invalid; treating request as unauthenticated.");
    return { response, user: null, supabase: null, configError: true };
  }

  try {
    const supabase = createServerClient(url, anonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    return { response, user, supabase, configError: false };
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[middleware] Supabase session check failed:", err);
    return { response, user: null, supabase: null, configError: true };
  }
}
