import { createClient } from "@/lib/supabase-admin/server";
import UsersManager from "@/components/admin/UsersManager";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: myProfile } = await supabase.from("profiles").select("role").eq("id", user!.id).single();
  const canManage = myProfile?.role === "owner" || myProfile?.role === "director";

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, requested_role, approval_status, is_active, created_at")
    .order("created_at", { ascending: false });

  const { data: courses } = await supabase
    .from("courses")
    .select("id, name")
    .eq("is_active", true)
    .order("display_order");

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Users</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Everyone who has signed in — assign roles or suspend access.
        {!canManage && " (View only — Owner/Director role required to make changes.)"}
      </p>
      <div className="mt-6">
        <UsersManager initialProfiles={profiles ?? []} courses={courses ?? []} canManage={canManage} />
      </div>
    </div>
  );
}
