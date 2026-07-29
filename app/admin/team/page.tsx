import { createClient } from "@/lib/supabase-admin/server";
import TeamManager from "@/components/admin/TeamManager";

export default async function AdminTeamPage() {
  const supabase = await createClient();
  const { data: members } = await supabase
    .from("team_members")
    .select("id, slug, name, role, bio, photo_url, gallery, specialization, experience_years, is_active, display_order")
    .order("display_order");

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Team</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Staff profiles shown on the public Team page.
      </p>
      <div className="mt-6">
        <TeamManager initialMembers={members ?? []} />
      </div>
    </div>
  );
}
