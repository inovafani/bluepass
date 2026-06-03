"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const roles = [
  { value: "OPERATOR", label: "Operator", roles: ["OPERATOR"] },
  { value: "CREATOR", label: "Creator", roles: ["CREATOR"] },
  { value: "BOTH", label: "Both", roles: ["OPERATOR", "CREATOR"] },
] as const;

const inputClassName =
  "mt-2 h-12 w-full border border-white/20 bg-white px-4 text-sm font-medium text-[#071827] caret-[#006F8E] outline-none transition-colors placeholder:text-slate-400 focus:border-[#9fe8df] focus:ring-2 focus:ring-[#9fe8df]/30";

type SignupRole = "OPERATOR" | "CREATOR";
type SignupRoleChoice = (typeof roles)[number]["value"];
type SubmitState = "idle" | "submitting" | "success" | "error";

export function SignupForm() {
  const [roleChoice, setRoleChoice] = useState<SignupRoleChoice>("OPERATOR");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");
    setError("");

    const formData = new FormData(form);
    const selectedOption = roles.find((item) => item.value === roleChoice);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      roles: [
        ...(selectedOption?.roles ?? ["OPERATOR"]),
      ] satisfies SignupRole[],
    };

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setState("error");
        setError("Please check your details and try again.");
        return;
      }

      form.reset();
      setRoleChoice("OPERATOR");
      setState("success");
    } catch {
      setState("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="relative w-full max-w-[500px]">
      {/* Glass layer on a div — not a form/article, so globals.css overflow:hidden doesn't kill backdrop-filter */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl bg-[rgba(20,24,30,0.34)] shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150"
      />
      <form
        onSubmit={handleSubmit}
        className="bp-signup-glass-form relative z-10 w-full p-5 sm:p-6 md:p-8"
      >
        <h1 className="bp-page-title mt-4 whitespace-nowrap text-[clamp(1.65rem,8vw,4rem)] leading-none text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.38)]">
          Join BluePass
        </h1>
        <p className="mt-5 text-sm leading-6 text-white/72 drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)]">
          Tell us where you fit. We will use this to follow up as BluePass opens
          access.
        </p>

        <div className="mt-8 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
              Name
            </span>
            <input
              name="name"
              type="text"
              required
              minLength={2}
              autoComplete="name"
              placeholder="Your name"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
              Email
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClassName}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
              Phone
            </span>
            <input
              name="phone"
              type="tel"
              required
              minLength={6}
              autoComplete="tel"
              placeholder="+62..."
              className={inputClassName}
            />
          </label>
        </div>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-white/78 drop-shadow-[0_1px_10px_rgba(0,0,0,0.32)]">
            I am joining as
          </legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {roles.map((item) => (
              <label
                key={item.value}
                className="flex min-h-14 cursor-pointer items-center justify-center border border-white/20 bg-black/20 px-4 text-center text-sm font-normal text-white/78 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10 has-[:checked]:border-white has-[:checked]:bg-white has-[:checked]:text-[#071827]"
              >
                <input
                  type="radio"
                  name="roleChoice"
                  value={item.value}
                  checked={roleChoice === item.value}
                  onChange={() => setRoleChoice(item.value)}
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={state === "submitting"}
          className="bp-focus-ring mt-8 inline-flex h-14 w-full items-center justify-center bg-white px-6 text-sm font-medium text-[#071827] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/50"
        >
          {state === "submitting" ? "Submitting" : "Join Us"}
        </button>

        {state === "success" ? (
          <p className="mt-4 border border-emerald-300/30 bg-emerald-400/10 p-3 text-sm leading-6 text-emerald-100">
            Thanks. Your BluePass signup was saved.
          </p>
        ) : null}

        {state === "error" ? (
          <p className="mt-4 border border-red-300/30 bg-red-400/10 p-3 text-sm leading-6 text-red-100">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  );
}
