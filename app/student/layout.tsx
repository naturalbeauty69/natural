import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase-admin/server";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirect=/student/dashboard");

  const { data: profile } = await supabase.from("profiles").select("role, is_active, approval_status, full_name").eq("id", user.id).single();
  if (!profile?.is_active || profile.approval_status === "suspended") redirect("/pending-approval");
  if (profile.approval_status !== "approved") redirect("/pending-approval");
  if (profile.role !== "student" && !["owner", "director", "manager", "receptionist", "trainer", "staff"].includes(profile.role)) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between border-b border-emerald-900/10 bg-cream-soft px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={32} height={32} />
          <span className="font-display text-base text-emerald-900">Student Portal</span>
        </Link>
        <form action="/logout" method="post">
          <button type="submit" className="btn-outline px-4 py-2 text-xs">Logout</button>
        </form>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
