import { createClient } from "@/lib/supabase-admin/server";
import MessagesManager from "@/components/admin/MessagesManager";

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_name, sender_email, sender_phone, subject, body, is_read, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">Messages</h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Inquiries submitted through the website.
      </p>
      <div className="mt-6">
        <MessagesManager initialMessages={messages ?? []} />
      </div>
    </div>
  );
}
