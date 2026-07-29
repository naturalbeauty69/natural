"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, CalendarCheck, GraduationCap, Users, UserCog, Briefcase,
  Sparkles, Package, Image as ImageIcon, FileText, Star, Heart, Mail,
  BarChart3, Award, Search, Settings, UsersRound, Bell,
  DatabaseBackup, LogOut, type LucideIcon,
} from "lucide-react";

interface SidebarLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const sections: { heading: string; links: SidebarLink[] }[] = [
  {
    heading: "Overview",
    links: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    heading: "Operations",
    links: [
      { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
      { label: "Students", href: "/admin/students", icon: GraduationCap },
      { label: "Courses", href: "/admin/courses", icon: GraduationCap },
      { label: "Batches", href: "/admin/batches", icon: Users },
      { label: "Trainers", href: "/admin/trainers", icon: UserCog },
      { label: "Team", href: "/admin/team", icon: UsersRound },
      { label: "Staff", href: "/admin/staff", icon: Briefcase },
    ],
  },
  {
    heading: "Catalog",
    links: [
      { label: "Services", href: "/admin/services", icon: Sparkles },
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Testimonials", href: "/admin/testimonials", icon: Heart },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    heading: "Business",
    links: [
      { label: "Messages", href: "/admin/messages", icon: Mail },
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Certificates", href: "/admin/certificates", icon: Award },
      { label: "SEO", href: "/admin/seo", icon: Search },
    ],
  },
  {
    heading: "System",
    links: [
      { label: "Website Settings", href: "/admin/settings", icon: Settings },
      { label: "Users", href: "/admin/users", icon: UsersRound },
      { label: "Notifications", href: "/admin/notifications", icon: Bell },
      { label: "Backup", href: "/admin/backup", icon: DatabaseBackup },
    ],
  },
];

export default function AdminSidebar({ collapsed, role }: { collapsed: boolean; role: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={`hidden flex-shrink-0 flex-col border-r border-emerald-900/10 bg-cream-soft transition-all duration-200 md:flex ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.heading} className="mb-5">
            {!collapsed && <p className="eyebrow px-2 text-emerald-500/70">{section.heading}</p>}
            <ul className="mt-2 space-y-0.5">
              {section.links.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        active ? "bg-emerald-700 text-cream" : "text-ink-soft hover:bg-emerald-50"
                      }`}
                      title={collapsed ? link.label : undefined}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-emerald-900/10 p-3">
        {!collapsed && <p className="px-2 pb-2 text-xs text-ink-soft">Signed in as {role}</p>}
        <form action="/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-ink-soft hover:bg-emerald-50"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && "Logout"}
          </button>
        </form>
      </div>
    </aside>
  );
}
