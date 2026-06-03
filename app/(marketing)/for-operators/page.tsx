import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";

export const metadata: Metadata = {
  title: "Operators | BluePass",
  description:
    "Browse vetted Indonesia marine operators on BluePass.",
};

const heroImage = "/operator/operator-header.jpg";

const liveOperators = [
  {
    slug: "calico-jack-charters",
    name: "Calico Jack",
    location: "KOMODO",
    maxGuests: 10,
    pricePerCabin: "$3,200",
    charterPrice: "$46,000",
    image:
      "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80",
    alt: "Private yacht crossing clear tropical water near Komodo",
  },
  {
    slug: "mermaid-spirit",
    name: "Mermaid Spirit",
    location: "BALI",
    maxGuests: 8,
    pricePerCabin: "$620",
    charterPrice: "$4,200",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    alt: "Sailing yacht at sunset",
  },
  {
    slug: "blue-lagoon-dive-resort",
    name: "Blue Lagoon",
    location: "BALI",
    maxGuests: 8,
    pricePerCabin: "$135",
    charterPrice: "$900",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
    alt: "Diver gliding above a coral reef",
  },
  {
    slug: "komodo-liveaboard-co",
    name: "Komodo Liveaboard Co.",
    location: "KOMODO",
    maxGuests: 16,
    pricePerCabin: "$1,850",
    charterPrice: "$22,000",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=800&q=80",
    alt: "Island coastline with turquoise water from the sea",
  },
];

export default function ForOperatorsPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        {/* Hero */}
        <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center saturate-[0.9]"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.72),rgba(0,15,21,0.38)_48%,rgba(0,8,14,0.58)),linear-gradient(180deg,rgba(0,0,0,0.30),rgba(0,0,0,0.08)_36%,rgba(0,0,0,0.64))]" />
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
                <a
                  href="#operators"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Browse operators
                </a>
              </div>
            </section>
          </div>
        </section>

        {/* Featured operators */}
        <section
          id="operators"
          className="px-[var(--cinematic-screen-x)] py-14 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Live operators
                </p>
                <h2 className="bp-page-title mt-4 text-2xl leading-none text-white/84 md:text-3xl">
                  Featured operators
                </h2>
              </div>
              <p className="text-sm font-light text-white/46">
                {liveOperators.length} operators
              </p>
            </div>

            <div className="bp-reveal mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {liveOperators.map((op) => (
                <Link
                  key={op.slug}
                  href={`/operators/${op.slug}`}
                  className="block"
                >
                  <article className="group relative overflow-hidden border border-white/[0.08]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <Image
                        src={op.image}
                        alt={op.alt}
                        fill
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, rgba(2,11,17,0.96) 0%, rgba(2,11,17,0.70) 32%, rgba(2,11,17,0.16) 60%, transparent 80%)",
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
                          {op.location}
                        </span>
                      </div>
                      {/* Bottom info */}
                      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                        <h3 className="bp-page-title text-[1.25rem] leading-tight text-white">
                          {op.name}
                        </h3>
                        <p
                          className="mt-1 text-[11px] text-white/55"
                          style={{ fontFamily: "var(--bp-font-mono)" }}
                        >
                          Up to {op.maxGuests} guests
                        </p>
                        <div className="mt-2.5 border-t border-white/12 pt-2.5">
                          <p className="text-[0.8125rem] font-medium text-white">
                            from {op.pricePerCabin}{" "}
                            <span className="font-light text-white/55">
                              / cabin · night
                            </span>
                          </p>
                          <p
                            className="mt-0.5 text-[11px] text-white/44"
                            style={{ fontFamily: "var(--bp-font-mono)" }}
                          >
                            or charter {op.charterPrice} / night · whole vessel
                          </p>
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Claim CTA */}
        <section
          id="claim"
          className="px-[var(--cinematic-screen-x)] py-16 text-center md:py-24"
        >
          <div className="bp-reveal bp-rounded-surface mx-auto max-w-4xl border border-white/12 bg-[#03111d]/76 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
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
