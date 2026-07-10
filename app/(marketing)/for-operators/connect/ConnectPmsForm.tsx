"use client";

import { useMemo, useState } from "react";

type Platform = "" | "REZDY" | "FAREHARBOR" | "BOKUN" | "NATIVE";
type SubmitState = "idle" | "submitting" | "success" | "error";

export function ConnectPmsForm() {
  const [platform, setPlatform] = useState<Platform>("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [apiBase, setApiBase] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [publicBookingBaseUrl, setPublicBookingBaseUrl] = useState("");
  const [publicProductUrlTemplate, setPublicProductUrlTemplate] = useState("");
  const [restApiBase, setRestApiBase] = useState("");
  const [restAccessKey, setRestAccessKey] = useState("");
  const [restSecretKey, setRestSecretKey] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const isBokun = platform === "BOKUN";
  const canSubmit = useMemo(() => {
    if (!platform || submitState === "submitting") {
      return false;
    }

    return true;
  }, [platform, submitState]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState("submitting");
    setMessage("");

    const response = await fetch("/api/operator-integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform,
        contactEmail,
        contactWhatsapp,
        notes,
        credentials: {
          apiBase,
          accessToken,
          supplierId,
          publicBookingBaseUrl,
          publicProductUrlTemplate,
          restApiBase,
          restAccessKey,
          restSecretKey,
        },
      }),
    });
    const payload = (await response.json()) as {
      error?: string;
      readiness?: { status?: string };
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
        ? "Bokun readiness received. BluePass will verify credentials and sync products with you."
        : `PMS setup received${payload.readiness?.status ? `: ${payload.readiness.status.toLowerCase()}` : ""}.`,
    );
  }

  return (
    <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
      <label className="grid gap-2">
        <span className="text-xs font-medium tracking-[0.16em] text-white/70">
          Booking system
        </span>
        <select
          className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
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

      <div className="grid gap-5 md:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-xs font-medium tracking-[0.16em] text-white/70">
            Contact email
          </span>
          <input
            className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            placeholder="ops@yourcompany.com"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs font-medium tracking-[0.16em] text-white/70">
            WhatsApp
          </span>
          <input
            className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
            value={contactWhatsapp}
            onChange={(event) => setContactWhatsapp(event.target.value)}
            placeholder="+62..."
          />
        </label>
      </div>

      {isBokun ? (
        <div className="grid gap-5 rounded-xl bg-[#071e2e] p-4">
          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              OCTO API base
            </span>
            <input
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
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
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
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
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={supplierId}
              onChange={(event) => setSupplierId(event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              Public booking base URL
            </span>
            <input
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
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
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={publicProductUrlTemplate}
              onChange={(event) => setPublicProductUrlTemplate(event.target.value)}
              placeholder="https://your-operator.bokun.io/book/{productId}"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              REST API base
            </span>
            <input
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={restApiBase}
              onChange={(event) => setRestApiBase(event.target.value)}
              placeholder="https://api.bokun.io"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              REST access key
            </span>
            <input
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              value={restAccessKey}
              onChange={(event) => setRestAccessKey(event.target.value)}
            />
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-medium tracking-[0.16em] text-white/70">
              REST secret key
            </span>
            <input
              className="h-12 rounded-lg border border-white/16 bg-white px-4 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
              type="password"
              value={restSecretKey}
              onChange={(event) => setRestSecretKey(event.target.value)}
            />
          </label>
        </div>
      ) : null}

      <label className="grid gap-2">
        <span className="text-xs font-medium tracking-[0.16em] text-white/70">
          PMS notes
        </span>
        <textarea
          className="min-h-28 rounded-lg border border-white/16 bg-white px-4 py-3 text-sm font-medium text-[#071827] outline-none transition-colors focus:border-[#B89A5D] focus:ring-2 focus:ring-[#B89A5D]/30"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Tell us your booking system account, preferred setup contact, or where availability/pricing currently lives."
        />
      </label>

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
        className="mt-2 inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-[11px] font-black text-[#071827] transition-colors hover:bg-white/90 disabled:cursor-not-allowed disabled:bg-white/45 md:w-auto"
      >
        {submitState === "submitting" ? "Connecting" : "Continue"}
      </button>
    </form>
  );
}
