import Image from "next/image";
import { SignupForm } from "./SignupForm";
import { BluePassFooter } from "@/app/components/BluePassFooter";

/* ─────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────── */

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
    role: "Travel and filmmaking creator behind Lost LeBlanc, built around cinematic guides.",
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

const operatorComparisons = [
  {
    label: "vs. OTA commission",
    before: "20–30%",
    beforeNote: "of every sale leaves to the platform",
    after: "Flat fee",
    afterNote: "one predictable BluePass fee per booking",
  },
  {
    label: "vs. paid traffic",
    before: "Cold",
    beforeNote: "anonymous visitors from an ad they half-scrolled",
    after: "Warm",
    afterNote: "travellers already trusting the creator who sent them",
  },
  {
    label: "vs. admin overhead",
    before: "Manual",
    beforeNote: "phone-tags, email chains, DM follow-ups",
    after: "WhatsApp",
    afterNote: "Kai handles enquiries, you close in WhatsApp Business",
  },
];

const meshFlow = [
  {
    num: "01",
    actor: "Creator",
    action: "Shares a trip their ocean audience already trusts.",
    accent: "#B89A5D",
  },
  {
    num: "02",
    actor: "Traveller",
    action: "Books through a recommendation, not a listing.",
    accent: "#9fe8df",
  },
  {
    num: "03",
    actor: "Operator",
    action: "Receives a warm, verified lead — no OTA middleman.",
    accent: "#ffffff",
  },
  {
    num: "04",
    actor: "Reef",
    action: "Gets funded automatically with every completed booking.",
    accent: "#4ade80",
  },
];

/* ─────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────── */

export default function SignupPage() {
  return (
    <>
      {/* ── STORY SECTIONS ──────────────────────────────── */}
      <div className="cinematic-page bg-[#020b11] text-white">
        {/* ── 1. FEATURED CREATORS ─────────────────────── */}
        {/*
            Background: underwater coral reef, Komodo National Park, Indonesia
            Photo by Johnny Africa on Unsplash
        */}
        <section className="relative overflow-hidden px-[var(--cinematic-screen-x)] pb-20 pt-24 md:pb-28 md:pt-32">
          {/* Underwater background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-[center_60%] saturate-[0.78]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1644027621533-633fe3de243a?w=1920&q=80&fit=crop')",
            }}
          />
          {/* Layered overlay — deep navy base + top/bottom fades */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#020b11]/74"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,11,17,0.72),rgba(2,11,17,0.22)_38%,rgba(2,11,17,0.22)_62%,rgba(2,11,17,0.82))]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0c3b3a]/14 mix-blend-color"
          />

          {/* Content */}
          <div className="bp-reveal relative z-10 mx-auto max-w-6xl">
            {/* Header row */}
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Featured creators
                </p>
                <h2 className="bp-page-title mt-4 text-[clamp(2.25rem,5vw,4rem)] leading-[0.94] text-white">
                  Every trip starts
                  <br />
                  with someone
                  <br />
                  who&apos;s been there.
                </h2>
                <a
                  href="#join"
                  className="bp-focus-ring mt-8 inline-flex h-11 items-center gap-2 bg-white px-6 text-[11px] font-medium text-[#071827] transition-colors hover:bg-white/90"
                >
                  Sign up now
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
                </a>
              </div>
              <p className="max-w-xl text-sm font-light leading-[1.85] text-white/56 md:text-[15px]">
                BluePass only partners with verified ocean creators — dive
                instructors, photographers, sailors, and conservation educators
                who took the trip before they ever recommended it. When they
                share a booking link, their audience already trusts it.
              </p>
            </div>

            {/* Creator grid */}
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {creators.map((creator) => (
                <a
                  key={creator.name}
                  href={creator.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bp-rounded-surface group border border-white/18 bg-white/[0.07] shadow-[0_8px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition-transform duration-200 hover:-translate-y-0.5 hover:border-white/28 hover:bg-white/[0.11]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={creator.image}
                      alt={`${creator.name} – BluePass ocean creator`}
                      fill
                      sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] tracking-[0.16em] text-[#B89A5D]">
                      {creator.handle}
                    </p>
                    <p className="bp-page-title mt-2 text-xl leading-none text-white/82">
                      {creator.name}
                    </p>
                    <p className="mt-2 text-sm font-light text-white/40">
                      {creator.location}
                    </p>
                    <p className="mt-3 text-sm font-light leading-6 text-white/54">
                      {creator.role}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── 2. CONSERVATION ──────────────────────────── */}
        <section className="relative overflow-hidden border-y border-white/10">
          <div className="grid lg:grid-cols-2">
            {/* Image column */}
            <div className="relative min-h-[400px] lg:min-h-[600px]">
              <Image
                src="/conservation/final-cta.jpg"
                alt="Reef conservation – funded by every BluePass booking"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover saturate-[0.9]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(to_right,transparent_55%,rgba(4,17,29,0.92)),linear-gradient(to_top,rgba(2,11,17,0.6),transparent_50%)]"
              />
              {/* Floating label on image */}
              <div className="absolute bottom-6 left-6 right-6 lg:right-auto lg:max-w-xs">
                <span className="inline-block rounded-sm border border-[#4ade80]/30 bg-[#4ade80]/10 px-3 py-1 text-[10px] tracking-[0.18em] text-[#4ade80]">
                  VERIFIED REEF RESTORATION
                </span>
                <p className="bp-page-title mt-3 text-xl leading-none text-white/86 drop-shadow-[0_2px_14px_rgba(0,0,0,0.7)] lg:text-2xl">
                  Indonesia&apos;s ocean, protected by your booking.
                </p>
              </div>
            </div>

            {/* Story column */}
            <div className="relative flex items-center overflow-hidden bg-[#04111d] px-[var(--cinematic-screen-x)] py-16 lg:px-14 lg:py-20">
              <OceanCurrentOrnament />
              <div className="bp-reveal relative max-w-xl">
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  Built into every booking
                </p>
                <h2 className="bp-page-title mt-4 text-[clamp(1.9rem,3.5vw,3.25rem)] leading-[0.95] text-white">
                  The reef gets funded.
                  <br />
                  No opt-in.
                  <br />
                  No asterisks.
                </h2>
                <p className="mt-7 text-sm font-light leading-[1.85] text-white/54 md:text-[15px]">
                  A portion of every BluePass booking flows directly to verified
                  reef restoration partners in Indonesia. Not a donate button.
                  Not a checkbox you skip. A structural commitment to the ocean
                  that makes every trip possible.
                </p>

                {/* Stat pills — rounded to match design system */}
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    { top: "Every", bottom: "single booking" },
                    { top: "Verified", bottom: "reef partners" },
                    { top: "Zero", bottom: "extra cost" },
                  ].map((item) => (
                    <div
                      key={item.bottom}
                      className="rounded-[var(--bp-radius-sm)] border border-white/12 bg-white/[0.03] p-4 text-center"
                    >
                      <p className="bp-page-title text-lg leading-none text-white/82">
                        {item.top}
                      </p>
                      <p className="mt-2 text-[11px] font-light leading-4 text-white/40">
                        {item.bottom}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Conservation image evidence */}
                <div className="mt-8 flex items-center gap-3">
                  <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-[var(--bp-radius-sm)]">
                    <Image
                      src="/conservation/partner-evidence.jpg"
                      alt="Conservation partner evidence"
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <p className="text-xs font-light leading-5 text-white/38">
                    We partner with on-the-ground organisations doing measurable
                    coral restoration — not offset schemes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. CHEAPER FOR OPERATORS ─────────────────── */}
        {/*
            🎨 Background colour lives on the <section> below.
            Change bg-[#04111d] to any hex value you like, e.g. bg-[#060e1a]
            The ambient glow colours are in the radial-gradient string below that.
        */}
        <section className="relative overflow-hidden bg-[#04111d] px-[var(--cinematic-screen-x)] py-20 md:py-28">
          {/* Ambient glow — gold from top-right, teal from bottom-left */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_76%_0%,rgba(184,154,93,0.09),transparent_50%),radial-gradient(ellipse_at_18%_100%,rgba(0,100,130,0.09),transparent_48%)]"
          />
          <div className="bp-reveal relative mx-auto max-w-6xl">
            <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-end">
              <div>
                <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                  For operators
                </p>
                <h2 className="bp-page-title mt-4 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.94] text-white">
                  Better leads.
                  <br />
                  Lower cost.
                  <br />
                  Warmer starts.
                </h2>
              </div>
              <p className="max-w-xl text-sm font-light leading-[1.85] text-white/56 md:text-[15px]">
                BluePass removes the three most expensive lines on every
                operator&apos;s P&amp;L and replaces each one with a channel
                that already knows how to tell your story.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {operatorComparisons.map((item) => (
                <article
                  key={item.label}
                  className="bp-fast-card border border-white/12 bg-[#071e30]/90 p-6 transition-colors hover:border-white/22 hover:bg-[#071e30]"
                >
                  <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                    {item.label}
                  </p>
                  <div className="mt-6 grid grid-cols-[1fr_1.25rem_1fr] items-start gap-2">
                    {/* Before */}
                    <div className="text-center">
                      <p className="bp-page-title text-xl text-white/30 line-through decoration-white/20">
                        {item.before}
                      </p>
                      <p className="mt-2 text-[11px] font-light leading-[1.5] text-white/28">
                        {item.beforeNote}
                      </p>
                    </div>
                    {/* Arrow */}
                    <p className="mt-1 text-center text-[#B89A5D]/50">→</p>
                    {/* After */}
                    <div className="text-center">
                      <p className="bp-page-title text-xl text-white/84">
                        {item.after}
                      </p>
                      <p className="mt-2 text-[11px] font-light leading-[1.5] text-white/52">
                        {item.afterNote}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Operator hero strip — rounded to match design system */}
            <div className="relative mt-8 overflow-hidden rounded-[var(--bp-radius-md)] border border-white/10">
              <div
                className="absolute inset-0 bg-cover bg-center saturate-50"
                style={{
                  backgroundImage: "url('/operator/operator-header.jpg')",
                }}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,11,17,0.88),rgba(2,11,17,0.44)_58%,rgba(2,11,17,0.82))]"
              />
              <div className="relative flex items-center justify-between gap-6 p-8 md:p-10">
                <div>
                  <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                    WhatsApp-first
                  </p>
                  <p className="bp-page-title mt-3 max-w-md text-2xl leading-none text-white/86 md:text-3xl">
                    Operate entirely in the app your guests already live in.
                  </p>
                </div>
                <div className="hidden shrink-0 text-right md:block">
                  <p className="text-sm font-light leading-7 text-white/48">
                    No new dashboards.
                    <br />
                    No new apps.
                    <br />
                    Just WhatsApp.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. REFERRAL MESH ─────────────────────────── */}
        {/*
            Background: aerial view of Raja Ampat islands, Indonesia
            Photo on Unsplash — the archipelago from above reads as a
            living network: islands as nodes, ocean channels as mesh lines. testing
        */}
        <section className="relative overflow-hidden border-y border-white/10">
          {/* Raja Ampat aerial background */}
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-[center_35%] saturate-[0.7]"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1703769605300-95c02ea2cb67?w=1920&q=80&fit=crop')",
            }}
          />
          {/* Deep overlay — tune opacity here: /72=too light · /82=balanced · /90=too dark */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#04111d]/40"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,17,29,0.65),rgba(4,17,29,0.12)_35%,rgba(4,17,29,0.12)_65%,rgba(4,17,29,0.65))]"
          />
          {/* Subtle color tint to blend ocean teal with brand */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgba(184,154,93,0.07),transparent_50%),radial-gradient(ellipse_at_75%_40%,rgba(159,232,223,0.06),transparent_48%)]"
          />
          <ReferralMeshWaves />

          <div className="relative z-10 px-[var(--cinematic-screen-x)] py-20 md:py-28">
            <div className="bp-reveal mx-auto max-w-6xl">
              <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center">
                {/* Left: headline + copy */}
                <div>
                  <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
                    The network
                  </p>
                  <h2 className="bp-page-title mt-4 text-[clamp(2.25rem,4.5vw,3.75rem)] leading-[0.94] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.9)]">
                    One trusted voice.
                    <br />
                    A self-growing
                    <br />
                    referral mesh.
                  </h2>
                  <p className="mt-7 max-w-md text-sm font-light leading-[1.85] text-white/72 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] md:text-[15px]">
                    Every booking tightens the trust loop. Better creators
                    attract better operators. Better operators bring warmer
                    travellers. The mesh deepens with every trip — and the reef
                    grows with it.
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <span className="h-px w-12 bg-[#B89A5D]/40" />
                    <p className="text-[11px] font-normal tracking-[0.14em] text-white/52">
                      SELF-REINFORCING · TRUST-GATED · CONSERVATION-ANCHORED
                    </p>
                  </div>
                </div>

                {/* Right: flow diagram */}
                <div className="relative grid gap-3">
                  {meshFlow.map((step, i) => (
                    <div key={step.actor} className="relative flex gap-4">
                      {/* Vertical connector */}
                      {i < meshFlow.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute left-[1.35rem] top-11 h-[calc(100%+0.75rem)] w-px bg-white/10"
                        />
                      )}
                      {/* Loop return connector hint */}
                      {i === meshFlow.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-3 left-[1.35rem] h-3 w-px bg-gradient-to-b from-[#4ade80]/20 to-transparent"
                        />
                      )}
                      {/* Number badge — rounded to match design system */}
                      <div
                        className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--bp-radius-sm)] border backdrop-blur-sm text-xs font-medium"
                        style={{
                          borderColor: `${step.accent}50`,
                          backgroundColor: `${step.accent}20`,
                          color: step.accent,
                        }}
                      >
                        {step.num}
                      </div>
                      {/* Card — auto-rounded by cinematic-page article rule */}
                      <article className="min-h-[4.5rem] flex-1 border border-white/20 bg-white/[0.09] p-4 backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.13]">
                        <p
                          className="text-[11px] font-medium tracking-[0.14em]"
                          style={{ color: step.accent }}
                        >
                          {step.actor}
                        </p>
                        <p className="mt-1 text-sm font-light leading-6 text-white/76">
                          {step.action}
                        </p>
                      </article>
                    </div>
                  ))}
                  {/* Loop label */}
                  <p className="mt-3 text-center text-[11px] font-light tracking-[0.14em] text-white/26">
                    ↺ &nbsp; The loop strengthens with every booking
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BRIDGE ───────────────────────────────────── */}
        {/*
            🎨 Background colour lives on the <div> below.
            Change bg-[#03101c] to any hex value you like, e.g. bg-[#04111d]
        */}
        <div className="relative overflow-hidden bg-[#03101c] px-[var(--cinematic-screen-x)] py-20 text-center md:py-24">
          {/* Soft teal glow rising from below — echoes the form's ocean hero coming next */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_110%,rgba(0,111,142,0.13),transparent_55%),radial-gradient(ellipse_at_50%_0%,rgba(184,154,93,0.05),transparent_50%)]"
          />
          <div className="bp-reveal relative">
            <p className="text-[11px] font-normal tracking-[0.18em] text-[#B89A5D]">
              You are one of the first
            </p>
            <h2 className="bp-page-title mx-auto mt-5 max-w-2xl text-[clamp(1.75rem,4vw,3rem)] leading-[1.05] text-white/82">
              The ocean economy is being rewired.
              <br />
              Here&apos;s where it starts.
            </h2>
            <div className="mx-auto mt-7 h-px w-28 bg-gradient-to-r from-transparent via-white/24 to-transparent" />
            <p className="mx-auto mt-7 max-w-sm text-sm font-light leading-[1.8] text-white/38">
              Join as an operator, a creator, or both — and help us build the
              trip economy the ocean deserves.
            </p>
            <ScrollHint />
          </div>
        </div>
      </div>

      {/* ── EXISTING SIGNUP FORM — unchanged ─────────────── */}
      <section
        id="join"
        className="cinematic-page relative min-h-svh overflow-hidden bg-[#020b11] text-white"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://assets.mixkit.co/videos/9774/9774-thumb-720-0.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.8),rgba(0,15,21,0.38)_48%,rgba(0,8,14,0.72)),linear-gradient(180deg,rgba(0,0,0,0.48),rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.74))]" />
        <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
        <div className="bp-film-grain absolute inset-0" />

        <div className="relative left-1/2 z-10 flex min-h-svh w-screen -translate-x-1/2 items-center justify-center px-[var(--cinematic-screen-x)] pb-14 pt-28 sm:pb-16 sm:pt-32">
          <SignupForm />
        </div>
      </section>

      <BluePassFooter />
    </>
  );
}

/* ─────────────────────────────────────────────────
   ORNAMENTS
───────────────────────────────────────────────── */

function OceanCurrentOrnament() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -right-10 top-1/2 hidden h-44 w-[55%] -translate-y-1/2 text-white/8 md:block"
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
        opacity="0.68"
      />
      <path
        d="M38 166C120 136 190 142 256 174C330 210 416 208 500 168C580 130 648 130 704 152"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.42"
      />
      <circle cx="586" cy="78" r="4" fill="#B89A5D" opacity="0.56" />
      <circle cx="626" cy="94" r="2.5" fill="#B89A5D" opacity="0.38" />
      <circle cx="536" cy="146" r="3" fill="#B89A5D" opacity="0.44" />
    </svg>
  );
}

function ReferralMeshWaves() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full text-white/[0.035]"
      viewBox="0 0 1440 480"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 120 C 180 80 360 160 540 120 S 900 80 1080 120 S 1350 160 1440 120"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M0 240 C 180 200 360 280 540 240 S 900 200 1080 240 S 1350 280 1440 240"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.7"
      />
      <path
        d="M0 360 C 180 320 360 400 540 360 S 900 320 1080 360 S 1350 400 1440 360"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.44"
      />
      <circle cx="320" cy="120" r="3" fill="#B89A5D" opacity="0.5" />
      <circle cx="760" cy="240" r="2.5" fill="#9fe8df" opacity="0.4" />
      <circle cx="1100" cy="360" r="3" fill="#4ade80" opacity="0.36" />
      <circle cx="540" cy="120" r="2" fill="#B89A5D" opacity="0.3" />
      <circle cx="980" cy="240" r="3.5" fill="#9fe8df" opacity="0.28" />
    </svg>
  );
}

function ScrollHint() {
  return (
    <div className="mx-auto mt-10 flex flex-col items-center gap-2.5 text-white/28">
      <span className="text-[10px] tracking-[0.22em]">JOIN BELOW</span>
      <svg
        width="14"
        height="22"
        viewBox="0 0 14 22"
        fill="none"
        className="animate-bounce"
        aria-hidden="true"
      >
        <line
          x1="7"
          y1="0"
          x2="7"
          y2="14"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M1 10 L7 16 L13 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
