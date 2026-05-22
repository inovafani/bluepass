"use client";

import type { FormEvent } from "react";
import { useState } from "react";

const roles = [
  { value: "OPERATOR", label: "Operator" },
  { value: "CREATOR", label: "Creator" },
  { value: "USER", label: "User" },
] as const;

const inputClassName =
  "mt-2 h-12 w-full border border-white/20 bg-white px-4 text-sm font-medium text-[#071827] caret-[#006F8E] outline-none transition-colors placeholder:text-slate-400 focus:border-[#9fe8df] focus:ring-2 focus:ring-[#9fe8df]/30";

type SignupRole = (typeof roles)[number]["value"];
type SubmitState = "idle" | "submitting" | "success" | "error";

export function SignupForm() {
  const [role, setRole] = useState<SignupRole>("OPERATOR");
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setState("submitting");
    setError("");

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      role,
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
      setRole("OPERATOR");
      setState("success");
    } catch {
      setState("error");
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[500px] border border-white/20 bg-[#03111d]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.48)] backdrop-blur-2xl sm:p-6 md:p-8"
    >
      <p className="text-[10px] font-black uppercase text-white/60">
        Join BluePass
      </p>
      <h1 className="mt-4 font-display text-[clamp(2.4rem,6vw,4.4rem)] font-black uppercase leading-[0.88] text-white">
        Sign Up
      </h1>
      <p className="mt-5 text-sm leading-6 text-white/70">
        Tell us where you fit. We will use this to follow up as BluePass opens
        access.
      </p>

      <div className="mt-8 space-y-4">
        <label className="block">
          <span className="text-[11px] font-black uppercase text-white/60">
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
          <span className="text-[11px] font-black uppercase text-white/60">
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
          <span className="text-[11px] font-black uppercase text-white/60">
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
        <legend className="text-[11px] font-black uppercase text-white/60">
          I am joining as
        </legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {roles.map((item) => (
            <label
              key={item.value}
              className="flex min-h-12 cursor-pointer items-center justify-center border border-white/20 bg-black/25 px-3 text-center text-[11px] font-black uppercase text-white/70 transition-colors hover:border-white/40 hover:bg-white/10 has-[:checked]:border-white has-[:checked]:bg-white has-[:checked]:text-[#071827]"
            >
              <input
                type="radio"
                name="role"
                value={item.value}
                checked={role === item.value}
                onChange={() => setRole(item.value)}
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
        className="bp-focus-ring mt-8 inline-flex h-12 w-full items-center justify-center bg-white px-6 text-[11px] font-black uppercase text-[#071827] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/50"
      >
        {state === "submitting" ? "Submitting" : "Sign up BluePass"}
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
  );
}
