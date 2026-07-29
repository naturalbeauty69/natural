import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server-side Supabase client bound to the current request's cookies,
// so it reads/writes the user's auth session. Use this in Server
// Components, Route Handlers, and Server Actions — never in Client
// Components (use lib/supabase.ts's browser client there instead).
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll called from a Server Component (no-op) — the
            // middleware below refreshes the session on every request
            // instead, so this is safe to ignore.
          }
        },
      },
    }
  );
}
