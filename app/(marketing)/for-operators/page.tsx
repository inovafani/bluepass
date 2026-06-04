import type { Metadata } from "next";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import { FleetBrowser } from "./FleetBrowser";

export const metadata: Metadata = {
  title: "Operators | BluePass",
  description:
    "Browse every vetted Indonesian liveaboard partner on BluePass.",
};

const heroImage = "/operator/operator-header.jpg";

export default function ForOperatorsPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        {/* Hero */}
        <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center saturate-[0.9]"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.72),rgba(0,15,21,0.38)_48%,rgba(0,8,14,0.58)),linear-gradient(180deg,rgba(0,0,0,0.30),rgba(0,0,0,0.08)_36%,rgba(0,0,0,0.64))]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="cinematic-hero-stage">
            <section className="max-w-[720px] border border-white/16 bg-[#03111d]/62 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
              <h1 className="bp-page-title text-[clamp(2.25rem,5vw,4rem)] leading-[0.96] text-white">
                Vetted crews, early previews, better water days.
              </h1>
              <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
                <span className="mt-1 h-24 w-px bg-white/70" aria-hidden="true" />
                <p className="max-w-[32rem] text-sm font-light leading-[1.75] text-white/66 md:text-[15px]">
                  BluePass brings live operators and curated previews into one
                  marketplace so travelers can discover trips that are usually
                  buried in WhatsApp, Instagram, and local referrals.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
                <a
                  href="#fleet"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Browse the fleet
                  <ArrowIcon />
                </a>
                <Link
                  href="/signup"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center rounded-full border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Claim your business
                </Link>
              </div>
            </section>
          </div>
        </section>

        {/* Fleet browser */}
        <div id="fleet">
          <FleetBrowser />
        </div>
      </main>
      <BluePassFooter />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
