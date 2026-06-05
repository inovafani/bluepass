import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import { FleetBrowser } from "./FleetBrowser";

export const metadata: Metadata = {
  title: "Discover | BluePass",
  description:
    "Browse every vetted Indonesian liveaboard partner on BluePass.",
};

const heroImage = "/operator/operator-header.jpg";

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

export default function DiscoverPage() {
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
                <span className="mt-1 h-24 w-px bg-white/70" aria-hidden="true" />
                <p className="max-w-[32rem] text-sm font-light leading-[1.75] text-white/66 md:text-[15px]">
                  BluePass brings live operators and curated previews into one
                  marketplace so travelers can discover trips that are usually
                  buried in WhatsApp, Instagram, and local referrals.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
                <a
                  href="#fleet"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center gap-2 rounded-full bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Browse the fleet
                  <ArrowIcon />
                </a>
                <Link
                  href="/signup"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center rounded-full border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  Claim your business
                </Link>
              </div>
            </section>
          </div>
        </section>

        {/* Fleet browser */}
        <div id="fleet">
          <FleetBrowser />
        </div>

        {/* Conservation & Partners */}
        <section className="px-[var(--cinematic-screen-x)] pb-16 md:pb-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#5cc8be]">
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
                <Link
                  key={card.id}
                  href={card.href}
                  className="group block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
                        {card.type === "partner" ? (
                          <>
                            <LeafIcon className="text-[#5cc8be]" />
                            <span className="text-[10px] tracking-[0.14em] text-white/75">
                              Conservation partner
                            </span>
                          </>
                        ) : (
                          <span className="text-[10px] tracking-[0.14em] text-white/75">
                            {card.handle}
                          </span>
                        )}
                      </div>
                      <div className="absolute inset-0 z-10 flex items-center justify-center">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/50 backdrop-blur-sm transition-colors group-hover:bg-black/70">
                          <PlayIcon />
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                        <p className="text-[10px] tracking-[0.18em] text-white/44">
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
