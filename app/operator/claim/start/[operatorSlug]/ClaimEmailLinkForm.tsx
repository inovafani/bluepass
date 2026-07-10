"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type SubmitState = "idle" | "submitting" | "success" | "manual" | "error";

export function ClaimEmailLinkForm({
  operatorSlug,
  operatorName,
}: {
  operatorSlug: string;
  operatorName: string;
}) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/operator-claim-tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operatorSlug }),
      });
      const data = (await response.json()) as {
        error?: string;
        message?: string;
        developmentClaimUrl?: string;
      };

      if (response.status === 202) {
        setState("manual");
        setMessage(data.message ?? "BluePass will review this listing manually.");
        return;
      }

      if (!response.ok) {
        setState("error");
        setMessage(data.error ?? "Unable to send this claim link right now.");
        return;
      }

      setState("success");
      setMessage(
        data.developmentClaimUrl
          ? `Development link: ${data.developmentClaimUrl}`
          : `We sent a secure claim link to the business email on file for ${operatorName}.`,
      );
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      data-operator-slug={operatorSlug}
      className="mt-10 rounded-2xl border border-white/14 bg-white/[0.08] p-5 backdrop-blur-md"
    >
      <p className="text-sm leading-6 text-white/68">
        To prove you own {operatorName}, BluePass will email a secure claim link
        to the business address on file.
      </p>
      <button
        type="submit"
        disabled={state === "submitting"}
        className="bp-focus-ring mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:bg-white/50"
      >
        {state === "submitting" ? "Sending" : "Email me my claim link"}
      </button>
      {message && (
        <p
          className={`mt-4 rounded-xl border p-3 text-sm leading-6 ${
            state === "error"
              ? "border-red-300/30 bg-red-400/10 text-red-100"
              : "border-emerald-300/24 bg-emerald-400/10 text-emerald-100"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
