"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Bell, Moon, Sun, ChevronDown, PanelLeftClose, PanelLeft } from "lucide-react";

const DARK_KEY = "nbc-admin-dark";

export default function AdminTopbar({
  onToggleMobileSidebar,
  onToggleCollapse,
  collapsed,
  userEmail,
  role,
}: {
  onToggleMobileSidebar: () => void;
  onToggleCollapse: () => void;
  collapsed: boolean;
  userEmail: string;
  role: string;
}) {
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DARK_KEY) === "1";
    setDark(stored);
    document.documentElement.classList.toggle("dark", stored);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    localStorage.setItem(DARK_KEY, next ? "1" : "0");
    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <header className="flex items-center justify-between border-b border-emerald-900/10 bg-cream-soft px-4 py-3 dark:border-cream/10 dark:bg-emerald-950">
      <div className="flex items-center gap-2">
        <button onClick={onToggleMobileSidebar} className="rounded-lg p-2 hover:bg-emerald-50 md:hidden" aria-label="Toggle menu">
          <Menu className="h-5 w-5 text-emerald-900 dark:text-cream" />
        </button>
        <button onClick={onToggleCollapse} className="hidden rounded-lg p-2 hover:bg-emerald-50 md:block" aria-label="Collapse sidebar">
          {collapsed ? <PanelLeft className="h-4 w-4 text-emerald-900 dark:text-cream" /> : <PanelLeftClose className="h-4 w-4 text-emerald-900 dark:text-cream" />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={toggleDark} aria-label="Toggle dark mode" className="rounded-lg p-2 hover:bg-emerald-50">
          {dark ? <Sun className="h-4 w-4 text-gold-500" /> : <Moon className="h-4 w-4 text-emerald-900" />}
        </button>

        <button aria-label="Notifications" className="relative rounded-lg p-2 hover:bg-emerald-50">
          <Bell className="h-4 w-4 text-emerald-900 dark:text-cream" />
        </button>

        <div className="relative">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-emerald-50"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-medium text-cream">
              {userEmail.charAt(0).toUpperCase()}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs text-ink-soft dark:text-cream/70">{role}</span>
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-ink-soft" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-emerald-900/10 bg-cream-soft p-2 shadow-soft">
              <p className="truncate px-2 py-1.5 text-xs text-ink-soft">{userEmail}</p>
              <Link href="/admin/profile" className="block rounded-lg px-2 py-1.5 text-sm hover:bg-emerald-50">Profile</Link>
              <Link href="/admin/settings" className="block rounded-lg px-2 py-1.5 text-sm hover:bg-emerald-50">Settings</Link>
              <form action="/logout" method="post">
                <button type="submit" className="w-full rounded-lg px-2 py-1.5 text-left text-sm text-red-700 hover:bg-red-50">
                  Logout
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
