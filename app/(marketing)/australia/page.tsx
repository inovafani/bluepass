import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";

export const metadata: Metadata = {
  title: "Australia | BluePass",
  description:
    "BluePass is opening in Australia: reef trips, charter vessels, and marine tourism booked over WhatsApp, with 5% of every booking reserved for the ocean.",
};

const WHATSAPP_LINK = "https://wa.me/628213143343";

const heroImage =
  "https://images.unsplash.com/photo-1560007839-d11d8ef1af5a?auto=format&fit=crop&w=2400&q=80";
const operatorBandImage =
  "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=2400&q=80";
const finalCtaImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80";

const proofPoints = [
  {
    value: "5%",
    title: "Back to the ocean",
    body: "Every booking reserves 5% for reef restoration and ocean protection.",
  },
  {
    value: "You set",
    title: "Your own rates",
    body: "Operators price their own trips. Listing is free, and we only earn on the bookings we bring.",
  },
  {
    value: "WhatsApp",
    title: "Where it happens",
    body: "Travellers ask, operators answer, and the booking is confirmed in the app everyone already has.",
  },
];

const regions = [
  {
    name: "Great Barrier Reef",
    location: "Cairns and Port Douglas",
    body: "Reef days, liveaboard dives, and outer-reef pontoons run by operators who work the same water every week.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver gliding above a coral reef",
  },
  {
    name: "The Whitsundays",
    location: "Queensland",
    body: "Bareboat and skippered charter through the islands, plus day sailing out of Airlie Beach and Hamilton Island.",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
    alt: "Charter yacht crossing clear water between islands",
  },
  {
    name: "Ningaloo Coast",
    location: "Western Australia",
    body: "Whale shark and manta season, fringing reef snorkels, and small-boat operators along the Exmouth coast.",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    alt: "Remote blue lagoon and white sand beach",
  },
];

const categories = [
  {
    title: "Reef and dive",
    body: "Day trips, certification courses, and liveaboards along the reef systems.",
    icon: "reef",
  },
  {
    title: "Charter and sailing",
    body: "Skippered and bareboat vessels, from half-day harbour runs to multi-night island charters.",
    icon: "boat",
  },
  {
    title: "Marine tourism",
    body: "Whale watching, island transfers, fishing charters, and coastal wildlife tours.",
    icon: "compass",
  },
];

const steps = [
  {
    title: "Tell Kai what you want",
    body: "Message in WhatsApp the way you would text a friend. Dates, group size, and the kind of day you are after.",
  },
  {
    title: "A real operator replies",
    body: "Kai matches you to operators who actually run that trip, and they confirm availability themselves.",
  },
  {
    title: "Pay once your spot is held",
    body: "Payment only opens after an operator accepts and your place is held. No deposit into the void.",
  },
];

export default function AustraliaPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center saturate-[0.9]"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.88),rgba(0,15,21,0.48)_50%,rgba(0,8,14,0.72)),linear-gradient(180deg,rgba(0,0,0,0.36),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.76))]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />
          <div className="cinematic-hero-stage">
            <section className="max-w-[640px] border border-white/16 bg-[#03111d]/58 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
              <p className="bp-eyebrow">
                Now opening
              </p>
              <h1 className="bp-page-title mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[0.96] text-white">
                Australia&apos;s coastline, one conversation away.
              </h1>
              <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
                <span
                  className="mt-1 h-20 w-px bg-white/70"
                  aria-hidden="true"
                />
                <p className="max-w-[29rem] text-sm font-light leading-[1.75] text-white/64 md:text-[15px]">
                  BluePass is bringing its WhatsApp-first booking model to
                  Australian reef, charter, and marine tourism operators. Ask
                  once, get a real operator on the other end, and keep 5% of
                  every booking working for the ocean.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
                <Link
                  href={WHATSAPP_LINK}
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center rounded-full bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Start with Kai
                </Link>
                <a
                  href="#for-operators"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center rounded-full border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  For operators
                </a>
              </div>
            </section>
          </div>
        </section>

        {/* ── Proof points ────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_14%_0%,rgba(184,154,93,0.10),transparent_38%),linear-gradient(180deg,rgba(4,17,29,0.6),#020b11_72%)]"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-[0.82fr_1.18fr] md:items-end">
              <div>
                <p className="bp-eyebrow">
                  The model
                </p>
                <h2 className="bp-page-title mt-4 max-w-md text-[clamp(1.8rem,3vw,2.5rem)] font-normal leading-[1.02] text-white/92">
                  The same three rules, in a new ocean.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-[1.75] text-white/56 md:justify-self-end md:text-[15px]">
                What worked across Indonesia does not change at the border: a
                fixed contribution to the ocean, operators in control of their
                own pricing, and a booking that happens in a conversation.
              </p>
            </div>

            <div className="bp-reveal mt-9 grid gap-4 md:grid-cols-3">
              {proofPoints.map((point, index) => (
                <article
                  key={point.title}
                  className="group relative overflow-hidden rounded-[var(--bp-radius-md)] border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.24)] md:p-7"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold tabular-nums tracking-[0.16em] text-[#B89A5D]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gradient-to-r from-[#B89A5D]/40 to-transparent"
                    />
                  </div>
                  <p className="bp-page-title mt-6 text-[clamp(1.75rem,3.2vw,2.35rem)] leading-none text-[#d4b56f]">
                    {point.value}
                  </p>
                  <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.22em] text-white/40">
                    {point.title}
                  </p>
                  <p className="mt-2.5 text-sm font-light leading-[1.7] text-white/58">
                    {point.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Regions ─────────────────────────────────────────────────────── */}
        <section
          id="regions"
          className="relative overflow-hidden border-y border-white/10 px-[var(--cinematic-screen-x)] py-14 md:py-20"
        >
          <div className="bp-reveal relative mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="bp-eyebrow">
                  Where we are starting
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-xl leading-none text-white md:text-2xl">
                  Three coastlines first, then the rest of the country.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-6 text-white/56 md:text-[15px]">
                BluePass is onboarding operators region by region rather than
                listing everything at once, so the first traveller who asks
                already has someone real to answer.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {regions.map((region) => (
                <article
                  key={region.name}
                  className="bp-tech-card bp-card-quiet group border border-white/[0.09]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={region.image}
                      alt={region.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      loading="lazy"
                      quality={72}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, #020b11 0%, rgba(2,11,17,0.84) 30%, rgba(2,11,17,0.32) 56%, transparent 74%)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                      <h3 className="bp-page-title text-[1.15rem] leading-tight text-white/92">
                        {region.name}
                      </h3>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/38">
                        {region.location}
                      </p>
                      <p className="mt-2 text-[0.78rem] leading-[1.5] text-white/58">
                        {region.body}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── What you can book ───────────────────────────────────────────── */}
        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="bp-reveal mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="bp-eyebrow">
                  What you can book
                </p>
                <h2 className="bp-page-title mt-4 max-w-md text-xl leading-none text-white/82 md:text-2xl">
                  If it leaves from an Australian jetty, it belongs here.
                </h2>
              </div>
              <p className="text-sm font-light leading-[1.75] text-white/36 md:text-right">
                One conversation, whatever kind of water day it is.
              </p>
            </div>

            <div className="grid divide-y divide-white/[0.07] border border-white/[0.07] bg-white/[0.015] md:grid-cols-3 md:divide-x md:divide-y-0">
              {categories.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 px-5 py-5"
                >
                  <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5">
                    <span className="text-[10px] text-white/22">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="flex h-8 w-8 items-center justify-center border border-white/[0.08] bg-white/[0.02]"
                      style={{ borderRadius: "6px" }}
                    >
                      <CategoryIcon type={item.icon} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="bp-page-title text-[0.9375rem] leading-tight text-white/86">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] font-light leading-[1.65] text-white/44">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── For operators ───────────────────────────────────────────────── */}
        <section
          id="for-operators"
          className="relative overflow-hidden border-y border-white/10 px-[var(--cinematic-screen-x)] py-14 md:py-20"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center saturate-[0.6]"
            style={{ backgroundImage: `url('${operatorBandImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,11,17,0.9),rgba(2,11,17,0.6)_38%,rgba(2,11,17,0.72))]" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="bp-reveal relative mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="bp-eyebrow">
                  For Australian operators
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-xl leading-none text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] md:text-2xl">
                  Free to list. You set the rates. We only earn on the bookings
                  we bring you.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-6 text-white/72 drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)] md:text-[15px]">
                Your business stays yours. BluePass sends travellers who are
                ready to book, you accept or decline in WhatsApp Business, and
                nothing is charged to a traveller until you have held the spot.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.title}
                  className="border border-white/12 bg-black/25 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold tabular-nums tracking-[0.16em] text-[#B89A5D]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gradient-to-r from-[#B89A5D]/40 to-transparent"
                    />
                  </div>
                  <h3 className="bp-page-title mt-5 text-[1.05rem] leading-tight text-white/90">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm font-light leading-[1.7] text-white/60">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3 md:gap-5">
              <Link
                href="/signup"
                className="bp-focus-ring inline-flex h-11 min-w-[186px] items-center justify-center rounded-full bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
              >
                List your business
              </Link>
              <Link
                href="/conservation"
                className="bp-focus-ring inline-flex h-11 min-w-[186px] items-center justify-center rounded-full border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
              >
                How the 5% works
              </Link>
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] py-16 text-center md:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center saturate-[0.7]"
            style={{ backgroundImage: `url('${finalCtaImage}')` }}
          />
          <div className="absolute inset-0 bg-[#020b11]/58" />
          <div className="bp-film-grain absolute inset-0" />
          <div className="bp-reveal relative mx-auto max-w-4xl overflow-hidden rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.30)] md:p-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(156,126,96,0.42),rgba(20,24,30,0.44))] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-[34px] backdrop-saturate-150"
            />
            <div className="relative z-10">
              <h2 className="bp-page-title text-2xl leading-none text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.38)] md:text-3xl">
                The reef is worth booking properly.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-6 text-white/72 drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] md:text-[15px]">
                Tell Kai where you want to be on the water in Australia. A real
                operator answers, and 5% of what you pay stays with the ocean
                you came to see.
              </p>
              <Link
                href={WHATSAPP_LINK}
                className="bp-focus-ring mt-8 inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-medium text-[#071827] transition-colors hover:bg-white/90"
              >
                Start with Kai
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <BluePassFooter />
    </>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function CategoryIcon({ type }: { type: string }) {
  if (type === "reef") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#B89A5D]"
        aria-hidden="true"
      >
        <path d="M2 18c1.5 0 2-1.5 3.5-1.5S7.5 18 9 18s2-1.5 3.5-1.5S14.5 18 16 18s2-1.5 3.5-1.5S21 18 22 18" />
        <path d="M7 16V9a3 3 0 0 1 6 0v7" />
        <path d="M13 16v-4a2.5 2.5 0 0 1 5 0v4" />
        <path d="M10 6V3" />
      </svg>
    );
  }

  if (type === "boat") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#B89A5D]"
        aria-hidden="true"
      >
        <path d="M2 20a2.4 2.4 0 0 0 2-1 2.4 2.4 0 0 1 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 1 4 0 2.4 2.4 0 0 0 4 0 2.4 2.4 0 0 1 2-1" />
        <path d="M4 16 3 9h18l-1 7" />
        <path d="M12 9V3l7 6" />
      </svg>
    );
  }

  if (type === "compass") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#B89A5D]"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5z" />
      </svg>
    );
  }

  return null;
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
