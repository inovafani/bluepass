import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";

export const metadata: Metadata = {
  title: "Creators | BluePass",
  description:
    "BluePass helps trusted ocean creators share Indonesia trips and earn clean attribution.",
};

const heroImage = "/creators/hero.jpg";

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
  },
  {
    title: "Clean attribution",
    body: "Followers book from your link. No messy tracking pitch needed.",
  },
  {
    title: "Creator earnings",
    body: "Commission comes from BluePass, with reef funding still included.",
  },
  {
    title: "Operator access",
    body: "Warm intros to crews when the trip fits your audience.",
  },
];

const creators = [
  {
    name: "Josiah William Gordon",
    handle: "@josiahwg",
    location: "Indonesia / New Zealand",
    role: "Fine-art travel photographer with a cinematic, destination-led eye.",
    href: "https://www.instagram.com/josiahwg?igsh=Y2J6cXVtcW55aHAy",
    image: "/creators/josiahwg.jpg",
  },
  {
    name: "Cam Vaughne",
    handle: "@camvaughne",
    location: "Bali, Indonesia",
    role: "Photo and film creator documenting remote Indonesia, sailing, and ocean conservation.",
    href: "https://www.instagram.com/camvaughne?igsh=ZjFtZzdhOXA4MzR1",
    image: "/creators/camvaughne.jpg",
  },
  {
    name: "Christian LeBlanc",
    handle: "@lostleblanc",
    location: "Global",
    role: "Travel and filmmaking creator behind Lost LeBlanc, built around cinematic guides and creator education.",
    href: "https://www.instagram.com/lostleblanc?igsh=MWw1eG5vdmQxeHEzYg==",
    image: "/creators/lostleblanc.jpg",
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
              <p className="mb-6 text-[10px] font-normal text-[#B89A5D]">
                Creators
              </p>
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
                  href="mailto:jeff@bluepass.travel?subject=BluePass%20creator%20program"
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

        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Creator program
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-xl leading-none text-white/82 md:text-2xl">
                  Your taste becomes the trip plan.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-6 text-white/54 md:text-[15px]">
                Keep the romance of storytelling. Add a booking path behind it.
              </p>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div
                className="bp-rounded-surface min-h-[420px] border border-white/12 bg-cover bg-center p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:p-8"
                style={{ backgroundImage: `url('${heroImage}')` }}
              >
                <div className="bp-rounded-surface flex h-full min-h-[360px] flex-col justify-end bg-[linear-gradient(180deg,transparent,rgba(0,7,12,0.78))] p-5">
                  <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                    BluePass creator page
                  </p>
                  <p className="bp-page-title mt-3 max-w-md text-xl leading-none text-white/82 md:text-2xl">
                    One link for the trips you believe in.
                  </p>
                </div>
              </div>

              <div className="grid gap-3">
                {steps.map((step, index) => (
                  <article
                    key={step.verb}
                    className="grid min-h-[132px] grid-cols-[3.25rem_1fr] items-center gap-4 border border-white/12 bg-[#03111d]/76 p-5 transition-colors hover:border-white/24 hover:bg-white/[0.035]"
                  >
                    <span className="grid h-11 w-11 place-items-center border border-[#B89A5D]/40 bg-[#B89A5D]/14 text-sm font-normal text-[#f4d891]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                        {step.verb}
                      </p>
                      <p className="mt-2 max-w-md text-sm font-light leading-6 text-white/62 md:text-base">
                        {step.title}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-[#04111d] px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                What you get
              </p>
              <h2 className="bp-page-title mt-4 max-w-md text-xl leading-none text-white/82 md:text-2xl">
                Creator tools without the ugly sales funnel.
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {creatorBenefits.map((benefit) => (
                <article
                  key={benefit.title}
                  className="min-h-[170px] border border-white/12 bg-white/[0.035] p-5 transition-colors hover:border-white/24"
                >
                  <CheckIcon />
                  <p className="bp-page-title mt-5 text-xl leading-none text-white/82">
                    {benefit.title}
                  </p>
                  <p className="mt-3 text-sm font-light leading-6 text-white/54">
                    {benefit.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="bp-rounded-surface mx-auto grid max-w-6xl gap-8 border border-white/12 bg-[#03111d]/70 p-6 md:p-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <h2 className="bp-page-title text-xl leading-none text-white/82 md:text-2xl">
              Built for real ocean people.
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                "Dive instructors",
                "Ocean photographers",
                "Travel filmmakers",
                "Sailing storytellers",
                "Conservation educators",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/14 bg-white/[0.035] px-3 py-2 text-sm font-light text-white/62"
                >
                  {item}
                </span>
              ))}
            </div>
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
            <div className="mt-8 grid gap-5 md:grid-cols-3">
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

        <section className="px-[var(--cinematic-screen-x)] py-16 text-center md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="bp-page-title text-2xl leading-none text-white md:text-3xl">
              Want your ocean stories to move bookings and fund reefs?
            </h2>
            <Link
              href="mailto:jeff@bluepass.travel?subject=BluePass%20creator%20program"
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

function CheckIcon() {
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
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
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
