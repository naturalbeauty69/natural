import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-admin/server";

// This route exchanges a Supabase auth code (from email verification,
// password reset, or invite links) for a session. It must NEVER throw
// an uncaught error — any failure here should redirect the user back
// to a sensible page with an error flag, not a blank 500.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/admin/dashboard";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // eslint-disable-next-line no-console
      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
    }

    return NextResponse.redirect(`${origin}${next}`);
  } catch (err) {
    // Catches misconfigured env vars, cookie failures, or any other
    // unexpected error — always redirect gracefully instead of 500ing.
    // eslint-disable-next-line no-console
    console.error("[auth/callback] Unexpected error:", err);
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
  }
}
