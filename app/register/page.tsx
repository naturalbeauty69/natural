"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

function RegisterForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") === "staff" ? "staff" : "student";

  const [requestedRole, setRequestedRole] = useState<"student" | "staff">(initialRole);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    setStatus("loading");

    try {
      const supabase = createClient();
      const origin = window.location.origin;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=/pending-approval`,
          data: {
            full_name: fullName.trim(),
            phone: phone.trim(),
            requested_role: requestedRole,
          },
        },
      });

      if (error) {
        setStatus("error");
        setMessage(error.message);
        return;
      }

      if (data.session) {
        window.location.href = "/pending-approval";
        return;
      }

      setStatus("success");
      setMessage(
        "Your account has been created. If email confirmation is enabled, check your email first. Your Academy access will remain pending until an owner/director approves it."
      );
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Registration failed. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-10">
      <div className="w-full max-w-lg rounded-xl2 border border-emerald-900/10 bg-cream-soft/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={64} height={64} />
          <h1 className="mt-4 text-center font-display text-xl text-emerald-900">
            Create Academy Account
          </h1>
          <p className="mt-1 text-center text-xs text-ink-soft">
            Registration does not grant access immediately. An owner/director must approve your account.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2">
          {(["student", "staff"] as const).map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setRequestedRole(role)}
              className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                requestedRole === role
                  ? "border-emerald-700 bg-emerald-700 text-cream"
                  : "border-emerald-900/10 bg-white/50 text-ink-soft hover:border-emerald-700/30"
              }`}
            >
              {role === "student" ? "Student account" : "Staff account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="full_name" className="text-sm font-medium text-ink">Full name</label>
            <input
              id="full_name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="phone" className="text-sm font-medium text-ink">Phone</label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm"
              autoComplete="tel"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-ink">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm"
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
                className="w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 pr-10 text-sm"
                autoComplete="new-password"
                minLength={8}
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

          <div>
            <label htmlFor="confirm_password" className="text-sm font-medium text-ink">Confirm password</label>
            <input
              id="confirm_password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm"
              autoComplete="new-password"
              minLength={8}
            />
          </div>

          {message && (
            <p className={`rounded-lg p-3 text-xs ${status === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-100 text-red-700"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="btn-primary flex w-full items-center justify-center gap-2"
          >
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
            {status === "loading" ? "Creating account…" : "Create account"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-center text-xs text-ink-soft">
          <Link href="/login?role=student" className="hover:text-emerald-700">Already have a student account? Login</Link>
          <Link href="/login?role=staff" className="hover:text-emerald-700">Already have a staff/admin account? Login</Link>
          <Link href="/" className="mt-2 hover:text-emerald-700">← Back to website</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}
