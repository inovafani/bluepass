import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import { ReelsCarousel } from "./ReelsCarousel";

export const metadata: Metadata = {
  title: "Creators | BluePass",
  description:
    "BluePass helps trusted ocean creators share Indonesia trips and earn clean attribution.",
};

const heroImage = "/creators/hero.jpg";
const creatorPageImage = "/creators/creator-page.jpg";

const steps = [
  {
    verb: "Curate",
    title: "Choose trips you would send to a friend.",
  },
  {
    verb: "Share",
    title: "Send your audience to a page that feels like you.",
  },
  {
    verb: "Earn",
    title: "Get paid when followers book.",
  },
];

const creatorBenefits = [
  {
    title: "Your ocean page",
    body: "A polished trip page for your favorite operators, routes, and stories.",
    icon: "page",
  },
  {
    title: "Clean attribution",
    body: "Followers book from your link. No messy tracking pitch needed.",
    icon: "link",
  },
  {
    title: "Creator earnings",
    body: "Commission comes from BluePass, with reef funding still included.",
    icon: "earn",
  },
  {
    title: "Operator access",
    body: "Warm intros to crews when the trip fits your audience.",
    icon: "access",
  },
];

const creators = [
  {
    name: "Josiah William Gordon",
    handle: "@josiahwg",
    location: "Indonesia / New Zealand",
    role: "Fine-art travel photographer with a cinematic, destination-led eye.",
    href: "https://www.instagram.com/josiahwg/",
    image: "/creators/josiahwg.jpg",
  },
  {
    name: "Cam Vaughne",
    handle: "@camvaughne",
    location: "Bali, Indonesia",
    role: "Photo and film creator documenting remote Indonesia, sailing, and ocean conservation.",
    href: "https://www.instagram.com/camvaughne/",
    image: "/creators/camvaughne.jpg",
  },
  {
    name: "Christian LeBlanc",
    handle: "@lostleblanc",
    location: "Global",
    role: "Travel and filmmaking creator behind Lost LeBlanc, built around cinematic guides and creator education.",
    href: "https://www.instagram.com/lostleblanc/",
    image: "/creators/lostleblanc.jpg",
  },
  {
    name: "Story of Sage",
    handle: "@storyofsage",
    location: "Indonesia",
    role: "Ocean and travel storyteller with a soft, cinematic lens on slow island life.",
    href: "https://www.instagram.com/storyofsage/",
    image: "/creators/storyofsage.jpg",
  },
];

const featuredReels = [
  {
    creator: "Story of Sage",
    handle: "@storyofsage",
    title: "Island light, reef days, quiet blue moments",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/DE0a2Z7xSQL/",
    videoSrc: "",
  },
  {
    creator: "Josiah William Gordon",
    handle: "@josiahwg",
    title: "Cinematic coastlines through a fine-art lens",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/CPBJDTmjKS_/",
    videoSrc: "",
  },
  {
    creator: "Cam Vaughne",
    handle: "@camvaughne",
    title: "Remote Indonesia by sail, film, and sea",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/Ck8BkRDhLhy/",
    videoSrc: "",
  },
  {
    creator: "Christian LeBlanc",
    handle: "@lostleblanc",
    title: "Travel stories built for cinematic discovery",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/DXO0GAiiYWz/",
    videoSrc: "",
  },
  {
    creator: "Cam Vaughne",
    handle: "@camvaughne",
    title: "Remote Indonesia by sail, film, and sea",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/DBvwGTlPQsA/",
    videoSrc: "",
  },
];

export default function CreatorsPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center saturate-[0.86]"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.86),rgba(0,15,21,0.46)_48%,rgba(0,8,14,0.7)),linear-gradient(180deg,rgba(0,0,0,0.38),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.74))]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="cinematic-hero-stage">
            <section className="max-w-[640px] border border-white/16 bg-[#03111d]/58 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
              <h1 className="bp-page-title text-[clamp(2.25rem,5vw,4rem)] leading-[0.96] text-white">
                Curate.
                <br />
                Share.
                <br />
                Earn.
              </h1>
              <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
                <span
                  className="mt-1 h-20 w-px bg-white/70"
                  aria-hidden="true"
                />
                <p className="max-w-[29rem] text-sm font-light leading-[1.75] text-white/64 md:text-[15px]">
                  Turn the ocean trips you already love into a beautiful booking
                  path. Your audience discovers better trips, operators meet
                  warmer leads, and every booking still funds the reef.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Apply to create
                </Link>
                <a
                  href="#featured-creators"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  See creators
                </a>
              </div>
            </section>
          </div>
        </section>

        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] py-16 md:py-24">
          {/* Ambient depth — gold from top-right, teal from bottom-left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_78%_0%,rgba(184,154,93,0.07),transparent_48%),radial-gradient(ellipse_at_16%_100%,rgba(0,100,130,0.07),transparent_46%)]"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-5 md:gap-8 lg:grid-cols-2 lg:items-stretch">

              {/* Left — image panel fills the grid row height */}
              <div className="relative min-h-[360px] overflow-hidden rounded-[var(--bp-radius-md)] shadow-[0_28px_90px_rgba(0,0,0,0.36)] lg:min-h-0">
                <div
                  className="absolute inset-0 scale-105 bg-cover bg-[center_70%] transition-transform duration-700 hover:scale-[1.08]"
                  style={{ backgroundImage: `url('${creatorPageImage}')` }}
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.02)_45%,rgba(0,0,0,0.74))]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color"
                />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                    BluePass creator page
                  </p>
                  <p className="bp-page-title mt-3 max-w-md text-2xl leading-none text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)] md:text-3xl">
                    One link for the trips you believe in.
                  </p>
                </div>
              </div>

              {/* Right — header + editorial step list + CTA */}
              <div className="flex flex-col justify-between gap-10 lg:py-2">

                {/* Header */}
                <div>
                  <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                    Creator program
                  </p>
                  <h2 className="bp-page-title mt-4 text-[clamp(1.9rem,3.5vw,3rem)] leading-[0.94] text-white/88">
                    Your taste becomes
                    <br className="hidden sm:block" /> the trip plan.
                  </h2>
                  <p className="mt-5 max-w-xs text-sm font-light leading-[1.85] text-white/48">
                    Keep the romance of storytelling.
                    <br />
                    Add a booking path behind it.
                  </p>
                </div>

                {/* Editorial step list — no boxes, just clean divider rows */}
                <div className="divide-y divide-white/[0.07]">
                  {steps.map((step, index) => (
                    <div key={step.verb} className="group flex items-start gap-5 py-6">
                      {/* Large ambient step number — decorative, not a badge */}
                      <span
                        aria-hidden="true"
                        className="min-w-[2.5rem] pt-0.5 text-[2.8rem] font-thin leading-none text-white/[0.10] transition-colors duration-300 group-hover:text-[#B89A5D]/32"
                      >
                        0{index + 1}
                      </span>
                      <div className="flex-1 pt-1">
                        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#B89A5D]">
                          {step.verb}
                        </p>
                        <p className="mt-2 text-[15px] font-light leading-[1.7] text-white/68">
                          {step.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Closing CTA */}
                <div className="flex flex-wrap items-center gap-4 border-t border-white/[0.08] pt-7">
                  <Link
                    href="/signup"
                    className="bp-focus-ring inline-flex h-10 items-center justify-center gap-2 bg-white px-5 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                  >
                    Apply to create
                    <ArrowIcon />
                  </Link>
                  <p className="text-[11px] font-light text-white/32">
                    Free to join. Commission on bookings only.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-y border-white/10 bg-[#04111d] px-[var(--cinematic-screen-x)] py-20 md:py-28">
          {/* Faint hero image as texture — very low opacity, just adds grain/depth */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-[center_30%] opacity-[0.06] saturate-0"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          {/* Ambient teal glow top-right */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(0,111,142,0.09),transparent_52%)]"
          />
          <OceanCurrentOrnament />

          <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            {/* Left — headline + anchor */}
            <div className="lg:sticky lg:top-28">
              <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                What you get
              </p>
              <h2 className="bp-page-title mt-4 max-w-md text-[clamp(2rem,3.5vw,3.25rem)] leading-[0.95] text-white/88">
                Creator tools without the ugly sales funnel.
              </h2>
              <div className="mt-6 flex items-start gap-3">
                <span
                  aria-hidden="true"
                  className="mt-1 h-10 w-px shrink-0 bg-gradient-to-b from-[#B89A5D]/60 to-transparent"
                />
                <p className="text-sm font-light leading-[1.8] text-white/44">
                  Everything a storyteller needs. Nothing that makes your
                  audience feel sold to.
                </p>
              </div>
            </div>

            {/* Right — benefit cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {creatorBenefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="group min-h-[200px] border border-white/12 bg-white/[0.03] p-6 transition-all duration-200 hover:border-white/24 hover:bg-white/[0.055] hover:shadow-[0_12px_40px_rgba(0,0,0,0.22)]"
                >
                  {/* Icon — framed in a gold-tinted box */}
                  <div className="flex h-11 w-11 items-center justify-center rounded-[var(--bp-radius-sm)] border border-[#B89A5D]/28 bg-[#B89A5D]/10 transition-colors group-hover:border-[#B89A5D]/44 group-hover:bg-[#B89A5D]/16">
                    <BenefitIcon type={benefit.icon} />
                  </div>
                  <p className="bp-page-title mt-6 text-xl leading-none text-white/88">
                    {benefit.title}
                  </p>
                  <p className="mt-3 text-sm font-light leading-[1.75] text-white/54">
                    {benefit.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="relative mx-auto grid max-w-6xl gap-8 overflow-hidden border-y border-white/10 py-12 md:grid-cols-[0.82fr_1.18fr] md:gap-16 md:py-16">
            <OceanCurrentOrnament />
            <div className="relative">
              <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                Who it is for
              </p>
              <h2 className="bp-page-title mt-4 max-w-xl text-2xl leading-none text-white/86 md:text-3xl">
                Real ocean people with real trust.
              </h2>
            </div>
            <p className="relative max-w-3xl text-base font-light leading-8 text-white/62 md:text-lg">
              BluePass is for dive instructors, ocean photographers, travel
              writers, sailors with audiences, and conservation educators. We do
              not take influencers we cannot verify took the trip.
            </p>
          </div>
        </section>

        <section
          id="featured-creators"
          className="border-y border-white/10 bg-[#04111d] px-[var(--cinematic-screen-x)] py-14 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
              Featured creators
            </p>
            <h2 className="bp-page-title mt-4 max-w-3xl text-xl leading-none text-white/82 md:text-2xl">
              The kind of taste BluePass is built for.
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {creators.map((creator) => (
                <Link
                  key={creator.name}
                  href={creator.href}
                  className="bp-rounded-surface group border border-white/12 bg-[#03111d]/90 shadow-[0_14px_44px_rgba(0,0,0,0.22)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/24"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#071827]/20">
                    <Image
                      src={creator.image}
                      alt={`${creator.name} Instagram profile picture`}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-xs tracking-[0.16em] text-[#B89A5D]">
                      {creator.handle}
                    </p>
                    <p className="bp-page-title mt-2 text-xl leading-none text-white/82">
                      {creator.name}
                    </p>
                    <p className="mt-2 text-sm font-light text-white/46">
                      {creator.location}
                    </p>
                    <p className="mt-3 text-sm font-light leading-6 text-white/54">
                      {creator.role}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(184,154,93,0.16),transparent_28%),linear-gradient(180deg,rgba(4,17,29,0),rgba(7,24,39,0.42)_48%,rgba(2,11,17,0))]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-5 md:grid-cols-[0.72fr_1.28fr] md:items-end">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Most viewed reels
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-2xl leading-none text-white/86 md:text-3xl">
                  A carousel for the clips that move people.
                </h2>
              </div>
              <p className="max-w-2xl text-sm font-light leading-6 text-white/56 md:text-[15px]">
                Feature handpicked Instagram reels from each creator in a
                swipe-friendly strip built to feel like a premium editorial
                shelf.
              </p>
            </div>

            <ReelsCarousel reels={featuredReels} />
          </div>
        </section>

        <section className="px-[var(--cinematic-screen-x)] py-16 text-center md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="bp-page-title text-2xl leading-none text-white md:text-3xl">
              Want your ocean stories to move bookings and fund reefs?
            </h2>
            <Link
              href="/signup"
              className="bp-focus-ring mt-8 inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-medium text-[#071827] transition-colors hover:bg-white/90"
            >
              Apply to be a creator
              <ArrowIcon />
            </Link>
          </div>
        </section>
      </main>
      <BluePassFooter />
    </>
  );
}

function BenefitIcon({ type }: { type: string }) {
  const paths = {
    page: (
      <>
        <path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v5h5" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
      </>
    ),
    link: (
      <>
        <path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 0 0-7.07-7.07L11 4.93" />
        <path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 0 0 7.07 7.07L13 19.07" />
      </>
    ),
    earn: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v8" />
        <path d="M9.5 10.5c.5-1 1.4-1.5 2.5-1.5 1.4 0 2.5.8 2.5 2s-1.1 2-2.5 2-2.5.8-2.5 2 1.1 2 2.5 2c1.1 0 2-.5 2.5-1.5" />
      </>
    ),
    access: (
      <>
        <path d="M16 3h5v5" />
        <path d="m21 3-7 7" />
        <path d="M10 6H6a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3v-4" />
        <path d="M8 14h5" />
      </>
    ),
  } as const;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5 text-[#B89A5D]"
      aria-hidden="true"
    >
      {paths[type as keyof typeof paths] ?? paths.page}
    </svg>
  );
}

function OceanCurrentOrnament() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -right-12 top-1/2 hidden h-48 w-[58%] -translate-y-1/2 text-white/10 md:block"
      viewBox="0 0 720 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 72C96 22 174 28 242 70C326 122 414 116 510 62C578 24 650 24 712 54"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M12 122C110 78 194 84 266 126C344 172 438 166 526 116C600 74 660 78 710 106"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.72"
      />
      <path
        d="M38 166C120 136 190 142 256 174C330 210 416 208 500 168C580 130 648 130 704 152"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.45"
      />
      <circle cx="586" cy="78" r="4" fill="#B89A5D" opacity="0.62" />
      <circle cx="626" cy="94" r="2.5" fill="#B89A5D" opacity="0.42" />
      <circle cx="536" cy="146" r="3" fill="#B89A5D" opacity="0.48" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
