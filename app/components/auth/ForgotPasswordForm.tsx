"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const inputClassName =
  "mt-2 h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-sm font-medium text-[#071827] caret-[#006F8E] outline-none transition-colors placeholder:text-slate-400 focus:border-[#9fe8df] focus:ring-2 focus:ring-[#9fe8df]/30";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const [developmentResetUrl, setDevelopmentResetUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await readJson(response);

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to continue.");
      }

      setDevelopmentResetUrl(data.developmentResetUrl ?? null);
      setRequested(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue.");
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
          Reset your password
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/66">
          Enter the email on your BluePass account and we will send you a link to choose a new
          password.
        </p>
      </div>

      {requested ? (
        <p className="mt-8 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          If that email has a BluePass account, we sent a link to reset the password. It expires
          in 60 minutes.
          {developmentResetUrl && (
            <a
              href={developmentResetUrl}
              className="mt-2 block break-all text-xs font-semibold underline"
            >
              Development reset link
            </a>
          )}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="bp-auth-form mt-8 grid gap-4">
          <label className="block text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
            Email
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              className={inputClassName}
            />
          </label>

          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bp-focus-ring mt-2 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Please wait..." : "Send reset link"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-white/62">
        <Link href="/login" className="font-semibold text-white hover:text-[#9fe8df]">
          Back to log in
        </Link>
      </p>
    </div>
  );
}

async function readJson(response: Response): Promise<{ error?: string; developmentResetUrl?: string }> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return { error: "BluePass could not continue. Please refresh the page and try again." };
}
