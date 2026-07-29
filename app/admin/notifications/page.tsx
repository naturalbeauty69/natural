import { createClient } from "@/lib/supabase-admin/server";
import NotificationsManager from "@/components/admin/NotificationsManager";

export default async function AdminNotificationsPage() {
  const supabase = await createClient();
  const { data: notifications } = await supabase
    .from("notifications")
    .select("id, type, title, body, is_read, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Notifications</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Auto-generated when a new appointment, message, or review comes in.
      </p>
      <div className="mt-6">
        <NotificationsManager initialNotifications={notifications ?? []} />
      </div>
    </div>
  );
}
