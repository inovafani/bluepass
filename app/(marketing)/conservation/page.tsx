import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";

export const metadata: Metadata = {
  title: "Conservation | BluePass",
  description:
    "BluePass reserves 5% of every booking for reef restoration and ocean protection.",
};

const heroImage =
  "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=2200&q=82";
const partnerEvidenceImage = "/conservation/partner-evidence.jpg";
const conservationCtaImage = "/conservation/final-cta.jpg";

const proofPoints = [
  {
    value: "5%",
    title: "Booking contribution",
    body: "Every BluePass booking reserves 5% for reef restoration.",
  },
  {
    value: "Monthly",
    title: "Reporting rhythm",
    body: "Impact notes will be dated and public as partner reporting comes online.",
  },
  {
    value: "Named",
    title: "Partner rule",
    body: "We will not ask travelers to trust anonymous conservation claims.",
  },
];

const partners = [
  {
    name: "Komodo Reef Fund",
    location: "Labuan Bajo",
    body: "Reef restoration, local monitoring, and mooring education",
    report: "June 2026",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=80",
    alt: "Diver gliding above a coral reef",
  },
  {
    name: "Raja Ampat Blue Water Trust",
    location: "West Papua",
    body: "Community reef patrols and coral nursery support",
    report: "June 2026",
    image:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    alt: "Turquoise island coastline from above",
  },
  {
    name: "Bali Ocean Classroom",
    location: "Bali",
    body: "Youth ocean education and coastal waste reduction",
    report: "July 2026",
    image:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1600&q=80",
    alt: "Remote blue lagoon and white sand beach",
  },
];

const reportItems = [
  {
    title: "Where funds moved",
    body: "Partner, region, contribution amount, and the booking month that created it.",
    icon: "flow",
  },
  {
    title: "What changed",
    body: "Photos, notes, receipts, and field updates as partners provide them.",
    icon: "verify",
  },
  {
    title: "What is next",
    body: "The next reef, waste, education, or monitoring project BluePass is funding.",
    icon: "sprout",
  },
];

export default function ConservationPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">

        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative min-h-svh overflow-hidden bg-[#020b11] text-white">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center saturate-[0.9]"
            style={{ backgroundImage: `url('${heroImage}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.88),rgba(0,15,21,0.48)_50%,rgba(0,8,14,0.72)),linear-gradient(180deg,rgba(0,0,0,0.36),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.76))]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />
          <div className="cinematic-hero-stage">
            <section className="max-w-[640px] border border-white/16 bg-[#03111d]/58 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
              <h1 className="bp-page-title text-[clamp(2.25rem,5vw,4rem)] leading-[0.96] text-white">
                5% of every booking goes back to the ocean.
              </h1>
              <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
                <span className="mt-1 h-20 w-px bg-white/70" aria-hidden="true" />
                <p className="max-w-[29rem] text-sm font-light leading-[1.75] text-white/64 md:text-[15px]">
                  Conservation cannot be a footer promise. BluePass is building
                  the reporting layer that shows where booking contributions go,
                  when they move, and which partners are responsible.
                </p>
              </div>
              <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
                <Link
                  href="/explore-indonesia"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Find a trip
                </Link>
                <a
                  href="#partner-evidence"
                  className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-medium text-white transition-colors hover:bg-white/10"
                >
                  See partners
                </a>
              </div>
            </section>
          </div>
        </section>

        {/* ── Proof points ────────────────────────────────────────────────── */}
        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="bp-reveal mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {proofPoints.map((point) => (
              <article
                key={point.title}
                className="bp-tech-card bp-card-quiet relative border border-white/[0.09] p-7 md:p-8"
              >
                {/* Gold top stripe */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-[2px] rounded-t-[14px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(184,154,93,0.55) 30%, rgba(184,154,93,0.55) 70%, transparent 100%)",
                  }}
                />
                {/* Stat value */}
                <p className="bp-page-title text-[3.5rem] leading-none text-[#B89A5D]">
                  {point.value}
                </p>
                {/* Thin rule */}
                <div className="my-5 h-px bg-white/[0.07]" />
                {/* Label + description */}
                <p
                  className="text-[10px] uppercase tracking-[0.22em] text-white/38"
                  style={{ fontFamily: "var(--bp-font-mono)" }}
                >
                  {point.title}
                </p>
                <p className="mt-2.5 text-sm font-light leading-[1.75] text-white/60">
                  {point.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* ── Partner evidence ────────────────────────────────────────────── */}
        <section
          id="partner-evidence"
          className="relative overflow-hidden border-y border-white/10 px-[var(--cinematic-screen-x)] py-14 md:py-20"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center saturate-[0.6]"
            style={{ backgroundImage: `url('${partnerEvidenceImage}')` }}
          />
          <div className="absolute inset-0 bg-[#020b11]/58" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="bp-reveal relative mx-auto max-w-6xl">
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Partner evidence
                </p>
                <h2 className="bp-page-title mt-4 max-w-xl text-xl leading-none text-white/82 md:text-2xl">
                  The promise gets stronger when the names are visible.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-6 text-white/54 md:text-[15px]">
                Every partner is named, every report has a date, and the work is
                tied back to the bookings that funded it.
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {partners.map((partner) => (
                <article
                  key={partner.name}
                  className="bp-tech-card bp-card-quiet group border border-white/[0.09]"
                >
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={partner.image}
                      alt={partner.alt}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      loading="lazy"
                      quality={72}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, #020b11 0%, rgba(2,11,17,0.84) 30%, rgba(2,11,17,0.32) 56%, transparent 74%)",
                      }}
                    />
                    {/* Partner badge */}
                    <div className="absolute left-3 top-3 z-10">
                      <span
                        className="border border-[rgba(0,185,165,0.28)] bg-[rgba(0,185,165,0.10)] px-2 py-[3px] text-[10px] tracking-[0.14em] text-[rgba(0,220,200,0.88)]"
                        style={{ fontFamily: "var(--bp-font-mono)", borderRadius: "6px" }}
                      >
                        Partner
                      </span>
                    </div>
                    {/* Content overlay */}
                    <div className="absolute inset-x-0 bottom-0 z-10 p-4">
                      <h3 className="bp-page-title text-[1.15rem] leading-tight text-white/92">
                        {partner.name}
                      </h3>
                      <p
                        className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/38"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        {partner.location}
                      </p>
                      <p className="mt-2 line-clamp-2 text-[0.78rem] leading-[1.5] text-white/58">
                        {partner.body}
                      </p>
                      <div
                        className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        <span className="text-[10px] uppercase tracking-[0.14em] text-white/34">
                          Next report
                        </span>
                        <span className="text-[10px] tracking-[0.12em] text-[#B89A5D]">
                          {partner.report}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Monthly report ───────────────────────────────────────────────── */}
        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="bp-reveal mx-auto max-w-6xl">
            {/* Heading row */}
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Monthly report
                </p>
                <h2 className="bp-page-title mt-4 max-w-md text-xl leading-none text-white/82 md:text-2xl">
                  Reports will be dated, readable, and hard to fake.
                </h2>
              </div>
              <p className="text-sm font-light leading-[1.75] text-white/36 md:text-right">
                Every line tied to a named partner and a booking month.
              </p>
            </div>

            {/* Compact single-row — 3 columns divided */}
            <div className="grid divide-y divide-white/[0.07] border border-white/[0.07] bg-white/[0.015] md:grid-cols-3 md:divide-x md:divide-y-0">
              {reportItems.map((item, i) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 px-5 py-5"
                >
                  <div className="flex shrink-0 flex-col items-center gap-2 pt-0.5">
                    <span
                      className="text-[10px] text-white/22"
                      style={{ fontFamily: "var(--bp-font-mono)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div
                      className="flex h-8 w-8 items-center justify-center border border-white/[0.08] bg-white/[0.02]"
                      style={{ borderRadius: "6px" }}
                    >
                      <ReportIcon type={item.icon} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h3 className="bp-page-title text-[0.9375rem] leading-tight text-white/86">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-[12px] font-light leading-[1.65] text-white/44">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] py-16 text-center md:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center saturate-[0.7]"
            style={{ backgroundImage: `url('${conservationCtaImage}')` }}
          />
          <div className="absolute inset-0 bg-[#020b11]/58" />
          <div className="bp-film-grain absolute inset-0" />
          <div className="bp-reveal relative mx-auto max-w-4xl overflow-hidden rounded-2xl p-6 shadow-[0_24px_80px_rgba(0,0,0,0.30)] md:p-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(156,126,96,0.42),rgba(20,24,30,0.44))] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-[34px] backdrop-saturate-150"
            />
            <div className="relative z-10">
              <h2 className="bp-page-title text-2xl leading-none text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.38)] md:text-3xl">
                5% of every booking goes back to the ocean.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-6 text-white/72 drop-shadow-[0_1px_12px_rgba(0,0,0,0.35)] md:text-[15px]">
                BluePass will publish named partners, dated updates, and monthly
                notes as bookings begin moving through the marketplace.
              </p>
              <Link
                href="/explore-indonesia"
                className="bp-focus-ring mt-8 inline-flex h-12 items-center justify-center gap-2 bg-white px-6 text-sm font-medium text-[#071827] transition-colors hover:bg-white/90"
              >
                Find a trip that funds the reef
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

      </main>
      <BluePassFooter />
    </>
  );
}

/* ── Icons ──────────────────────────────────────────────────────────────── */

function ReportIcon({ type }: { type: string }) {
  if (type === "flow") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#B89A5D]"
        aria-hidden="true"
      >
        <path d="m8 3-4 4 4 4" />
        <path d="M4 7h16" />
        <path d="m16 21 4-4-4-4" />
        <path d="M20 17H4" />
      </svg>
    );
  }

  if (type === "verify") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#B89A5D]"
        aria-hidden="true"
      >
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    );
  }

  if (type === "sprout") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#B89A5D]"
        aria-hidden="true"
      >
        <path d="M7 20h10" />
        <path d="M10 20c5.5-2.5.8-6.4 3-10" />
        <path d="M9.5 9.4c1.1.8 1.8 2.1 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" />
        <path d="M14.1 6a7 7 0 0 1 1.1 4.8 4.5 4.5 0 0 1-4.6-1A5 5 0 0 1 9 5.6c2.5-.4 4.2.3 5.1.4z" />
      </svg>
    );
  }

  return null;
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
