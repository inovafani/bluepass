import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { yachts } from "@/lib/data/yachts";

export const metadata: Metadata = {
  title: "Explore Indonesia | BluePass",
  description:
    "Find liveaboards, private yachts, dive days, sailing, surf, and reef trips across Indonesia.",
};

// ─── Destination images ────────────────────────────────────────────────────────
// To swap: replace files in /public/destinations/
//   labuan-bajo.webp  → Komodo card
//   raja-ampat.jpg    → Raja Ampat card
const destinations = [
  {
    href: "/for-operators",
    label: "FLORES · INDONESIA",
    name: "Komodo",
    image: "/destinations/labuan-bajo.webp",
    alt: "Labuan Bajo, Komodo National Park",
  },
  {
    href: "/for-operators",
    label: "WEST PAPUA · INDONESIA",
    name: "Raja Ampat",
    image: "/destinations/raja-ampat.jpg",
    alt: "Raja Ampat karst islands from the air",
  },
];


const conservationCards = [
  {
    id: "01",
    type: "creator",
    handle: "@storyofsage",
    name: "Story of Sage",
    description: "Island light, reef days, quiet blue moments.",
    image: "/creators/storyofsage.jpg",
    alt: "Story of Sage",
    href: "https://www.instagram.com/reel/DE0a2Z7xSQL/",
  },
  {
    id: "02",
    type: "creator",
    handle: "@josiahwg",
    name: "Josiah William Gordon",
    description: "Cinematic coastlines through a fine-art lens.",
    image: "/creators/josiahwg.jpg",
    alt: "Josiah William Gordon",
    href: "https://www.instagram.com/reel/CPBJDTmjKS_/",
  },
  {
    id: "03",
    type: "creator",
    handle: "@camvaughne",
    name: "Cam Vaughne",
    description: "Remote Indonesia by sail, film, and sea.",
    image: "/creators/camvaughne.jpg",
    alt: "Cam Vaughne",
    href: "https://www.instagram.com/reel/Ck8BkRDhLhy/",
  },
  {
    id: "04",
    type: "creator",
    handle: "@lostleblanc",
    name: "Christian LeBlanc",
    description: "Travel stories built for cinematic discovery.",
    image: "/creators/lostleblanc.jpg",
    alt: "Christian LeBlanc",
    href: "https://www.instagram.com/reel/DXO0GAiiYWz/",
  },
];

const conservationPartners = [
  {
    name: "Komodo Reef Fund",
    location: "Labuan Bajo",
    body: "Reef restoration, local monitoring, and mooring education",
    report: "June 2026",
  },
  {
    name: "Raja Ampat Blue Water Trust",
    location: "West Papua",
    body: "Community reef patrols and coral nursery support",
    report: "June 2026",
  },
  {
    name: "Bali Ocean Classroom",
    location: "Bali",
    body: "Youth ocean education and coastal waste reduction",
    report: "July 2026",
  },
];

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

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="white"
      stroke="none"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function IndonesiaMap() {
  const islands = [
    { key: "mentawai", cx: 60, cy: 100, r: 4, accent: true },
    { key: "sumatra", cx: 130, cy: 78, r: 14 },
    { key: "java", cx: 285, cy: 92, r: 8 },
    { key: "bali", cx: 410, cy: 96, r: 5, accent: true },
    { key: "lombok", cx: 450, cy: 96, r: 4 },
    { key: "sumbawa", cx: 502, cy: 98, r: 5 },
    { key: "komodo", cx: 558, cy: 98, r: 6, accent: true },
    { key: "flores", cx: 612, cy: 100, r: 7 },
    { key: "sulawesi", cx: 720, cy: 64, r: 13 },
    { key: "wakatobi", cx: 770, cy: 102, r: 4, accent: true },
    { key: "maluku", cx: 880, cy: 92, r: 7 },
    { key: "raja-ampat", cx: 1010, cy: 70, r: 6, accent: true },
    { key: "papua", cx: 1110, cy: 80, r: 18 },
  ];
  return (
    <svg
      viewBox="0 0 1200 160"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Stylized map of the Indonesian archipelago, with Bali, Komodo, and Raja Ampat marked."
      className="mx-auto mt-6 block w-full max-w-[1080px]"
    >
      <defs>
        <linearGradient id="bp-current" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="rgba(143,174,154,0)" />
          <stop offset="22%" stopColor="rgba(143,174,154,0.28)" />
          <stop offset="78%" stopColor="rgba(143,174,154,0.28)" />
          <stop offset="100%" stopColor="rgba(143,174,154,0)" />
        </linearGradient>
      </defs>
      <path
        d="M 0 92 Q 300 78, 600 96 T 1200 88"
        fill="none"
        stroke="url(#bp-current)"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M 0 110 Q 320 100, 640 116 T 1200 106"
        fill="none"
        stroke="url(#bp-current)"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.6"
      />
      {islands.map((island) => (
        <circle
          key={island.key}
          cx={island.cx}
          cy={island.cy}
          r={island.r}
          fill={island.accent ? "#B89A5D" : "rgba(237,229,214,0.55)"}
          opacity={island.accent ? 0.85 : 0.7}
        />
      ))}
      {[
        { label: "Bali", x: 410, y: 130, lineY1: 110, lineY2: 116 },
        { label: "Komodo", x: 558, y: 130, lineY1: 110, lineY2: 116 },
        { label: "Raja Ampat", x: 1010, y: 50, lineY1: 60, lineY2: 56 },
      ].map((mark) => (
        <g key={mark.label}>
          <line
            x1={mark.x}
            y1={mark.lineY1}
            x2={mark.x}
            y2={mark.lineY2}
            stroke="rgba(184,154,93,0.6)"
            strokeWidth="1"
          />
          <text
            x={mark.x}
            y={mark.y}
            textAnchor="middle"
            fontSize="11"
            fontFamily="system-ui, sans-serif"
            letterSpacing="2"
            fill="rgba(237,229,214,0.75)"
          >
            {mark.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function ExploreIndonesiaPage() {
  return (
    <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
      {/* Hero — unchanged */}
      <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-top"
          style={{ backgroundImage: "url('/explore/explore-header.jpg')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.88),rgba(0,15,21,0.5)_48%,rgba(0,8,14,0.72)),linear-gradient(180deg,rgba(0,0,0,0.48),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.74))]" />
        <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
        <div className="bp-film-grain absolute inset-0" />
        <div className="cinematic-hero-stage">
          <section className="max-w-[640px] border border-white/16 bg-[#03111d]/58 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
            <h1 className="bp-page-title text-[clamp(3rem,6vw,4rem)] leading-[0.96] text-white">
              Dive, Sail, Surf
            </h1>
            <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
              <span className="mt-1 h-20 w-px bg-white/70" aria-hidden="true" />
              <p className="max-w-[29rem] text-sm leading-[1.75] text-white/78 md:text-[15px]">
                Browse the live BluePass catalog and early operator previews. If
                the trip depends on dates, cabins, comfort, or dive level, Kai
                can narrow it faster than a grid.
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
              <Link
                href="https://wa.me/628213143343"
                className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90 active:scale-[0.98]"
              >
                Get matched by Kai
              </Link>
              <a
                href="#where-to-go"
                className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
              >
                Explore
              </a>
            </div>
          </section>
        </div>
      </section>

      {/* Where to go */}
      <section
        id="where-to-go"
        className="px-[var(--cinematic-screen-x)] py-14 md:py-18"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="bp-page-title text-xl text-white/84 md:text-2xl">
            Where to go
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {destinations.map((dest) => (
              <Link key={dest.name} href={dest.href} className="group block">
                <div
                  className="relative overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={dest.image}
                    alt={dest.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(2,11,17,0.82) 0%, rgba(2,11,17,0.38) 44%, transparent 72%)",
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p
                      className="text-[10px] uppercase tracking-[0.20em] text-white/55"
                      style={{ fontFamily: "var(--bp-font-mono)" }}
                    >
                      {dest.label}
                    </p>
                    <p className="bp-page-title mt-1 text-xl text-white">
                      {dest.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured yachts */}
      <section className="px-[var(--cinematic-screen-x)] pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-end justify-between gap-4">
            <h2 className="bp-page-title text-xl text-white/84 md:text-2xl">
              Featured yachts
            </h2>
            <Link
              href="/for-operators"
              className="text-[12px] text-white/46 transition-colors hover:text-white/80"
              style={{ fontFamily: "var(--bp-font-mono)" }}
            >
              See all 24 →
            </Link>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {yachts.map((yacht) => (
              <Link key={yacht.slug} href={`/yachts/${yacht.slug}`} className="block">
                <article className="group relative overflow-hidden border border-white/[0.07]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={yacht.images.card}
                      alt={yacht.images.gallery[0]?.alt ?? yacht.name}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                      quality={72}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(2,11,17,0.96) 0%, rgba(2,11,17,0.68) 30%, rgba(2,11,17,0.14) 58%, transparent 78%)",
                      }}
                    />
                    {/* Location badge */}
                    <div className="absolute left-3 top-3 z-10">
                      <span
                        className="border border-white/16 bg-black/52 px-2 py-[3px] text-[10px] tracking-[0.18em] text-white/80"
                        style={{
                          fontFamily: "var(--bp-font-mono)",
                          borderRadius: "4px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {yacht.locationBadge}
                      </span>
                    </div>
                    {/* Bottom info */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                      <h3 className="bp-page-title text-[1.25rem] leading-tight text-white">
                        {yacht.name}
                      </h3>
                      <p
                        className="mt-0.5 text-[11px] text-white/52"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        Up to {yacht.maxGuests} guests
                      </p>
                      {yacht.tagline && (
                        <p
                          className="mt-0.5 text-[11px] text-white/40"
                          style={{ fontFamily: "var(--bp-font-mono)" }}
                        >
                          {yacht.tagline}
                        </p>
                      )}
                      <div className="mt-2.5 border-t border-white/10 pt-2.5">
                        <p className="text-[0.8125rem] font-medium text-white">
                          from {yacht.pricePerCabin}{" "}
                          <span className="font-light text-white/52">
                            / cabin · night
                          </span>
                        </p>
                        {yacht.charterPrice && (
                          <p
                            className="mt-0.5 text-[11px] text-white/38"
                            style={{ fontFamily: "var(--bp-font-mono)" }}
                          >
                            or charter {yacht.charterPrice} / night · whole
                            yacht
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Conservation & Partners */}
      <section className="px-[var(--cinematic-screen-x)] pb-16 md:pb-20">
        <div className="mx-auto max-w-6xl">
          <p
            className="text-[11px] uppercase tracking-[0.22em] text-[#5cc8be]"
            style={{ fontFamily: "var(--bp-font-mono)" }}
          >
            Conservation &amp; Partners
          </p>
          <h2 className="bp-page-title mt-3 max-w-2xl text-2xl leading-[1.1] text-white md:text-3xl">
            A carousel for the people and partners moving the ocean forward.
          </h2>
          <p className="mt-2 max-w-xl text-sm font-light text-white/50">
            The conservation partners that receive 5% of every booking, plus the
            creators we trust to tell the story.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {conservationCards.map((card) => (
              <Link key={card.id} href={card.href} className="group block" target="_blank" rel="noopener noreferrer">
                <article className="relative overflow-hidden border border-white/[0.08]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
                      loading="lazy"
                      quality={72}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04] saturate-[0.7]"
                    />
                    <div className="absolute inset-0 bg-[#020b11]/44" />
                    {/* Top badge */}
                    <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                      {card.type === "partner" ? (
                        <>
                          <LeafIcon className="text-[#5cc8be]" />
                          <span
                            className="text-[10px] tracking-[0.14em] text-white/75"
                            style={{ fontFamily: "var(--bp-font-mono)" }}
                          >
                            Conservation partner
                          </span>
                        </>
                      ) : (
                        <span
                          className="text-[10px] tracking-[0.14em] text-white/75"
                          style={{ fontFamily: "var(--bp-font-mono)" }}
                        >
                          {card.handle}
                        </span>
                      )}
                    </div>
                    {/* Play button */}
                    <div className="absolute inset-0 z-10 flex items-center justify-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition-colors group-hover:bg-black/70">
                        <PlayIcon />
                      </span>
                    </div>
                    {/* Bottom info */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                      <p
                        className="text-[10px] tracking-[0.18em] text-white/44"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        {card.id}
                      </p>
                      <p className="mt-0.5 text-[0.9375rem] font-medium text-white/92">
                        {card.name}
                      </p>
                      <p className="mt-1 text-[12px] leading-[1.5] text-white/52">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5% banner */}
      <section className="px-[var(--cinematic-screen-x)] mb-14 md:mb-20">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/conservation"
            className="group flex items-start justify-between gap-4 border border-[#1a7c72]/30 bg-[#0a2e2a] p-5 md:items-center md:p-6"
          >
            <div className="flex items-start gap-3 md:items-center">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#1a7c72]/50 bg-[#0d3d38] md:mt-0">
                <LeafIcon className="text-[#5cc8be]" />
              </span>
              <div>
                <p className="text-[0.9375rem] font-medium text-white">
                  5% of every trip — built into the price.
                </p>
                <p className="mt-0.5 text-[12px] leading-[1.6] text-white/48">
                  Vetted ocean partners get a real cut of every booking. Never an
                  add-on, never optional. Tap to see exactly where it goes →
                </p>
              </div>
            </div>
            <ArrowIcon />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#04111d] font-sans text-white">
        <div className="border-t border-white/10 bg-[#04111d] px-5">
          <div className="mx-auto max-w-6xl py-10 md:py-14">
            <p className="text-center text-[10px] font-normal tracking-[0.32em] text-white/45">
              The water we work in
            </p>
            <IndonesiaMap />
          </div>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 text-sm text-white/60 md:grid-cols-[1.4fr_1fr_1fr_1fr] [&_a]:font-normal [&_a]:transition-colors [&_a:hover]:text-white">
          <div>
            <p className="site-brand-name text-2xl text-white">BluePass</p>
            <p className="mt-3 max-w-md leading-6">
              Your pass to Indonesia&apos;s best ocean trips. Conversational
              matching, vetted operators, a referral mesh that keeps trips alive
              when one crew is full, and 5% of every booking back to the reef.
            </p>
            <p className="mt-4 text-[11px] font-normal tracking-[0.18em] text-white/40">
              Indonesia-first - Founding cohort 2026
            </p>
          </div>
          <div className="grid gap-2">
            <p className="text-xs font-normal tracking-[0.18em] text-[#B89A5D]">
              Marketplace
            </p>
            <Link href="/explore-indonesia">Trips</Link>
            <Link href="/for-operators">Operators</Link>
            <Link href="/explore-indonesia">Destinations</Link>
          </div>
          <div className="grid gap-2">
            <p className="text-xs font-normal tracking-[0.18em] text-[#B89A5D]">
              Company
            </p>
            <Link href="/about">About</Link>
            <Link href="/conservation">Conservation</Link>
            <Link href="/creators">Creators</Link>
          </div>
          <div className="grid gap-2">
            <p className="text-xs font-normal tracking-[0.18em] text-[#B89A5D]">
              Operators
            </p>
            <Link href="/for-operators">BluePass for Operators</Link>
            <Link href="/signup">Claim your business</Link>
            <a href="mailto:jeff@bluepass.travel">Founding cohort</a>
          </div>
        </div>
        <div className="border-t border-white/10 px-5">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 py-5 text-[11px] font-normal tracking-[0.18em] text-white/35 md:flex-row md:items-center">
            <span>Copyright 2026 BluePass - Marine Tourism Operator OS</span>
            <span className="text-white/30">
              Built in Indonesia - for Indonesia&apos;s ocean
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
