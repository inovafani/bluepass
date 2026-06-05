import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import { FleetBrowser } from "./FleetBrowser";
import { KaiSearchHero } from "./KaiSearchHero";

export const metadata: Metadata = {
  title: "Discover | BluePass",
  description: "Browse every vetted Indonesian liveaboard partner on BluePass.",
};

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
];

export default function DiscoverPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        {/* Hero — Kai search */}
        <KaiSearchHero />

        {/* Fleet browser */}
        <div id="fleet">
          <FleetBrowser />
        </div>

        {/* Conservation & Partners carousel */}
        <section className="px-[var(--cinematic-screen-x)] pb-16 md:pb-20">
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] uppercase tracking-[0.22em] text-[#5cc8be]">
              Conservation &amp; Partners
            </p>
            <h2 className="bp-page-title mt-3 max-w-2xl text-2xl leading-[1.1] text-white md:text-3xl">
              A carousel for the people and partners moving the ocean forward.
            </h2>
            <p className="mt-2 max-w-xl text-sm font-light text-white/50">
              The conservation partners that receive 5% of every booking, plus
              the creators we trust to tell the story.
            </p>

            <div className="mx-auto mt-8 grid max-w-5xl gap-3 sm:grid-cols-2 xl:grid-cols-3">
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
