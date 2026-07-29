import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-admin/middleware";

const STAFF_ROLES = ["owner", "director", "manager", "receptionist", "trainer", "staff"];

export async function middleware(request: NextRequest) {
  const { response, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isStudentRoute = path.startsWith("/student");

  if (!isAdminRoute && !isStudentRoute) {
    return response;
  }

  // Not logged in at all → send to login, remembering where they wanted to go.
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in — check role to enforce access to the right area.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "guest";

  if (!profile?.is_active) {
    return NextResponse.redirect(new URL("/login?error=suspended", request.url));
  }

  if (isAdminRoute && !STAFF_ROLES.includes(role)) {
    // Students land on their own dashboard instead of a dead end;
    // guests get bounced to the public homepage.
    const dest = role === "student" ? "/student/dashboard" : "/";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isStudentRoute && role !== "student" && !STAFF_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
