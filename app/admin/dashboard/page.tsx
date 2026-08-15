"use client";

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  GraduationCap,
  Users,
  UserCheck,
  Briefcase,
  Star,
  TrendingUp,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type DashboardStats = {
  todayAppointments: number;
  pendingAppointments: number;
  runningBatches: number;
  upcomingBatches: number;
  totalStudents: number;
  totalStaff: number;
  newEnrollments30d: number;
  reviews: number;
};

const EMPTY_STATS: DashboardStats = {
  todayAppointments: 0,
  pendingAppointments: 0,
  runningBatches: 0,
  upcomingBatches: 0,
  totalStudents: 0,
  totalStaff: 0,
  newEnrollments30d: 0,
  reviews: 0,
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadStats() {
      if (!supabase) {
        if (!cancelled) {
          setLoadError("Supabase is not configured.");
          setLoading(false);
        }
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000
      ).toISOString();

      try {
        const [
          todayAppointments,
          pendingAppointments,
          runningBatches,
          upcomingBatches,
          totalStudents,
          totalStaff,
          newEnrollments30d,
          reviews,
        ] = await Promise.all([
          supabase
            .from("appointments")
            .select("id", { count: "exact", head: true })
            .eq("appointment_date", today),
          supabase
            .from("appointments")
            .select("id", { count: "exact", head: true })
            .eq("status", "pending"),
          supabase
            .from("course_batches")
            .select("id", { count: "exact", head: true })
            .eq("status", "running"),
          supabase
            .from("course_batches")
            .select("id", { count: "exact", head: true })
            .eq("status", "upcoming"),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("role", "student"),
          supabase
            .from("staff_records")
            .select("id", { count: "exact", head: true })
            .eq("is_active", true),
          supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .eq("role", "student")
            .gte("created_at", thirtyDaysAgo),
          supabase
            .from("testimonials")
            .select("id", { count: "exact", head: true }),
        ]);

        const firstError = [
          todayAppointments,
          pendingAppointments,
          runningBatches,
          upcomingBatches,
          totalStudents,
          totalStaff,
          newEnrollments30d,
          reviews,
        ].find((result) => result.error);

        if (firstError) {
          throw firstError.error;
        }

        if (!cancelled) {
          setStats({
            todayAppointments: todayAppointments.count ?? 0,
            pendingAppointments: pendingAppointments.count ?? 0,
            runningBatches: runningBatches.count ?? 0,
            upcomingBatches: upcomingBatches.count ?? 0,
            totalStudents: totalStudents.count ?? 0,
            totalStaff: totalStaff.count ?? 0,
            newEnrollments30d: newEnrollments30d.count ?? 0,
            reviews: reviews.count ?? 0,
          });
          setLoadError(null);
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadStats();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      label: "Today's Appointments",
      value: stats.todayAppointments,
      icon: CalendarCheck,
    },
    {
      label: "Pending Appointments",
      value: stats.pendingAppointments,
      icon: Clock,
    },
    {
      label: "Running Batches",
      value: stats.runningBatches,
      icon: GraduationCap,
    },
    {
      label: "Upcoming Classes",
      value: stats.upcomingBatches,
      icon: GraduationCap,
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: Users,
    },
    {
      label: "Total Staff",
      value: stats.totalStaff,
      icon: Briefcase,
    },
    {
      label: "New Enrollments (30d)",
      value: stats.newEnrollments30d,
      icon: UserCheck,
    },
    {
      label: "Customer Reviews",
      value: stats.reviews,
      icon: Star,
    },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-emerald-900 dark:text-cream">
        Dashboard
      </h1>
      <p className="mt-1 text-sm text-ink-soft dark:text-cream/60">
        Live counts from your Supabase database.
      </p>

      {loadError && (
        <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800 dark:border-red-400/30 dark:bg-red-950/30 dark:text-red-200">
          {loadError}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="card p-5 dark:border-cream/10 dark:bg-emerald-900"
            >
              <Icon className="h-5 w-5 text-gold-500" />
              <p className="mt-3 font-display text-2xl text-emerald-900 dark:text-cream">
                {loading ? "—" : card.value}
              </p>
              <p className="mt-1 text-xs text-ink-soft dark:text-cream/60">
                {card.label}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-8 rounded-xl2 border border-dashed border-gold-500/40 bg-gold-100/30 p-6 dark:bg-emerald-900/40">
        <p className="eyebrow flex items-center gap-2 text-gold-700">
          <TrendingUp className="h-4 w-4" /> Charts (Student Growth, Admissions,
          Popular Courses/Services, Appointment Trends)
        </p>
        <p className="mt-2 text-sm text-ink-soft dark:text-cream/70">
          These become meaningful once there&apos;s real usage history to chart
          — the stat cards above are already live from your database. Charting
          library (Recharts) is installed and ready; wiring the actual trend
          charts is a quick follow-up once a few weeks of real
          appointment/enrollment data exist.
        </p>
      </div>
    </div>
  );
}
