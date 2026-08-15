import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-admin/middleware";

const STAFF_ROLES = ["owner", "director", "manager", "receptionist", "trainer", "staff"];

export async function middleware(request: NextRequest) {
  const { response: sessionResponse, user, supabase } = await updateSession(request);
  const path = request.nextUrl.pathname;

  const isAdminRoute = path.startsWith("/admin");
  const isStudentRoute = path.startsWith("/student");

  if (!isAdminRoute && !isStudentRoute) {
    return sessionResponse;
  }

  // Not logged in at all → send to login, remembering where they wanted to go.
  if (!user || !supabase) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
  }

  // The middleware is the single authentication/role check for protected
  // routes. Pass the verified identity/role to Server Components through
  // request headers so /admin/layout does not perform the same Supabase
  // auth/profile queries a second time.
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
    const dest = role === "student" ? "/student/dashboard" : "/";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  if (isStudentRoute && role !== "student" && !STAFF_ROLES.includes(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-admin-role", role);
  requestHeaders.set("x-admin-user-email", user.email ?? "");
  requestHeaders.set("x-admin-active", profile?.is_active ? "1" : "0");

  // Preserve any Supabase session cookies written by updateSession while
  // also passing the verified identity to downstream Server Components.
  const nextResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  response.cookies.getAll().forEach((cookie) => {
    nextResponse.cookies.set(cookie);
  });

  return nextResponse;
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
};
