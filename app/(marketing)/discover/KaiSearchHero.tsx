"use client";

import Link from "next/link";
import { useState } from "react";

const suggestions = [
  { label: "Mantas in Komodo", query: "I'm looking for a Komodo liveaboard focused on manta rays and diving." },
  { label: "Raja Ampat biodiversity", query: "I want to explore Raja Ampat — looking for a liveaboard focused on biodiversity and reef diving." },
  { label: "Komodo cabin trip", query: "I'd like a cabin on a Komodo liveaboard for a small group." },
  { label: "Raja Ampat cabin trip", query: "I'd like a cabin on a Raja Ampat liveaboard for a small group." },
  { label: "Around $5k", query: "What Komodo or Raja Ampat liveaboard options does BluePass have around $5,000?" },
];

function openKai(query: string) {
  window.dispatchEvent(new CustomEvent("kai:open", { detail: { query } }));
}

export function KaiSearchHero() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  function handleSubmit(e: React.FormEvent | React.KeyboardEvent | React.MouseEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    openKai(q);
    setQuery("");
  }

  return (
    <section className="relative min-h-svh overflow-hidden bg-[#020b11]">
      {/* Background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{ backgroundImage: "url('/explore/explore-header.jpg')" }}
      />
      {/* Main dark overlay — bump this up to darken the image */}
      <div className="absolute inset-0 bg-[#020b11]/72" />
      {/* Subtle teal wash */}
      <div className="absolute inset-0 bg-[#0c3b3a]/28 mix-blend-color" />
      {/* Radial depth hint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_48%_at_50%_22%,rgba(20,160,148,0.16)_0%,transparent_65%)]" />
      {/* Top + bottom vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,11,17,0.55)_0%,transparent_28%,rgba(2,11,17,0.82)_100%)]" />
      <div className="bp-film-grain absolute inset-0 opacity-45" />

      {/* Content */}
      <div className="relative flex min-h-svh flex-col items-center justify-center px-5 pb-24 pt-28">

        {/* Eyebrow — needs drop-shadow to punch through */}
        <p className="text-[10px] uppercase tracking-[0.32em] text-white/70 [text-shadow:0_1px_12px_rgba(0,0,0,0.9)]">
          Plan with Kai
        </p>

        {/* Heading */}
        <h1 className="bp-page-title mt-4 text-center leading-none text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.60)]">
          <span className="block text-[clamp(3.5rem,9vw,6.5rem)]">Where to</span>
          <span className="block text-[clamp(3.5rem,9vw,6.5rem)] font-light italic text-white">
            next?
          </span>
        </h1>

        {/* Search bar — bare div, no form wrapper to avoid stacking context
            that blocks backdrop-filter on child elements.
            Border via style prop so class selector div[class*=" border "]
            in globals.css does not force overflow:hidden on this element.   */}
        <div
          style={{
            border: focused
              ? "1px solid rgba(255,255,255,0.70)"
              : "1px solid rgba(255,255,255,0.12)",
            borderRadius: "9999px",
          }}
          className="mt-10 flex w-full max-w-[44rem] items-center gap-3 bg-black/[0.15] px-5 py-3.5 backdrop-blur-[40px] transition-[border-color] duration-150"
        >
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#5cc8be]"
            aria-hidden="true"
          >
            <KaiIcon />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(e); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Tell Kai your dates, crew & vibe…"
            className="flex-1 appearance-none border-0 bg-transparent text-[13px] text-white shadow-none outline-none ring-0 focus:outline-none focus:ring-0 placeholder:text-white/45"
          />
          {query.trim() && (
            <button
              type="button"
              onClick={handleSubmit}
              className="shrink-0 rounded-full bg-white px-4 py-1.5 text-[11px] font-semibold text-[#020b11] transition-colors hover:bg-white/90"
            >
              Ask
            </button>
          )}
        </div>

        {/* Suggestion chips — same nav glass recipe */}
        <div className="mt-3 flex w-full max-w-[44rem] flex-wrap gap-2 px-0 lg:flex-nowrap lg:justify-between">
          {suggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => openKai(s.query)}
              className="shrink-0 whitespace-nowrap rounded-full border border-white/[0.12] bg-black/[0.15] px-4 py-2 text-[11px] font-medium text-white/72 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-[40px] transition-colors hover:bg-white/[0.10] hover:text-white/95"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Conservation reminder
            No "group" class — a[class*="group"] is caught by the cinematic
            override and gets bg-[#04111d]/86 forced on it.                  */}
        <Link
          href="/conservation"
          className="mt-4 flex w-full max-w-[44rem] items-center gap-4 rounded-2xl border border-white/[0.12] bg-black/[0.15] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-[40px] transition-colors hover:bg-black/[0.22] hover:border-white/[0.20]"
        >
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#1a7c72]/55 bg-[#0d3d38]/80 px-3 py-1.5 text-[9px] tracking-[0.20em] text-[#5cc8be]">
            <LeafIcon />
            CONSERVATION
          </span>
          <p className="text-[12px] font-light leading-[1.55] text-white/58">
            5% of every trip goes to vetted ocean partners — built into the price.{" "}
            <span className="text-white/38">Never an add-on. See where it goes →</span>
          </p>
        </Link>

      </div>
    </section>
  );
}

function KaiIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#020b11"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LeafIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
