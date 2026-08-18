import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-admin/server";

export default async function PendingApprovalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/pending-approval");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role, approval_status, is_active")
    .eq("id", user.id)
    .single();

  if (profile?.approval_status === "approved" && profile.is_active) {
    const destination =
      profile.role === "student"
        ? "/student/dashboard"
        : [ "owner", "director", "manager", "receptionist", "trainer", "staff" ].includes(profile.role)
          ? "/admin/dashboard"
          : "/";
    redirect(destination);
  }

  const rejected = profile?.approval_status === "rejected";
  const suspended = profile?.approval_status === "suspended" || profile?.is_active === false;

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-lg rounded-xl2 border border-emerald-900/10 bg-cream-soft p-8 text-center shadow-soft">
        <p className="eyebrow text-gold-600">Academy access</p>
        <h1 className="mt-2 font-display text-2xl text-emerald-900">
          {rejected ? "Access not approved" : suspended ? "Account suspended" : "Approval pending"}
        </h1>
        <p className="mt-4 text-sm leading-6 text-ink-soft">
          {rejected
            ? "Your registration was not approved. Please contact the academy administrator if you believe this was a mistake."
            : suspended
              ? "Your account is currently suspended. Please contact the academy administrator."
              : "Your account has been created successfully, but an owner/director must approve it before you can access protected Academy resources."}
        </p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/" className="btn-outline">Back to website</Link>
          <form action="/logout" method="post">
            <button type="submit" className="btn-primary w-full sm:w-auto">Logout</button>
          </form>
        </div>
      </div>
    </div>
  );
}
