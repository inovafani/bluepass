"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { PasswordInput } from "@/app/components/auth/PasswordInput";

const inputClassName =
  "mt-2 h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-sm font-medium text-[#071827] caret-[#006F8E] outline-none transition-colors placeholder:text-slate-400 focus:border-[#9fe8df] focus:ring-2 focus:ring-[#9fe8df]/30";
const passwordInputClassName = `${inputClassName} pr-11`;

export function ResetPasswordForm({ token }: { token: string | null }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("This reset link is missing its token. Please request a new one.");
      return;
    }

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(form.get("confirmPassword") ?? "");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to reset password.");
      }

      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
          BluePass Traveller
        </p>
        <h1 className="bp-page-title mt-3 text-4xl leading-none tracking-tight text-white">
          Choose a new password
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/66">
          This also signs you out everywhere else, for your account&apos;s safety.
        </p>
      </div>

      {!token && (
        <p className="mt-8 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          This reset link is missing its token.{" "}
          <Link href="/forgot-password" className="font-semibold underline">
            Request a new one
          </Link>
          .
        </p>
      )}

      <form onSubmit={handleSubmit} className="bp-auth-form mt-8 grid gap-4">
        <label className="block text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
          New password
          <PasswordInput
            name="password"
            autoComplete="new-password"
            required
            minLength={8}
            className={passwordInputClassName}
          />
        </label>
        <label className="block text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
          Confirm new password
          <PasswordInput
            name="confirmPassword"
            autoComplete="new-password"
            required
            minLength={8}
            className={passwordInputClassName}
          />
        </label>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="bp-focus-ring mt-2 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Please wait..." : "Reset password"}
        </button>
      </form>

      <p className="mt-6 text-sm text-white/62">
        <Link href="/login" className="font-semibold text-white hover:text-[#9fe8df]">
          Back to log in
        </Link>
      </p>
    </div>
  );
}

async function readJson(response: Response): Promise<{ error?: string }> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return { error: "BluePass could not continue. Please refresh the page and try again." };
}
