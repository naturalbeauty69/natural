import { createClient } from "@/lib/supabase-admin/server";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from("profiles").select("full_name, email").eq("id", user!.id).single();

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">{profile?.email}</p>

      <div className="mt-8 rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-8 text-center">
        <p className="eyebrow text-gold-700">Coming in the next phase</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
          Course progress, attendance, assignments, and certificate downloads will appear here
          once your enrollment is linked to a batch by the academy admin.
        </p>
      </div>
    </div>
  );
}
