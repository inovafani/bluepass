import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Explore Indonesia | BluePass",
  description:
    "Find liveaboards, private yachts, dive days, sailing, surf, and reef trips across Indonesia.",
};

const liveTrips = [
  {
    href: "/trips/private-yacht-charter",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
    alt: "Private yacht crossing clear tropical water",
    operator: "Calico Jack Charters",
    title: "Private Yacht Charter",
    summary:
      "A fully crewed Komodo day charter with reef stops, chef lunch, and a flexible route.",
    duration: "8 hours",
    capacity: "Up to 10",
    availability: "Space open",
    price: "$2,400",
    badge: "Live check",
  },
  {
    href: "/trips/komodo-liveaboard-expedition",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Island coastline with turquoise water",
    operator: "Komodo Liveaboard Co.",
    title: "Komodo Liveaboard Expedition",
    summary:
      "A cabin-based multi-day expedition through Komodo dive sites and island trails.",
    duration: "4 days / 3 nights",
    capacity: "Up to 16",
    availability: "Limited",
    price: "$1,850",
    badge: "Live check",
  },
  {
    href: "/trips/dive-day-trip",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver gliding above a coral reef",
    operator: "Blue Lagoon Dive Resort",
    title: "Dive Day Trip",
    summary:
      "Two guided dives from Padangbai with resort logistics and reef briefings.",
    duration: "6 hours",
    capacity: "Up to 8",
    availability: "WhatsApp hold",
    price: "$135",
    badge: "Live check",
  },
  {
    href: "/trips/sunset-sailing",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Sailing yacht at sunset",
    operator: "Mermaid Spirit",
    title: "Sunset Sailing",
    summary:
      "A private dusk sail with canapes, swim stops, and a quiet deck for golden hour.",
    duration: "3 hours",
    capacity: "Up to 8",
    availability: "Limited",
    price: "$620",
    badge: "24-hour hold",
  },
  {
    href: "/trips/conservation-reef-experience",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    alt: "Remote blue lagoon and white sand beach",
    operator: "Blue Lagoon Dive Resort",
    title: "Conservation Reef Experience",
    summary:
      "A reef education and snorkel experience with conservation briefings and local guides.",
    duration: "4 hours",
    capacity: "Up to 12",
    availability: "Space open",
    price: "$95",
    badge: "Live check",
  },
];

const earlyPreviews = [
  {
    href: "/preview/scuba-republic-jaya-plus-epica",
    location: "Raja Ampat + Komodo",
    title: "Scuba Republic Signature Expedition",
    summary:
      "Liveaboard + Dive Center experience across Raja Ampat + Komodo. Multi-destination, year-round, strong reviews.",
    price: "$2,600",
    image:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver swimming beside a coral reef wall",
  },
  {
    href: "/preview/mermaid-liveaboards-i-plus-ii",
    location: "Komodo, Raja Ampat, Banda Sea, Alor, Halmahera",
    title: "Mermaid Liveaboards Signature Expedition",
    summary:
      "Luxury Liveaboard experience across Komodo, Raja Ampat, Banda Sea, Alor, Halmahera. Covers every BluePass destination. Nine awards..",
    price: "$2,600",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
    alt: "Luxury yacht crossing clear tropical water",
  },
  {
    href: "/preview/samambaia-liveaboard",
    location: "Raja Ampat, Komodo, Alor, Flores, Banda, Triton Bay",
    title: "Samambaia Liveaboard Signature Expedition",
    summary:
      "Luxury Phinisi experience across Raja Ampat, Komodo, Alor, Flores, Banda, Triton Bay. Full East Indonesia circuit. Premium positioning..",
    price: "$2,600",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Golden beach at sunset",
  },
  {
    href: "/preview/la-galigo-liveaboard",
    location: "Komodo, Raja Ampat, Lembeh, Halmahera",
    title: "La Galigo Liveaboard Signature Expedition",
    summary:
      "Phinisi Liveaboard experience across Komodo, Raja Ampat, Lembeh, Halmahera. Heritage vessel plus conservation positioning.",
    price: "$2,600",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Turquoise island coastline from above",
  },
  {
    href: "/preview/scuba-junkie-klm-eliya",
    location: "Komodo, Raja Ampat, Banda Sea",
    title: "Scuba Junkie Signature Expedition",
    summary:
      "Liveaboard + Resort chain experience across Komodo, Raja Ampat, Banda Sea. Already GF Gold. Expanding Raja Ampat in 2026..",
    price: "$2,600",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    alt: "Remote lagoon with white sand and blue water",
  },
  {
    href: "/preview/mikumba-diving-jelajahi-laut",
    location: "Komodo, Raja Ampat, Banda, Halmahera, Sulawesi, Ambon",
    title: "Mikumba Diving Signature Expedition",
    summary:
      "Expedition Liveaboard experience across Komodo, Raja Ampat, Banda, Halmahera, Sulawesi, Ambon. Niche routes across Halmahera and Sulawesi.",
    price: "$2,200",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Scuba diver with schooling fish on a reef",
  },
  {
    href: "/preview/ayo-divers-ratu-laut",
    location: "Raja Ampat + Komodo",
    title: "Ayo Divers Signature Expedition",
    summary:
      "Phinisi Liveaboard experience across Raja Ampat + Komodo. Heritage phinisi operators are core to the BluePass brand.",
    price: "$2,200",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80",
    alt: "Wooden boat near a tropical island",
  },
  {
    href: "/preview/blue-manta-explorer",
    location: "Raja Ampat, Komodo, Ambon",
    title: "Blue Manta Explorer Signature Expedition",
    summary:
      "Luxury Steel Liveaboard experience across Raja Ampat, Komodo, Ambon. Scale fill rate with conservation-oriented bookings.",
    price: "$2,200",
    image:
      "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?auto=format&fit=crop&w=1600&q=80",
    alt: "Deep blue ocean seen from above",
  },
  {
    href: "/preview/calico-jack",
    location: "Raja Ampat, Triton Bay, Banda Sea, Ambon",
    title: "Calico Jack Signature Expedition",
    summary:
      "Liveaboard experience across Raja Ampat, Triton Bay, Banda Sea, Ambon. Focused on remote Indonesia diving.",
    price: "$2,200",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    alt: "Tropical island shore with warm light",
  },
  {
    href: "/preview/indo-master",
    location: "Raja Ampat, Komodo, Banda",
    title: "Indo Master Signature Expedition",
    summary:
      "Liveaboard experience across Raja Ampat, Komodo, Banda. Multi-destination operator.",
    price: "$2,200",
  },
  {
    href: "/preview/sea-temple-cruises",
    location: "Raja Ampat, Indonesia",
    title: "Raja Ampat Dive Expedition",
    summary:
      "A multi-day liveaboard route through reef, island, and manta-focused sites.",
    price: "$2,600",
  },
];

const earlyPreviewImage =
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80";

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

function MessageIcon() {
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
      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
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
      <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-top"
          style={{
            backgroundImage: "url('/explore/explore-header.jpg')",
          }}
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
                href="#ready-to-inquire"
                className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
              >
                Browse trips
              </a>
            </div>
          </section>
        </div>
      </section>

      <section
        id="ready-to-inquire"
        className="px-[var(--cinematic-screen-x)] py-12 md:py-16"
      >
        <div className="bp-reveal mb-5 grid gap-4 border border-white/12 bg-black/20 p-5 text-white shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:grid-cols-[1fr_auto] md:items-center md:p-6">
          <div>
            <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
              Kai can match while you browse
            </p>
            <h2 className="bp-page-title mt-2 text-3xl leading-none text-white md:text-4xl">
              Tell Kai what you want. Browse while we check the path.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/60">
              BluePass tries live space first, then a 24-hour operator hold if
              the trip needs human confirmation.
            </p>
          </div>
          <Link
            href="https://wa.me/628213143343"
            className="inline-flex h-11 items-center justify-center gap-2 bg-white px-5 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
          >
            <MessageIcon />
            Ask Kai to match
          </Link>
        </div>

        <div className="bp-rounded-surface border border-white/12 bg-[#03111d]/58 p-3 shadow-[0_28px_100px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search trips</span>
              <input
                className="h-12 w-full border border-white/20 bg-white px-4 pl-11 text-base text-[#071827] shadow-sm outline-none transition-colors placeholder:text-[#071827]/40 focus:border-white focus:ring-2 focus:ring-white/30"
                placeholder="Search Komodo, liveaboards, dive days, surf, private yacht"
                defaultValue=""
              />
              <span className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#071827]/40">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
            </label>
            <div className="bp-rounded-surface grid grid-cols-3 gap-2 border border-white/16 bg-black/25 p-1">
              {["All", "Live", "Early"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`rounded-sm px-3 py-2 text-xs font-medium transition-colors ${
                    filter === "All"
                      ? "bg-white text-[#071827]"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bp-reveal content-visibility-auto mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                Live trips
              </p>
              <h2 className="bp-page-title mt-3 text-4xl text-white">
                Ready to inquire
              </h2>
            </div>
            <p className="text-sm text-white/50">5 trips</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {liveTrips.map((trip) => (
              <Link key={trip.href} href={trip.href} className="block">
                <article className="bp-tech-card group h-full border border-white/[0.09]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={trip.image}
                      alt={trip.alt}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      loading="lazy"
                      quality={72}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="bp-scan-grid" />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, #020b11 0%, rgba(2,11,17,0.86) 30%, rgba(2,11,17,0.34) 56%, transparent 76%)",
                      }}
                    />
                    <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-1.5">
                      <span
                        className="border border-white/14 bg-black/58 px-2 py-[3px] text-[10px] tracking-[0.13em] text-white/90"
                        style={{
                          fontFamily: "var(--bp-font-mono)",
                          borderRadius: "6px",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {trip.badge}
                      </span>
                      <span
                        className="border border-[#B89A5D]/28 bg-[#B89A5D]/14 px-2 py-[3px] text-[10px] tracking-[0.13em] text-[#f4d891]"
                        style={{
                          fontFamily: "var(--bp-font-mono)",
                          borderRadius: "6px",
                        }}
                      >
                        5% reef
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                      <p
                        className="text-[10px] uppercase tracking-[0.22em] text-[#B89A5D]"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        {trip.operator}
                      </p>
                      <h3 className="bp-page-title mt-1.5 text-[1.2rem] leading-tight text-white">
                        {trip.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-[1.5] text-white/58">
                        {trip.summary}
                      </p>
                      <div
                        className="mt-3 flex items-center border-t border-white/[0.08] pt-3"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        <span className="text-[10px] text-white/44">
                          {trip.duration}
                        </span>
                        <span className="mx-1.5 text-[10px] text-white/20">
                          ·
                        </span>
                        <span className="text-[10px] text-white/44">
                          {trip.capacity}
                        </span>
                        <span className="ml-auto text-[0.8125rem] font-medium text-white">
                          From {trip.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>

        <div className="bp-reveal content-visibility-auto mt-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                Early previews
              </p>
              <h2 className="bp-page-title mt-3 text-4xl text-white">
                Curated operators being reviewed
              </h2>
            </div>
            <p className="text-sm text-white/50">11 previews</p>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {earlyPreviews.map((preview) => (
              <Link key={preview.href} href={preview.href} className="block">
                <article className="bp-tech-card group border border-white/[0.09]">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={preview.image ?? earlyPreviewImage}
                      alt={
                        preview.alt ?? "Island coastline with turquoise water"
                      }
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      loading="lazy"
                      quality={72}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                    <div className="bp-scan-grid" />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, #020b11 0%, rgba(2,11,17,0.82) 32%, rgba(2,11,17,0.30) 58%, transparent 76%)",
                      }}
                    />
                    <div className="absolute left-3 top-3 z-10">
                      <span
                        className="border border-[#B89A5D]/28 bg-[#B89A5D]/14 px-2 py-[3px] text-[10px] tracking-[0.13em] text-[#f4d891]"
                        style={{
                          fontFamily: "var(--bp-font-mono)",
                          borderRadius: "6px",
                        }}
                      >
                        Preview
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                      <p
                        className="text-[10px] uppercase tracking-[0.18em] text-[#B89A5D]"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        {preview.location}
                      </p>
                      <h3 className="bp-page-title mt-1.5 text-[1.2rem] leading-tight text-white">
                        {preview.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-[0.78rem] leading-[1.5] text-white/56">
                        {preview.summary}
                      </p>
                      <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3">
                        <span
                          className="text-[10px] tracking-[0.14em] text-[#B89A5D]"
                          style={{ fontFamily: "var(--bp-font-mono)" }}
                        >
                          View preview →
                        </span>
                        <span className="text-[0.8125rem] font-medium text-white">
                          From {preview.price}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#04111d] font-sans text-white">
        <div className="border-t border-white/10 bg-[#04111d] px-5">
          <div className="mx-auto max-w-6xl py-10 md:py-14">
            <p className="text-center text-[10px] font-normal tracking-[0.32em] text-white/45">
              The water we work in
            </p>
            <IndonesiaMap />
          </div>
        </div>

        <div className="border-y border-white/10 bg-[radial-gradient(circle_at_18%_30%,rgba(26,124,114,0.18),transparent_55%),radial-gradient(circle_at_82%_70%,rgba(184,154,93,0.10),transparent_55%)] px-5">
          <div className="mx-auto max-w-6xl py-12 md:py-16">
            <div className="grid gap-8 md:grid-cols-[1.15fr_2fr] md:gap-12">
              <div>
                <p className="text-[11px] font-normal tracking-[0.22em] text-[#B89A5D]">
                  Reef restoration
                </p>
                <p className="bp-page-title mt-4 text-3xl leading-[1.08] text-white md:text-4xl">
                  5% of every booking
                  <br />
                  <span className="text-white/65">
                    goes to a named partner.
                  </span>
                </p>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
                  We will not ask travellers to trust anonymous conservation
                  claims. Every partner is named, every report is dated, every
                  contribution is auditable. Reports go public as partner
                  reporting comes online.
                </p>
                <Link
                  href="/conservation"
                  className="mt-6 inline-flex items-center gap-2 text-xs font-normal tracking-[0.18em] text-[#B89A5D] transition-colors hover:text-white"
                >
                  See how the 5% flows
                </Link>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {conservationPartners.map((partner) => (
                  <div
                    key={partner.name}
                    className="rounded-md border border-white/10 bg-white/[0.025] p-4"
                  >
                    <p className="text-sm font-normal text-white">
                      {partner.name}
                    </p>
                    <p className="mt-1 text-[11px] tracking-[0.16em] text-white/55">
                      {partner.location}
                    </p>
                    <p className="mt-3 text-xs leading-5 text-white/65">
                      {partner.body}
                    </p>
                    <p className="mt-4 flex items-baseline justify-between border-t border-white/10 pt-3 text-[11px] tracking-[0.16em]">
                      <span className="text-white/45">Next report</span>
                      <span className="text-[#B89A5D]">{partner.report}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
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
