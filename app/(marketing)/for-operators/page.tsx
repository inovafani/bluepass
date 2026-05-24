import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";

export const metadata: Metadata = {
  title: "Operators | BluePass",
  description:
    "Browse vetted and claimable Indonesia marine operators on BluePass.",
};

const heroImage =
  "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=2200&q=82";
const accessImage =
  "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=2200&q=82";

const liveOperators = [
  {
    name: "Calico Jack Charters",
    href: "/operators/calico-jack-charters",
    tag: "charter",
    location: "Labuan Bajo Marina, East Nusa Tenggara",
    body: "A captain-led charter house pairing polished service with flexible Komodo day routes.",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
    alt: "Private yacht crossing clear tropical water",
  },
  {
    name: "Mermaid Spirit",
    href: "/operators/mermaid-spirit",
    tag: "sailing",
    location: "Nusa Lembongan, Bali",
    body: "A boutique sailing crew known for intimate sunset and celebration charters.",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    alt: "Sailing yacht at sunset",
  },
  {
    name: "Blue Lagoon Dive Resort",
    href: "/operators/blue-lagoon-dive-resort",
    tag: "dive",
    location: "Padangbai, Bali",
    body: "A dive resort pairing easy logistics with reef, macro, and conservation-led experiences.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver gliding above a coral reef",
  },
  {
    name: "Komodo Liveaboard Co.",
    href: "/operators/komodo-liveaboard-co",
    tag: "liveaboard",
    location: "Labuan Bajo, East Nusa Tenggara",
    body: "Premium cabin-based liveaboards for divers, photographers, and island explorers.",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Island coastline with turquoise water",
  },
];

const previews = [
  {
    name: "Scuba Republic (Jaya + Epica)",
    href: "/preview/scuba-republic-jaya-plus-epica",
    body: "Scuba Republic (Jaya + Epica) is staged for BluePass onboarding as a liveaboard + dive center with T1 priority.",
  },
  {
    name: "Mermaid Liveaboards (I + II)",
    href: "/preview/mermaid-liveaboards-i-plus-ii",
    body: "Mermaid Liveaboards (I + II) is staged for BluePass onboarding as a luxury liveaboard with T1 priority.",
  },
  {
    name: "Samambaia Liveaboard",
    href: "/preview/samambaia-liveaboard",
    body: "Samambaia Liveaboard is staged for BluePass onboarding as a luxury phinisi with T1 priority.",
  },
  {
    name: "La Galigo Liveaboard",
    href: "/preview/la-galigo-liveaboard",
    body: "La Galigo Liveaboard is staged for BluePass onboarding as a phinisi liveaboard with T1 priority.",
  },
];

export default function ForOperatorsPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center saturate-[0.9]"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.9),rgba(0,15,21,0.54)_48%,rgba(0,8,14,0.78)),linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.12)_36%,rgba(0,0,0,0.76))]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="cinematic-hero-stage">
            <section className="max-w-[720px] border border-white/16 bg-[#03111d]/62 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
              <h1 className="bp-page-title text-[clamp(2.25rem,5vw,4rem)] leading-[0.96] text-white">
                Vetted crews, early previews, better water days.
              </h1>
              <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
                <span
                  className="mt-1 h-24 w-px bg-white/70"
                  aria-hidden="true"
                />
                <p className="max-w-[32rem] text-sm font-light leading-[1.75] text-white/66 md:text-[15px]">
                  BluePass brings live operators and curated previews into one
                  marketplace so travelers can discover trips that are usually
                  buried in WhatsApp, Instagram, and local referrals.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
                <Link
                  href="/for-operators#claim"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center gap-2 bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Claim your business
                  <ArrowIcon />
                </Link>
                <Link
                  href="/operators"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Browse operators
                </Link>
              </div>
              <p className="mt-7 text-[11px] font-light tracking-[0.18em] text-[#B89A5D]">
                Operator catalog
              </p>
            </section>
          </div>
        </section>

        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Live operators
                </p>
                <h2 className="bp-page-title mt-4 text-2xl leading-none text-white/84 md:text-3xl">
                  Published on BluePass
                </h2>
              </div>
              <p className="text-sm font-light text-white/46">4 operators</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {liveOperators.map((operator) => (
                <Link
                  key={operator.name}
                  href={operator.href}
                  className="group overflow-hidden border border-white/12 bg-[#03111d]/76 shadow-[0_18px_60px_rgba(0,0,0,0.22)] transition-transform duration-300 hover:-translate-y-1 hover:border-white/24"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    <Image
                      src={operator.image}
                      alt={operator.alt}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020b11]/92 via-[#020b11]/34 to-transparent p-4">
                      <span className="inline-flex border border-[#B89A5D]/35 bg-[#B89A5D]/14 px-3 py-1 text-[11px] font-light tracking-[0.14em] text-[#f1d58a]">
                        {operator.tag}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="bp-page-title text-xl leading-none text-white/84">
                      {operator.name}
                    </h3>
                    <p className="mt-3 flex items-center gap-2 text-sm font-light text-white/44">
                      <MapPinIcon />
                      {operator.location}
                    </p>
                    <p className="mt-4 text-sm font-light leading-6 text-white/56">
                      {operator.body}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/10 px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${accessImage}')` }}
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Curated access
                </p>
                <h2 className="bp-page-title mt-4 max-w-2xl text-2xl leading-none text-white/88 md:text-3xl">
                  The best ocean trips are not always listed in one place.
                </h2>
              </div>
              <div>
                <p className="max-w-xl text-sm font-light leading-6 text-white/62 md:text-[15px]">
                  BluePass surfaces live operators and early previews from
                  across Indonesia, then makes the status clear before you
                  inquire.
                </p>
                <Link
                  href="/operators"
                  className="bp-focus-ring mt-5 inline-flex h-11 items-center justify-center gap-2 bg-white px-5 text-sm font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Browse operators
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="mt-9 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {previews.map((preview) => (
                <Link
                  key={preview.name}
                  href={preview.href}
                  className="group overflow-hidden border border-white/12 bg-[#03111d]/74 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-white/24"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-white/5">
                    <Image
                      src={accessImage}
                      alt="Island coastline with turquoise water"
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020b11]/76 to-transparent" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-light tracking-[0.14em] text-[#B89A5D]">
                      Early preview
                    </p>
                    <h3 className="bp-page-title mt-3 text-xl leading-none text-white/84">
                      {preview.name}
                    </h3>
                    <p className="mt-4 text-sm font-light leading-6 text-white/56">
                      {preview.body}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          id="claim"
          className="px-[var(--cinematic-screen-x)] py-16 text-center md:py-24"
        >
          <div className="bp-rounded-surface mx-auto max-w-4xl border border-white/12 bg-[#03111d]/76 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
            <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
              Claim your business
            </p>
            <h2 className="bp-page-title mx-auto mt-4 max-w-2xl text-2xl leading-none text-white md:text-3xl">
              Bring your operator profile into the marketplace.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-6 text-white/56 md:text-[15px]">
              BluePass helps travelers find the right crew, understand status,
              and inquire through a cleaner path before the trip moves back into
              your operator workflow.
            </p>
            <Link
              href="/signup"
              className="bp-focus-ring mt-8 inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-medium text-[#071827] transition-colors hover:bg-white/90"
            >
              Sign up BluePass
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
      <BluePassFooter />
    </>
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className="shrink-0 text-[#B89A5D]"
    >
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
