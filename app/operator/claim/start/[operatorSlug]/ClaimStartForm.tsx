"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

const inputClassName =
  "mt-2 h-12 w-full border border-white/18 bg-white px-4 text-sm font-medium text-[#071827] caret-[#006F8E] outline-none transition-colors placeholder:text-slate-400 focus:border-[#9fe8df] focus:ring-2 focus:ring-[#9fe8df]/30";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ClaimStartForm({
  operatorSlug,
  operatorName,
  defaultName,
  defaultEmail,
  defaultPhone,
}: {
  operatorSlug: string;
  operatorName: string;
  defaultName?: string | null;
  defaultEmail?: string | null;
  defaultPhone?: string | null;
}) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("submitting");
    setError("");

    const payload = {
      operatorSlug,
      claimantName: String(formData.get("claimantName") ?? ""),
      claimantEmail: String(formData.get("claimantEmail") ?? ""),
      claimantPhone: String(formData.get("claimantPhone") ?? ""),
      claimantRole: String(formData.get("claimantRole") ?? ""),
      websiteUrl: String(formData.get("websiteUrl") ?? ""),
      proofUrl: String(formData.get("proofUrl") ?? ""),
      notes: String(formData.get("notes") ?? ""),
      authorized: formData.get("authorized") === "on",
    };

    try {
      const response = await fetch("/api/operator-claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setState("error");
        setError(data.error ?? "Unable to submit this claim right now.");
        return;
      }

      form.reset();
      setState("success");
    } catch {
      setState("error");
      setError("Something went wrong. Please try again.");
    }
  }

  if (state === "success") {
    return (
      <div className="mt-10 rounded-2xl border border-emerald-300/24 bg-emerald-400/10 p-5 text-center">
        <p className="text-sm font-semibold text-emerald-100">
          Claim submitted for {operatorName}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/58">
          BluePass will review the business proof before marking this listing as
          claimed.
        </p>
        <Link
          href="/dashboard"
          className="bp-focus-ring mt-5 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#071827] transition-colors hover:bg-white/88"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-4 text-left">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-white/78">Full name</span>
          <input
            name="claimantName"
            required
            minLength={2}
            autoComplete="name"
            defaultValue={defaultName ?? ""}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white/78">Business email</span>
          <input
            name="claimantEmail"
            type="email"
            required
            autoComplete="email"
            defaultValue={defaultEmail ?? ""}
            className={inputClassName}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-white/78">WhatsApp / phone</span>
          <input
            name="claimantPhone"
            type="tel"
            autoComplete="tel"
            defaultValue={defaultPhone ?? ""}
            className={inputClassName}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-white/78">Role at business</span>
          <input
            name="claimantRole"
            placeholder="Owner, manager, reservations..."
            className={inputClassName}
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-white/78">Company website</span>
        <input
          name="websiteUrl"
          type="text"
          autoComplete="url"
          placeholder="https://yourcompany.com"
          className={inputClassName}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-white/78">
          Proof URL or notes link
        </span>
        <input
          name="proofUrl"
          type="text"
          autoComplete="url"
          placeholder="LinkedIn, booking page, company profile..."
          className={inputClassName}
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-white/78">Notes</span>
        <textarea
          name="notes"
          rows={4}
          placeholder="Tell us how you are connected to this business."
          className="mt-2 w-full border border-white/18 bg-white px-4 py-3 text-sm font-medium text-[#071827] caret-[#006F8E] outline-none transition-colors placeholder:text-slate-400 focus:border-[#9fe8df] focus:ring-2 focus:ring-[#9fe8df]/30"
        />
      </label>

      <label className="flex items-start gap-3 rounded-2xl border border-white/12 bg-white/[0.06] p-4 text-sm leading-6 text-white/70">
        <input
          type="checkbox"
          name="authorized"
          required
          className="mt-1 h-4 w-4 rounded border-white/30"
        />
        <span>I am authorized to claim this business listing.</span>
      </label>

      <button
        type="submit"
        disabled={state === "submitting"}
        className="bp-focus-ring inline-flex h-14 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:bg-white/50"
      >
        {state === "submitting" ? "Submitting" : `Submit claim for ${operatorName}`}
      </button>

      {state === "error" && (
        <p className="rounded-xl border border-red-300/30 bg-red-400/10 p-3 text-sm leading-6 text-red-100">
          {error}
        </p>
      )}
    </form>
  );
}
