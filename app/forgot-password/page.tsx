"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next/reset-password`,
    });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md rounded-xl2 border border-emerald-900/10 bg-cream-soft/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={56} height={56} />
          <h1 className="mt-4 text-center font-display text-lg text-emerald-900">Reset your password</h1>
        </div>

        {status === "sent" ? (
          <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-center text-sm text-emerald-800">
            If an account exists for {email}, a password reset link has been sent.
          </p>
        ) : (
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
              />
            </div>
            {status === "error" && (
              <p className="rounded-lg bg-red-100 p-3 text-xs text-red-700">{errorMessage}</p>
            )}
            <button type="submit" disabled={status === "loading"} className="btn-primary flex w-full items-center justify-center gap-2">
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              Send Reset Link
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-ink-soft">
          <Link href="/login" className="hover:text-emerald-700">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
