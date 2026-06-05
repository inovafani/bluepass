import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BluePassFooter } from "@/app/components/BluePassFooter";

type Highlight = { label: string; value: string };
type ItineraryItem = { time: string; title: string; body: string };

type LiveTrip = {
  operator: string;
  location: string;
  title: string;
  badge: string;
  availability: string;
  tagline: string;
  summary: string;
  price: string;
  duration: string;
  capacity: string;
  image: string;
  alt: string;
  highlights: Highlight[];
  included: string[];
  schedule: ItineraryItem[];
  tags: string[];
};

const trips: Record<string, LiveTrip> = {
  "private-yacht-charter": {
    operator: "Calico Jack Charters",
    location: "Komodo National Park",
    title: "Private Yacht Charter",
    badge: "Live check",
    availability: "Space open",
    tagline: "A fully crewed Komodo day charter — reef stops, chef lunch, flexible route.",
    summary:
      "Calico Jack Charters operates one of Komodo's finest private yacht experiences. A fully crewed vessel with an onboard chef, flexible reef itinerary, and a captain who adapts the route to conditions and guest interests. Ideal for groups who want the freedom of a private boat without the complexity of a liveaboard.",
    price: "$2,400",
    duration: "8 hours",
    capacity: "Up to 10",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
    alt: "Private yacht crossing clear tropical water",
    highlights: [
      { label: "Duration", value: "8 hours" },
      { label: "Capacity", value: "Up to 10" },
      { label: "Availability", value: "Space open" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "Fully crewed private yacht with captain and first mate",
      "Onboard chef — 3-course lunch prepared fresh",
      "All snorkelling equipment",
      "Non-alcoholic beverages and snacks throughout",
      "National park entry fees",
      "Flexible reef and island route",
    ],
    schedule: [
      {
        time: "07:30",
        title: "Labuan Bajo Departure",
        body: "Depart from Labuan Bajo marina. Morning briefing with the captain on the day's route and reef conditions. Coffee and breakfast pastries served on deck.",
      },
      {
        time: "09:00",
        title: "First Reef Stop — Batu Bolong",
        body: "First snorkel or dive stop at Batu Bolong, Komodo's most celebrated pinnacle reef. The channel current brings in reef sharks, mantas, and schooling trevally.",
      },
      {
        time: "11:00",
        title: "Pink Beach",
        body: "A rare pink-sand beach formed by red coral fragments. Excellent shallow snorkelling directly off the beach — clownfish, hawksbill turtles, and abundant reef fish.",
      },
      {
        time: "13:00",
        title: "Chef Lunch Aboard",
        body: "Anchor in a sheltered bay while the onboard chef serves a fresh 3-course Indonesian-inspired lunch. Grilled catch of the day, local salads, and tropical fruit.",
      },
      {
        time: "14:30",
        title: "Flexible Afternoon — Manta Point or Dragon Trek",
        body: "Based on the morning's conditions and group preference: head to Manta Point for manta ray encounters, or beach for a short komodo dragon trek with a park ranger.",
      },
      {
        time: "16:30",
        title: "Return to Labuan Bajo",
        body: "Sunset return to the marina with cold drinks on deck. Transfers to hotels arranged.",
      },
    ],
    tags: ["Private Charter", "Komodo", "Snorkelling", "Mantas", "Chef On Board", "Flexible Route"],
  },

  "komodo-liveaboard-expedition": {
    operator: "Komodo Liveaboard Co.",
    location: "Komodo National Park",
    title: "Komodo Liveaboard Expedition",
    badge: "Live check",
    availability: "Limited",
    tagline: "Four days aboard. Every signature Komodo site. Dragon trek included.",
    summary:
      "Komodo Liveaboard Co. runs the most complete multi-day Komodo itinerary available — four days and three nights covering every significant dive site in the national park. Cabin-based comfort, a dive guide ratio of 1:4, and the Komodo dragon trek built into day three.",
    price: "$1,850",
    duration: "4 days / 3 nights",
    capacity: "Up to 16",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Island coastline with turquoise water",
    highlights: [
      { label: "Duration", value: "4 days / 3 nights" },
      { label: "Dives", value: "10–12 guided dives" },
      { label: "Availability", value: "Limited spaces" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "10–12 guided dives with certified dive masters",
      "Nitrox available on request",
      "Comfortable shared and private cabin options",
      "All meals and drinking water",
      "Komodo dragon trek with park ranger",
      "National park entry and dive fees",
    ],
    schedule: [
      {
        time: "Day 1",
        title: "Labuan Bajo Embarkation & Batu Bolong",
        body: "Board in Labuan Bajo and head directly to Batu Bolong for two afternoon dives. The pinnacle drops 25m and the current regularly pulls in reef sharks and schools of fusiliers.",
      },
      {
        time: "Day 2",
        title: "Crystal Rock, Castle Rock & Manta Point",
        body: "The two rocks are Komodo's most celebrated dive sites — current-swept, shark-heavy, and dense with coral. Afternoon at Manta Point where reef mantas circle cleaning stations daily.",
      },
      {
        time: "Day 3",
        title: "Pink Beach Snorkel & Dragon Trek",
        body: "Morning snorkel at Pink Beach followed by the komodo dragon trek with a park ranger. Afternoon return dive at a site chosen by the dive guide based on conditions.",
      },
      {
        time: "Day 4",
        title: "Final Dives & Labuan Bajo Return",
        body: "Two morning dives at Siaba Besar or Tatawa Kecil before returning to Labuan Bajo by noon. Logbook stamps and hotel transfers.",
      },
    ],
    tags: ["Liveaboard", "Komodo", "Manta Rays", "Dragon Trek", "4 Days", "Dive-focused"],
  },

  "dive-day-trip": {
    operator: "Blue Lagoon Dive Resort",
    location: "Padangbai, Bali",
    title: "Dive Day Trip",
    badge: "Live check",
    availability: "WhatsApp hold",
    tagline: "Two guided dives from Padangbai. Resort logistics. Reef briefings.",
    summary:
      "Blue Lagoon Dive Resort has been operating out of Padangbai since 2008. The dive day trip is a two-dive guided experience from the Blue Lagoon site — Bali's most consistent day-dive location — with a full resort briefing, equipment, and lunch at the resort included. A great introduction to Bali diving.",
    price: "$135",
    duration: "6 hours",
    capacity: "Up to 8",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver gliding above a coral reef",
    highlights: [
      { label: "Duration", value: "6 hours" },
      { label: "Dives", value: "2 guided dives" },
      { label: "Hold method", value: "WhatsApp hold" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "Two guided dives with certified dive master",
      "Full dive equipment (wetsuit, BCD, regulator, mask, fins)",
      "Resort facilities use — shower, changing rooms",
      "Reef briefing and site orientation",
      "Lunch at the resort",
      "Return transfer from Sanur or Kuta on request",
    ],
    schedule: [
      {
        time: "08:30",
        title: "Resort Arrival & Briefing",
        body: "Arrive at Blue Lagoon Dive Resort in Padangbai. Equipment fitting, dive briefing, and a walkthrough of the Blue Lagoon site — its layout, key species, and depth profile.",
      },
      {
        time: "09:15",
        title: "Dive One — Blue Lagoon Reef",
        body: "First dive at Blue Lagoon, a sheltered bay with a coral slope starting at 3m. Hawksbill turtles are resident, along with blue-spotted rays, moray eels, and reef fish in high density.",
      },
      {
        time: "10:30",
        title: "Surface Interval at Resort",
        body: "Surface interval on the resort deck with fresh fruit and drinks. The dive master debrief and a preview of the second dive site.",
      },
      {
        time: "11:00",
        title: "Dive Two — The Jetty Wall",
        body: "The second dive takes in Padangbai's jetty wall — a muck-dive-style site with nudibranchs, ghost pipefish, and the resident frogfish the guides have named Bemo.",
      },
      {
        time: "12:30",
        title: "Lunch & Equipment Return",
        body: "Lunch served at the resort restaurant. Equipment rinse and storage. Optional mask and fin upgrade discussion with the shop team.",
      },
      {
        time: "14:30",
        title: "Resort Departure",
        body: "End of the day trip. Transfer back to Sanur or Kuta available on request.",
      },
    ],
    tags: ["Day Trip", "Bali", "Guided Dives", "Padangbai", "Beginners Welcome", "Resort"],
  },

  "sunset-sailing": {
    operator: "Mermaid Spirit",
    location: "Labuan Bajo, Komodo",
    title: "Sunset Sailing",
    badge: "24-hour hold",
    availability: "Limited",
    tagline: "A private dusk sail with canapes, swim stops, and a quiet deck for golden hour.",
    summary:
      "Mermaid Spirit operates Labuan Bajo's most intimate sunset sailing experience. A private traditional vessel for up to eight guests, with canapes prepared by the crew, two swim stops in sheltered bays, and a deck cleared for golden hour as the Komodo archipelago silhouettes against the fading sky.",
    price: "$620",
    duration: "3 hours",
    capacity: "Up to 8",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Sailing yacht at sunset over calm tropical water",
    highlights: [
      { label: "Duration", value: "3 hours" },
      { label: "Style", value: "Private vessel" },
      { label: "Hold type", value: "24-hour hold" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "Private traditional sailing vessel with crew",
      "Canapes and cold drinks served throughout",
      "Two sheltered bay swim stops",
      "Snorkelling equipment for swim stops",
      "Sunset photography spot at prime Komodo viewpoint",
      "Return to Labuan Bajo marina by dark",
    ],
    schedule: [
      {
        time: "16:00",
        title: "Labuan Bajo Marina Departure",
        body: "Board at the marina. The crew sets sail west as the afternoon heat begins to ease. First canapes served as you clear the harbour mouth.",
      },
      {
        time: "16:45",
        title: "First Swim Stop — Sheltered Bay",
        body: "Anchor in a sheltered bay between two Komodo islands. The water is bath-warm and the bay is usually calm even when wind picks up outside. Snorkelling equipment available.",
      },
      {
        time: "17:30",
        title: "Sailing to the Sunset Point",
        body: "The captain positions the boat at Mermaid Spirit's signature viewpoint — a channel between two islands that frames the setting sun perfectly. The crew clear the forward deck.",
      },
      {
        time: "18:15",
        title: "Golden Hour & Second Swim",
        body: "The last swim stop as the sky turns orange and pink. Cold drinks, music on deck, and the silence of the Komodo archipelago at dusk.",
      },
      {
        time: "18:45",
        title: "Return to Labuan Bajo",
        body: "Sail back to the marina in the early dark. Stars emerge quickly this far from city lights. The crew delivers you back by 19:00.",
      },
    ],
    tags: ["Sunset", "Private", "Sailing", "Komodo", "Romantic", "Small Group"],
  },

  "conservation-reef-experience": {
    operator: "Blue Lagoon Dive Resort",
    location: "Padangbai, Bali",
    title: "Conservation Reef Experience",
    badge: "Live check",
    availability: "Space open",
    tagline: "Reef education and snorkel with conservation briefings and local guides.",
    summary:
      "Blue Lagoon Dive Resort's conservation program runs a half-day reef education and snorkel experience built around active reef health work. Local guides explain coral restoration methods, reef health indicators, and how BluePass's 5% reef levy connects to the site you're snorkelling above.",
    price: "$95",
    duration: "4 hours",
    capacity: "Up to 12",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    alt: "Remote blue lagoon and white sand beach",
    highlights: [
      { label: "Duration", value: "4 hours" },
      { label: "Focus", value: "Reef conservation" },
      { label: "Guide", value: "Local reef expert" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "Reef conservation briefing with local reef expert",
      "Full snorkelling equipment",
      "Guided snorkel session above active restoration site",
      "Coral nursery explanation and observation",
      "Conservation contribution certificate",
      "Fresh juice and snacks post-session",
    ],
    schedule: [
      {
        time: "08:30",
        title: "Conservation Briefing",
        body: "Arrive at the resort and meet your local reef guide. A 40-minute presentation on Bali's reef health, the impact of bleaching events in 2016 and 2020, and the restoration methods being used at Blue Lagoon.",
      },
      {
        time: "09:15",
        title: "Coral Nursery Walk",
        body: "Wade into the shallows to observe the rope-mounted coral nursery frames. The guide explains how fragments are grown and transplanted, and what success looks like over 12–18 months.",
      },
      {
        time: "09:45",
        title: "Guided Snorkel — Restoration Zone",
        body: "Snorkel above the active restoration zone with the guide pointing out successful transplants, reef species returning to healthier coral, and areas still under stress.",
      },
      {
        time: "11:00",
        title: "Deep Reef Snorkel",
        body: "Move to the outer reef in 3–8m of water for a free-snorkel session. The guide accompanies the group and fields questions throughout.",
      },
      {
        time: "11:45",
        title: "Debrief & Certificate",
        body: "Return to resort for fresh juice and a short debrief. Conservation contribution certificates issued. Each participant's reef levy is matched to a named reef project.",
      },
    ],
    tags: ["Conservation", "Snorkelling", "Bali", "Reef Education", "Family Friendly", "Half Day"],
  },
};

export async function generateStaticParams() {
  return Object.keys(trips).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const trip = trips[slug];
  if (!trip) return { title: "Trip | BluePass" };
  return {
    title: `${trip.title} | BluePass`,
    description: trip.summary,
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

export default async function TripPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = trips[slug];

  if (!trip) notFound();

  const isLive = trip.badge === "Live check";

  return (
    <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
      {/* Hero */}
      <section className="relative min-h-[72svh] overflow-hidden bg-[#020b11]">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${trip.image}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.92),rgba(0,15,21,0.55)_52%,rgba(0,8,14,0.78)),linear-gradient(180deg,rgba(0,0,0,0.52),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.82))]" />
        <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
        <div className="bp-film-grain absolute inset-0" />

        <div className="relative flex min-h-[72svh] flex-col justify-end px-[var(--cinematic-screen-x)] pb-12 pt-28">
          <Link
            href="/discover"
            className="mb-6 inline-flex w-fit items-center gap-2 text-[10px] tracking-[0.22em] text-white/50 transition-colors hover:text-white/80"
           
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
            Back to Explore
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 border border-white/14 bg-black/50 px-2.5 py-1 text-[10px] tracking-[0.13em] text-white/80"
              style={{
                borderRadius: "6px",
                backdropFilter: "blur(8px)",
              }}
            >
              <BadgeDot live={isLive} />
              {trip.badge}
            </span>
            <span
              className="border border-[#B89A5D]/28 bg-[#B89A5D]/14 px-2.5 py-1 text-[10px] tracking-[0.13em] text-[#f4d891]"
              style={{ borderRadius: "6px" }}
            >
              5% reef
            </span>
          </div>

          <p
            className="mt-3 text-[10px] uppercase tracking-[0.26em] text-[#B89A5D]"
           
          >
            {trip.operator} · {trip.location}
          </p>
          <h1 className="bp-page-title mt-2 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.96] text-white">
            {trip.title}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
            {trip.tagline}
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/10 bg-[#03111d]/80 px-[var(--cinematic-screen-x)] backdrop-blur-xl">
        <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {[
            { label: "From", value: trip.price },
            { label: "Duration", value: trip.duration },
            { label: "Capacity", value: trip.capacity },
            { label: "Availability", value: trip.availability },
          ].map((stat) => (
            <div key={stat.label} className="px-5 py-5">
              <p
                className="text-[10px] tracking-[0.20em] text-white/40"
               
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
               
              >
                About this trip
              </p>
              <h2 className="bp-page-title mt-3 text-3xl text-white">
                {trip.operator}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-white/70">
                {trip.summary}
              </p>
            </section>

            {/* Highlights */}
            <section className="mt-10">
              <p
                className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
               
              >
                At a glance
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {trip.highlights.map((h) => (
                  <div
                    key={h.label}
                    className="border border-white/10 bg-white/[0.03] p-4"
                    style={{ borderRadius: "4px" }}
                  >
                    <p
                      className="text-[10px] tracking-[0.18em] text-white/40"
                     
                    >
                      {h.label}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-white">
                      {h.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {trip.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/55"
                  style={{ borderRadius: "4px" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Schedule */}
            <section className="mt-12">
              <p
                className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
               
              >
                Day schedule
              </p>
              <h2 className="bp-page-title mt-3 text-2xl text-white">
                How the day runs
              </h2>
              <div className="mt-6 border border-white/10">
                {trip.schedule.map((item, i) => (
                  <div
                    key={item.time}
                    className={`grid grid-cols-[80px_1fr] gap-4 p-5 ${
                      i < trip.schedule.length - 1
                        ? "border-b border-white/[0.07]"
                        : ""
                    }`}
                  >
                    <div className="pt-0.5">
                      <p
                        className="text-[10px] tracking-[0.18em] text-[#B89A5D]"
                       
                      >
                        {item.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">
                        {item.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-6 text-white/55">
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-6 space-y-4">
              {/* What's included */}
              <div className="rounded-xl bg-[#0a2538] p-6">
                <p
                  className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                 
                >
                  What&apos;s included
                </p>
                <ul className="mt-4 space-y-3">
                  {trip.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span className="text-sm leading-5 text-white/65">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book CTA */}
              <div className="rounded-xl bg-[#0a2538] p-6">
                <div className="flex items-center gap-2">
                  <p className="bp-page-title text-2xl text-white">
                    From {trip.price}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 border border-white/14 bg-black/40 px-2 py-0.5 text-[9px] tracking-[0.12em] text-white/60"
                    style={{
                      borderRadius: "4px",
                    }}
                  >
                    <BadgeDot live={isLive} />
                    {trip.badge}
                  </span>
                </div>
                <p className="mt-1 text-sm text-white/50">{trip.duration} · {trip.capacity}</p>
                <p className="mt-4 text-[13px] leading-6 text-white/60">
                  Ask Kai to check live availability and place a{" "}
                  {isLive ? "same-day" : "24-hour"} hold on this trip for you.
                </p>
                <Link
                  href="https://wa.me/628213143343"
                  className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[11px] font-medium tracking-[0.04em] text-[#071827] transition-colors hover:bg-white/90"
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
                  Check availability with Kai
                </Link>
                <Link
                  href="/discover"
                  className="mt-2.5 flex h-10 w-full items-center justify-center border border-white/20 text-[11px] font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  Back to all trips
                </Link>
              </div>

              {/* Conservation note */}
              <div className="border border-[#B89A5D]/20 bg-[#B89A5D]/[0.04] p-5">
                <p
                  className="text-[10px] tracking-[0.22em] text-[#B89A5D]"
                 
                >
                  Reef contribution
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  5% of this booking goes to a named reef partner. Reports go
                  public as partner reporting comes online.
                </p>
                <Link
                  href="/conservation"
                  className="mt-3 inline-flex items-center gap-1.5 text-[11px] tracking-[0.14em] text-[#B89A5D] transition-colors hover:text-white"
                 
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
