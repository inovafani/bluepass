import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BluePassFooter } from "@/app/components/BluePassFooter";

type Highlight = { label: string; value: string };
type ItineraryDay = { day: string; title: string; body: string };

type OperatorPreview = {
  location: string;
  title: string;
  operatorName: string;
  tagline: string;
  summary: string;
  price: string;
  duration: string;
  capacity: string;
  vesselType: string;
  image: string;
  alt: string;
  highlights: Highlight[];
  included: string[];
  itinerary: ItineraryDay[];
  tags: string[];
};

const previews: Record<string, OperatorPreview> = {
  "scuba-republic-jaya-plus-epica": {
    location: "Raja Ampat + Komodo",
    title: "Scuba Republic Signature Expedition",
    operatorName: "Scuba Republic",
    tagline: "Two iconic destinations. One unforgettable liveaboard.",
    summary:
      "Scuba Republic runs one of Indonesia's most respected liveaboard programs, pairing the world-class reef walls of Raja Ampat with the manta ray channels of Komodo. Built for serious divers but refined for comfort — strong reviews, year-round departures, and a crew that knows these sites intimately.",
    price: "$2,600",
    duration: "10 days / 9 nights",
    capacity: "Up to 16 guests",
    vesselType: "Liveaboard + Dive Center",
    image:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver swimming beside a coral reef wall",
    highlights: [
      { label: "Guided dives", value: "20–24 dives" },
      { label: "Destinations", value: "Raja Ampat + Komodo" },
      { label: "Nitrox", value: "Included" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives with certified dive master",
      "Nitrox fills throughout",
      "All meals, snacks, and drinking water",
      "Airport transfers from Sorong and Labuan Bajo",
      "Dive equipment use (wetsuit, BCD, regulator)",
      "Conservation briefings and reef contribution",
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Sorong Embarkation & Mansuar Reefs",
        body: "Board in Sorong and head overnight to Mansuar. First dives at Friwin Bank and Cape Kri, where fish counts regularly exceed 300 species. Expect huge schools of jacks, bumphead parrotfish, and resident wobbegong sharks.",
      },
      {
        day: "Day 3–4",
        title: "Misool & The Southern Passage",
        body: "Misool's limestone karst towers above water mirror the cathedral caverns below. Schooling barracuda, nudibranchs, ghost pipefish, and soft coral gardens covering every surface.",
      },
      {
        day: "Day 5",
        title: "Transit Day & Banda Sea Crossing",
        body: "Rest day transit toward Komodo. Briefings on Komodo's current-driven dive culture. Optional afternoon snorkel at a remote atoll.",
      },
      {
        day: "Day 6–8",
        title: "Komodo's Pelagic Sites",
        body: "Three days across Batu Bolong, Manta Alley, Crystal Rock, and Castle Rock. Current-driven sites with manta rays, reef sharks, and occasional hammerheads on every dive.",
      },
      {
        day: "Day 9",
        title: "Pink Beach & Dragon Trek",
        body: "Morning snorkel at Pink Beach and optional Komodo dragon trek with licensed park rangers. Sunset debrief, celebration dinner aboard.",
      },
      {
        day: "Day 10",
        title: "Labuan Bajo Disembarkation",
        body: "Arrive Labuan Bajo by morning. Final logbook stamps and hotel transfers arranged.",
      },
    ],
    tags: ["Liveaboard", "Manta Rays", "Raja Ampat", "Komodo", "Nitrox", "Year-round"],
  },

  "mermaid-liveaboards-i-plus-ii": {
    location: "Komodo · Raja Ampat · Banda Sea · Alor · Halmahera",
    title: "Mermaid Liveaboards Signature Expedition",
    operatorName: "Mermaid Liveaboards",
    tagline: "Nine international awards. Every BluePass destination.",
    summary:
      "Mermaid I and Mermaid II are two of Indonesia's most decorated liveaboard vessels, covering the full arc from Komodo to Raja Ampat, with seasonal extensions into Banda Sea, Alor, and Halmahera. Nine consecutive dive industry awards. Luxury positioning without pretense.",
    price: "$2,600",
    duration: "12 days / 11 nights",
    capacity: "Up to 18 guests",
    vesselType: "Luxury Liveaboard Fleet",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
    alt: "Luxury yacht crossing clear tropical water",
    highlights: [
      { label: "Fleet vessels", value: "Mermaid I & II" },
      { label: "Awards", value: "9 international" },
      { label: "Destinations", value: "5 regions" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All dives with bilingual dive guides",
      "Nitrox certified filling station",
      "Premium cabin accommodation",
      "All meals, wine with dinners, beverages",
      "Full dive equipment available onboard",
      "Marine biologist on selected itineraries",
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Labuan Bajo Embarkation & Komodo Entry",
        body: "Fly into Labuan Bajo and board Mermaid I or II. First dives at Batu Bolong and Manta Point before heading north. Welcome briefing by the marine biologist.",
      },
      {
        day: "Day 3–5",
        title: "Banda Sea Spice Islands",
        body: "The Banda Sea delivers some of Indonesia's most remote blue-water diving. Pinnacle walls dropping 600m, abundant pelagics, and the chance to explore historic nutmeg forts on shore.",
      },
      {
        day: "Day 6–7",
        title: "Alor Strait & Strong Currents",
        body: "Alor is built for current junkies — whip rays, eagle rays, and pygmy seahorses crowd nutrient-rich upwellings. Several sites rated among Southeast Asia's top drift dives.",
      },
      {
        day: "Day 8–9",
        title: "Halmahera's Volcanic Gardens",
        body: "Volcanic geology creates extraordinary macro conditions: mandarin fish, muck diving in black sand, and healthy hard coral not found further west.",
      },
      {
        day: "Day 10–11",
        title: "Raja Ampat Finale",
        body: "The expedition closes in Raja Ampat. Cape Kri, Sardine Reef, and Pianemo lagoon round out what may be the most biodiverse marine environment on Earth.",
      },
      {
        day: "Day 12",
        title: "Sorong Disembarkation",
        body: "Morning disembarkation in Sorong. Mermaid's ground team handles transfers to airport or onward hotels.",
      },
    ],
    tags: ["Luxury", "Award-winning", "5 Regions", "Banda Sea", "Halmahera", "Raja Ampat"],
  },

  "samambaia-liveaboard": {
    location: "Raja Ampat · Komodo · Alor · Flores · Banda · Triton Bay",
    title: "Samambaia Liveaboard Signature Expedition",
    operatorName: "Samambaia",
    tagline: "The full East Indonesia circuit aboard a premium Phinisi.",
    summary:
      "Samambaia is a premium traditional Phinisi liveaboard completing the most comprehensive East Indonesia circuit available — Raja Ampat, Komodo, Alor, Flores, Banda, and Triton Bay. Six destinations, one vessel, full premium positioning. Ideal for divers who want to see everything on a single trip.",
    price: "$2,600",
    duration: "14 days / 13 nights",
    capacity: "Up to 14 guests",
    vesselType: "Premium Phinisi Liveaboard",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Golden beach at sunset with wooden vessel silhouette",
    highlights: [
      { label: "Route stops", value: "6 destinations" },
      { label: "Vessel type", value: "Heritage Phinisi" },
      { label: "Circuit", value: "Full East Indonesia" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives and snorkel sessions",
      "Nitrox fills and dive equipment",
      "Premium en-suite cabin accommodation",
      "All meals prepared by a private chef",
      "Kayaks and paddleboards for surface intervals",
      "Guided shore excursions at each destination",
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Komodo Embarkation & Dragon Country",
        body: "Board in Labuan Bajo and dive Batu Bolong and Crystal Rock. Optional pink beach walk and komodo dragon sighting on day two.",
      },
      {
        day: "Day 3–4",
        title: "Flores Sea & Alor",
        body: "Head east through the Flores Sea to Alor's current-swept channels. Hammerhead sightings, schooling trevally, and the resident dugong at Mola Mola Point.",
      },
      {
        day: "Day 5–6",
        title: "Banda Sea Crossing",
        body: "Open-ocean crossing to the Banda archipelago. Above-water exploration of Fort Belgica and nutmeg plantations alongside deep-wall diving with massive Napoleon wrasse.",
      },
      {
        day: "Day 7–9",
        title: "Triton Bay's Whale Sharks",
        body: "Triton Bay offers one of Indonesia's best whale shark encounters plus unique endemic species found nowhere else. Soft coral gardens at Triton Bay's signature sites.",
      },
      {
        day: "Day 10–12",
        title: "Raja Ampat Signature Sites",
        body: "Cape Kri, Misool lagoons, and Fiabacet. Three full days in the world's most biodiverse marine environment with your personal dive guide.",
      },
      {
        day: "Day 13–14",
        title: "Sorong Finale & Disembarkation",
        body: "Final dives at Sorong's local reef walls, logbook ceremony, and disembarkation at Sorong port.",
      },
    ],
    tags: ["Phinisi", "Full Circuit", "Triton Bay", "Whale Sharks", "Banda Sea", "6 Stops"],
  },

  "la-galigo-liveaboard": {
    location: "Komodo · Raja Ampat · Lembeh · Halmahera",
    title: "La Galigo Liveaboard Signature Expedition",
    operatorName: "La Galigo",
    tagline: "Heritage vessel. Conservation purpose. Four world-class regions.",
    summary:
      "La Galigo is a traditional Bugis Phinisi with a deep conservation backstory. The vessel operates across Komodo, Raja Ampat, Lembeh, and Halmahera — combining wide-angle pelagic diving with world-renowned macro at Lembeh Strait. Every booking funds marine research through the La Galigo Foundation.",
    price: "$2,600",
    duration: "11 days / 10 nights",
    capacity: "Up to 12 guests",
    vesselType: "Heritage Bugis Phinisi",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Turquoise island coastline from above",
    highlights: [
      { label: "Vessel", value: "Heritage Phinisi" },
      { label: "Conservation", value: "La Galigo Foundation" },
      { label: "Macro capital", value: "Lembeh Strait" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives with conservation briefings",
      "Macro photography workshops with resident photographer",
      "Nitrox and dive equipment",
      "All meals and beverages",
      "Foundation research participation opportunities",
      "Lembeh night dives led by specialist macro guide",
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Komodo Embarkation",
        body: "Board in Labuan Bajo and immediately dive Manta Alley. Two days in Komodo National Park with park ranger conservation briefings included.",
      },
      {
        day: "Day 3–4",
        title: "Halmahera's Volcanic Black Sand",
        body: "East to Halmahera where volcanic black-sand muck diving produces blue-ring octopus, frogfish, and mimic octopus in extraordinary density.",
      },
      {
        day: "Day 5–7",
        title: "Lembeh Strait Macro Marathon",
        body: "Three days in Lembeh — widely considered the world capital of macro diving. Night dives each evening with La Galigo's specialist macro guide. Photography workshops included for all guests.",
      },
      {
        day: "Day 8–9",
        title: "Misool's Reefs",
        body: "Transition to Raja Ampat's southern zone at Misool. Soft coral caves, schooling fish beyond counting, and the eerie stillness of shallow inland bays.",
      },
      {
        day: "Day 10–11",
        title: "Raja Ampat North & Sorong",
        body: "Cape Kri and Pianemo for a final two days, then early morning disembarkation in Sorong with full logbook certification.",
      },
    ],
    tags: ["Heritage Phinisi", "Lembeh", "Macro", "Conservation", "Photography", "Halmahera"],
  },

  "scuba-junkie-klm-eliya": {
    location: "Komodo · Raja Ampat · Banda Sea",
    title: "Scuba Junkie Signature Expedition",
    operatorName: "Scuba Junkie",
    tagline: "GF Gold certified. Expanding Raja Ampat in 2026.",
    summary:
      "Scuba Junkie is one of Southeast Asia's most respected dive operators, already holding Green Fins Gold standard and expanding its Raja Ampat program in 2026. The KLM Eliya offers a hybrid resort-and-liveaboard experience across Komodo, Raja Ampat, and the Banda Sea with a strong conservation program already in place.",
    price: "$2,600",
    duration: "10 days / 9 nights",
    capacity: "Up to 20 guests",
    vesselType: "Liveaboard + Resort Chain",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    alt: "Remote lagoon with white sand and blue water",
    highlights: [
      { label: "Certification", value: "Green Fins Gold" },
      { label: "Vessel", value: "KLM Eliya" },
      { label: "2026 expansion", value: "Raja Ampat" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives with Green Fins-certified guides",
      "Nitrox and equipment",
      "All meals and non-alcoholic beverages",
      "Reef health monitoring participation",
      "Airport transfers",
      "Access to Scuba Junkie resort facilities at each stop",
    ],
    itinerary: [
      {
        day: "Day 1–3",
        title: "Komodo Conservation Dives",
        body: "Start in Komodo with Green Fins-guided dives at Batu Bolong, Castle Rock, and Manta Point. Morning reef health data collection open to guests.",
      },
      {
        day: "Day 4–5",
        title: "Banda Sea Extension",
        body: "Two days in the Banda Sea to reach the historic spice islands. Pinnacle wall diving with schooling hammerheads recorded at Banda's outer reefs.",
      },
      {
        day: "Day 6–8",
        title: "Raja Ampat Preview (2026 Routes)",
        body: "The expanded 2026 Raja Ampat itinerary covers Misool, Cape Kri, and new unmapped sites being charted by Scuba Junkie's team this season.",
      },
      {
        day: "Day 9",
        title: "Sorong Local Reefs",
        body: "Final dives at Sorong's reef systems. Conservation debrief and reef health report walkthrough with the lead guide.",
      },
      {
        day: "Day 10",
        title: "Sorong Disembarkation",
        body: "Early morning disembarkation. Scuba Junkie's team handles logistics to the airport and partner hotels.",
      },
    ],
    tags: ["Green Fins Gold", "Komodo", "Raja Ampat", "Banda Sea", "Conservation", "Expanding 2026"],
  },

  "mikumba-diving-jelajahi-laut": {
    location: "Komodo · Raja Ampat · Banda · Halmahera · Sulawesi · Ambon",
    title: "Mikumba Diving Signature Expedition",
    operatorName: "Mikumba Diving",
    tagline: "Six regions. Niche routes across Halmahera and Sulawesi.",
    summary:
      "Mikumba runs some of the most expedition-focused liveaboard routes in Indonesia, including rarely-visited sites across Halmahera and Sulawesi that most operators skip entirely. The Jelajahi Laut vessel is expedition-grade, comfortable, and crewed by local dive guides with deep knowledge of each region.",
    price: "$2,200",
    duration: "12 days / 11 nights",
    capacity: "Up to 14 guests",
    vesselType: "Expedition Liveaboard",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Scuba diver with schooling fish on a reef",
    highlights: [
      { label: "Regions", value: "6 destinations" },
      { label: "Unique routes", value: "Halmahera + Sulawesi" },
      { label: "Vessel", value: "Jelajahi Laut" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives including niche route sites",
      "Nitrox and full equipment",
      "All meals — Indonesian + international",
      "Local village visits at Halmahera and Sulawesi",
      "Dive briefings with site historical context",
      "Conservation contribution",
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Komodo Entry & Flores Sea",
        body: "Embark in Labuan Bajo and head east through the Flores Sea. Three dives on day one including Batu Bolong.",
      },
      {
        day: "Day 3–4",
        title: "Ambon's Lembeh-Rival Muck",
        body: "Ambon's Maluku Bay is the lesser-known answer to Lembeh — exceptional frogfish, rhinopias, and the famous Ambon scorpionfish discovered here in 2004.",
      },
      {
        day: "Day 5–6",
        title: "Banda Sea Outer Atolls",
        body: "Remote outer Banda atolls rarely visited by other operators. Schooling hammerheads, nurse sharks resting on open sand, and pristine hard coral plateaus.",
      },
      {
        day: "Day 7–8",
        title: "North Sulawesi & Bunaken",
        body: "Bunaken Marine Park with its iconic wall dives — 25-metre visibility, turtles on every dive, and the night dive at Siladen that draws underwater photographers globally.",
      },
      {
        day: "Day 9–10",
        title: "Halmahera's Niche Sites",
        body: "Mikumba's signature: unmapped sites in North Halmahera that the operator first dived in 2019. Volcanic chemistry, dense pygmy seahorses, and occasional dugong.",
      },
      {
        day: "Day 11–12",
        title: "Raja Ampat Finale & Sorong",
        body: "Close at Cape Kri and Sardine Reef before disembarking in Sorong.",
      },
    ],
    tags: ["Expedition", "Halmahera", "Sulawesi", "Ambon", "Niche Routes", "6 Regions"],
  },

  "ayo-divers-ratu-laut": {
    location: "Raja Ampat + Komodo",
    title: "Ayo Divers Signature Expedition",
    operatorName: "Ayo Divers",
    tagline: "Heritage Phinisi operators. Core to the BluePass brand.",
    summary:
      "Ayo Divers operates the Ratu Laut — a classic Sulawesi Phinisi that has been running diver expeditions across Raja Ampat and Komodo for over a decade. Heritage phinisi craft are central to the BluePass brand story: authentic, locally-built, and operated by Indonesian crews who grew up on these waters.",
    price: "$2,200",
    duration: "9 days / 8 nights",
    capacity: "Up to 12 guests",
    vesselType: "Traditional Phinisi Liveaboard",
    image:
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1600&q=80",
    alt: "Traditional wooden Phinisi boat near a tropical island",
    highlights: [
      { label: "Vessel", value: "Ratu Laut Phinisi" },
      { label: "Crew origin", value: "Local Indonesian" },
      { label: "Destinations", value: "Raja Ampat + Komodo" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives with local Indonesian dive masters",
      "Nitrox and basic equipment",
      "Home-cooked Indonesian meals by a family chef",
      "Traditional evening fishing with the crew",
      "Cultural briefings on Phinisi boatbuilding heritage",
      "Reef contribution",
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Sorong Embarkation & Raja Ampat Entry",
        body: "Board in Sorong and head immediately to Pianemo lagoon. Evening briefing by the dive master on what makes Raja Ampat's ecology unique.",
      },
      {
        day: "Day 3–5",
        title: "Cape Kri & Misool",
        body: "Three days exploring the most celebrated sites in Raja Ampat. Cape Kri holds the record for highest fish count on a single dive — 374 species in one hour.",
      },
      {
        day: "Day 6",
        title: "Open Sea Transit",
        body: "Day transit south toward Komodo. Traditional fishing with the crew, card games, and a sunset dinner prepared by the ship's cook.",
      },
      {
        day: "Day 7–8",
        title: "Komodo National Park",
        body: "Two days across Batu Bolong, Manta Alley, and Pink Beach snorkel. Park ranger guide joins for the komodo dragon trek on day eight.",
      },
      {
        day: "Day 9",
        title: "Labuan Bajo Disembarkation",
        body: "Arrive at dawn. Farewell breakfast, logbook stamps, and hotel transfers.",
      },
    ],
    tags: ["Phinisi", "Heritage", "Indonesian Crew", "Raja Ampat", "Komodo", "Cultural"],
  },

  "blue-manta-explorer": {
    location: "Raja Ampat · Komodo · Ambon",
    title: "Blue Manta Explorer Signature Expedition",
    operatorName: "Blue Manta",
    tagline: "Luxury steel liveaboard. Conservation fill-rate model.",
    summary:
      "Blue Manta Explorer is a modern steel liveaboard designed to serve conservation-oriented guests who want luxury without compromise. The vessel runs Raja Ampat, Komodo, and Ambon routes built to fill cabins through BluePass's conservation-first matching system — ensuring every bunk funds active reef programs.",
    price: "$2,200",
    duration: "10 days / 9 nights",
    capacity: "Up to 16 guests",
    vesselType: "Luxury Steel Liveaboard",
    image:
      "https://images.unsplash.com/photo-1520466809213-7b9a56adcd45?auto=format&fit=crop&w=1600&q=80",
    alt: "Deep blue ocean seen from above",
    highlights: [
      { label: "Vessel type", value: "Modern steel hull" },
      { label: "A/C cabins", value: "8 en-suite cabins" },
      { label: "Focus", value: "Conservation fill" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All dives with bilingual guides",
      "Unlimited Nitrox and full equipment",
      "Air-conditioned en-suite cabins",
      "All meals, open bar, and premium beverages",
      "Onboard dive shop and camera rinsing station",
      "Conservation research participation",
    ],
    itinerary: [
      {
        day: "Day 1–3",
        title: "Raja Ampat Northern Sites",
        body: "Three days at the northern half of Raja Ampat — Wayag's rock pinnacles above water, Sardine Reef and Friwin Bank below. Maximum visibility dives in calm conditions.",
      },
      {
        day: "Day 4–5",
        title: "Ambon Macro & Muck",
        body: "Ambon Bay's volcanic muck diving produces rare species at high density. Blue Manta's marine biologist leads night dives to hunt for the Ambon scorpionfish.",
      },
      {
        day: "Day 6",
        title: "Banda Sea Open Water",
        body: "Transit day with a pelagic fishing session. Optional ocean photography workshop with the ship's resident underwater photographer.",
      },
      {
        day: "Day 7–9",
        title: "Komodo Finale",
        body: "Three days of Komodo's best sites. Manta Alley virtually guarantees reef mantas. Batu Bolong and Crystal Rock for schooling pelagics.",
      },
      {
        day: "Day 10",
        title: "Labuan Bajo Disembarkation",
        body: "Final morning dives at Labuan Bajo's local reef. Conservation contribution certificate issued per guest.",
      },
    ],
    tags: ["Luxury Steel", "Conservation", "Ambon", "Raja Ampat", "Komodo", "Modern"],
  },

  "calico-jack": {
    location: "Raja Ampat · Triton Bay · Banda Sea · Ambon",
    title: "Calico Jack Signature Expedition",
    operatorName: "Calico Jack",
    tagline: "Remote Indonesia. Sites most liveaboards never reach.",
    summary:
      "Calico Jack specialises in truly remote Indonesian diving — Triton Bay's whale sharks, outer Banda Sea atolls, and the rarely-visited macro sites around Ambon. The itinerary is built for experienced divers who have completed the standard Komodo and Raja Ampat circuit and want to go further.",
    price: "$2,200",
    duration: "11 days / 10 nights",
    capacity: "Up to 14 guests",
    vesselType: "Expedition Liveaboard",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80",
    alt: "Tropical island shore with warm afternoon light",
    highlights: [
      { label: "Specialty", value: "Remote Indonesia" },
      { label: "Whale sharks", value: "Triton Bay" },
      { label: "Experience req.", value: "50+ logged dives" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All dives including remote and unmapped sites",
      "Nitrox and full expedition equipment",
      "All meals and beverages",
      "Fishing and foraging sessions with the crew",
      "Tender boat access to remote beaches",
      "Satellite communications for safety",
    ],
    itinerary: [
      {
        day: "Day 1–2",
        title: "Raja Ampat Entry & Misool",
        body: "Embark at Sorong and head south to Misool. The cave systems at Misool's southern tip are some of Southeast Asia's most photogenic dive environments.",
      },
      {
        day: "Day 3–4",
        title: "Triton Bay & Whale Shark Feeding",
        body: "Triton Bay's fish-aggregating devices (bagans) attract whale sharks in extraordinary numbers. Calico Jack holds established relationships with local fishermen for consistent encounters.",
      },
      {
        day: "Day 5–7",
        title: "Banda Sea Outer Atolls",
        body: "Three days on remote outer Banda atolls. Sites that Calico Jack first mapped in 2021 — schooling hammerheads, reef sharks, and hard coral coverage above 80%.",
      },
      {
        day: "Day 8–9",
        title: "Ambon's Secret Spots",
        body: "Ambon Bay macro madness: blue-ring octopus, hairy frogfish, coconut octopus, and the Ambon scorpionfish. Night dives most evenings.",
      },
      {
        day: "Day 10–11",
        title: "Return to Sorong",
        body: "Final transit dives and return to Sorong. Full certification documentation and logbook signing by senior dive master.",
      },
    ],
    tags: ["Remote", "Triton Bay", "Whale Sharks", "Banda Sea", "Expedition", "Advanced Divers"],
  },

  "indo-master": {
    location: "Raja Ampat · Komodo · Banda",
    title: "Indo Master Signature Expedition",
    operatorName: "Indo Master",
    tagline: "Multi-destination. Accessible. Strong local expertise.",
    summary:
      "Indo Master runs a reliable multi-destination circuit covering Raja Ampat, Komodo, and the Banda Sea. A well-reviewed operator with consistently strong guides, comfortable cabins, and a straightforward approach — great for first-time liveaboard guests and returning divers alike.",
    price: "$2,200",
    duration: "10 days / 9 nights",
    capacity: "Up to 16 guests",
    vesselType: "Liveaboard",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Turquoise island coastline from above",
    highlights: [
      { label: "Circuit", value: "3 destinations" },
      { label: "Style", value: "Accessible comfort" },
      { label: "Guides", value: "English + Indonesian" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives with bilingual guides",
      "Nitrox and equipment available",
      "All meals and soft drinks",
      "Diving instruction and refresher courses on request",
      "National park entry fees",
      "Airport transfers",
    ],
    itinerary: [
      {
        day: "Day 1–3",
        title: "Raja Ampat Core Sites",
        body: "Three days at Raja Ampat's signature sites — Cape Kri, Sardine Reef, Arborek, and Mios Kon. Indo Master's guides are among the most experienced locals in the area.",
      },
      {
        day: "Day 4–5",
        title: "Banda Sea Arc",
        body: "Two days in Banda with wall dives and historic fort visits on Run Island — the island the Dutch traded for Manhattan in 1667.",
      },
      {
        day: "Day 6–7",
        title: "Misool Southern Raja Ampat",
        body: "Misool's inland bays and reef systems offer some of the most sheltered and visually dramatic diving in the region.",
      },
      {
        day: "Day 8–9",
        title: "Komodo National Park",
        body: "Two days across Komodo's headline sites. Indo Master's captain knows the tidal windows for Batu Bolong and times arrival for slack water every time.",
      },
      {
        day: "Day 10",
        title: "Labuan Bajo Disembarkation",
        body: "Arrive in Labuan Bajo for final breakfast, logbook stamps, and transfer to the airport or town hotels.",
      },
    ],
    tags: ["Multi-destination", "Accessible", "First-timers", "Raja Ampat", "Komodo", "Banda"],
  },

  "sea-temple-cruises": {
    location: "Raja Ampat · Indonesia",
    title: "Raja Ampat Dive Expedition",
    operatorName: "Sea Temple Cruises",
    tagline: "Manta-focused. Island-immersed. Reef-first design.",
    summary:
      "Sea Temple Cruises runs a focused Raja Ampat expedition designed around manta ray behaviour, reef ecology, and island exploration. The multi-day route covers reef, island, and manta-specific sites across the archipelago with a small-group feel and guides who know individual manta ray identities by sight.",
    price: "$2,600",
    duration: "8 days / 7 nights",
    capacity: "Up to 10 guests",
    vesselType: "Boutique Liveaboard",
    image:
      "https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver below the surface with rays of light from above",
    highlights: [
      { label: "Focus", value: "Manta ray encounters" },
      { label: "Group size", value: "Max 10 guests" },
      { label: "Region", value: "Raja Ampat" },
      { label: "Reef levy", value: "5% per booking" },
    ],
    included: [
      "All guided dives with manta specialist guides",
      "Manta ray identification citizen science program",
      "Nitrox and full dive equipment",
      "All meals and beverages",
      "Island trekking and snorkel sessions",
      "Photo documentation of manta encounters provided post-trip",
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Sorong Embarkation",
        body: "Board in Sorong for an evening departure. Welcome briefing and manta ray identification workshop — learn to read the belly spot patterns used to track individuals.",
      },
      {
        day: "Day 2–3",
        title: "Manta Sandy & Arborek",
        body: "Raja Ampat's primary manta cleaning stations. Sea Temple guides know the tidal patterns that bring the largest aggregations. Early morning dives often yield 10–20 mantas.",
      },
      {
        day: "Day 4",
        title: "Wayag Island Trek",
        body: "Rest from diving — hike to the summit of Wayag for the iconic karst island panorama. Surface interval snorkel in the enclosed lagoon below.",
      },
      {
        day: "Day 5–6",
        title: "Cape Kri & Sardine Reef",
        body: "Two days at Raja Ampat's most species-dense sites. Cape Kri's world-record fish count is regularly approached on Sea Temple's morning dives.",
      },
      {
        day: "Day 7",
        title: "Pianemo & Misool Gateway",
        body: "Pianemo lagoon in the morning — the UNESCO-candidate landscape that most people only see in photos. Afternoon at Misool's northern edge.",
      },
      {
        day: "Day 8",
        title: "Sorong Return",
        body: "Final dive at Sorong's house reef. Manta ID certificates issued per guest. Disembarkation and transfers to airport.",
      },
    ],
    tags: ["Manta Rays", "Boutique", "Raja Ampat", "Small Group", "Citizen Science", "Photography"],
  },
};

export async function generateStaticParams() {
  return Object.keys(previews).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const preview = previews[slug];
  if (!preview) return { title: "Preview | BluePass" };
  return {
    title: `${preview.title} | BluePass`,
    description: preview.summary,
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

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const preview = previews[slug];

  if (!preview) notFound();

  return (
    <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
      {/* Hero */}
      <section className="relative min-h-[72svh] overflow-hidden bg-[#020b11]">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${preview.image}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.92),rgba(0,15,21,0.55)_52%,rgba(0,8,14,0.78)),linear-gradient(180deg,rgba(0,0,0,0.52),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.82))]" />
        <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
        <div className="bp-film-grain absolute inset-0" />

        <div className="relative flex min-h-[72svh] flex-col justify-end px-[var(--cinematic-screen-x)] pb-12 pt-28">
          <Link
            href="/explore-indonesia"
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
            Back to Explore
          </Link>

          <div className="flex items-center gap-3">
            <span
              className="border border-[#B89A5D]/28 bg-[#B89A5D]/14 px-2.5 py-1 text-[10px] tracking-[0.18em] text-[#f4d891]"
              style={{ fontFamily: "var(--bp-font-mono)", borderRadius: "6px" }}
            >
              Preview
            </span>
            <span
              className="border border-white/14 bg-black/40 px-2.5 py-1 text-[10px] tracking-[0.13em] text-white/70"
              style={{ fontFamily: "var(--bp-font-mono)", borderRadius: "6px", backdropFilter: "blur(8px)" }}
            >
              5% reef
            </span>
          </div>

          <p
            className="mt-3 text-[10px] uppercase tracking-[0.26em] text-[#B89A5D]"
            style={{ fontFamily: "var(--bp-font-mono)" }}
          >
            {preview.location}
          </p>
          <h1 className="bp-page-title mt-2 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.96] text-white">
            {preview.title}
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-white/65">
            {preview.tagline}
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-white/10 bg-[#03111d]/80 px-[var(--cinematic-screen-x)] backdrop-blur-xl">
        <div className="grid grid-cols-2 divide-x divide-white/10 md:grid-cols-4">
          {[
            { label: "From", value: preview.price },
            { label: "Duration", value: preview.duration },
            { label: "Capacity", value: preview.capacity },
            { label: "Vessel", value: preview.vesselType },
          ].map((stat) => (
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
                About this expedition
              </p>
              <h2 className="bp-page-title mt-3 text-3xl text-white">
                {preview.operatorName}
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-[1.8] text-white/70">
                {preview.summary}
              </p>
            </section>

            {/* Highlights */}
            <section className="mt-10">
              <p
                className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                style={{ fontFamily: "var(--bp-font-mono)" }}
              >
                At a glance
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {preview.highlights.map((h) => (
                  <div
                    key={h.label}
                    className="border border-white/10 bg-white/[0.03] p-4"
                    style={{ borderRadius: "4px" }}
                  >
                    <p
                      className="text-[10px] tracking-[0.18em] text-white/40"
                      style={{ fontFamily: "var(--bp-font-mono)" }}
                    >
                      {h.label}
                    </p>
                    <p className="mt-1.5 text-sm font-medium text-white">{h.value}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tags */}
            <div className="mt-6 flex flex-wrap gap-2">
              {preview.tags.map((tag) => (
                <span
                  key={tag}
                  className="border border-white/12 bg-white/[0.04] px-3 py-1.5 text-[10px] tracking-[0.14em] text-white/55"
                  style={{ fontFamily: "var(--bp-font-mono)", borderRadius: "4px" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Itinerary */}
            <section className="mt-12">
              <p
                className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                style={{ fontFamily: "var(--bp-font-mono)" }}
              >
                Sample itinerary
              </p>
              <h2 className="bp-page-title mt-3 text-2xl text-white">
                What to expect
              </h2>
              <div className="mt-6 grid gap-0 border border-white/10">
                {preview.itinerary.map((item, i) => (
                  <div
                    key={item.day}
                    className={`grid grid-cols-[100px_1fr] gap-4 p-5 ${
                      i < preview.itinerary.length - 1 ? "border-b border-white/[0.07]" : ""
                    }`}
                  >
                    <div className="pt-0.5">
                      <p
                        className="text-[10px] tracking-[0.18em] text-[#B89A5D]"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        {item.day}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="mt-1.5 text-sm leading-6 text-white/55">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:pt-0">
            <div className="sticky top-6 space-y-4">
              {/* What's included */}
              <div className="border border-white/12 bg-[#03111d]/60 p-6 backdrop-blur-xl">
                <p
                  className="text-[11px] tracking-[0.22em] text-[#B89A5D]"
                  style={{ fontFamily: "var(--bp-font-mono)" }}
                >
                  What&apos;s included
                </p>
                <ul className="mt-4 space-y-3">
                  {preview.included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckIcon />
                      <span className="text-sm leading-5 text-white/65">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Book CTA */}
              <div className="border border-white/12 bg-[#03111d]/60 p-6 backdrop-blur-xl">
                <p className="bp-page-title text-2xl text-white">
                  From {preview.price}
                </p>
                <p className="mt-2 text-sm text-white/50">{preview.duration}</p>
                <p className="mt-4 text-[13px] leading-6 text-white/60">
                  This operator is in early preview on BluePass. Ask Kai for
                  availability, dates, and a personalised quote.
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
                  Ask Kai about this trip
                </Link>
                <Link
                  href="/explore-indonesia"
                  className="mt-2.5 flex h-10 w-full items-center justify-center border border-white/20 text-[11px] font-medium text-white/70 transition-colors hover:border-white/40 hover:text-white"
                >
                  Back to all trips
                </Link>
              </div>

              {/* Conservation note */}
              <div className="border border-[#B89A5D]/20 bg-[#B89A5D]/[0.04] p-5">
                <p
                  className="text-[10px] tracking-[0.22em] text-[#B89A5D]"
                  style={{ fontFamily: "var(--bp-font-mono)" }}
                >
                  Reef contribution
                </p>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  5% of every booking is transferred to a named reef partner.
                  Reports go public as partner reporting comes online.
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
