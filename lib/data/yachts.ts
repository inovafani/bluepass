/**
 * ─── YACHT DATA ──────────────────────────────────────────────────────────────
 *
 * Single source of truth for all 36 yacht/operator profiles.
 * Used by: explore-indonesia grid · for-operators fleet browser · yachts/[slug] detail pages.
 *
 * HOW TO UPDATE IMAGES
 * ─────────────────────
 * Find the yacht by name, then edit its `images` block:
 *
 *   card    → thumbnail shown on grid cards
 *   hero    → full-bleed background on the detail page
 *   gallery → up to 5 photos in the detail page gallery
 *             (first image is displayed large/tall on the left)
 *
 * Swap any URL. To use a local file put it in /public/yachts/<slug>/
 * and reference it as "/yachts/<slug>/hero.jpg".
 */

export type YachtImages = {
  /** Grid card thumbnail */
  card: string;
  /** Full-bleed hero on detail page */
  hero: string;
  /** Gallery photos — first image is displayed large */
  gallery: { src: string; alt: string }[];
};

export type Departure = { dates: string; duration: string; berths: string };
export type ItineraryDay = { day: number; title: string; description: string };

export type Yacht = {
  slug: string;
  name: string;
  /** Used in "+ Plan with [firstName]" CTA */
  firstName: string;
  /** Uppercase label on cards: "KOMODO" | "RAJA AMPAT" */
  locationBadge: string;
  /** Filter value: "Komodo" | "Raja Ampat" */
  region: "Komodo" | "Raja Ampat";
  /** Tier badge on cards: "Explorer" | "Premium" | "Legend" | "" */
  tier: string;
  /** Whether cabin-by-cabin booking is available (vs whole-yacht only) */
  cabinBookable: boolean;
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

// ─── Shared itinerary templates (Komodo / Raja Ampat 7-day) ──────────────────

const KOMODO_7: ItineraryDay[] = [
  { day: 1, title: "Labuan Bajo embarkation", description: "Board mid-afternoon. Welcome briefing, check-in dive at Sebayur." },
  { day: 2, title: "Sangeang Volcano", description: "Dives at Hot Rocks (black sand, ribbon eels). Cruise south overnight." },
  { day: 3, title: "Castle Rock & Crystal Rock", description: "Drift dives, schooling jacks, white-tips. Manta Alley in the afternoon." },
  { day: 4, title: "Komodo Dragon walk", description: "Morning hike on Rinca. Afternoon dive at Karang Makassar (manta cleaning)." },
  { day: 5, title: "Batu Bolong & Pink Beach", description: "Iconic vertical wall. Beach BBQ. Sunset dive if conditions allow." },
  { day: 6, title: "Southern Komodo", description: "Three dives — Cannibal Rock, Yellow Wall of Texas. Macro-rich, slower current." },
  { day: 7, title: "Wainilu & disembark", description: "One final morning dive. Cruise back to Labuan Bajo, disembark after lunch." },
];

const RAJA_AMPAT_7: ItineraryDay[] = [
  { day: 1, title: "Sorong embarkation", description: "Board in Sorong. Evening passage toward the Dampier Strait." },
  { day: 2, title: "Cape Kri", description: "World fish-count record site. Three dives, schooling barracuda and fusiliers." },
  { day: 3, title: "Arborek & Manta Sandy", description: "Village snorkel in the morning. Manta cleaning station in the afternoon." },
  { day: 4, title: "Blue Magic seamount", description: "Current dive with wobbegong sharks and walking fish." },
  { day: 5, title: "Misool karst", description: "Cave and arch systems, pygmy seahorse, mushroom corals." },
  { day: 6, title: "Wayag", description: "Sunrise hike to the viewpoint. Kayaking through the karst lagoon." },
  { day: 7, title: "Return to Sorong", description: "Morning dive, farewell breakfast, disembark in Sorong." },
];

const KOMODO_CONSERVATION = "Routes 5% of every BluePass booking to BluePass Conservation partners: Coral Triangle Center (reef restoration), Mangrove Action Project (coastal nurseries), and The Manta Trust (research + protection in Komodo).";
const RAJA_CONSERVATION = "Routes 5% of every BluePass booking to the Raja Ampat Blue Water Trust (community reef patrols and coral nursery support) and Coral Triangle Center.";

// ─── Unsplash image pool ─────────────────────────────────────────────────────
// To replace with real photos: swap any URL below or use a local /public path.
const IMG = {
  sail:    "https://images.unsplash.com/photo-1519420573924-65fcd45245f8",
  phinisi: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13",
  coast:   "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57",
  island:  "https://images.unsplash.com/photo-1519046904884-53103b34b206",
  boat:    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  diver:   "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c",
  beach:   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
  bay:     "https://images.unsplash.com/photo-1500375592092-40eb2168fd21",
  reef:    "https://images.unsplash.com/photo-1544551763-46a013bb70d5",
  water:   "https://images.unsplash.com/photo-1500673922987-e212871fec22",
};

function img(id: string, w = 800) {
  return `${id}?auto=format&fit=crop&w=${w}&q=80`;
}

function heroImg(id: string) {
  return `${id}?auto=format&fit=crop&w=2200&q=82`;
}

function gallery(primary: string, ...rest: string[]) {
  const imgs = [primary, ...rest];
  return imgs.map((id, i) => ({ src: img(id, i === 0 ? 1200 : 800), alt: "" }));
}

// ─── All 36 yachts ───────────────────────────────────────────────────────────

export const yachts: Yacht[] = [

  // ─── 01 · ALEXA ─────────────────────────────────────────────────────────────
  {
    slug: "alexa", name: "Alexa", firstName: "Alexa",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "", cabinBookable: false,
    maxGuests: 2, length: "22 m", cabins: 1, build: "Custom fusion yacht",
    pricePerCabin: "$6,499", charterPrice: null, charterOnly: true,
    tagline: "Couples-only fusion yacht",
    about: "Alexa is a couples-only private yacht built for two — one master suite, a private dive tender, and a chef who works to the couple's menu before departure. No shared decks, no group schedules. Routes cover Komodo's quieter sites away from the main traffic.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "2 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "2 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "2 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Alexa ${KOMODO_CONSERVATION}`,
    images: {
      // ─── UPDATE IMAGES HERE ──────────────────────────────────────────────────
      card: img(IMG.sail),
      hero: heroImg(IMG.sail),
      gallery: gallery(IMG.sail, IMG.bay, IMG.beach, IMG.reef, IMG.water),
      // ─────────────────────────────────────────────────────────────────────────
    },
  },

  // ─── 02 · ALIIKAI ───────────────────────────────────────────────────────────
  {
    slug: "aliikai", name: "Aliikai", firstName: "Aliikai",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Premium", cabinBookable: true,
    maxGuests: 15, length: "35 m", cabins: 7, build: "Indonesian phinisi",
    pricePerCabin: "$690", charterPrice: "$8,900", charterOnly: false,
    tagline: null,
    about: "Aliikai is a 35-metre Raja Ampat phinisi with seven cabins and a reputation for some of the best dive guiding in West Papua. Running year-round routes across Misool, Dampier Strait, and the Wayag islands.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "15 berths" },
      { dates: "Aug 2 — Aug 9", duration: "7 nights", berths: "15 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "15 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Aliikai ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.phinisi),
      hero: heroImg(IMG.phinisi),
      gallery: gallery(IMG.phinisi, IMG.coast, IMG.diver, IMG.bay, IMG.boat),
    },
  },

  // ─── 03 · ALILA PURNAMA ─────────────────────────────────────────────────────
  {
    slug: "alila-purnama", name: "Alila Purnama", firstName: "Alila",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Legend", cabinBookable: false,
    maxGuests: 10, length: "46 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$3,000", charterPrice: "$15,000", charterOnly: true,
    tagline: null,
    about: "Alila Purnama is a 46-metre phinisi with five suites, a spa, and a dedicated dive deck. Built from ironwood in South Sulawesi and refitted in 2021. Legend tier — flagship Indonesian phinisi-class yacht with concierge service and multiple decks.",
    departures: [
      { dates: "Sep 5 — Sep 12", duration: "7 nights", berths: "10 berths" },
      { dates: "Oct 3 — Oct 10", duration: "7 nights", berths: "10 berths" },
      { dates: "Oct 31 — Nov 7", duration: "7 nights", berths: "10 berths" },
      { dates: "Nov 28 — Dec 5", duration: "7 nights", berths: "10 berths" },
      { dates: "Dec 26 — Jan 2", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Alila Purnama ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.coast),
      hero: heroImg(IMG.coast),
      gallery: gallery(IMG.coast, IMG.phinisi, IMG.reef, IMG.beach, IMG.water),
    },
  },

  // ─── 04 · AMANDIRA ──────────────────────────────────────────────────────────
  {
    slug: "amandira", name: "Amandira", firstName: "Amandira",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "", cabinBookable: false,
    maxGuests: 10, length: "45 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$3,190", charterPrice: "$15,500", charterOnly: false,
    tagline: null,
    about: "Amandira is Aman's private charter phinisi — 45 metres moored permanently in Raja Ampat. Whole-vessel charters for up to ten guests, covering Misool, the Dampier Strait, and private-access zones in the Bird's Head Seascape.",
    departures: [
      { dates: "Jul 19 — Jul 26", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 16 — Aug 23", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 20 — Sep 27", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Amandira ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.island),
      hero: heroImg(IMG.island),
      gallery: gallery(IMG.island, IMG.phinisi, IMG.diver, IMG.bay, IMG.coast),
    },
  },

  // ─── 05 · ANNE BONNY ────────────────────────────────────────────────────────
  {
    slug: "anne-bonny", name: "Anne Bonny", firstName: "Anne",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Explorer", cabinBookable: false,
    maxGuests: 8, length: "30 m", cabins: 3, build: "Indonesian phinisi",
    pricePerCabin: "$1,483", charterPrice: "$4,450", charterOnly: true,
    tagline: null,
    about: "Anne Bonny is a 30-metre liveaboard yacht with 3 cabins for up to 8 guests. Cruises Komodo waters with seasonal Raja Ampat itineraries. Whole-yacht private charter only. Accessible adventure tier — premium dive operation without flagship pricing.",
    departures: [
      { dates: "Sep 12 — Sep 19", duration: "7 nights", berths: "8 berths" },
      { dates: "Oct 10 — Oct 17", duration: "7 nights", berths: "8 berths" },
      { dates: "Oct 31 — Nov 7", duration: "7 nights", berths: "8 berths" },
      { dates: "Nov 28 — Dec 5", duration: "7 nights", berths: "8 berths" },
      { dates: "Dec 26 — Jan 2", duration: "7 nights", berths: "8 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Anne Bonny ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.boat),
      hero: heroImg(IMG.boat),
      gallery: gallery(IMG.boat, IMG.reef, IMG.water, IMG.beach, IMG.phinisi),
    },
  },

  // ─── 06 · CALICO JACK ───────────────────────────────────────────────────────
  {
    slug: "calico-jack", name: "Calico Jack", firstName: "Jack",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: true,
    maxGuests: 10, length: "28 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$3,200", charterPrice: "$46,000", charterOnly: false,
    tagline: null,
    about: "Calico Jack has operated out of Labuan Bajo since 2015, building a reputation for polished private charters across Komodo National Park. Every trip is run by the founding captain who grew up in the Flores islands.",
    departures: [
      { dates: "Jul 14 — Jul 21", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 11 — Aug 18", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Calico Jack ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.diver),
      hero: heroImg(IMG.diver),
      gallery: gallery(IMG.diver, IMG.coast, IMG.reef, IMG.water, IMG.beach),
    },
  },

  // ─── 07 · CARPE DIEM ────────────────────────────────────────────────────────
  {
    slug: "carpe-diem", name: "Carpe Diem", firstName: "Carpe Diem",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Explorer", cabinBookable: false,
    maxGuests: 12, length: "34 m", cabins: 6, build: "Indonesian phinisi",
    pricePerCabin: "$885", charterPrice: "$8,580", charterOnly: false,
    tagline: null,
    about: "Carpe Diem is a mid-range Raja Ampat phinisi with strong photography light conditions, knowledgeable guides, and flexible routing that follows currents rather than a fixed schedule.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 2 — Aug 9", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Carpe Diem ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.beach),
      hero: heroImg(IMG.beach),
      gallery: gallery(IMG.beach, IMG.island, IMG.diver, IMG.bay, IMG.coast),
    },
  },

  // ─── 08 · CELESTIA ──────────────────────────────────────────────────────────
  {
    slug: "celestia", name: "Celestia", firstName: "Celestia",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "", cabinBookable: false,
    maxGuests: 14, length: "38 m", cabins: 7, build: "Indonesian phinisi",
    pricePerCabin: "$1,643", charterPrice: null, charterOnly: false,
    tagline: null,
    about: "Celestia is a 38-metre phinisi based in Labuan Bajo running 7-night Komodo expeditions for up to 14 guests. Modern air-conditioned saloon and a covered dive deck covering all signature Komodo sites.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 1 — Sep 8", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Celestia ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.bay),
      hero: heroImg(IMG.bay),
      gallery: gallery(IMG.bay, IMG.phinisi, IMG.reef, IMG.beach, IMG.water),
    },
  },

  // ─── 09 · DUNIA BARU ────────────────────────────────────────────────────────
  {
    slug: "dunia-baru", name: "Dunia Baru", firstName: "Dunia Baru",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Legend", cabinBookable: false,
    maxGuests: 14, length: "36 m", cabins: 7, build: "Traditional phinisi",
    pricePerCabin: "$2,857", charterPrice: "$20,000", charterOnly: false,
    tagline: null,
    about: "Dunia Baru is a traditionally built phinisi running high-season Komodo circuits. Seven cabins, a spacious upper deck, and a camera wash station for photographers.",
    departures: [
      { dates: "Jul 21 — Jul 28", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 18 — Aug 25", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 22 — Sep 29", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Dunia Baru ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.reef),
      hero: heroImg(IMG.reef),
      gallery: gallery(IMG.reef, IMG.coast, IMG.phinisi, IMG.beach, IMG.boat),
    },
  },

  // ─── 10 · FENIDES ───────────────────────────────────────────────────────────
  {
    slug: "fenides", name: "Fenides", firstName: "Fenides",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Premium", cabinBookable: true,
    maxGuests: 11, length: "41 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$815", charterPrice: "$8,580", charterOnly: false,
    tagline: null,
    about: "Fenides is a compact Raja Ampat phinisi ideal for groups looking for value without sacrificing access. Five cabins, a reliable dive team, and a route calendar that prioritises current conditions.",
    departures: [
      { dates: "Jul 12 — Jul 19", duration: "7 nights", berths: "11 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "11 berths" },
      { dates: "Sep 13 — Sep 20", duration: "7 nights", berths: "11 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Fenides ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.island),
      hero: heroImg(IMG.island),
      gallery: gallery(IMG.island, IMG.beach, IMG.reef, IMG.bay, IMG.phinisi),
    },
  },

  // ─── 11 · JAKARE ────────────────────────────────────────────────────────────
  {
    slug: "jakare", name: "Jakare", firstName: "Jakare",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Explorer", cabinBookable: false,
    maxGuests: 14, length: "30 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$980", charterPrice: "$4,900", charterOnly: false,
    tagline: null,
    about: "Jakare is a 30-metre Komodo liveaboard with five cabins, running consistent 7-night circuits of the national park since 2016. An experienced local crew that has dived every site across multiple seasons.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 11 — Aug 18", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Jakare ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.water),
      hero: heroImg(IMG.water),
      gallery: gallery(IMG.water, IMG.coast, IMG.diver, IMG.beach, IMG.phinisi),
    },
  },

  // ─── 12 · JELAJAHI LAUT ─────────────────────────────────────────────────────
  {
    slug: "jelajahi-laut", name: "Jelajahi Laut", firstName: "Jelajahi",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Explorer", cabinBookable: true,
    maxGuests: 12, length: "33 m", cabins: 6, build: "Indonesian phinisi",
    pricePerCabin: "$2,500", charterPrice: "$4,900", charterOnly: false,
    tagline: null,
    about: "Jelajahi Laut — 'Explore the Sea' — is a Raja Ampat phinisi focused on longer itineraries covering the Dampier Strait, Misool, and the remote northern sites around Kawe and Fam islands.",
    departures: [
      { dates: "Jul 19 — Jul 26", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 16 — Aug 23", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 20 — Sep 27", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Jelajahi Laut ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.coast),
      hero: heroImg(IMG.coast),
      gallery: gallery(IMG.coast, IMG.phinisi, IMG.diver, IMG.island, IMG.bay),
    },
  },

  // ─── 13 · KATHARINA ─────────────────────────────────────────────────────────
  {
    slug: "katharina", name: "Katharina", firstName: "Katharina",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: false,
    maxGuests: 12, length: "55 m", cabins: 6, build: "Indonesian phinisi",
    pricePerCabin: "$887", charterPrice: "$4,250", charterOnly: false,
    tagline: null,
    about: "Katharina is a 55-metre Premium Komodo liveaboard with six spacious cabins and a wide dive deck. Known for its attentive service and knowledgeable guide team covering all of Komodo's signature sites.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 13 — Sep 20", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Katharina ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.phinisi),
      hero: heroImg(IMG.phinisi),
      gallery: gallery(IMG.phinisi, IMG.coast, IMG.reef, IMG.water, IMG.beach),
    },
  },

  // ─── 14 · KUDANIL EXPLORER ──────────────────────────────────────────────────
  {
    slug: "kudanil-explorer", name: "Kudanil Explorer", firstName: "Kudanil",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Legend", cabinBookable: false,
    maxGuests: 16, length: "50 m", cabins: 7, build: "Traditional phinisi",
    pricePerCabin: "$3,331", charterPrice: "$25,250", charterOnly: false,
    tagline: null,
    about: "Kudanil Explorer is a 50-metre Legend-tier phinisi running premium Raja Ampat expeditions. Seven en-suite cabins, two dive decks, and a dedicated macro photography guide on every trip.",
    departures: [
      { dates: "Jul 12 — Jul 19", duration: "7 nights", berths: "16 berths" },
      { dates: "Aug 16 — Aug 23", duration: "7 nights", berths: "16 berths" },
      { dates: "Sep 20 — Sep 27", duration: "7 nights", berths: "16 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Kudanil Explorer ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.island),
      hero: heroImg(IMG.island),
      gallery: gallery(IMG.island, IMG.bay, IMG.diver, IMG.beach, IMG.water),
    },
  },

  // ─── 15 · LAMIMA ────────────────────────────────────────────────────────────
  {
    slug: "lamima", name: "Lamima", firstName: "Lamima",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "", cabinBookable: false,
    maxGuests: 14, length: "60 m", cabins: 7, build: "Traditional phinisi",
    pricePerCabin: "$3,571", charterPrice: "$25,000", charterOnly: false,
    tagline: null,
    about: "Lamima is one of Indonesia's largest traditionally-built wooden phinisi at 60 metres. Seven spacious cabins, a large open deck, and itineraries that cover both Komodo and the Banda Sea.",
    departures: [
      { dates: "Jul 21 — Jul 28", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 25 — Sep 1", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 22 — Sep 29", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Lamima ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.boat),
      hero: heroImg(IMG.boat),
      gallery: gallery(IMG.boat, IMG.phinisi, IMG.coast, IMG.beach, IMG.reef),
    },
  },

  // ─── 16 · MAJIK ─────────────────────────────────────────────────────────────
  {
    slug: "majik", name: "Majik", firstName: "Majik",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "", cabinBookable: false,
    maxGuests: 8, length: "50 m", cabins: 4, build: "Indonesian phinisi",
    pricePerCabin: "$1,425", charterPrice: "$5,700", charterOnly: false,
    tagline: null,
    about: "Majik is a sleek 50-metre phinisi with four oversized cabins for small groups wanting privacy and space in Raja Ampat. Intimate feel on a large vessel with a personal crew-to-guest ratio.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "8 berths" },
      { dates: "Aug 2 — Aug 9", duration: "7 nights", berths: "8 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "8 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Majik ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.sail),
      hero: heroImg(IMG.sail),
      gallery: gallery(IMG.sail, IMG.bay, IMG.island, IMG.reef, IMG.diver),
    },
  },

  // ─── 17 · MISCHIEF ──────────────────────────────────────────────────────────
  {
    slug: "mischief", name: "Mischief", firstName: "Mischief",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: false,
    maxGuests: 6, length: "50 m", cabins: 3, build: "Indonesian phinisi",
    pricePerCabin: "$2,667", charterPrice: "$8,000", charterOnly: false,
    tagline: null,
    about: "Mischief is a Premium Komodo phinisi built for small groups who want space and quality. Three large en-suite cabins, a private dive platform, and a route that avoids crowded anchorages.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "6 berths" },
      { dates: "Aug 11 — Aug 18", duration: "7 nights", berths: "6 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "6 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Mischief ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.phinisi),
      hero: heroImg(IMG.phinisi),
      gallery: gallery(IMG.phinisi, IMG.water, IMG.reef, IMG.coast, IMG.beach),
    },
  },

  // ─── 18 · MUTIARA LAUT ──────────────────────────────────────────────────────
  {
    slug: "mutiara-laut", name: "Mutiara Laut", firstName: "Mutiara",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "", cabinBookable: false,
    maxGuests: 10, length: "40 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$1,929", charterPrice: "$13,500", charterOnly: false,
    tagline: null,
    about: "Mutiara Laut is a reliable Komodo liveaboard with a strong local crew and a well-maintained dive operation. Covers all national park sites on a 7-night circuit from Labuan Bajo.",
    departures: [
      { dates: "Jul 14 — Jul 21", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 18 — Aug 25", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 22 — Sep 29", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Mutiara Laut ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.coast),
      hero: heroImg(IMG.coast),
      gallery: gallery(IMG.coast, IMG.bay, IMG.reef, IMG.beach, IMG.water),
    },
  },

  // ─── 19 · OMBAK PUTIH ───────────────────────────────────────────────────────
  {
    slug: "ombak-putih", name: "Ombak Putih", firstName: "Ombak",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: true,
    maxGuests: 34, length: "42 m", cabins: 12, build: "Traditional tall ship",
    pricePerCabin: "$5,200", charterPrice: "$60,400", charterOnly: false,
    tagline: null,
    about: "Ombak Putih is a 42-metre traditional tall ship with 12 cabins — the largest cabin-bookable liveaboard in the BluePass fleet. Runs group expeditions through Komodo and beyond.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "34 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "34 berths" },
      { dates: "Sep 1 — Sep 8", duration: "7 nights", berths: "34 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Ombak Putih ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.boat),
      hero: heroImg(IMG.boat),
      gallery: gallery(IMG.boat, IMG.coast, IMG.reef, IMG.beach, IMG.water),
    },
  },

  // ─── 20 · ORACLE ────────────────────────────────────────────────────────────
  {
    slug: "oracle", name: "Oracle", firstName: "Oracle",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Explorer", cabinBookable: false,
    maxGuests: 5, length: "36 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$1,983", charterPrice: "$9,392", charterOnly: false,
    tagline: null,
    about: "Oracle is a compact Komodo phinisi with five private cabins for groups of up to five guests. Excellent guide-to-guest ratio and flexible daily scheduling based on conditions.",
    departures: [
      { dates: "Jul 21 — Jul 28", duration: "7 nights", berths: "5 berths" },
      { dates: "Aug 25 — Sep 1", duration: "7 nights", berths: "5 berths" },
      { dates: "Sep 29 — Oct 6", duration: "7 nights", berths: "5 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Oracle ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.reef),
      hero: heroImg(IMG.reef),
      gallery: gallery(IMG.reef, IMG.phinisi, IMG.water, IMG.coast, IMG.beach),
    },
  },

  // ─── 21 · PRANA ─────────────────────────────────────────────────────────────
  {
    slug: "prana", name: "Prana", firstName: "Prana",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Legend", cabinBookable: false,
    maxGuests: 8, length: "55 m", cabins: 9, build: "Indonesian phinisi",
    pricePerCabin: "$2,000", charterPrice: "$8,000", charterOnly: false,
    tagline: null,
    about: "Prana is a 55-metre Legend-tier phinisi offering nine en-suite cabins with private balconies. Runs exclusive Komodo itineraries with a 2:1 crew-to-guest ratio and spa facilities.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "8 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "8 berths" },
      { dates: "Sep 13 — Sep 20", duration: "7 nights", berths: "8 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Prana ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.sail),
      hero: heroImg(IMG.sail),
      gallery: gallery(IMG.sail, IMG.coast, IMG.water, IMG.reef, IMG.beach),
    },
  },

  // ─── 22 · RASCAL ────────────────────────────────────────────────────────────
  {
    slug: "rascal", name: "Rascal", firstName: "Rascal",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: true,
    maxGuests: 10, length: "30 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$2,500", charterPrice: "$12,500", charterOnly: false,
    tagline: null,
    about: "Rascal is a 30-metre Premium Komodo liveaboard with five en-suite cabins bookable per-cabin. Well regarded for its consistently high dive guide quality and its accessible pricing for the Premium tier.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 1 — Sep 8", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Rascal ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.water),
      hero: heroImg(IMG.water),
      gallery: gallery(IMG.water, IMG.phinisi, IMG.reef, IMG.coast, IMG.beach),
    },
  },

  // ─── 23 · REBEL ─────────────────────────────────────────────────────────────
  {
    slug: "rebel", name: "Rebel", firstName: "Rebel",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Premium", cabinBookable: true,
    maxGuests: 10, length: "31 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$2,500", charterPrice: "$12,500", charterOnly: false,
    tagline: null,
    about: "Rebel is a 31-metre Premium Raja Ampat phinisi with five en-suite cabins. Runs cabin-bookable 7-night circuits of the Bird's Head Seascape with a well-rated local dive team.",
    departures: [
      { dates: "Jul 19 — Jul 26", duration: "7 nights", berths: "10 berths" },
      { dates: "Aug 23 — Aug 30", duration: "7 nights", berths: "10 berths" },
      { dates: "Sep 27 — Oct 4", duration: "7 nights", berths: "10 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Rebel ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.bay),
      hero: heroImg(IMG.bay),
      gallery: gallery(IMG.bay, IMG.island, IMG.diver, IMG.beach, IMG.water),
    },
  },

  // ─── 24 · SAMARA I ──────────────────────────────────────────────────────────
  {
    slug: "samara-i", name: "Samara I", firstName: "Samara",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Explorer", cabinBookable: true,
    maxGuests: 13, length: "27 m", cabins: 6, build: "Indonesian phinisi",
    pricePerCabin: "$1,690", charterPrice: "$4,000", charterOnly: false,
    tagline: null,
    about: "Samara I is an Explorer-tier Komodo liveaboard with six cabins, well-suited to mixed groups and photographers. Consistent guide team and a camera-dedicated rinse station.",
    departures: [
      { dates: "Jul 14 — Jul 21", duration: "7 nights", berths: "13 berths" },
      { dates: "Aug 18 — Aug 25", duration: "7 nights", berths: "13 berths" },
      { dates: "Sep 15 — Sep 22", duration: "7 nights", berths: "13 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Samara I ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.diver),
      hero: heroImg(IMG.diver),
      gallery: gallery(IMG.diver, IMG.reef, IMG.water, IMG.beach, IMG.coast),
    },
  },

  // ─── 25 · SAMSARA SAMUDRA ───────────────────────────────────────────────────
  {
    slug: "samsara-samudra", name: "Samsara Samudra", firstName: "Samsara",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: false,
    maxGuests: 48, length: "42 m", cabins: 20, build: "Traditional tall ship",
    pricePerCabin: "$1,658", charterPrice: "$3,500", charterOnly: false,
    tagline: null,
    about: "Samsara Samudra is a 42-metre tall ship with 20 cabins, running large group expeditions through Komodo. Combines traditional sailing with comfortable shared spaces and a full dive operation.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "48 berths" },
      { dates: "Aug 11 — Aug 18", duration: "7 nights", berths: "48 berths" },
      { dates: "Sep 8 — Sep 15", duration: "7 nights", berths: "48 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Samsara Samudra ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.boat),
      hero: heroImg(IMG.boat),
      gallery: gallery(IMG.boat, IMG.coast, IMG.reef, IMG.water, IMG.beach),
    },
  },

  // ─── 26 · SANCTUARY ─────────────────────────────────────────────────────────
  {
    slug: "sanctuary", name: "Sanctuary", firstName: "Sanctuary",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: false,
    maxGuests: 8, length: "30 m", cabins: 9, build: "Indonesian phinisi",
    pricePerCabin: "$1,500", charterPrice: "$13,500", charterOnly: false,
    tagline: null,
    about: "Sanctuary is a 30-metre Premium Komodo phinisi known for its warm crew and strong repeating guest base. Nine well-appointed cabins and an experienced guide team across all park sites.",
    departures: [
      { dates: "Jul 21 — Jul 28", duration: "7 nights", berths: "8 berths" },
      { dates: "Aug 25 — Sep 1", duration: "7 nights", berths: "8 berths" },
      { dates: "Sep 29 — Oct 6", duration: "7 nights", berths: "8 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Sanctuary ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.phinisi),
      hero: heroImg(IMG.phinisi),
      gallery: gallery(IMG.phinisi, IMG.reef, IMG.water, IMG.coast, IMG.beach),
    },
  },

  // ─── 27 · SEAVENTURE LIVEABOARDS ────────────────────────────────────────────
  {
    slug: "seaventure-liveaboards", name: "SeaVenture Liveaboards", firstName: "SeaVenture",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "", cabinBookable: false,
    maxGuests: 20, length: "40 m", cabins: 10, build: "Steel liveaboard",
    pricePerCabin: "$543", charterPrice: "$5,430", charterOnly: false,
    tagline: null,
    about: "SeaVenture Liveaboards is a value-focused Raja Ampat operation with 10 cabins on a 40-metre steel vessel. Accessible pricing for divers who want full park coverage without the premium build cost.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "20 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "20 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "20 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `SeaVenture Liveaboards ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.bay),
      hero: heroImg(IMG.bay),
      gallery: gallery(IMG.bay, IMG.island, IMG.reef, IMG.beach, IMG.diver),
    },
  },

  // ─── 28 · SHAKTI ────────────────────────────────────────────────────────────
  {
    slug: "shakti", name: "Shakti", firstName: "Shakti",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Explorer", cabinBookable: false,
    maxGuests: 12, length: "32 m", cabins: 6, build: "Indonesian phinisi",
    pricePerCabin: "Quote on request", charterPrice: null, charterOnly: false,
    tagline: null,
    about: "Shakti is an Explorer-tier Raja Ampat phinisi with six cabins. Pricing varies by season and group size — contact Kai for a personalised quote.",
    departures: [
      { dates: "Jul 12 — Jul 19", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 16 — Aug 23", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 20 — Sep 27", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Shakti ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.island),
      hero: heroImg(IMG.island),
      gallery: gallery(IMG.island, IMG.diver, IMG.reef, IMG.bay, IMG.beach),
    },
  },

  // ─── 29 · SI DATU BUA ───────────────────────────────────────────────────────
  {
    slug: "si-datu-bua", name: "Si Datu Bua", firstName: "Si Datu",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: false,
    maxGuests: 8, length: "40 m", cabins: 3, build: "Indonesian phinisi",
    pricePerCabin: "$4,000", charterPrice: "$12,000", charterOnly: false,
    tagline: null,
    about: "Si Datu Bua is a Premium Komodo phinisi with three oversized suites for small groups. Known for its exceptional onboard cuisine and a dive guide team ranked among the top in the national park.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "8 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "8 berths" },
      { dates: "Sep 1 — Sep 8", duration: "7 nights", berths: "8 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Si Datu Bua ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.water),
      hero: heroImg(IMG.water),
      gallery: gallery(IMG.water, IMG.phinisi, IMG.reef, IMG.coast, IMG.beach),
    },
  },

  // ─── 30 · SILOINA ONE ───────────────────────────────────────────────────────
  {
    slug: "siloina-one", name: "Siloina One", firstName: "Siloina",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "", cabinBookable: false,
    maxGuests: 14, length: "40 m", cabins: 8, build: "Indonesian phinisi",
    pricePerCabin: "Quote on request", charterPrice: null, charterOnly: false,
    tagline: null,
    about: "Siloina One is a 40-metre Komodo phinisi with eight cabins. Runs seasonal circuits across the national park — pricing varies by group composition and departure date.",
    departures: [
      { dates: "Jul 21 — Jul 28", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 25 — Sep 1", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 29 — Oct 6", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Siloina One ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.coast),
      hero: heroImg(IMG.coast),
      gallery: gallery(IMG.coast, IMG.phinisi, IMG.reef, IMG.water, IMG.beach),
    },
  },

  // ─── 31 · SILOINA TWO ───────────────────────────────────────────────────────
  {
    slug: "siloina-two", name: "Siloina Two", firstName: "Siloina",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "", cabinBookable: false,
    maxGuests: 14, length: "40 m", cabins: 8, build: "Indonesian phinisi",
    pricePerCabin: "Quote on request", charterPrice: null, charterOnly: false,
    tagline: null,
    about: "Siloina Two is the Raja Ampat sister vessel of Siloina One — 40 metres, eight cabins, running the full Bird's Head circuit from Sorong.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "14 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "14 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "14 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Siloina Two ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.beach),
      hero: heroImg(IMG.beach),
      gallery: gallery(IMG.beach, IMG.island, IMG.diver, IMG.bay, IMG.reef),
    },
  },

  // ─── 32 · SILOLONA ──────────────────────────────────────────────────────────
  {
    slug: "silolona", name: "Silolona", firstName: "Silolona",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Premium", cabinBookable: false,
    maxGuests: 12, length: "50 m", cabins: 5, build: "Traditional phinisi",
    pricePerCabin: "$4,200", charterPrice: "$21,000", charterOnly: false,
    tagline: null,
    about: "Silolona is a 50-metre Premium phinisi with five exquisitely-appointed cabins. Widely recognised as one of the finest traditional sailing yachts in Southeast Asia, covering Komodo's most dramatic sites.",
    departures: [
      { dates: "Jul 14 — Jul 21", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 18 — Aug 25", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 22 — Sep 29", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Silolona ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.sail),
      hero: heroImg(IMG.sail),
      gallery: gallery(IMG.sail, IMG.coast, IMG.reef, IMG.water, IMG.phinisi),
    },
  },

  // ─── 33 · TABULA RASA ───────────────────────────────────────────────────────
  {
    slug: "tabula-rasa", name: "Tabula Rasa", firstName: "Tabula",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Premium", cabinBookable: false,
    maxGuests: 8, length: "22.8 m", cabins: 4, build: "Custom motor yacht",
    pricePerCabin: "$2,500", charterPrice: "$10,000", charterOnly: false,
    tagline: null,
    about: "Tabula Rasa is a 22.8-metre custom motor yacht with four en-suite cabins operating in Raja Ampat. Compact and fast — able to access remote dive sites before the larger fleet arrives.",
    departures: [
      { dates: "Jul 19 — Jul 26", duration: "7 nights", berths: "8 berths" },
      { dates: "Aug 23 — Aug 30", duration: "7 nights", berths: "8 berths" },
      { dates: "Sep 27 — Oct 4", duration: "7 nights", berths: "8 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Tabula Rasa ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.bay),
      hero: heroImg(IMG.bay),
      gallery: gallery(IMG.bay, IMG.island, IMG.beach, IMG.diver, IMG.reef),
    },
  },

  // ─── 34 · VEDANTA ───────────────────────────────────────────────────────────
  {
    slug: "vedanta", name: "Vedanta", firstName: "Vedanta",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "", cabinBookable: false,
    maxGuests: 6, length: "41 m", cabins: 5, build: "Indonesian phinisi",
    pricePerCabin: "$3,833", charterPrice: "$23,000", charterOnly: false,
    tagline: null,
    about: "Vedanta is a 41-metre Raja Ampat phinisi with five cabins for intimate groups of up to six guests. Excellent crew, quiet anchorages, and routes that go beyond the standard Bird's Head circuit.",
    departures: [
      { dates: "Jul 5 — Jul 12", duration: "7 nights", berths: "6 berths" },
      { dates: "Aug 9 — Aug 16", duration: "7 nights", berths: "6 berths" },
      { dates: "Sep 6 — Sep 13", duration: "7 nights", berths: "6 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Vedanta ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.phinisi),
      hero: heroImg(IMG.phinisi),
      gallery: gallery(IMG.phinisi, IMG.island, IMG.reef, IMG.bay, IMG.beach),
    },
  },

  // ─── 35 · VELA ──────────────────────────────────────────────────────────────
  {
    slug: "vela", name: "Vela", firstName: "Vela",
    locationBadge: "KOMODO", region: "Komodo",
    tier: "Legend", cabinBookable: false,
    maxGuests: 12, length: "42 m", cabins: 5, build: "Traditional phinisi",
    pricePerCabin: "$2,847", charterPrice: "$17,000", charterOnly: false,
    tagline: null,
    about: "Vela is a 42-metre Legend-tier Komodo phinisi with five exquisitely-appointed cabins, a sun deck Jacuzzi, and an in-house marine biologist available on every trip.",
    departures: [
      { dates: "Jul 7 — Jul 14", duration: "7 nights", berths: "12 berths" },
      { dates: "Aug 4 — Aug 11", duration: "7 nights", berths: "12 berths" },
      { dates: "Sep 1 — Sep 8", duration: "7 nights", berths: "12 berths" },
    ],
    itinerary: KOMODO_7,
    conservation: `Vela ${KOMODO_CONSERVATION}`,
    images: {
      card: img(IMG.boat),
      hero: heroImg(IMG.boat),
      gallery: gallery(IMG.boat, IMG.phinisi, IMG.coast, IMG.reef, IMG.water),
    },
  },

  // ─── 36 · ZEN SCUBA SPA ─────────────────────────────────────────────────────
  {
    slug: "zen-scuba-spa", name: "Zen Scuba Spa", firstName: "Zen",
    locationBadge: "RAJA AMPAT", region: "Raja Ampat",
    tier: "Premium", cabinBookable: false,
    maxGuests: 20, length: "40 m", cabins: 8, build: "Steel liveaboard",
    pricePerCabin: "$8,768", charterPrice: "$35,000", charterOnly: false,
    tagline: null,
    about: "Zen Scuba Spa combines a full spa operation with Raja Ampat's best dive sites. Eight cabins, an onboard massage suite, a hot tub, and a certified yoga instructor available during surface intervals.",
    departures: [
      { dates: "Jul 12 — Jul 19", duration: "7 nights", berths: "20 berths" },
      { dates: "Aug 16 — Aug 23", duration: "7 nights", berths: "20 berths" },
      { dates: "Sep 20 — Sep 27", duration: "7 nights", berths: "20 berths" },
    ],
    itinerary: RAJA_AMPAT_7,
    conservation: `Zen Scuba Spa ${RAJA_CONSERVATION}`,
    images: {
      card: img(IMG.water),
      hero: heroImg(IMG.water),
      gallery: gallery(IMG.water, IMG.bay, IMG.island, IMG.diver, IMG.beach),
    },
  },
];

/** Quick lookup by slug */
export const yachtBySlug = Object.fromEntries(
  yachts.map((y) => [y.slug, y])
) as Record<string, Yacht>;
