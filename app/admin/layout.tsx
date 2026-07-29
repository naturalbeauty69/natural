import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-admin/server";
import AdminShell from "@/components/admin/AdminShell";

const STAFF_ROLES = ["owner", "director", "manager", "receptionist", "trainer", "staff"];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, is_active")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "guest";

  if (!profile?.is_active) redirect("/login?error=suspended");
  if (!STAFF_ROLES.includes(role)) {
    redirect(role === "student" ? "/student/dashboard" : "/");
  }

  return (
    <AdminShell userEmail={user.email ?? ""} role={role}>
      {children}
    </AdminShell>
  );
}
