import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BluePassFooter } from "@/app/components/BluePassFooter";

type TripCard = {
  href: string;
  title: string;
  summary: string;
  price: string;
  duration: string;
  badge: string;
  image: string;
  alt: string;
};

type Stat = { label: string; value: string };

type OperatorProfile = {
  name: string;
  tag: string;
  location: string;
  region: string;
  tagline: string;
  about: string;
  established: string;
  image: string;
  alt: string;
  stats: Stat[];
  trips: TripCard[];
  highlights: string[];
  conservation: string;
};

const operators: Record<string, OperatorProfile> = {
  "calico-jack-charters": {
    name: "Calico Jack Charters",
    tag: "Charter",
    location: "Labuan Bajo Marina, East Nusa Tenggara",
    region: "Komodo National Park",
    tagline: "Captain-led Komodo charters. Polished service. Flexible routes.",
    about:
      "Calico Jack Charters has operated out of Labuan Bajo since 2015, building a reputation for polished private charters across Komodo National Park. Every trip is run by the founding captain, who grew up in the Flores islands and knows the park's tidal windows and reef conditions better than any itinerary could capture. Specialising in fully private day charters for groups of two to ten, with an onboard chef and a route that changes based on conditions and guest interests.",
    established: "2015",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
    alt: "Private yacht crossing clear tropical water near Komodo",
    stats: [
      { label: "Founded", value: "2015" },
      { label: "Base", value: "Labuan Bajo" },
      { label: "Max guests", value: "10 per charter" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    trips: [
      {
        href: "/trips/private-yacht-charter",
        title: "Private Yacht Charter",
        summary:
          "A fully crewed Komodo day charter with reef stops, an onboard chef lunch, and a flexible route tailored to conditions.",
        price: "$2,400",
        duration: "8 hours",
        badge: "Live check",
        image:
          "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
        alt: "Private yacht crossing clear tropical water",
      },
    ],
    highlights: [
      "Fully private charters — no shared boats",
      "Onboard chef with fresh Indonesian lunch",
      "Captain knowledge of Komodo tidal windows",
      "Flexible route — Manta Point, Pink Beach, or dragon trek",
      "Snorkelling and diving equipment included",
    ],
    conservation:
      "Calico Jack contributes 5% of every booking to Komodo Reef Fund, which runs reef restoration and local monitoring programs in Labuan Bajo.",
  },

  "mermaid-spirit": {
    name: "Mermaid Spirit",
    tag: "Sailing",
    location: "Nusa Lembongan, Bali",
    region: "Bali · Nusa Islands",
    tagline: "Boutique sunset sailing. Intimate charters. Celebration specialists.",
    about:
      "Mermaid Spirit is Nusa Lembongan's most intimate sailing operation — a crew of four running private sunset and celebration charters for groups of up to eight. Founded in 2018 by two sisters who grew up sailing Bali's straits, the business has become the go-to for anniversary and honeymoon clients who want privacy over the usual crowded sunset boat experience. The vessel was built in Sulawesi and restored in 2022.",
    established: "2018",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Sailing yacht at sunset with golden light on the water",
    stats: [
      { label: "Founded", value: "2018" },
      { label: "Base", value: "Nusa Lembongan" },
      { label: "Max guests", value: "8 per sail" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    trips: [
      {
        href: "/trips/sunset-sailing",
        title: "Sunset Sailing",
        summary:
          "A private dusk sail with canapes, two swim stops, and a cleared forward deck for golden hour over the Komodo archipelago.",
        price: "$620",
        duration: "3 hours",
        badge: "24-hour hold",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
        alt: "Sailing yacht at sunset",
      },
    ],
    highlights: [
      "Fully private — no shared bookings",
      "Canapes and cold drinks served throughout",
      "Two sheltered bay swim stops",
      "Restored traditional Sulawesi sailing vessel",
      "Specialist in anniversaries and celebrations",
    ],
    conservation:
      "Mermaid Spirit contributes 5% of every booking to Bali Ocean Classroom, supporting youth ocean education and coastal waste reduction in Bali.",
  },

  "blue-lagoon-dive-resort": {
    name: "Blue Lagoon Dive Resort",
    tag: "Dive Resort",
    location: "Padangbai, Bali",
    region: "East Bali · Padangbai",
    tagline: "Reef, macro, and conservation dives from Bali's most consistent dive base.",
    about:
      "Blue Lagoon Dive Resort has operated from Padangbai since 2008, becoming one of East Bali's most trusted dive operations. The resort runs guided dives at Blue Lagoon reef and Padangbai's jetty wall — two distinct site types in the same bay — with equipment, logistics, and conservation briefings all managed in-house. The resort's conservation program is one of the few in Bali actively running a coral nursery with measurable transplant success rates.",
    established: "2008",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver gliding above a coral reef",
    stats: [
      { label: "Founded", value: "2008" },
      { label: "Base", value: "Padangbai, Bali" },
      { label: "Sites", value: "Blue Lagoon + Jetty Wall" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    trips: [
      {
        href: "/trips/dive-day-trip",
        title: "Dive Day Trip",
        summary:
          "Two guided dives at Blue Lagoon reef and the Padangbai jetty wall, with full equipment, reef briefing, and resort lunch.",
        price: "$135",
        duration: "6 hours",
        badge: "Live check",
        image:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
        alt: "Diver gliding above a coral reef",
      },
      {
        href: "/trips/conservation-reef-experience",
        title: "Conservation Reef Experience",
        summary:
          "A half-day reef education and snorkel experience with conservation briefings, coral nursery walkthrough, and a guided snorkel above the restoration zone.",
        price: "$95",
        duration: "4 hours",
        badge: "Live check",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
        alt: "Remote blue lagoon and white sand beach",
      },
    ],
    highlights: [
      "Active coral nursery with public transplant data",
      "Two site types: reef slope and muck/macro wall",
      "Resident frogfish, turtles, and blue-spotted rays",
      "Beginners welcome — refresher courses available",
      "Conservation briefing included on every dive",
    ],
    conservation:
      "Blue Lagoon Dive Resort contributes 5% of every booking to Bali Ocean Classroom and runs its own coral nursery program, with transplant success rates published quarterly.",
  },

  "komodo-liveaboard-co": {
    name: "Komodo Liveaboard Co.",
    tag: "Liveaboard",
    location: "Labuan Bajo, East Nusa Tenggara",
    region: "Komodo National Park",
    tagline: "Premium cabin liveaboards through every signature Komodo site.",
    about:
      "Komodo Liveaboard Co. runs the most complete multi-day itinerary in Komodo National Park — a four-day, three-night cabin-based expedition that covers every significant dive site and includes the Komodo dragon trek. Founded in 2012 by a team of Labuan Bajo-based dive instructors, the company has refined the same itinerary over a decade into a highly consistent product with a 1:4 guide ratio and a safety record built on strict pre-dive current briefings.",
    established: "2012",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Island coastline with turquoise water from the sea",
    stats: [
      { label: "Founded", value: "2012" },
      { label: "Base", value: "Labuan Bajo" },
      { label: "Guide ratio", value: "1 : 4" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    trips: [
      {
        href: "/trips/komodo-liveaboard-expedition",
        title: "Komodo Liveaboard Expedition",
        summary:
          "Four days and three nights covering every signature Komodo site — Batu Bolong, Crystal Rock, Manta Alley, Pink Beach — with the dragon trek built into day three.",
        price: "$1,850",
        duration: "4 days / 3 nights",
        badge: "Live check",
        image:
          "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
        alt: "Island coastline with turquoise water",
      },
    ],
    highlights: [
      "10–12 guided dives across all signature Komodo sites",
      "1:4 dive guide ratio throughout",
      "Komodo dragon trek with park ranger — day 3",
      "Shared and private cabin options",
      "Strict current briefing before every site",
    ],
    conservation:
      "Komodo Liveaboard Co. contributes 5% of every booking to Komodo Reef Fund, which runs reef restoration, local monitoring, and mooring education in the national park.",
  },
};

export async function generateStaticParams() {
  return Object.keys(operators).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const op = operators[slug];
  if (!op) return { title: "Operator | BluePass" };
  return {
    title: `${op.name} | BluePass`,
    description: op.about,
  };
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#B89A5D]"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function BadgeDot({ live }: { live: boolean }) {
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-400" : "bg-amber-400"}`}
    />
  );
}

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const op = operators[slug];

  if (!op) notFound();

  return (
    <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
      {/* Hero */}
      <section className="relative min-h-[68svh] overflow-hidden bg-[#020b11]">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${op.image}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.90),rgba(0,15,21,0.52)_52%,rgba(0,8,14,0.76)),linear-gradient(180deg,rgba(0,0,0,0.50),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.80))]" />
        <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
        <div className="bp-film-grain absolute inset-0" />

        <div className="relative flex min-h-[68svh] flex-col justify-end px-[var(--cinematic-screen-x)] pb-12 pt-28">
          <Link
            href="/for-operators"
            className="mb-6 inline-flex w-fit items-center gap-2 text-[10px] tracking-[0.22em] text-white/50 transition-colors hover:text-white/80"
            style={{ fontFamily: "var(--bp-font-mono)" }}
          >
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
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Operators
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="border border-white/14 bg-black/50 px-2.5 py-1 text-[10px] tracking-[0.14em] text-white/80"
              style={{
                fontFamily: "var(--bp-font-mono)",
                borderRadius: "6px",
                backdropFilter: "blur(8px)",
              }}
            >
              {op.tag}
            </span>
            <span
              className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] tracking-[0.14em] text-emerald-300"
              style={{ fontFamily: "var(--bp-font-mono)", borderRadius: "6px" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live on BluePass
            </span>
          </div>

          <p
            className="mt-3 text-[10px] uppercase tracking-[0.26em] text-[#B89A5D]"
            style={{ fontFamily: "var(--bp-font-mono)" }}
          >
            {op.region} · {op.location}
          </p>
          <h1 className="bp-page-title mt-2 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.96] text-white">
            {op.name}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
            {op.tagline}
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/10 bg-[#03111d]/80 px-[var(--cinematic-screen-x)] backdrop-blur-xl">
        <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {op.stats.map((stat) => (
            <div key={stat.label} className="px-5 py-5">
              <p
                className="text-[10px] tracking-[0.20em] text-white/40"
                style={{ fontFamily: "var(--bp-font-mono)" }}
              >
                {stat.label}
              </p>
              <p className="bp-page-title mt-1.5 text-lg leading-tight text-white">
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-[var(--cinematic-screen-x)] py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Main content */}
          <div>
            {/* About */}
            <section>
              <p
                className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                style={{ fontFamily: "var(--bp-font-mono)" }}
              >
                About the operator
              </p>
              <h2 className="bp-page-title mt-3 text-3xl text-white">
                {op.name}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-white/70">
                {op.about}
              </p>
            </section>

            {/* Why this operator */}
            <section className="mt-10">
              <p
                className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                style={{ fontFamily: "var(--bp-font-mono)" }}
              >
                Why BluePass listed them
              </p>
              <ul className="mt-4 space-y-3">
                {op.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <CheckIcon />
                    <span className="text-sm leading-5 text-white/65">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Trips */}
            <section className="mt-12">
              <p
                className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                style={{ fontFamily: "var(--bp-font-mono)" }}
              >
                Available trips
              </p>
              <h2 className="bp-page-title mt-3 text-2xl text-white">
                Book with {op.name}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {op.trips.map((trip) => (
                  <Link key={trip.href} href={trip.href} className="group block">
                    <article className="bp-tech-card border border-white/[0.09]">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={trip.image}
                          alt={trip.alt}
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                        />
                        <div className="bp-scan-grid" />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to top, #020b11 0%, rgba(2,11,17,0.78) 38%, rgba(2,11,17,0.18) 68%, transparent 84%)",
                          }}
                        />
                        <div className="absolute left-3 top-3 z-10">
                          <span
                            className="inline-flex items-center gap-1.5 border border-white/14 bg-black/50 px-2 py-[3px] text-[10px] tracking-[0.12em] text-white/80"
                            style={{
                              fontFamily: "var(--bp-font-mono)",
                              borderRadius: "6px",
                              backdropFilter: "blur(8px)",
                            }}
                          >
                            <BadgeDot live={trip.badge === "Live check"} />
                            {trip.badge}
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="bp-page-title text-lg leading-tight text-white">
                          {trip.title}
                        </h3>
                        <p className="mt-1.5 text-sm leading-6 text-white/55">
                          {trip.summary}
                        </p>
                        <div
                          className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3"
                          style={{ fontFamily: "var(--bp-font-mono)" }}
                        >
                          <span className="text-[10px] text-white/44">
                            {trip.duration}
                          </span>
                          <span className="text-[0.8125rem] font-medium text-white">
                            From {trip.price}
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-6 space-y-4">
              {/* Inquire CTA */}
              <div className="border border-white/12 bg-[#03111d]/60 p-6 backdrop-blur-xl">
                <p
                  className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                  style={{ fontFamily: "var(--bp-font-mono)" }}
                >
                  Inquire with Kai
                </p>
                <p className="mt-3 text-[13px] leading-6 text-white/60">
                  Ask Kai about availability, custom itineraries, or group
                  pricing for {op.name}. Live space is checked before confirming.
                </p>
                <Link
                  href="https://wa.me/628213143343"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 bg-white text-[11px] font-medium tracking-[0.04em] text-[#071827] transition-colors hover:bg-white/90"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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
                  Ask Kai about {op.name}
                </Link>
                <Link
                  href="/for-operators"
                  className="mt-2.5 flex h-10 w-full items-center justify-center border border-white/20 text-[11px] font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  Browse all operators
                </Link>
              </div>

              {/* Location */}
              <div className="border border-white/12 bg-[#03111d]/60 p-5 backdrop-blur-xl">
                <p
                  className="text-[10px] tracking-[0.22em] text-[#B89A5D]"
                  style={{ fontFamily: "var(--bp-font-mono)" }}
                >
                  Location
                </p>
                <p className="mt-2 text-sm text-white">{op.location}</p>
                <p className="mt-0.5 text-[11px] text-white/40">{op.region}</p>
              </div>

              {/* Conservation */}
              <div className="border border-[#B89A5D]/20 bg-[#B89A5D]/[0.04] p-5">
                <p
                  className="text-[10px] tracking-[0.22em] text-[#B89A5D]"
                  style={{ fontFamily: "var(--bp-font-mono)" }}
                >
                  Reef contribution
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  {op.conservation}
                </p>
                <Link
                  href="/conservation"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-[#B89A5D] transition-colors hover:text-white"
                  style={{ fontFamily: "var(--bp-font-mono)" }}
                >
                  How the 5% flows →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BluePassFooter />
    </main>
  );
}
