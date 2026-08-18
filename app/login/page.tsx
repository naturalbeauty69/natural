"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";
import { trackAdminLogin } from "@/lib/analytics";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const loginRole = searchParams.get("role") === "student" ? "student" : searchParams.get("role") === "staff" ? "staff" : "auto";
  const suspended = searchParams.get("error") === "suspended";
  const callbackError = searchParams.get("error") === "auth_callback_failed" || searchParams.get("error") === "missing_code";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setStatus("error");
        setErrorMessage("Login succeeded but the session could not be loaded. Please try again.");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, is_active, approval_status")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        setStatus("error");
        setErrorMessage("Your account profile could not be loaded. Please contact the administrator.");
        return;
      }

      if (!profile.is_active || ["suspended", "rejected"].includes(profile.approval_status)) {
        await supabase.auth.signOut();
        setStatus("error");
        setErrorMessage(profile.approval_status === "rejected" ? "Your account has not been approved." : "Your account is suspended.");
        return;
      }

      if (profile.approval_status !== "approved") {
        trackAdminLogin();
        window.location.href = "/pending-approval";
        return;
      }

      const destination =
        redirectTo ||
        (profile.role === "student"
          ? "/student/dashboard"
          : ["owner", "director", "manager", "receptionist", "trainer", "staff"].includes(profile.role)
            ? "/admin/dashboard"
            : "/");

      if (loginRole === "student" && profile.role !== "student" && !["owner","director","manager","receptionist","trainer","staff"].includes(profile.role)) {
        setStatus("error");
        setErrorMessage("This account is not approved as a student account.");
        return;
      }

      if (loginRole === "staff" && !["owner","director","manager","receptionist","trainer","staff"].includes(profile.role)) {
        setStatus("error");
        setErrorMessage("This account is not approved as a staff/admin account.");
        return;
      }

      trackAdminLogin();
      // Hard navigation (not router.push/router.refresh): the session
      // cookie was just written by the browser client's cookie adapter,
      // and middleware needs to see it on a fresh request. Client-side
      // router navigation can serve a cached RSC payload from before the
      // cookie was set, causing a redirect loop or stuck loading state
      // — this is a well-known gotcha with Supabase SSR + Next.js App
      // Router, especially behind an edge cache like Cloudflare.
      window.location.href = redirectTo || destination;
    } catch (err) {
      // Catches a misconfigured Supabase client or any unexpected
      // failure — without this, the UI would otherwise be stuck on
      // "Signing in…" forever with no feedback.
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md rounded-xl2 border border-emerald-900/10 bg-cream-soft/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={64} height={64} />
          <h1 className="mt-4 text-center font-display text-xl text-emerald-900">
            Natural Beauty Clinic &amp; Academy
          </h1>
          <p className="eyebrow mt-1 text-gold-500">Staff &amp; Admin Login</p>
        </div>

        {suspended && (
          <p className="mt-6 rounded-lg bg-red-100 p-3 text-center text-xs text-red-700">
            Your account has been suspended. Contact the administrator.
          </p>
        )}

        {callbackError && (
          <p className="mt-6 rounded-lg bg-red-100 p-3 text-center text-xs text-red-700">
            The authentication link could not be completed. Please sign in again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-ink">Password</label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 pr-10 text-sm outline-none focus:border-emerald-700"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-ink-soft">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-emerald-900/30"
              />
              Remember me
            </label>
            <Link href="/forgot-password" className="text-emerald-700 hover:text-gold-600">
              Forgot password?
            </Link>
          </div>

          {status === "error" && (
            <p className="rounded-lg bg-red-100 p-3 text-xs text-red-700">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary flex w-full items-center justify-center gap-2"
          >
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "loading" ? "Signing in…" : "Login"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-center text-xs text-ink-soft">
          <Link href="/register?role=student" className="hover:text-emerald-700">Create a student account</Link>
          <Link href="/register?role=staff" className="hover:text-emerald-700">Create a staff account</Link>
          <Link href="/" className="mt-2 hover:text-emerald-700">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
