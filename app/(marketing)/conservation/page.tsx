import type { Metadata } from "next";
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
  },
  {
    name: "Raja Ampat Blue Water Trust",
    location: "West Papua",
    body: "Community reef patrols and coral nursery support",
    report: "June 2026",
  },
  {
    name: "Bali Ocean Classroom",
    location: "Bali",
    body: "Youth ocean education and coastal waste reduction",
    report: "July 2026",
  },
];

const reportItems = [
  {
    title: "Where funds moved",
    body: "Partner, region, contribution amount, and the booking month that created it.",
    icon: "waves",
  },
  {
    title: "What changed",
    body: "Photos, notes, receipts, and field updates as partners provide them.",
    icon: "file",
  },
  {
    title: "What is next",
    body: "The next reef, waste, education, or monitoring project BluePass is funding.",
    icon: "leaf",
  },
];

export default function ConservationPage() {
  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
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
                <span
                  className="mt-1 h-20 w-px bg-white/70"
                  aria-hidden="true"
                />
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

        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-4 md:grid-cols-3">
            {proofPoints.map((point) => (
              <article
                key={point.title}
                className="border border-white/12 bg-[#03111d]/70 p-6 shadow-[0_14px_44px_rgba(0,0,0,0.22)] backdrop-blur-xl"
              >
                <p className="bp-page-title text-4xl leading-none text-[#B89A5D]">
                  {point.value}
                </p>
                <h2 className="bp-page-title mt-5 text-xl leading-none text-white/84">
                  {point.title}
                </h2>
                <p className="mt-3 text-sm font-light leading-6 text-white/56">
                  {point.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="partner-evidence"
          className="relative overflow-hidden border-y border-white/10 px-[var(--cinematic-screen-x)] py-14 md:py-20"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${partnerEvidenceImage}')` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="bp-film-grain absolute inset-0" />
          <div className="relative mx-auto max-w-6xl">
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
                  className="border border-white/12 bg-[#03111d]/70 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-colors hover:border-white/24"
                >
                  <LeafIcon />
                  <h3 className="bp-page-title mt-5 text-xl leading-none text-white/84">
                    {partner.name}
                  </h3>
                  <p className="mt-2 text-sm font-light text-white/46">
                    {partner.location}
                  </p>
                  <p className="mt-4 text-sm font-light leading-6 text-white/56">
                    {partner.body}
                  </p>
                  <p className="mt-5 text-[11px] font-normal tracking-[0.16em] text-[#B89A5D]">
                    Next report {partner.report}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                Monthly report
              </p>
              <h2 className="bp-page-title mt-4 max-w-md text-xl leading-none text-white/82 md:text-2xl">
                Reports will be dated, readable, and hard to fake.
              </h2>
            </div>
            <div className="grid gap-3">
              {reportItems.map((item) => (
                <article
                  key={item.title}
                  className="grid gap-4 border border-white/12 bg-[#03111d]/76 p-5 md:grid-cols-[2.5rem_1fr] md:items-start"
                >
                  <ReportIcon type={item.icon} />
                  <div>
                    <h3 className="bp-page-title text-xl leading-none text-white/84">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-light leading-6 text-white/56">
                      {item.body}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] py-16 text-center md:py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${conservationCtaImage}')` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="bp-film-grain absolute inset-0" />
          <div className="bp-rounded-surface relative mx-auto max-w-4xl border border-white/12 bg-[#03111d]/72 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-10">
            <h2 className="bp-page-title text-2xl leading-none text-white md:text-3xl">
              5% of every booking goes back to the ocean.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-6 text-white/56 md:text-[15px]">
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
        </section>
      </main>
      <BluePassFooter />
    </>
  );
}

function LeafIcon() {
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
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}

function ReportIcon({ type }: { type: string }) {
  if (type === "file") {
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
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
        <path d="M14 2v4a2 2 0 0 0 2 2h4" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    );
  }

  if (type === "waves") {
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
        <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
        <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" />
      </svg>
    );
  }

  return <LeafIcon />;
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
