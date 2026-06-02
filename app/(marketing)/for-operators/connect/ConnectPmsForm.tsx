"use client";

import { useMemo, useState } from "react";

type Platform = "" | "REZDY" | "FAREHARBOR" | "BOKUN" | "NATIVE";
type SubmitState = "idle" | "submitting" | "success" | "error";

export function ConnectPmsForm() {
  const [platform, setPlatform] = useState<Platform>("");
  const [operatorId, setOperatorId] = useState("");
  const [apiBase, setApiBase] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [publicBookingBaseUrl, setPublicBookingBaseUrl] = useState("");
  const [publicProductUrlTemplate, setPublicProductUrlTemplate] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const isBokun = platform === "BOKUN";
  const canSubmit = useMemo(() => {
    if (!operatorId || !platform || submitState === "submitting") {
      return false;
    }

    return !isBokun || Boolean(accessToken);
  }, [accessToken, isBokun, operatorId, platform, submitState]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const response = await fetch("/api/operator-integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operatorId,
        platform,
        credentials: {
          apiBase,
          accessToken,
          supplierId,
          publicBookingBaseUrl,
          publicProductUrlTemplate,
        },
      }),
    });
    const payload = (await response.json()) as {
      error?: string;
      sync?: { synced?: number };
    };

    if (!response.ok) {
      setSubmitState("error");
      setMessage(payload.error ?? "Connection failed.");
      return;
    }

    setSubmitState("success");
    setMessage(
      isBokun
        ? `Bokun connected. ${payload.sync?.synced ?? 0} products synced.`
        : "Booking system connected.",
    );
  }

  return (
    <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-xs font-medium tracking-[0.16em] text-white/70">
          Operator ID
        </span>
        <input
          className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
          value={operatorId}
          onChange={(event) => setOperatorId(event.target.value)}
          placeholder="operator_..."
        />
      </label>

      <label className="grid gap-2">
        <span className="text-xs font-medium tracking-[0.16em] text-white/70">
          Booking system
        </span>
        <select
          className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
          value={platform}
          onChange={(event) => setPlatform(event.target.value as Platform)}
        >
          <option value="" disabled>
            Select PMS platform
          </option>
          <option value="REZDY">Rezdy</option>
          <option value="FAREHARBOR">FareHarbor</option>
          <option value="BOKUN">Bokun</option>
          <option value="NATIVE">None</option>
        </select>
      </label>

      {isBokun ? (
        <div className="grid gap-5 border border-white/12 p-4">
          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              OCTO API base
            </span>
            <input
              className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={apiBase}
              onChange={(event) => setApiBase(event.target.value)}
              placeholder="https://api.bokun.io/octo/v1"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              Access token
            </span>
            <input
              className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              type="password"
              value={accessToken}
              onChange={(event) => setAccessToken(event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              OCTO supplier ID
            </span>
            <input
              className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              Public booking base URL
            </span>
            <input
              className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={publicBookingBaseUrl}
              onChange={(event) => setPublicBookingBaseUrl(event.target.value)}
              placeholder="https://your-operator.bokun.io/book"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              Public product URL template
            </span>
            <input
              className="h-12 border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={publicProductUrlTemplate}
              onChange={(event) => setPublicProductUrlTemplate(event.target.value)}
              placeholder="https://your-operator.bokun.io/book/{productId}"
            />
          </label>
        </div>
      ) : null}

      {message ? (
        <p
          className={
            submitState === "error"
              ? "text-sm font-medium text-red-200"
              : "text-sm font-medium text-emerald-200"
          }
        >
          {message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-2 inline-flex h-12 w-full items-center justify-center bg-white px-6 text-[11px] font-black text-[#071827] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/45 md:w-auto"
      >
        {submitState === "submitting" ? "Connecting" : "Continue"}
      </button>
    </form>
  );
}
