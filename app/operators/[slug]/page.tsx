import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BluePassFooter } from "@/app/components/BluePassFooter";

type Departure = { dates: string; duration: string; berths: string };
type ItineraryDay = { day: number; title: string; description: string };
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
type GalleryImage = { src: string; alt: string };

type OperatorProfile = {
  name: string;
  firstName: string;
  tier: string;
  location: string;
  region: string;
  tagline: string;
  about: string;
  length: string;
  cabins: number;
  maxGuests: number;
  build: string;
  pricePerCabin: string;
  charterPrice: string;
  charterOnly: boolean;
  image: string;
  alt: string;
  gallery: GalleryImage[];
  departures: Departure[];
  itinerary: ItineraryDay[];
  trips: TripCard[];
  conservation: string;
};

const operators: Record<string, OperatorProfile> = {
  "calico-jack-charters": {
    name: "Calico Jack",
    firstName: "Jack",
    tier: "Explorer",
    location: "Labuan Bajo Marina, East Nusa Tenggara",
    region: "Komodo",
    tagline:
      "Captain-led Komodo charters. Polished service. Flexible routes.",
    about:
      "Calico Jack has operated out of Labuan Bajo since 2015, building a reputation for polished private charters across Komodo National Park. Every trip is run by the founding captain, who grew up in the Flores islands and knows the park's tidal windows and reef conditions better than any itinerary could capture. Specialising in fully private day charters for groups of two to ten, with an onboard chef and a route that changes based on conditions and guest interests.",
    length: "28 m",
    cabins: 5,
    maxGuests: 10,
    build: "Indonesian phinisi",
    pricePerCabin: "$3,200",
    charterPrice: "$46,000",
    charterOnly: false,
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=2200&q=82",
    alt: "Private yacht crossing clear tropical water near Komodo",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80",
        alt: "Yacht at anchor in Komodo waters",
      },
      {
        src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
        alt: "Sunlit water in Komodo National Park",
      },
      {
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        alt: "Beach at sunrise",
      },
      {
        src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        alt: "Diver above coral reef",
      },
      {
        src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
        alt: "Island coastline from the water",
      },
    ],
    departures: [
      { dates: "Jul 14 — Jul 21", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 1 — Sep 8", duration: "7 nights", berths: "10 berths" },
      { dates: "Oct 6 — Oct 13", duration: "7 nights", berths: "10 berths" },
      { dates: "Nov 3 — Nov 10", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Labuan Bajo embarkation",
        description:
          "Board mid-afternoon. Welcome briefing, check-in dive at Sebayur.",
      },
      {
        day: 2,
        title: "Batu Bolong & Crystal Rock",
        description:
          "Three dives at Komodo's most current-swept sites. Schooling jacks and white-tips.",
      },
      {
        day: 3,
        title: "Pink Beach",
        description:
          "Morning dive at Manta Alley. Afternoon beach walk at Pink Beach. Sunset anchorage.",
      },
      {
        day: 4,
        title: "Komodo Dragon walk",
        description:
          "Morning hike on Rinca with a park ranger. Afternoon dive at Karang Makassar.",
      },
      {
        day: 5,
        title: "South Komodo",
        description:
          "Three dives — Cannibal Rock, Yellow Wall of Texas. Macro-rich, slower current.",
      },
      {
        day: 6,
        title: "North Komodo passage",
        description:
          "Castle Rock and The Cauldron. Drift dive through the arch if conditions allow.",
      },
      {
        day: 7,
        title: "Wainilu & disembark",
        description:
          "One final morning dive. Cruise back to Labuan Bajo, disembark after lunch.",
      },
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
          "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80",
        alt: "Private yacht crossing clear tropical water",
      },
    ],
    conservation:
      "Calico Jack routes 5% of every BluePass booking to BluePass Conservation partners: Coral Triangle Center (reef restoration), Mangrove Action Project (coastal nurseries), and The Manta Trust (research + protection in Komodo and Raja Ampat).",
  },

  "mermaid-spirit": {
    name: "Mermaid Spirit",
    firstName: "Mermaid",
    tier: "Foundation",
    location: "Nusa Lembongan, Bali",
    region: "Bali · Nusa Islands",
    tagline:
      "Boutique sunset sailing. Intimate charters. Celebration specialists.",
    about:
      "Mermaid Spirit is Nusa Lembongan's most intimate sailing operation — a crew of four running private sunset and celebration charters for groups of up to eight. Founded in 2018 by two sisters who grew up sailing Bali's straits, the business has become the go-to for anniversary and honeymoon clients who want privacy over the usual crowded sunset boat experience. The vessel was built in Sulawesi and restored in 2022.",
    length: "18 m",
    cabins: 3,
    maxGuests: 8,
    build: "Sulawesi sailing vessel",
    pricePerCabin: "$620",
    charterPrice: "$4,200",
    charterOnly: false,
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=82",
    alt: "Sailing yacht at sunset with golden light on the water",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        alt: "Sailing at sunset near Bali",
      },
      {
        src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
        alt: "Tropical bay at dusk",
      },
      {
        src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
        alt: "Wooden boat near a tropical island",
      },
      {
        src: "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?auto=format&fit=crop&w=800&q=80",
        alt: "Deep blue ocean view",
      },
      {
        src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80",
        alt: "Diver underwater",
      },
    ],
    departures: [
      { dates: "Jul 5 — Jul 8", duration: "3 nights", berths: "8 berths" },
      { dates: "Jul 19 — Jul 22", duration: "3 nights", berths: "8 berths" },
      { dates: "Aug 9 — Aug 12", duration: "3 nights", berths: "8 berths" },
      { dates: "Sep 6 — Sep 9", duration: "3 nights", berths: "8 berths" },
    ],
    itinerary: [
      {
        day: 1,
        title: "Nusa Lembongan embarkation",
        description:
          "Board at 4 pm. Welcome canapés as we sail into the strait.",
      },
      {
        day: 2,
        title: "Penida passage",
        description:
          "Morning snorkel at Crystal Bay. Afternoon sail along the Nusa Penida cliffs.",
      },
      {
        day: 3,
        title: "Sunset anchorage",
        description:
          "Quiet bay anchorage, candlelit dinner on deck, star gazing.",
      },
    ],
    trips: [
      {
        href: "/trips/sunset-sailing",
        title: "Sunset Sailing",
        summary:
          "A private dusk sail with canapés, two swim stops, and a cleared forward deck for golden hour.",
        price: "$620",
        duration: "3 hours",
        badge: "24-hour hold",
        image:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        alt: "Sailing yacht at sunset",
      },
    ],
    conservation:
      "Mermaid Spirit routes 5% of every BluePass booking to Bali Ocean Classroom, supporting youth ocean education and coastal waste reduction in Bali.",
  },

  "blue-lagoon-dive-resort": {
    name: "Blue Lagoon",
    firstName: "Blue Lagoon",
    tier: "Foundation",
    location: "Padangbai, Bali",
    region: "East Bali · Padangbai",
    tagline:
      "Reef, macro, and conservation dives from Bali's most consistent dive base.",
    about:
      "Blue Lagoon Dive Resort has operated from Padangbai since 2008, becoming one of East Bali's most trusted dive operations. The resort runs guided dives at Blue Lagoon reef and Padangbai's jetty wall — two distinct site types in the same bay — with equipment, logistics, and conservation briefings all managed in-house. The resort's conservation program is one of the few in Bali actively running a coral nursery with measurable transplant success rates.",
    length: "—",
    cabins: 12,
    maxGuests: 8,
    build: "Shore-based resort",
    pricePerCabin: "$135",
    charterPrice: "$900",
    charterOnly: false,
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2200&q=82",
    alt: "Diver gliding above a coral reef",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
        alt: "Diver above coral reef",
      },
      {
        src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
        alt: "Remote blue lagoon",
      },
      {
        src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
        alt: "Island coastline",
      },
      {
        src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80",
        alt: "Diver near reef wall",
      },
      {
        src: "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?auto=format&fit=crop&w=800&q=80",
        alt: "Deep blue ocean",
      },
    ],
    departures: [
      { dates: "Daily from Jul 1", duration: "Day trips", berths: "8 guests" },
      {
        dates: "Private on request",
        duration: "Full day",
        berths: "8 guests",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Blue Lagoon reef",
        description: "Two guided dives on the reef slope. Turtle briefing included.",
      },
      {
        day: 2,
        title: "Jetty wall",
        description:
          "Macro and muck dive along the Padangbai jetty wall. Frogfish and nudibranch.",
      },
      {
        day: 3,
        title: "Coral nursery",
        description:
          "Snorkel above the restoration zone with a conservation briefing.",
      },
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
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        alt: "Diver gliding above a coral reef",
      },
      {
        href: "/trips/conservation-reef-experience",
        title: "Conservation Reef Experience",
        summary:
          "Reef education and snorkel with conservation briefings, coral nursery walkthrough, and a guided snorkel above the restoration zone.",
        price: "$95",
        duration: "4 hours",
        badge: "Live check",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
        alt: "Remote blue lagoon and white sand beach",
      },
    ],
    conservation:
      "Blue Lagoon Dive Resort routes 5% of every BluePass booking to Bali Ocean Classroom and runs its own coral nursery program, with transplant success rates published quarterly.",
  },

  "komodo-liveaboard-co": {
    name: "Komodo Liveaboard Co.",
    firstName: "Komodo",
    tier: "Explorer",
    location: "Labuan Bajo, East Nusa Tenggara",
    region: "Komodo National Park",
    tagline:
      "Premium cabin liveaboards through every signature Komodo site.",
    about:
      "Komodo Liveaboard Co. runs the most complete multi-day itinerary in Komodo National Park — a four-day, three-night cabin-based expedition that covers every significant dive site and includes the Komodo dragon trek. Founded in 2012 by a team of Labuan Bajo-based dive instructors, the company has refined the same itinerary over a decade into a highly consistent product with a 1:4 guide ratio and a safety record built on strict pre-dive current briefings.",
    length: "36 m",
    cabins: 8,
    maxGuests: 16,
    build: "Indonesian phinisi",
    pricePerCabin: "$1,850",
    charterPrice: "$22,000",
    charterOnly: false,
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2200&q=82",
    alt: "Island coastline with turquoise water from the sea",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
        alt: "Liveaboard yacht at anchor near Komodo islands",
      },
      {
        src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80",
        alt: "Yacht at sea",
      },
      {
        src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
        alt: "Diver above coral",
      },
      {
        src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
        alt: "Sunlit Komodo waters",
      },
      {
        src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
        alt: "Tropical beach at sunset",
      },
    ],
    departures: [
      {
        dates: "Jul 7 — Jul 11",
        duration: "4 nights",
        berths: "16 berths",
      },
      {
        dates: "Aug 11 — Aug 15",
        duration: "4 nights",
        berths: "16 berths",
      },
      {
        dates: "Sep 8 — Sep 12",
        duration: "4 nights",
        berths: "16 berths",
      },
      {
        dates: "Oct 13 — Oct 17",
        duration: "4 nights",
        berths: "16 berths",
      },
      {
        dates: "Nov 10 — Nov 14",
        duration: "4 nights",
        berths: "16 berths",
      },
    ],
    itinerary: [
      {
        day: 1,
        title: "Labuan Bajo embarkation",
        description:
          "Board mid-afternoon. Welcome briefing, check-in dive at Sebayur.",
      },
      {
        day: 2,
        title: "Batu Bolong & Crystal Rock",
        description:
          "Three dives at Komodo's most current-swept sites. Schooling jacks and white-tips.",
      },
      {
        day: 3,
        title: "Komodo Dragon walk",
        description:
          "Morning hike on Rinca with a park ranger. Afternoon dive at Karang Makassar (manta cleaning).",
      },
      {
        day: 4,
        title: "Manta Alley & Pink Beach",
        description:
          "Iconic manta dive in the morning. Beach BBQ. Sunset dive if conditions allow.",
      },
      {
        day: 5,
        title: "Wainilu & disembark",
        description:
          "One final morning dive. Cruise back to Labuan Bajo, disembark after lunch.",
      },
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
          "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
        alt: "Island coastline with turquoise water",
      },
    ],
    conservation:
      "Komodo Liveaboard Co. routes 5% of every BluePass booking to BluePass Conservation partners: Coral Triangle Center (reef restoration), Mangrove Action Project (coastal nurseries), and The Manta Trust (research + protection in Komodo and Raja Ampat).",
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

export default async function OperatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const op = operators[slug];
  if (!op) notFound();

  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        {/* Hero */}
        <section className="relative min-h-[72svh] overflow-hidden bg-[#020b11]">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url('${op.image}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,rgba(0,0,0,0.04)_38%,rgba(2,11,17,0.82)_78%,rgba(2,11,17,0.97)_100%)]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/12 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="relative flex min-h-[72svh] flex-col justify-end px-[var(--cinematic-screen-x)] pb-10 pt-28">
            <Link
              href="/for-operators"
              className="mb-8 inline-flex w-fit items-center gap-2 text-[10px] tracking-[0.22em] text-white/46 transition-colors hover:text-white/80"
             
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
              Operators
            </Link>

            <p
              className="text-[10px] uppercase tracking-[0.26em] text-white/55"
             
            >
              BluePass Operator · {op.tier} Tier
            </p>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="bp-page-title text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.96] text-white">
                {op.name}
              </h1>
              <VerifiedBadge />
            </div>
            <p className="mt-3 text-[15px] font-light text-white/60">
              {op.length !== "—" ? `${op.length} · ` : ""}
              {op.cabins} cabins · up to {op.maxGuests} guests · {op.region}
            </p>
          </div>
        </section>

        {/* Body */}
        <div className="px-[var(--cinematic-screen-x)] py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14 xl:grid-cols-[1fr_360px]">
              {/* Left column */}
              <div className="space-y-12">
                {/* Gallery */}
                <section>
                  <SectionLabel>Gallery</SectionLabel>
                  <div className="mt-4 grid grid-cols-[1fr_1fr] grid-rows-2 gap-2 md:grid-cols-[1.2fr_1fr_1fr] md:grid-rows-2">
                    {/* Large first image */}
                    <div className="relative row-span-2 overflow-hidden">
                      <Image
                        src={op.gallery[0].src}
                        alt={op.gallery[0].alt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 30vw, 50vw"
                      />
                    </div>
                    {/* Four smaller images */}
                    {op.gallery.slice(1, 5).map((img, i) => (
                      <div
                        key={i}
                        className="relative aspect-[4/3] overflow-hidden"
                      >
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 15vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* About */}
                <section>
                  <SectionLabel>About</SectionLabel>
                  <p className="mt-4 text-[15px] leading-[1.82] text-white/68">
                    {op.about}
                  </p>
                </section>

                {/* Itinerary */}
                <section>
                  <SectionLabel>Sample Itinerary</SectionLabel>
                  <ol className="mt-5 space-y-0">
                    {op.itinerary.map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span
                            className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#1a7c72]/60 bg-[#0d3d38] text-[9px] font-medium text-[#5cc8be]"
                           
                          >
                            {item.day}
                          </span>
                          {i < op.itinerary.length - 1 && (
                            <span className="mt-1 h-full w-px bg-white/8" />
                          )}
                        </div>
                        <div className="pb-5">
                          <p
                            className="text-[10px] uppercase tracking-[0.18em] text-white/36"
                           
                          >
                            Day {item.day}
                          </p>
                          <p className="mt-0.5 text-[0.9375rem] font-medium text-white/88">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-[1.65] text-white/52">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Trips */}
                <section>
                  <SectionLabel>Trips</SectionLabel>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {op.trips.map((trip) => (
                      <Link
                        key={trip.href}
                        href={trip.href}
                        className="group block"
                      >
                        <article className="bp-tech-card border border-white/[0.09]">
                          <div className="relative aspect-[16/9] overflow-hidden">
                            <Image
                              src={trip.image}
                              alt={trip.alt}
                              fill
                              sizes="(min-width: 640px) 50vw, 100vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                            />
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
                                  borderRadius: "6px",
                                  backdropFilter: "blur(8px)",
                                }}
                              >
                                {trip.badge}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <p
                              className="text-[10px] uppercase tracking-[0.20em] text-[#B89A5D]"
                             
                            >
                              {trip.duration}
                            </p>
                            <h3 className="bp-page-title mt-1 text-lg leading-tight text-white">
                              {trip.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-6 text-white/55">
                              {trip.summary}
                            </p>
                            <div
                              className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3"
                             
                            >
                              <span className="text-[10px] text-white/44">
                                from {trip.price} / cabin · night
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    ))}
                  </div>
                </section>

                {/* Conservation */}
                <section className="border border-[#1a7c72]/28 bg-[#0d3d38]/18 p-5">
                  <div className="flex items-center gap-2">
                    <LeafIcon />
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-[#5cc8be]"
                     
                    >
                      Conservation
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {op.conservation}
                  </p>
                  <p className="mt-2 text-[12px] text-white/38">
                    Plus 5% of every BluePass booking is built into the price
                    and routed to BluePass Conservation partners.
                  </p>
                </section>
              </div>

              {/* Sidebar */}
              <div>
                <div className="sticky top-6 space-y-3">
                  {/* Price */}
                  <div className="rounded-xl bg-[#0a2538] p-5">
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-white/40"
                     
                    >
                      Price
                    </p>
                    <p className="mt-3 text-[1.5rem] font-medium leading-none text-white">
                      from {op.pricePerCabin}
                    </p>
                    <p className="mt-1 text-[12px] text-white/50">
                      / cabin · night
                    </p>
                    <p className="mt-1.5 text-[12px] text-white/40">
                      or charter {op.charterPrice} / night · whole vessel
                    </p>
                    {op.charterOnly && (
                      <span
                        className="mt-2 inline-block border border-[#B89A5D]/30 bg-[#B89A5D]/10 px-2 py-[3px] text-[10px] tracking-[0.16em] text-[#f1d58a]"
                       
                      >
                        Whole-yacht charter only
                      </span>
                    )}
                  </div>

                  {/* Vessel */}
                  <div className="rounded-xl bg-[#0a2538] p-5">
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-white/40"
                     
                    >
                      Vessel
                    </p>
                    <dl className="mt-3 space-y-2">
                      {op.length !== "—" && (
                        <VesselRow label="Length" value={op.length} />
                      )}
                      <VesselRow label="Cabins" value={String(op.cabins)} />
                      <VesselRow
                        label="Max guests"
                        value={String(op.maxGuests)}
                      />
                      <VesselRow label="Tier" value={op.tier} />
                      <VesselRow label="Build" value={op.build} />
                    </dl>
                  </div>

                  {/* Departures */}
                  <div className="rounded-xl bg-[#0a2538] p-5">
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-white/40"
                     
                    >
                      Next Departures
                    </p>
                    <ul className="mt-3 space-y-0 divide-y divide-white/[0.06]">
                      {op.departures.map((dep, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between py-2.5"
                        >
                          <div>
                            <p className="text-[0.8125rem] text-white/88">
                              {dep.dates}
                            </p>
                            <p
                              className="mt-0.5 text-[11px] text-white/40"
                             
                            >
                              {dep.duration} · {dep.berths}
                            </p>
                          </div>
                          <Link
                            href="https://wa.me/628213143343"
                            className="text-[11px] text-[#5cc8be] transition-colors hover:text-white"
                           
                          >
                            Hold ›
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[11px] leading-[1.5] text-white/30">
                      Indicative departures — the operator confirms exact dates
                      on quote.
                    </p>
                  </div>

                  {/* CTAs */}
                  <Link
                    href="https://wa.me/628213143343"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[11px] font-medium tracking-[0.04em] text-[#071827] transition-colors hover:bg-white/90"
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
                    + Plan with {op.firstName}
                  </Link>
                  {op.trips[0] && (
                    <Link
                      href={op.trips[0].href}
                      className="flex h-11 w-full items-center justify-center rounded-xl bg-[#1a7c72] text-[11px] font-medium tracking-[0.04em] text-white transition-colors hover:bg-[#1f9088]"
                    >
                      See trip details
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BluePassFooter />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] uppercase tracking-[0.22em] text-[#B89A5D]"
     
    >
      {children}
    </p>
  );
}

function VesselRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
      <dt className="text-[12px] text-white/44">{label}</dt>
      <dd className="text-[0.8125rem] font-medium text-white">{value}</dd>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#1a7c72]"
      title="Verified BluePass operator"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

function LeafIcon() {
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
      className="text-[#5cc8be]"
      aria-hidden="true"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
