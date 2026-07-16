import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";

export const metadata: Metadata = {
  title: "Indonesia | BluePass",
  description:
    "BluePass in Indonesia: phinisi charters, Komodo and Raja Ampat trips, and dive days booked over WhatsApp, with 5% of every booking reserved for the reef.",
};

const WHATSAPP_LINK = "https://wa.me/628213143343";

const heroImage =
  "https://images.unsplash.com/photo-1703081350237-ef57fafb6f6a?auto=format&fit=crop&w=2400&q=80";
const operatorBandImage = "/explore/explore-header.jpg";
const finalCtaImage =
  "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=2400&q=80";

const proofPoints = [
  {
    value: "5%",
    title: "Back to the reef",
    body: "Every booking reserves 5% for reef restoration and ocean protection.",
  },
  {
    value: "You set",
    title: "Your own rates",
    body: "Operators price their own trips. Listing is free, and we only earn on the bookings we bring.",
  },
  {
    value: "Bahasa",
    title: "Or English",
    body: "Kai works in the language you message in, and operators reply in theirs.",
  },
];

const regions = [
  {
    name: "Labuan Bajo and Komodo",
    location: "East Nusa Tenggara",
    body: "Phinisi liveaboards through the national park, day boats to Padar and Pink Beach, and manta dives at Karang Makassar.",
    image: "/destinations/labuan-bajo.webp",
    alt: "Islands and turquoise water near Labuan Bajo",
  },
  {
    name: "Raja Ampat",
    location: "West Papua",
    body: "The richest reef on the planet. Liveaboard crossings, homestay island hopping, and dive operators who know every current.",
    image: "/destinations/raja-ampat.jpg",
    alt: "Limestone islands scattered across Raja Ampat",
  },
  {
    name: "Bali",
    location: "Bali",
    body: "Day charters from Benoa and Sanur, Nusa Penida crossings, and the dive schools that most travellers start with.",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1600&q=80",
    alt: "Tropical coastline in Bali",
  },
];

const categories = [
  {
    title: "Phinisi and liveaboards",
    body: "Cabin berths or a whole boat, from a long weekend to a full Komodo or Raja Ampat crossing.",
    icon: "boat",
  },
  {
    title: "Dive and snorkel",
    body: "Day dives, certification courses, and the small operators who run the sites properly.",
    icon: "reef",
  },
  {
    title: "Day trips and transfers",
    body: "Island hopping, sunrise boats, fishing, and the crossings between them.",
    icon: "compass",
  },
];

const steps = [
  {
    title: "Message Kai in WhatsApp",
    body: "No new app, no account to make. Say where you want to go, when, and how many of you there are.",
  },
  {
    title: "A real operator replies",
    body: "Kai matches you to operators who actually run that trip. They confirm availability and price themselves.",
  },
  {
    title: "Pay once your spot is held",
    body: "Payment only opens after an operator accepts and the seat or cabin is held for you.",
  },
];

const audiences = [
  {
    title: "For operators",
    body: "List for free, keep control of your own pricing, and take bookings in the WhatsApp Business account you already run all day. We only earn on the travellers we bring you.",
    href: "/signup",
    label: "Claim your business",
  },
  {
    title: "For creators",
    body: "If your audience already asks you where to dive and which boat to take, you can send them somewhere real and earn a share of the bookings that follow.",
    href: "/creators",
    label: "Creator programme",
  },
  {
    title: "For partners",
    body: "Agencies and source-market partners can hand travellers to operators here without building a supply network of their own.",
    href: "/partners",
    label: "Partner with us",
  },
];

export default function IndonesiaPage() {
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
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.88),rgba(0,15,21,0.42)_50%,rgba(0,8,14,0.6)),linear-gradient(180deg,rgba(0,0,0,0.32),rgba(0,0,0,0.06)_40%,rgba(0,0,0,0.42))]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />
          <div className="cinematic-hero-stage">
            <section className="max-w-[640px] border border-white/16 bg-[#03111d]/58 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
              <p className="bp-eyebrow">
                Home water
              </p>
              <h1 className="bp-page-title mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[0.96] text-white">
                Indonesia is where BluePass started.
              </h1>
              <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
                <span
                  className="mt-1 h-20 w-px bg-white/70"
                  aria-hidden="true"
                />
                <p className="max-w-[29rem] text-sm font-light leading-[1.75] text-white/64 md:text-[15px]">
                  Seventeen thousand islands, and the best trips are still run by
                  operators who answer their own phone. BluePass puts them one
                  WhatsApp message away, and keeps 5% of every booking working
                  for the reef.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
                <Link
                  href={WHATSAPP_LINK}
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center rounded-full bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Start with Kai
                </Link>
                <Link
                  href="/discover"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center rounded-full border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Browse trips
                </Link>
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
                  Built around how Indonesia already books.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-[1.75] text-white/56 md:justify-self-end md:text-[15px]">
                Nobody here wants another booking app. The trips already happen
                over WhatsApp, so BluePass made that the product instead of
                fighting it.
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
                  The water
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-xl leading-none text-white md:text-2xl">
                  Three regions carry most of the asking.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-6 text-white/56 md:text-[15px]">
                Komodo, Raja Ampat, and Bali are where travellers start. The
                operators there are the ones BluePass onboarded first.
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
                  Cabins, dives, and the boats in between.
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

        {/* ── How it works ────────────────────────────────────────────────── */}
        <section
          id="how-it-works"
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
                  How it works
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-xl leading-none text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] md:text-2xl">
                  Ask, get answered, then pay.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-6 text-white/72 drop-shadow-[0_1px_12px_rgba(0,0,0,0.45)] md:text-[15px]">
                Nothing is charged before an operator has accepted and held your
                place. That order matters, and it does not bend.
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
          </div>
        </section>

        {/* ── Who it is for ───────────────────────────────────────────────── */}
        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="bp-reveal mx-auto max-w-6xl">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="bp-eyebrow">
                  Who it is for
                </p>
                <h2 className="bp-page-title mt-4 max-w-md text-xl leading-none text-white/82 md:text-2xl">
                  The marketplace only works if every side of it does.
                </h2>
              </div>
              <p className="text-sm font-light leading-[1.75] text-white/36 md:text-right">
                Operators, creators, and partners across the archipelago.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {audiences.map((audience) => (
                <article
                  key={audience.title}
                  className="flex flex-col rounded-[var(--bp-radius-md)] border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.24)] md:p-7"
                >
                  <h3 className="bp-page-title text-[1.15rem] leading-tight text-white/90">
                    {audience.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm font-light leading-[1.7] text-white/58">
                    {audience.body}
                  </p>
                  <Link
                    href={audience.href}
                    className="bp-focus-ring mt-6 inline-flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.16em] text-[#B89A5D] transition-colors hover:text-[#d4b56f]"
                  >
                    {audience.label}
                    <ArrowIcon />
                  </Link>
                </article>
              ))}
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
                Tell Kai where you want to wake up.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-6 text-white/72 drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] md:text-[15px]">
                Komodo, Raja Ampat, or somewhere you have not heard of yet. A
                real operator answers, and 5% of what you pay stays with the
                reef you came to see.
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
