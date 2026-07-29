"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";
import { trackAdminLogin } from "@/lib/analytics";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin/dashboard";
  const suspended = searchParams.get("error") === "suspended";

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

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }

    trackAdminLogin();
    router.push(redirectTo);
    router.refresh();
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

        <p className="mt-6 text-center text-xs text-ink-soft">
          <Link href="/" className="hover:text-emerald-700">← Back to website</Link>
        </p>
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
