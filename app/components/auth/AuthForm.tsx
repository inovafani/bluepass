"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useToast } from "@/app/components/ui/ToastProvider";
import { PasswordInput } from "@/app/components/auth/PasswordInput";

type AuthMode = "login" | "register";

const inputClassName =
  "mt-2 h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-sm font-medium text-[#071827] caret-[#006F8E] outline-none transition-colors placeholder:text-slate-400 focus:border-[#9fe8df] focus:ring-2 focus:ring-[#9fe8df]/30";
const passwordInputClassName = `${inputClassName} pr-11`;

export function AuthForm({
  mode,
  nextPath,
}: {
  mode: AuthMode;
  nextPath?: string | null;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const isRegister = mode === "register";
  const safeNextPath = sanitizeNextPath(nextPath);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<
    string | null
  >(null);
  const [developmentVerificationUrl, setDevelopmentVerificationUrl] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setError(null);
    setNotice(null);
    setDevelopmentVerificationUrl(null);
    setIsSubmitting(true);

    const form = new FormData(formElement);
    const payload = {
      ...(isRegister ? { name: String(form.get("name") ?? "") } : {}),
      email: String(form.get("email") ?? ""),
      ...(isRegister ? { phone: String(form.get("phone") ?? "") } : {}),
      password: String(form.get("password") ?? ""),
      ...(isRegister && safeNextPath ? { next: safeNextPath } : {}),
    };

    try {
      const response = await fetch(
        `/api/auth/${isRegister ? "register" : "login"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await readAuthResponse(response);

      if (!response.ok) {
        if (data.code === "EMAIL_NOT_VERIFIED" && data.email) {
          setPendingVerificationEmail(data.email);
        }
        throw new Error(data.error ?? "Unable to continue.");
      }

      if (isRegister && data.requiresEmailVerification) {
        setPendingVerificationEmail(data.email ?? payload.email);
        setDevelopmentVerificationUrl(data.developmentVerificationUrl ?? null);
        setNotice(
          "We sent a verification link to your email. Verify it before logging in.",
        );
        formElement.reset();
        return;
      }

      showToast(isRegister ? "Account created. Welcome to BluePass." : "Logged in successfully.");
      router.push(safeNextPath ?? "/discover");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendVerification() {
    if (!pendingVerificationEmail) return;

    setError(null);
    setNotice(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingVerificationEmail }),
      });
      const data = await readAuthResponse(response);

      if (!response.ok) {
        throw new Error(data.error ?? "Unable to resend verification email.");
      }

      setDevelopmentVerificationUrl(data.developmentVerificationUrl ?? null);
      setNotice(
        data.alreadyVerified
          ? "This email is already verified. You can log in now."
          : "Verification email sent again.",
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend verification email.",
      );
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
          {isRegister ? "Create your optional profile" : "Welcome back"}
        </h1>
        <p className="mt-4 text-sm leading-6 text-white/66">
          {isRegister
            ? "Kai can remember your contact details for future inquiries. You can still use BluePass without an account."
            : "Sign in so Kai can reuse your saved name, email, and phone for inquiries."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bp-auth-form mt-8 grid gap-4">
        {isRegister && (
          <label className="block text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
            Name
            <input
              name="name"
              autoComplete="name"
              required
              minLength={2}
              className={inputClassName}
            />
          </label>
        )}
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
        {isRegister && (
          <label className="block text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
            WhatsApp / phone
            <input
              name="phone"
              autoComplete="tel"
              required
              minLength={6}
              className={inputClassName}
            />
          </label>
        )}
        <label className="block text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
          Password
          <PasswordInput
            name="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
            minLength={8}
            className={passwordInputClassName}
          />
        </label>

        {!isRegister && (
          <Link
            href="/forgot-password"
            className="-mt-2 justify-self-end text-sm font-semibold text-white/72 hover:text-[#9fe8df]"
          >
            Forgot password?
          </Link>
        )}

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {notice && (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            {notice}
          </p>
        )}

        {pendingVerificationEmail && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
            <p>
              Waiting for verification:{" "}
              <span className="font-semibold">{pendingVerificationEmail}</span>
            </p>
            <button
              type="button"
              onClick={resendVerification}
              disabled={isSubmitting}
              className="mt-2 font-semibold text-bluepass-ocean hover:text-bluepass-deep disabled:opacity-60"
            >
              Resend verification email
            </button>
            {developmentVerificationUrl && (
              <a
                href={developmentVerificationUrl}
                className="mt-2 block break-all text-xs font-semibold text-slate-700 underline"
              >
                Development verification link
              </a>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bp-focus-ring mt-2 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Please wait..."
            : isRegister
              ? "Create profile"
              : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-white/62">
        {isRegister ? "Already have a profile?" : "New to BluePass?"}{" "}
        <Link
          href={buildAuthHref(
            isRegister ? "/login" : "/register",
            safeNextPath,
          )}
          className="font-semibold text-white hover:text-[#9fe8df]"
        >
          {isRegister ? "Log in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}

function sanitizeNextPath(nextPath: string | null | undefined) {
  if (!nextPath || !nextPath.startsWith("/") || nextPath.startsWith("//")) {
    return null;
  }

  if (/^\/[^/\\]*:/.test(nextPath)) {
    return null;
  }

  return nextPath;
}

function buildAuthHref(path: string, nextPath: string | null) {
  if (!nextPath) {
    return path;
  }

  return `${path}?next=${encodeURIComponent(nextPath)}`;
}

async function readAuthResponse(response: Response): Promise<{
  error?: string;
  code?: string;
  email?: string;
  requiresEmailVerification?: boolean;
  developmentVerificationUrl?: string;
  alreadyVerified?: boolean;
}> {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return {
    error:
      response.status === 404
        ? "Auth endpoint is not available. Please refresh the page and try again."
        : "BluePass could not continue. Please refresh the page and try again.",
  };
}
