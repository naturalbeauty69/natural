import { createClient } from "@/lib/supabase-admin/server";
import AcademyResourceList from "@/components/academy/AcademyResourceList";

export default async function StudentDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", user.id)
    .single();

  const { data: resources } = await supabase
    .from("academy_resources")
    .select("id, title, description, resource_type, file_name, storage_path, storage_url, google_drive_url, download_enabled, course_id")
    .eq("is_active", true)
    .order("display_order");

  const { data: applications } = await supabase
    .from("course_applications")
    .select("id, course_id, status, created_at, courses(name)")
    .eq("applicant_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      <p className="mt-1 text-sm text-ink-soft">{profile?.email}</p>

      <section className="mt-8">
        <p className="eyebrow text-gold-600">Your academy resources</p>
        <h2 className="mt-1 text-2xl text-emerald-900">Course files, notices & learning links</h2>
        <AcademyResourceList resources={(resources ?? []) as any} />
      </section>

      <section className="mt-12">
        <p className="eyebrow text-gold-600">Applications</p>
        <h2 className="mt-1 text-2xl text-emerald-900">Your course applications</h2>
        {applications?.length ? (
          <div className="mt-5 space-y-3">
            {applications.map((application: any) => (
              <div key={application.id} className="card flex items-center justify-between p-4">
                <div>
                  <p className="font-medium text-emerald-900">{application.courses?.name ?? "Course"}</p>
                  <p className="text-xs text-ink-soft">{new Date(application.created_at).toLocaleDateString()}</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs capitalize text-emerald-700">{application.status}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-ink-soft">You have not submitted an online course application yet.</p>
        )}
      </section>
    </div>
  );
}
