import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import {
  featuredReels,
  partnerAudiences,
  partnerBenefitCards,
  partnerHero,
  partnerRegions,
  partnerSteps,
  partnerToolkit,
} from "@/lib/data/creators-page-content";
import { ReelsCarousel } from "./ReelsCarousel";

export const metadata: Metadata = {
  title: "Partner Program | BluePass",
  description:
    "BluePass helps dive shops, travel agencies, advisors, trip leaders, and ocean partners earn on Indonesia bookings while funding reef conservation.",
};

const heroImage = "/creators/hero.jpg";

const partnerSignals = [
  { value: "5%", label: "founding partner commission" },
  { value: "No", label: "client markup" },
  { value: "1", label: "Indonesia operator catalogue" },
];

const partnerStoryMoments = [
  {
    label: "01",
    title: "A client asks where to dive.",
    body: "You send one BluePass link.",
  },
  {
    label: "02",
    title: "They see vetted Indonesia operators.",
    body: "No markup. No messy handoff.",
  },
  {
    label: "03",
    title: "The booking funds the reef.",
    body: "You earn. They get proof.",
  },
];

const partnerFlowLabels = ["Claim", "Share", "Book", "Prove"];
const partnerStepIcons = ["link", "page", "earn", "reef"];

const toolkitShortCopy = [
  "Vetted trips",
  "Attribution",
  "Reef proof",
  "Human backup",
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
    role: "Photo and film partner documenting remote Indonesia, sailing, and ocean conservation.",
    href: "https://www.instagram.com/camvaughne/",
    image: "/creators/camvaughne.jpg",
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

export default function CreatorsPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center saturate-[0.82]"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.88),rgba(0,12,18,0.62)_45%,rgba(0,7,12,0.32)_74%,rgba(0,7,12,0.70)),linear-gradient(180deg,rgba(0,0,0,0.42),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.82))]" />
          <div className="absolute inset-0 bg-[#102820]/22 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="cinematic-hero-stage">
            <section className="max-w-[640px] border border-white/16 bg-[#03111d]/58 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
              <h1 className="bp-page-title text-[clamp(2rem,4vw,3.35rem)] leading-[0.98] text-white">
                Send your divers to Indonesia&apos;s best operators.
              </h1>
              <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
                <span
                  className="mt-1 h-full w-px self-stretch bg-white/70"
                  aria-hidden="true"
                />
                <p className="max-w-[30rem] text-sm font-light leading-[1.75] text-white/68 md:text-[15px]">
                  They pay the operator&apos;s own rate. You earn on every
                  booking. Every trip funds reef conservation in the exact place
                  they dive.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/signup"
                  className="bp-focus-ring inline-flex h-11 min-w-[190px] items-center justify-center rounded-full bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  {partnerHero.primaryLabel}
                </Link>
                <a
                  href="https://wa.me/628213143343"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center rounded-full border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  {partnerHero.secondaryLabel}
                </a>
              </div>
            </section>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/10 bg-[#020b11] px-[var(--cinematic-screen-x)] py-14 text-white md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_12%_0%,rgba(0,111,142,0.20),transparent_36%),radial-gradient(ellipse_at_86%_20%,rgba(184,154,93,0.12),transparent_34%),linear-gradient(180deg,rgba(4,17,29,0.94),#020b11_76%)]"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-[#B89A5D]">
                  Why partner with BluePass
                </p>
                <h2 className="bp-page-title mt-4 max-w-[42rem] text-[clamp(1.9rem,3vw,2.75rem)] leading-[1.02] text-white/92">
                  One trusted recommendation.
                  <span className="block">A cleaner booking path.</span>
                </h2>
              </div>
              <div className="grid w-full max-w-xl gap-3 sm:grid-cols-3 lg:justify-self-end">
                {partnerSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-[var(--bp-radius-sm)] border border-white/[0.10] bg-white/[0.035] px-4 py-4"
                  >
                    <p className="bp-page-title text-2xl leading-none text-white/90">
                      {signal.value}
                    </p>
                    <p className="mt-2 text-[9px] font-light uppercase leading-[1.45] tracking-[0.12em] text-white/42">
                      {signal.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-9 grid gap-4 lg:grid-cols-3">
              {partnerStoryMoments.map((moment) => (
                <div
                  key={moment.label}
                  className="group rounded-[var(--bp-radius-md)] border border-white/[0.10] bg-white/[0.045] p-6 shadow-[0_18px_54px_rgba(0,0,0,0.24)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[11px] font-semibold tracking-[0.16em] text-[#B89A5D]">
                      {moment.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-gradient-to-r from-[#B89A5D]/36 to-transparent"
                    />
                  </div>
                  <h3 className="bp-page-title mt-7 max-w-sm text-[clamp(1.35rem,2vw,1.75rem)] leading-[1.02] text-white/92">
                    {moment.title}
                  </h3>
                  <p className="mt-4 text-sm font-light leading-[1.65] text-white/52">
                    {moment.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {partnerBenefitCards.map((benefit) => (
                <div
                  key={benefit.title}
                  className="flex items-center gap-3 rounded-[var(--bp-radius-md)] border border-white/[0.08] bg-white/[0.03] px-4 py-3"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[var(--bp-radius-sm)] border border-[#B89A5D]/26 bg-[#B89A5D]/10">
                    <BenefitIcon
                      type={benefit.icon}
                      className="text-[#d4b56f]"
                    />
                  </span>
                  <p className="text-sm font-semibold leading-snug text-white/78">
                    {benefit.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/[0.08] bg-[#020b11] px-[var(--cinematic-screen-x)] py-14 text-white md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,111,142,0.08),transparent_34%,rgba(184,154,93,0.05))]"
          />
          <div className="relative mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-[0.7fr_1fr] md:items-end">
              <div>
                <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-[#B89A5D]">
                  How it works
                </p>
                <h2 className="bp-page-title mt-4 max-w-md text-[clamp(1.8rem,3vw,2.65rem)] font-normal leading-[0.98] text-white/90">
                  Four quiet moves.
                </h2>
              </div>
              <div className="flex flex-wrap gap-2 md:justify-self-end">
                {["Clean booking path", "Tracked attribution", "Reef proof"].map(
                  (label) => (
                    <span
                      key={label}
                      className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-2 text-[12px] font-medium text-white/58"
                    >
                      {label}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div className="mt-9 grid gap-3 md:grid-cols-4">
              {partnerSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative min-h-44 rounded-[var(--bp-radius-md)] border border-white/[0.10] bg-white/[0.045] p-5 shadow-[0_12px_36px_rgba(0,0,0,0.18)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-[var(--bp-radius-sm)] border border-[#B89A5D]/30 bg-[#B89A5D]/10">
                      <BenefitIcon
                        type={partnerStepIcons[index]}
                        className="text-[#d4b56f]"
                      />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B89A5D]">
                      {partnerFlowLabels[index]}
                    </span>
                  </div>
                  <h3 className="mt-8 text-[17px] font-semibold leading-tight text-white/86">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[13px] font-light leading-[1.55] text-white/48">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              <span className="mr-1 text-sm font-light text-white/38">
                Operators across
              </span>
              {partnerRegions.map((region) => (
                <span
                  key={region}
                  className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-[#a8e5e8]"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden border-t border-white/[0.08] bg-[#04111d] px-[var(--cinematic-screen-x)] py-14 text-white md:py-20">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_0%,rgba(184,154,93,0.08),transparent_34%),radial-gradient(ellipse_at_20%_82%,rgba(0,111,142,0.13),transparent_42%)]"
          />
          <div className="relative mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.74fr_1.26fr] lg:items-start">
            <div className="relative">
              <p className="text-[11px] font-normal uppercase tracking-[0.18em] text-[#B89A5D]">
                What you get
              </p>
              <h2 className="bp-page-title mt-4 max-w-xl text-[clamp(1.8rem,3vw,2.5rem)] font-normal leading-tight text-white/90">
                Everything useful. Nothing new to operate.
              </h2>
              <div className="mt-7 flex flex-wrap gap-2">
                {partnerAudiences.map((audience) => (
                  <span
                    key={audience}
                    className="rounded-full border border-white/[0.12] bg-white/[0.04] px-3.5 py-2 text-sm font-light text-white/58"
                  >
                    {audience}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative rounded-[var(--bp-radius-md)] border border-white/[0.12] bg-[#020b11]/62 shadow-[0_24px_80px_rgba(0,0,0,0.32)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] px-5 py-4 md:px-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
                  Partner toolkit
                </p>
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b08c3c]">
                  Founding 5%
                </p>
              </div>
              <div className="border-b border-white/[0.08] px-5 py-4 md:px-6">
                <div className="flex items-center justify-between gap-4 rounded-[var(--bp-radius-sm)] border border-white/[0.10] bg-white/[0.035] px-4 py-3">
                  <span className="truncate text-sm font-medium text-white/82">
                    bluepass.co/p/your-company
                  </span>
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#a8e5e8]">
                    tracked
                  </span>
                </div>
              </div>

              <div className="grid gap-3 p-4 sm:grid-cols-2 md:p-5">
                {partnerToolkit.map((item, index) => (
                  <div
                    key={item.title}
                    className="rounded-[var(--bp-radius-sm)] border border-white/[0.10] bg-white/[0.035] p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[var(--bp-radius-sm)] border border-[#B89A5D]/32 bg-[#B89A5D]/10">
                        <BenefitIcon
                          type={index === 1 ? "link" : "page"}
                          className="text-[#d4b56f]"
                        />
                      </span>
                      <div>
                        <h3 className="text-[15px] font-semibold leading-snug text-white/84">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm font-light leading-[1.6] text-white/50">
                          {toolkitShortCopy[index]}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          id="featured-creators"
          className="border-y border-white/10 bg-[#04111d] px-[var(--cinematic-screen-x)] py-14 md:py-20"
        >
          <div className="mx-auto max-w-6xl">
            <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
              Featured partners
            </p>
            <h2 className="bp-page-title mt-4 max-w-3xl text-xl leading-none text-white/82 md:text-2xl">
              The kind of taste BluePass is built for.
            </h2>
            <div className="bp-reveal mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-2 xl:grid-cols-3">
              {creators.map((creator) => (
                <Link key={creator.name} href={creator.href} className="block">
                  <article className="bp-tech-card group border border-white/[0.09]">
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <Image
                        src={creator.image}
                        alt={`${creator.name} Instagram profile picture`}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                      <div className="bp-scan-grid" />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(to top, #020b11 0%, rgba(2,11,17,0.80) 28%, rgba(2,11,17,0.22) 52%, transparent 68%)",
                        }}
                      />
                      <div className="absolute left-3 top-3 z-10">
                        <span
                          className="border border-white/14 bg-black/52 px-2 py-[3px] text-[10px] tracking-[0.13em] text-white/82"
                          style={{
                            borderRadius: "6px",
                            backdropFilter: "blur(6px)",
                          }}
                        >
                          {creator.handle}
                        </span>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                        <p className="bp-page-title text-[1.2rem] leading-tight text-white/92">
                          {creator.name}
                        </p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/38">
                          {creator.location}
                        </p>
                        <p className="mt-2 line-clamp-2 text-[0.78rem] leading-[1.5] text-white/56">
                          {creator.role}
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_12%,rgba(184,154,93,0.18),transparent_28%),radial-gradient(ellipse_at_70%_30%,rgba(80,111,94,0.13),transparent_46%),linear-gradient(180deg,rgba(4,17,29,0),rgba(7,24,39,0.50)_48%,rgba(2,11,17,0))]" />
          <div className="relative mx-auto max-w-6xl">
            <div className="bp-reveal grid gap-5 border-b border-white/10 pb-8 md:grid-cols-[0.86fr_1.14fr] md:items-end">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Most viewed reels
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-2xl leading-none text-white/90 md:text-3xl">
                  Proof that trust has a visual language.
                </h2>
              </div>
              <p className="max-w-2xl text-sm font-light leading-6 text-white/68 md:text-[15px]">
                These are not ad units. They are the kind of ocean stories that
                make a client ask, &quot;Can we do that trip?&quot; The carousel now
                uses local poster images first, so the shelf stays visually
                intact even when Instagram does not return a thumbnail.
              </p>
            </div>

            <ReelsCarousel reels={featuredReels} />
          </div>
        </section>

        <section className="px-[var(--cinematic-screen-x)] py-16 text-center md:py-24">
          <div className="mx-auto max-w-4xl">
            <h2 className="bp-page-title text-2xl leading-none text-white md:text-3xl">
              Claim your founding-partner link.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm font-light leading-[1.8] text-white/48">
              Lock 5% for the founding cohort, get your tracked link and
              operator catalogue, and put a reef-impact story in front of your
              clients.
            </p>
            <Link
              href="/signup"
              className="bp-focus-ring mt-8 inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-medium text-[#071827] transition-colors hover:bg-white/90"
            >
              Claim my 5% founding link
              <ArrowIcon />
            </Link>
            <p className="mt-5 text-[11px] font-light text-white/30">
              Book + protect the ocean. Never a markup. 5% to the reef.
            </p>
          </div>
        </section>
      </main>
      <BluePassFooter />
    </>
  );
}

function BenefitIcon({
  type,
  className = "text-[#B89A5D]",
}: {
  type: string;
  className?: string;
}) {
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
    trust: (
      <>
        <path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z" />
        <path d="m9 12 2 2 4-5" />
      </>
    ),
    reef: (
      <>
        <path d="M12 22V12" />
        <path d="M8 22v-6" />
        <path d="M16 22v-7" />
        <path d="M4 22v-4" />
        <path d="M20 22v-5" />
        <path d="M12 12c-3.8 0-6-1.9-6-4.5S8.2 3 12 3s6 1.9 6 4.5S15.8 12 12 12Z" />
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
      className={`h-5 w-5 ${className}`}
      aria-hidden="true"
    >
      {paths[type as keyof typeof paths] ?? paths.page}
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
