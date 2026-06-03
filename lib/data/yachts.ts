/**
 * ─── YACHT DATA ──────────────────────────────────────────────────────────────
 *
 * This is the single source of truth for all yacht/operator profiles.
 * It is used by both the explore-indonesia grid cards and the detail pages.
 *
 * HOW TO UPDATE IMAGES
 * ─────────────────────
 * Each yacht has an `images` object with three keys:
 *
 *   card    → the thumbnail shown on the explore-indonesia grid
 *   hero    → the full-bleed background on the detail page
 *   gallery → up to 5 photos shown in the detail page gallery
 *              (the first one is displayed large/tall on the left)
 *
 * To swap an image, replace the URL string for that key. Unsplash URLs follow
 * the pattern:  https://images.unsplash.com/photo-<ID>?auto=format&fit=crop&w=<W>&q=<Q>
 *
 * To use a local image, put the file in /public/yachts/<slug>/ and reference
 * it as e.g. "/yachts/anne-bonny/hero.jpg"
 */

export type YachtImages = {
  /** Grid card thumbnail */
  card: string;
  /** Full-bleed hero on detail page */
  hero: string;
  /** Gallery photos — first image is displayed large on the left */
  gallery: { src: string; alt: string }[];
};

export type Departure = {
  dates: string;
  duration: string;
  berths: string;
};

export type ItineraryDay = {
  day: number;
  title: string;
  description: string;
};

export type Yacht = {
  slug: string;
  name: string;
  /** Used in CTA copy: "+ Plan with [firstName]" */
  firstName: string;
  /** Short uppercase label shown on cards e.g. "KOMODO" */
  locationBadge: string;
  /** Full region shown on detail page e.g. "Komodo National Park" */
  region: string;
  /** BluePass tier e.g. "Explorer" or "Foundation" */
  tier: string;
  maxGuests: number;
  length: string;
  cabins: number;
  build: string;
  pricePerCabin: string;
  charterPrice: string | null;
  charterOnly: boolean;
  tagline: string | null;
  about: string;
  departures: Departure[];
  itinerary: ItineraryDay[];
  conservation: string;
  images: YachtImages;
};

export const yachts: Yacht[] = [
  // ─── 01 · ALEXA ─────────────────────────────────────────────────────────────
  {
    slug: "alexa",
    name: "Alexa",
    firstName: "Alexa",
    locationBadge: "KOMODO",
    region: "Komodo National Park",
    tier: "Flagship",
    maxGuests: 2,
    length: "22 m",
    cabins: 1,
    build: "Custom fusion yacht",
    pricePerCabin: "$6,499",
    charterPrice: null,
    charterOnly: true,
    tagline: "Couples-only fusion yacht",
    about:
      "Alexa is a couples-only private yacht built for two — one master suite, a private dive tender, and a chef who works to the couple's menu before departure. No shared decks, no group schedules. Routes cover Komodo's quieter sites: Tatawa Besar, Wainilu, and Siaba Besar, which see a fraction of the Batu Bolong traffic.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "2 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "2 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "2 berths" },
      { dates: "Oct 6 — Oct 13", duration: "7 nights", berths: "2 berths" },
    ],
    itinerary: [
      { day: 1, title: "Labuan Bajo embarkation", description: "Board in the afternoon. Welcome dive briefing at Sebayur." },
      { day: 2, title: "Siaba Besar", description: "Manta and turtle feeding ground. Afternoon snorkel from the tender." },
      { day: 3, title: "Tatawa Besar", description: "Drift dive along the wall. Shallow reef for snorkelling at slack tide." },
      { day: 4, title: "Pink Beach", description: "Private morning at the beach. Dive at Manta Alley in the afternoon." },
      { day: 5, title: "Komodo Dragon walk", description: "Ranger-guided trek on Rinca. Sunset at Kalong Island." },
      { day: 6, title: "Wainilu", description: "Macro dive. Afternoon sailing passage under full canvas." },
      { day: 7, title: "Return & disembark", description: "Final morning dive, late breakfast, return to Labuan Bajo." },
    ],
    conservation: "Alexa routes 5% of every BluePass booking to BluePass Conservation partners: Coral Triangle Center, Mangrove Action Project, and The Manta Trust.",
    images: {
      // ─── UPDATE IMAGES HERE ──────────────────────────────────────────────────
      card: "https://images.unsplash.com/photo-1519420573924-65fcd45245f8?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1519420573924-65fcd45245f8?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1519420573924-65fcd45245f8?auto=format&fit=crop&w=1200&q=80", alt: "Alexa sailing in calm waters" },
        { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80", alt: "Tropical bay anchorage" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Beach at golden hour" },
        { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", alt: "Underwater reef scene" },
        { src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80", alt: "Sunlit water in Komodo" },
      ],
      // ─────────────────────────────────────────────────────────────────────────
    },
  },

  // ─── 02 · ALIIKAI ───────────────────────────────────────────────────────────
  {
    slug: "aliikai",
    name: "Aliikai",
    firstName: "Aliikai",
    locationBadge: "RAJA AMPAT",
    region: "Raja Ampat · West Papua",
    tier: "Flagship",
    maxGuests: 15,
    length: "35 m",
    cabins: 7,
    build: "Indonesian phinisi",
    pricePerCabin: "$690",
    charterPrice: "$8,900",
    charterOnly: false,
    tagline: null,
    about:
      "Aliikai is a 35-metre Raja Ampat phinisi with seven cabins and a reputation for some of the best dive guiding in West Papua. Running year-round routes across Misool, Dampier Strait, and the Wayag islands, the vessel pairs comfortable cabin accommodation with access to the Coral Triangle's highest recorded reef density.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "15 berths" },
      { dates: "Aug 2 — Aug 9", duration: "7 nights", berths: "15 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "15 berths" },
      { dates: "Oct 4 — Oct 11", duration: "7 nights", berths: "15 berths" },
      { dates: "Nov 1 — Nov 8", duration: "7 nights", berths: "15 berths" },
    ],
    itinerary: [
      { day: 1, title: "Sorong embarkation", description: "Board in Sorong. Afternoon departure for the Dampier Strait." },
      { day: 2, title: "Cape Kri", description: "Site of the world fish-count record. Three dives, schooling barracuda." },
      { day: 3, title: "Arborek & Manta Sandy", description: "Village snorkel in the morning. Manta cleaning station in the afternoon." },
      { day: 4, title: "Misool passage", description: "Overnight sail south. Rest day with snorkelling from the swim platform." },
      { day: 5, title: "Misool karst", description: "Diving inside the limestone lagoons. Pygmy seahorse and nudibranch." },
      { day: 6, title: "Wayag", description: "Hike to the iconic viewpoint. Snorkel in the turquoise lagoon below." },
      { day: 7, title: "Return to Sorong", description: "Morning dive, farewell breakfast, return transit to Sorong." },
    ],
    conservation: "Aliikai routes 5% of every BluePass booking to the Raja Ampat Blue Water Trust — community reef patrols and coral nursery support across West Papua.",
    images: {
      card: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1200&q=80", alt: "Aliikai at sea" },
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80", alt: "Raja Ampat coastline" },
        { src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80", alt: "Diver underwater" },
        { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80", alt: "Tropical bay" },
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", alt: "Island anchorage" },
      ],
    },
  },

  // ─── 03 · ALILA PURNAMA ─────────────────────────────────────────────────────
  {
    slug: "alila-purnama",
    name: "Alila Purnama",
    firstName: "Alila",
    locationBadge: "KOMODO",
    region: "Komodo National Park",
    tier: "Flagship",
    maxGuests: 10,
    length: "40 m",
    cabins: 5,
    build: "Traditional phinisi",
    pricePerCabin: "$3,000",
    charterPrice: "$15,000",
    charterOnly: false,
    tagline: null,
    about:
      "Alila Purnama is Komodo's most recognised luxury phinisi — a 40-metre vessel with five suites, a spa, and a dedicated dive deck with compressor. Built from ironwood in South Sulawesi and refitted in 2021, it runs both Komodo and Alor itineraries with a ratio of two crew to every guest.",
    departures: [
      { dates: "Jul 12 — Jul 19", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 13 — Sep 20", duration: "7 nights", berths: "10 berths" },
      { dates: "Oct 11 — Oct 18", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: [
      { day: 1, title: "Labuan Bajo embarkation", description: "Welcome champagne. Briefing and check-in dive at Sebayur." },
      { day: 2, title: "Batu Bolong", description: "Komodo's signature current site. Three dives, grey reef sharks." },
      { day: 3, title: "Manta Alley", description: "Dedicated manta session in the morning. Pink Beach in the afternoon." },
      { day: 4, title: "Komodo Dragon walk", description: "Private ranger hike on Rinca. Sunset anchorage at Kalong." },
      { day: 5, title: "Crystal Rock", description: "Drift dive through the channel. Schooling jacks and white-tips." },
      { day: 6, title: "Cannibal Rock", description: "Macro dive on the famous pinnacle. Afternoon snorkel at Horseshoe Bay." },
      { day: 7, title: "Return & disembark", description: "Final dive at Sebayur. Late breakfast, disembark in Labuan Bajo." },
    ],
    conservation: "Alila Purnama routes 5% of every BluePass booking to BluePass Conservation partners across Komodo and the Coral Triangle.",
    images: {
      card: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80", alt: "Alila Purnama at anchor near the Komodo islands" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Deck view at sea" },
        { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", alt: "Reef dive in Komodo" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Pink Beach at sunrise" },
        { src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80", alt: "Komodo National Park waters" },
      ],
    },
  },

  // ─── 04 · AMANDIRA ──────────────────────────────────────────────────────────
  {
    slug: "amandira",
    name: "Amandira",
    firstName: "Amandira",
    locationBadge: "RAJA AMPAT",
    region: "Raja Ampat · West Papua",
    tier: "Explorer",
    maxGuests: 10,
    length: "45 m",
    cabins: 5,
    build: "Indonesian phinisi",
    pricePerCabin: "$3,190",
    charterPrice: "$15,500",
    charterOnly: false,
    tagline: null,
    about:
      "Amandira is Aman's private charter phinisi — a 45-metre vessel moored permanently in Raja Ampat. Chartering as a whole vessel for up to ten guests, it covers Misool, the Dampier Strait, and private-access zones in the Bird's Head Seascape that are closed to standard liveaboards.",
    departures: [
      { dates: "Jul 19 — Jul 26", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 16 — Aug 23", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 20 — Sep 27", duration: "7 nights", berths: "10 berths" },
      { dates: "Oct 18 — Oct 25", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: [
      { day: 1, title: "Sorong embarkation", description: "Private transfer to the vessel. Welcome brief and afternoon snorkel." },
      { day: 2, title: "Cape Kri", description: "World-record reef fish count site. Three dives in the Dampier current." },
      { day: 3, title: "Manta Sandy", description: "Manta cleaning station. Afternoon at the Arborek village." },
      { day: 4, title: "Private atoll transit", description: "Exclusive-access zone in the Bird's Head Seascape." },
      { day: 5, title: "Misool karst", description: "Underwater cave and arch systems. Pygmy seahorse briefing." },
      { day: 6, title: "Wayag lagoon", description: "Sunrise hike. Kayaking through the limestone karst." },
      { day: 7, title: "Return to Sorong", description: "Morning dive, farewell breakfast, private transfer to Sorong airport." },
    ],
    conservation: "Amandira routes 5% of every BluePass booking to the Raja Ampat Blue Water Trust and Coral Triangle Center.",
    images: {
      card: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", alt: "Amandira in a Raja Ampat bay" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Phinisi at sea" },
        { src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80", alt: "Raja Ampat dive" },
        { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80", alt: "Karst lagoon" },
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80", alt: "Island coastline from water" },
      ],
    },
  },

  // ─── 05 · ANNE BONNY ────────────────────────────────────────────────────────
  {
    slug: "anne-bonny",
    name: "Anne Bonny",
    firstName: "Anne",
    locationBadge: "KOMODO",
    region: "Komodo National Park",
    tier: "Explorer",
    maxGuests: 8,
    length: "30 m",
    cabins: 3,
    build: "Indonesian phinisi",
    pricePerCabin: "$1,483",
    charterPrice: "$4,450",
    charterOnly: true,
    tagline: null,
    about:
      "Anne Bonny is a 30-metre liveaboard yacht with 3 cabins for up to 8 guests. Cruises Komodo waters with seasonal Raja Ampat itineraries. Whole-yacht private charter only. Accessible adventure tier — premium dive operation without flagship pricing.",
    departures: [
      { dates: "Sep 12 — Sep 19", duration: "7 nights", berths: "8 berths" },
      { dates: "Oct 10 — Oct 17", duration: "7 nights", berths: "8 berths" },
      { dates: "Oct 31 — Nov 7", duration: "7 nights", berths: "8 berths" },
      { dates: "Nov 28 — Dec 5", duration: "7 nights", berths: "8 berths" },
      { dates: "Dec 26 — Jan 2", duration: "7 nights", berths: "8 berths" },
    ],
    itinerary: [
      { day: 1, title: "Labuan Bajo embarkation", description: "Board mid-afternoon. Welcome briefing, check-in dive at Sebayur." },
      { day: 2, title: "Sangeang Volcano", description: "Two morning dives at Hot Rocks (black sand, ribbon eels). Cruise south overnight." },
      { day: 3, title: "Castle Rock & Crystal Rock", description: "Drift dives, schooling jacks, white-tips. Manta Alley in the afternoon." },
      { day: 4, title: "Komodo Dragon walk", description: "Morning hike on Rinca. Afternoon dive at Karang Makassar (manta cleaning)." },
      { day: 5, title: "Batu Bolong & Pink Beach", description: "Iconic vertical wall. Beach BBQ. Sunset dive if conditions allow." },
      { day: 6, title: "Southern Komodo", description: "Three dives — Cannibal Rock, Yellow Wall of Texas. Macro-rich, slower current." },
      { day: 7, title: "Wainilu & disembark", description: "One final morning dive. Cruise back to Labuan Bajo, disembark after lunch." },
    ],
    conservation: "Anne Bonny routes 5% of every BluePass booking to BluePass Conservation partners: Coral Triangle Center (reef restoration), Mangrove Action Project (coastal nurseries), and The Manta Trust (research + protection in Komodo and Raja Ampat).",
    images: {
      card: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80", alt: "Anne Bonny sailing in Komodo" },
        { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", alt: "Diver above reef" },
        { src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80", alt: "Komodo waters" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Pink Beach at sunrise" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Phinisi at anchor" },
      ],
    },
  },

  // ─── 06 · CALICO JACK ───────────────────────────────────────────────────────
  {
    slug: "calico-jack",
    name: "Calico Jack",
    firstName: "Jack",
    locationBadge: "KOMODO",
    region: "Komodo National Park",
    tier: "Explorer",
    maxGuests: 10,
    length: "28 m",
    cabins: 5,
    build: "Indonesian phinisi",
    pricePerCabin: "$3,200",
    charterPrice: "$46,000",
    charterOnly: false,
    tagline: null,
    about:
      "Calico Jack has operated out of Labuan Bajo since 2015, building a reputation for polished private charters across Komodo National Park. Every trip is run by the founding captain, who grew up in the Flores islands and knows the park's tidal windows and reef conditions better than any itinerary could capture.",
    departures: [
      { dates: "Jul 14 — Jul 21", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 11 — Aug 18", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "10 berths" },
      { dates: "Oct 6 — Oct 13", duration: "7 nights", berths: "10 berths" },
      { dates: "Nov 3 — Nov 10", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: [
      { day: 1, title: "Labuan Bajo embarkation", description: "Board mid-afternoon. Welcome briefing, check-in dive at Sebayur." },
      { day: 2, title: "Batu Bolong & Crystal Rock", description: "Three dives at Komodo's most current-swept sites. Schooling jacks and white-tips." },
      { day: 3, title: "Pink Beach", description: "Morning dive at Manta Alley. Afternoon beach walk at Pink Beach. Sunset anchorage." },
      { day: 4, title: "Komodo Dragon walk", description: "Morning hike on Rinca with a park ranger. Afternoon dive at Karang Makassar." },
      { day: 5, title: "South Komodo", description: "Three dives — Cannibal Rock, Yellow Wall of Texas. Macro-rich, slower current." },
      { day: 6, title: "North Komodo passage", description: "Castle Rock and The Cauldron. Drift dive through the arch if conditions allow." },
      { day: 7, title: "Wainilu & disembark", description: "One final morning dive. Cruise back to Labuan Bajo, disembark after lunch." },
    ],
    conservation: "Calico Jack routes 5% of every BluePass booking to BluePass Conservation partners: Coral Triangle Center (reef restoration), Mangrove Action Project (coastal nurseries), and The Manta Trust.",
    images: {
      card: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1200&q=80", alt: "Calico Jack at anchor in Komodo National Park" },
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80", alt: "Island coastline" },
        { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", alt: "Diver above Komodo reef" },
        { src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80", alt: "Sunlit Komodo waters" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Tropical beach at sunset" },
      ],
    },
  },

  // ─── 07 · CARPE DIEM ────────────────────────────────────────────────────────
  {
    slug: "carpe-diem",
    name: "Carpe Diem",
    firstName: "Carpe Diem",
    locationBadge: "RAJA AMPAT",
    region: "Raja Ampat · West Papua",
    tier: "Explorer",
    maxGuests: 12,
    length: "32 m",
    cabins: 6,
    build: "Indonesian phinisi",
    pricePerCabin: "$885",
    charterPrice: "$8,580",
    charterOnly: false,
    tagline: null,
    about:
      "Carpe Diem is a 32-metre phinisi running Raja Ampat and Komodo circuits with six shared cabins and an experienced local dive team. A mid-range flagship-experience vessel — strong photography light conditions, knowledgeable guides, and flexible routing that follows currents rather than a fixed schedule.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 2 — Aug 9", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "12 berths" },
      { dates: "Oct 4 — Oct 11", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: [
      { day: 1, title: "Sorong embarkation", description: "Board in Sorong. Evening passage toward Cape Kri." },
      { day: 2, title: "Cape Kri", description: "World-record fish count site. Schooling barracuda and fusiliers." },
      { day: 3, title: "Arborek", description: "Village jetty dive. Manta cleaning station in the afternoon." },
      { day: 4, title: "Blue Magic", description: "Current dive on the seamount. Wobbegong sharks and walking fish." },
      { day: 5, title: "Misool", description: "Karst cave systems and mushroom corals. UNESCO heritage site." },
      { day: 6, title: "Wayag", description: "Sunrise hike to the viewpoint. Snorkel in the jade lagoon." },
      { day: 7, title: "Return to Sorong", description: "Morning dive, pack and disembark in Sorong." },
    ],
    conservation: "Carpe Diem routes 5% of every BluePass booking to the Raja Ampat Blue Water Trust.",
    images: {
      card: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", alt: "Carpe Diem at dusk" },
        { src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80", alt: "Raja Ampat anchorage" },
        { src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80", alt: "Diver underwater" },
        { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80", alt: "Lagoon at low tide" },
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80", alt: "Island coastline" },
      ],
    },
  },

  // ─── 08 · CELESTIA ──────────────────────────────────────────────────────────
  {
    slug: "celestia",
    name: "Celestia",
    firstName: "Celestia",
    locationBadge: "KOMODO",
    region: "Komodo National Park",
    tier: "Explorer",
    maxGuests: 14,
    length: "38 m",
    cabins: 7,
    build: "Indonesian phinisi",
    pricePerCabin: "$1,643",
    charterPrice: null,
    charterOnly: false,
    tagline: null,
    about:
      "Celestia is a 38-metre phinisi based in Labuan Bajo, running 7-night Komodo expeditions for up to 14 guests. Built in 2019 with a modern air-conditioned saloon and a covered dive deck, it covers all the Komodo signature sites while staying approachable on price for groups who want the full park experience without flagship budgets.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 1 — Sep 8", duration: "7 nights", berths: "14 berths" },
      { dates: "Oct 6 — Oct 13", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: [
      { day: 1, title: "Labuan Bajo embarkation", description: "Check in and evening briefing. Night dive at Sebayur if conditions allow." },
      { day: 2, title: "Batu Bolong", description: "Komodo's signature wall. Grey reef sharks at the tip." },
      { day: 3, title: "Manta Alley & Pink Beach", description: "Two manta dives in the morning. Pink Beach walk after lunch." },
      { day: 4, title: "Rinca Dragon Walk", description: "Ranger trek on Rinca island. Afternoon dive at Karang Makassar." },
      { day: 5, title: "Crystal Rock", description: "Drift dive. Schools of fish, white-tips, and a macro reef section." },
      { day: 6, title: "Cannibal Rock", description: "Macro dive. Ghostpipe fish, ornate ghostpipe, and frogfish." },
      { day: 7, title: "Wainilu & disembark", description: "Final morning dive. Return to Labuan Bajo by noon." },
    ],
    conservation: "Celestia routes 5% of every BluePass booking to BluePass Conservation partners: Coral Triangle Center and Mangrove Action Project.",
    images: {
      card: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80", alt: "Celestia at anchor in Komodo" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Phinisi at sea" },
        { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", alt: "Reef dive" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Tropical anchorage" },
        { src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80", alt: "Komodo waters" },
      ],
    },
  },

  // ─── 09 · DUNIA BARU ────────────────────────────────────────────────────────
  {
    slug: "dunia-baru",
    name: "Dunia Baru",
    firstName: "Dunia Baru",
    locationBadge: "KOMODO",
    region: "Komodo National Park",
    tier: "Explorer",
    maxGuests: 14,
    length: "36 m",
    cabins: 7,
    build: "Traditional phinisi",
    pricePerCabin: "$2,857",
    charterPrice: "$20,000",
    charterOnly: false,
    tagline: null,
    about:
      "Dunia Baru is a traditionally built phinisi running high-season Komodo circuits from June to November and Alor expeditions in shoulder months. Seven cabins, a spacious upper deck, and a camera wash station for photographers.",
    departures: [
      { dates: "Jul 21 — Jul 28", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 18 — Aug 25", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 22 — Sep 29", duration: "7 nights", berths: "14 berths" },
      { dates: "Oct 20 — Oct 27", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: [
      { day: 1, title: "Labuan Bajo embarkation", description: "Welcome aboard. Afternoon briefing and sunset snorkel." },
      { day: 2, title: "Batu Bolong", description: "Signature Komodo current site. Three dives with the guide team." },
      { day: 3, title: "Crystal Rock", description: "Drift dive. Sharks and schooling fish in the pass." },
      { day: 4, title: "Rinca island", description: "Dragon walk with a ranger. Evening BBQ on deck." },
      { day: 5, title: "Manta Alley", description: "Multiple manta encounters at the cleaning station." },
      { day: 6, title: "Cannibal Rock", description: "Macro specialist site. Ghost pipefish and pygmy seahorses." },
      { day: 7, title: "Wainilu & disembark", description: "Morning dive, breakfast, disembark at Labuan Bajo." },
    ],
    conservation: "Dunia Baru routes 5% of every BluePass booking to BluePass Conservation partners.",
    images: {
      card: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80", alt: "Dunia Baru at anchor" },
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80", alt: "Island coastline" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Phinisi at sea" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Sunset anchorage" },
        { src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80", alt: "Coastal scenery" },
      ],
    },
  },

  // ─── 10 · FENIDES ───────────────────────────────────────────────────────────
  {
    slug: "fenides",
    name: "Fenides",
    firstName: "Fenides",
    locationBadge: "RAJA AMPAT",
    region: "Raja Ampat · West Papua",
    tier: "Foundation",
    maxGuests: 11,
    length: "30 m",
    cabins: 5,
    build: "Indonesian phinisi",
    pricePerCabin: "$815",
    charterPrice: "$8,580",
    charterOnly: false,
    tagline: null,
    about:
      "Fenides is a compact Raja Ampat phinisi ideal for groups looking for value without sacrificing access. Five cabins, a reliable dive team, and a route calendar that prioritises current conditions over a fixed schedule.",
    departures: [
      { dates: "Jul 12 — Jul 19", duration: "7 nights", berths: "11 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "11 berths" },
      { dates: "Sep 13 — Sep 20", duration: "7 nights", berths: "11 berths" },
      { dates: "Oct 11 — Oct 18", duration: "7 nights", berths: "11 berths" },
    ],
    itinerary: [
      { day: 1, title: "Sorong embarkation", description: "Board and depart for the northern reef systems." },
      { day: 2, title: "Cape Kri", description: "Three dives on the world-record reef." },
      { day: 3, title: "Manta Sandy", description: "Manta cleaning station. Village visit in the afternoon." },
      { day: 4, title: "Blue Magic seamount", description: "Current dive with wobbegong sharks." },
      { day: 5, title: "Misool", description: "Karst caves and macro-rich walls." },
      { day: 6, title: "Wayag", description: "Viewpoint hike and lagoon snorkel." },
      { day: 7, title: "Return to Sorong", description: "Morning dive and disembark." },
    ],
    conservation: "Fenides routes 5% of every BluePass booking to the Raja Ampat Blue Water Trust.",
    images: {
      card: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", alt: "Fenides at anchor in Raja Ampat" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Tropical bay" },
        { src: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80", alt: "Reef dive" },
        { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80", alt: "Lagoon scene" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Phinisi under sail" },
      ],
    },
  },

  // ─── 11 · JAKARE ────────────────────────────────────────────────────────────
  {
    slug: "jakare",
    name: "Jakare",
    firstName: "Jakare",
    locationBadge: "KOMODO",
    region: "Komodo National Park",
    tier: "Foundation",
    maxGuests: 14,
    length: "34 m",
    cabins: 7,
    build: "Indonesian phinisi",
    pricePerCabin: "$980",
    charterPrice: "$4,900",
    charterOnly: false,
    tagline: null,
    about:
      "Jakare is a 34-metre Komodo liveaboard with seven cabins, running consistent 7-night circuits of the national park since 2016. A reliable, well-maintained vessel with an experienced local crew that has dived every site in the park across multiple seasons.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 11 — Aug 18", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "14 berths" },
      { dates: "Oct 13 — Oct 20", duration: "7 nights", berths: "14 berths" },
      { dates: "Nov 10 — Nov 17", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: [
      { day: 1, title: "Labuan Bajo embarkation", description: "Welcome briefing. Check-in dive at Sebayur." },
      { day: 2, title: "Batu Bolong", description: "Current dive on Komodo's signature wall." },
      { day: 3, title: "Manta Alley", description: "Two dedicated manta sessions. Pink Beach in the afternoon." },
      { day: 4, title: "Rinca island", description: "Dragon walk with ranger. Afternoon at Karang Makassar." },
      { day: 5, title: "Crystal Rock", description: "Drift dive. White-tips and schooling fish." },
      { day: 6, title: "Cannibal Rock", description: "Macro dive with ghost pipefish and frogfish." },
      { day: 7, title: "Wainilu & disembark", description: "Final dive and disembark at Labuan Bajo." },
    ],
    conservation: "Jakare routes 5% of every BluePass booking to BluePass Conservation partners.",
    images: {
      card: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=1200&q=80", alt: "Jakare at anchor" },
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80", alt: "Komodo island coastline" },
        { src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80", alt: "Dive site" },
        { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80", alt: "Tropical sunset" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Phinisi at sea" },
      ],
    },
  },

  // ─── 12 · JELAJAHI LAUT ─────────────────────────────────────────────────────
  {
    slug: "jelajahi-laut",
    name: "Jelajahi Laut",
    firstName: "Jelajahi",
    locationBadge: "RAJA AMPAT",
    region: "Raja Ampat · West Papua",
    tier: "Explorer",
    maxGuests: 12,
    length: "33 m",
    cabins: 6,
    build: "Indonesian phinisi",
    pricePerCabin: "$2,500",
    charterPrice: "$4,900",
    charterOnly: false,
    tagline: null,
    about:
      "Jelajahi Laut — 'Explore the Sea' — is a 33-metre Raja Ampat phinisi focused on longer itineraries that combine the Dampier Strait, Misool, and the remote northern sites around Kawe and Fam islands. Six cabins, a covered upper deck, and a tight dive crew that knows the less-dived corners of the Bird's Head Seascape.",
    departures: [
      { dates: "Jul 19 — Jul 26", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 16 — Aug 23", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 20 — Sep 27", duration: "7 nights", berths: "12 berths" },
      { dates: "Oct 18 — Oct 25", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: [
      { day: 1, title: "Sorong embarkation", description: "Board and depart north toward Kawe island." },
      { day: 2, title: "Fam islands", description: "Remote reef dives north of the main circuit. Little boat traffic." },
      { day: 3, title: "Cape Kri", description: "Record reef density. Schooling barracuda in the current." },
      { day: 4, title: "Manta Sandy", description: "Cleaning station dives. Village visit." },
      { day: 5, title: "Misool karst", description: "Cave and arch dives through the limestone." },
      { day: 6, title: "Wayag", description: "Lagoon snorkel and viewpoint hike." },
      { day: 7, title: "Return to Sorong", description: "Morning dive, breakfast, disembark." },
    ],
    conservation: "Jelajahi Laut routes 5% of every BluePass booking to the Raja Ampat Blue Water Trust.",
    images: {
      card: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
      hero: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2200&q=82",
      gallery: [
        { src: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80", alt: "Jelajahi Laut in Raja Ampat" },
        { src: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80", alt: "Phinisi at sea" },
        { src: "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=800&q=80", alt: "Dive site" },
        { src: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80", alt: "Remote anchorage" },
        { src: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=800&q=80", alt: "Karst lagoon" },
      ],
    },
  },
];

/** Quick lookup by slug */
export const yachtBySlug = Object.fromEntries(
  yachts.map((y) => [y.slug, y])
) as Record<string, Yacht>;
