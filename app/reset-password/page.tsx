"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase-admin/browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setStatus("error");
      setErrorMessage("Passwords do not match.");
      return;
    }
    setStatus("loading");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setStatus("error");
        setErrorMessage(error.message);
      } else {
        setStatus("success");
        setTimeout(() => router.push("/login"), 1500);
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md rounded-xl2 border border-emerald-900/10 bg-cream-soft/80 p-8 shadow-soft backdrop-blur-xl">
        <div className="flex flex-col items-center">
          <Image src="/images/logo/logo.png" alt="Natural Beauty Clinic & Academy" width={56} height={56} />
          <h1 className="mt-4 text-center font-display text-lg text-emerald-900">Set a new password</h1>
        </div>

        {status === "success" ? (
          <p className="mt-6 rounded-lg bg-emerald-50 p-4 text-center text-sm text-emerald-800">
            Password updated. Redirecting to login…
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="password" className="text-sm font-medium text-ink">New Password</label>
              <input
                id="password" type="password" required minLength={8}
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="text-sm font-medium text-ink">Confirm Password</label>
              <input
                id="confirm" type="password" required minLength={8}
                value={confirm} onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded-lg border border-emerald-900/15 bg-cream px-3 py-2.5 text-sm outline-none focus:border-emerald-700"
              />
            </div>
            {status === "error" && (
              <p className="rounded-lg bg-red-100 p-3 text-xs text-red-700">{errorMessage}</p>
            )}
            <button type="submit" disabled={status === "loading"} className="btn-primary flex w-full items-center justify-center gap-2">
              {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
