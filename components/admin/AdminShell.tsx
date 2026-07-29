"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminShell({
  children,
  userEmail,
  role,
}: {
  children: React.ReactNode;
  userEmail: string;
  role: string;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream dark:bg-emerald-950">
      <AdminSidebar collapsed={collapsed} role={role} />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-emerald-900/40" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-64 bg-cream-soft">
            <AdminSidebar collapsed={false} role={role} />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <AdminTopbar
          onToggleMobileSidebar={() => setMobileOpen((v) => !v)}
          onToggleCollapse={() => setCollapsed((v) => !v)}
          collapsed={collapsed}
          userEmail={userEmail}
          role={role}
        />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
        <footer className="border-t border-emerald-900/10 px-6 py-3 text-center text-xs text-ink-soft dark:border-cream/10 dark:text-cream/50">
          Natural Beauty Clinic &amp; Academy — Admin
        </footer>
      </div>
    </div>
  );
}
