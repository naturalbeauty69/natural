"use client";

import { useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

interface Message {
  id: string;
  sender_name: string | null;
  sender_email: string | null;
  sender_phone: string | null;
  subject: string | null;
  body: string | null;
  is_read: boolean;
  created_at: string;
}

export default function MessagesManager({ initialMessages }: { initialMessages: Message[] }) {
  const [messages, setMessages] = useState(initialMessages);

  async function toggleRead(m: Message) {
    const supabase = createClient();
    const { error } = await supabase.from("messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (!error) setMessages((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_read: !x.is_read } : x)));
  }

  async function deleteMessage(id: string) {
    if (!confirm("Delete this message permanently?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("messages").delete().eq("id", id);
    if (!error) setMessages((prev) => prev.filter((m) => m.id !== id));
  }

  if (messages.length === 0) {
    return <p className="py-10 text-center text-sm text-ink-soft">No messages yet.</p>;
  }

  return (
    <div className="space-y-3">
      {messages.map((m) => (
        <div key={m.id} className={`card p-4 ${!m.is_read ? "border-l-4 border-l-gold-500" : ""}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-ink dark:text-cream">{m.sender_name ?? "Unknown"}</p>
              <p className="text-xs text-ink-soft dark:text-cream/60">
                {[m.sender_email, m.sender_phone].filter(Boolean).join(" · ")}
              </p>
              {m.subject && <p className="mt-1 text-sm font-medium text-ink dark:text-cream">{m.subject}</p>}
              {m.body && <p className="mt-1 text-sm text-ink-soft dark:text-cream/70">{m.body}</p>}
              <p className="mt-2 text-xs text-ink-soft/70">{new Date(m.created_at).toLocaleString()}</p>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              <button onClick={() => toggleRead(m)} aria-label="Toggle read" className="rounded-lg p-1.5 text-emerald-700 hover:bg-emerald-50">
                {m.is_read ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
              </button>
              <button onClick={() => deleteMessage(m.id)} aria-label="Delete" className="rounded-lg p-1.5 text-red-600 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
