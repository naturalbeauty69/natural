import { redirect } from "next/navigation";
import { headers } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";

const STAFF_ROLES = ["owner", "director", "manager", "receptionist", "trainer", "staff"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerStore = await headers();
  const role = headerStore.get("x-admin-role") ?? "guest";
  const userEmail = headerStore.get("x-admin-user-email") ?? "";
  const active = headerStore.get("x-admin-active") === "1";

  // middleware performs the authenticated user + profile check once and
  // forwards the verified result via request headers. Keep this layout
  // lightweight so the Cloudflare Worker does not repeat Supabase queries.
  if (!active || !STAFF_ROLES.includes(role)) {
    redirect(role === "student" ? "/student/dashboard" : "/login?redirect=/admin/dashboard");
  }

  return (
    <AdminShell userEmail={userEmail} role={role}>
      {children}
    </AdminShell>
  );
}
