"use client";

import { useState } from "react";
import { Check, Trash2, CalendarCheck, Mail, Star, Bell } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

const typeIcon: Record<string, typeof Bell> = {
  appointment: CalendarCheck,
  system: Mail,
  review: Star,
  enrollment: Bell,
};

export default function NotificationsManager({ initialNotifications }: { initialNotifications: Notification[] }) {
  const [items, setItems] = useState(initialNotifications);

  async function markRead(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    if (!error) setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  }

  async function deleteNotification(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("notifications").delete().eq("id", id);
    if (!error) setItems((prev) => prev.filter((n) => n.id !== id));
  }

  if (items.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-soft">No notifications yet.</p>;
  }

  return (
    <div className="space-y-2">
      {items.map((n) => {
        const Icon = typeIcon[n.type] ?? Bell;
        return (
          <div key={n.id} className={`card flex items-start gap-3 p-4 ${!n.is_read ? "border-l-4 border-l-gold-500" : ""}`}>
            <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-700" />
            <div className="flex-1">
              <p className="text-sm font-medium text-ink dark:text-cream">{n.title}</p>
              {n.body && <p className="text-xs text-ink-soft dark:text-cream/60">{n.body}</p>}
              <p className="mt-1 text-[11px] text-ink-soft/70">{new Date(n.created_at).toLocaleString()}</p>
            </div>
            <div className="flex flex-shrink-0 gap-1">
              {!n.is_read && (
                <button onClick={() => markRead(n.id)} aria-label="Mark read" className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50">
                  <Check className="h-4 w-4" />
                </button>
              )}
              <button onClick={() => deleteNotification(n.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
