import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import { yachts, yachtBySlug } from "@/lib/data/yachts";

export async function generateStaticParams() {
  return yachts.map((y) => ({ slug: y.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yacht = yachtBySlug[slug];
  if (!yacht) return { title: "Yacht | BluePass" };
  return {
    title: `${yacht.name} | BluePass`,
    description: yacht.about,
  };
}

export default async function YachtPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const yacht = yachtBySlug[slug];
  if (!yacht) notFound();

  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        {/* Hero */}
        <section className="relative min-h-[72svh] overflow-hidden bg-[#020b11]">
          <div
            aria-hidden="true"
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url('${yacht.images.hero}')` }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.04)_38%,rgba(2,11,17,0.84)_78%,rgba(2,11,17,0.97)_100%)]" />
          <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
          <div className="bp-film-grain absolute inset-0" />

          <div className="relative flex min-h-[72svh] flex-col justify-end px-[var(--cinematic-screen-x)] pb-10 pt-28">
            <Link
              href="/explore-indonesia"
              className="mb-8 inline-flex w-fit items-center gap-2 text-[10px] tracking-[0.22em] text-white/46 transition-colors hover:text-white/80"
              style={{ fontFamily: "var(--bp-font-mono)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
              Explore Indonesia
            </Link>

            <p
              className="text-[10px] uppercase tracking-[0.26em] text-white/55"
              style={{ fontFamily: "var(--bp-font-mono)" }}
            >
              BluePass Operator · {yacht.tier} Tier
            </p>
            <div className="mt-2 flex items-center gap-3">
              <h1 className="bp-page-title text-[clamp(2.5rem,5.5vw,4rem)] leading-[0.96] text-white">
                {yacht.name}
              </h1>
              <VerifiedBadge />
            </div>
            <p className="mt-3 text-[15px] font-light text-white/60">
              {yacht.length !== "—" ? `${yacht.length} · ` : ""}
              {yacht.cabins} cabins · up to {yacht.maxGuests} guests · {yacht.region}
            </p>
          </div>
        </section>

        {/* Body */}
        <div className="px-[var(--cinematic-screen-x)] py-12 md:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-14 xl:grid-cols-[1fr_360px]">

              {/* ── Left column ── */}
              <div className="space-y-12">

                {/* Gallery */}
                <section>
                  <SectionLabel>Gallery</SectionLabel>
                  <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-2 md:grid-cols-[1.2fr_1fr_1fr]">
                    {/* First image — tall, spans 2 rows */}
                    <div className="relative row-span-2 min-h-[240px] overflow-hidden">
                      <Image
                        src={yacht.images.gallery[0]?.src ?? yacht.images.hero}
                        alt={yacht.images.gallery[0]?.alt ?? yacht.name}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 28vw, 50vw"
                      />
                    </div>
                    {/* Remaining 4 images */}
                    {yacht.images.gallery.slice(1, 5).map((img, i) => (
                      <div key={i} className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={img.src}
                          alt={img.alt}
                          fill
                          className="object-cover"
                          sizes="(min-width: 1024px) 14vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                </section>

                {/* About */}
                <section>
                  <SectionLabel>About</SectionLabel>
                  <p className="mt-4 text-[15px] leading-[1.82] text-white/68">
                    {yacht.about}
                  </p>
                  {yacht.tagline && (
                    <p className="mt-3 text-[13px] leading-relaxed text-white/38">
                      {yacht.tagline}
                    </p>
                  )}
                </section>

                {/* Sample Itinerary */}
                <section>
                  <SectionLabel>Sample Itinerary</SectionLabel>
                  <ol className="mt-5">
                    {yacht.itinerary.map((item, i) => (
                      <li key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span
                            className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#1a7c72]/60 bg-[#0d3d38] text-[9px] font-medium text-[#5cc8be]"
                            style={{ fontFamily: "var(--bp-font-mono)" }}
                          >
                            {item.day}
                          </span>
                          {i < yacht.itinerary.length - 1 && (
                            <span className="mt-1 h-full w-px bg-white/[0.08]" />
                          )}
                        </div>
                        <div className="pb-5">
                          <p
                            className="text-[10px] uppercase tracking-[0.18em] text-white/36"
                            style={{ fontFamily: "var(--bp-font-mono)" }}
                          >
                            Day {item.day}
                          </p>
                          <p className="mt-0.5 text-[0.9375rem] font-medium text-white/88">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-[1.65] text-white/52">
                            {item.description}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                {/* Trips */}
                <section>
                  <SectionLabel>Trips</SectionLabel>
                  <div className="mt-4 space-y-2">
                    <Link
                      href="https://wa.me/628213143343"
                      className="group flex items-center justify-between gap-4 border border-white/[0.09] bg-[#03111d]/50 p-4 transition-colors hover:bg-[#03111d]/80"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="border border-[#B89A5D]/28 bg-[#B89A5D]/10 px-2 py-[3px] text-[10px] tracking-[0.14em] text-[#f1d58a]"
                            style={{ fontFamily: "var(--bp-font-mono)", borderRadius: "4px" }}
                          >
                            LIVEABOARD · {yacht.itinerary.length}-DAY
                          </span>
                        </div>
                        <p className="mt-2 text-[0.9375rem] font-medium text-white/90">
                          {yacht.name} · {yacht.itinerary.length - 1}-Night{" "}
                          {yacht.region.split("·")[0].trim()} Liveaboard
                        </p>
                        <p className="mt-0.5 text-[12px] text-white/44">
                          {yacht.length !== "—" ? `${yacht.length} yacht · ` : ""}
                          {yacht.cabins} cabins · up to {yacht.maxGuests} guests,{" "}
                          {yacht.tier} tier {yacht.region.split("·")[0].trim().toLowerCase()} liveaboard.
                        </p>
                        <p className="mt-2 text-[0.8125rem] font-medium text-white">
                          from {yacht.pricePerCabin}{" "}
                          <span className="font-light text-white/52">/ cabin · night</span>
                        </p>
                        {yacht.charterPrice && (
                          <p
                            className="mt-0.5 text-[11px] text-white/38"
                            style={{ fontFamily: "var(--bp-font-mono)" }}
                          >
                            or charter {yacht.charterPrice} / night · whole yacht
                          </p>
                        )}
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-white/30 transition-colors group-hover:text-white/70" aria-hidden="true">
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Link>
                  </div>
                </section>

                {/* Conservation */}
                <section className="border border-[#1a7c72]/28 bg-[#0d3d38]/18 p-5">
                  <div className="flex items-center gap-2">
                    <LeafIcon />
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-[#5cc8be]"
                      style={{ fontFamily: "var(--bp-font-mono)" }}
                    >
                      Conservation
                    </p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-white/62">
                    {yacht.conservation}
                  </p>
                  <p className="mt-2 text-[12px] leading-relaxed text-white/34">
                    Plus 5% of every BluePass booking is built into the price and
                    routed to BluePass Conservation partners.
                  </p>
                </section>
              </div>

              {/* ── Sidebar ── */}
              <div>
                <div className="sticky top-6 space-y-3">

                  {/* Price */}
                  <div className="border border-white/12 bg-[#03111d]/70 p-5 backdrop-blur-xl">
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-white/40"
                      style={{ fontFamily: "var(--bp-font-mono)" }}
                    >
                      Price
                    </p>
                    <p className="mt-3 text-[1.5rem] font-medium leading-none text-white">
                      from {yacht.pricePerCabin}
                    </p>
                    <p className="mt-1 text-[12px] text-white/50">/ cabin · night</p>
                    {yacht.charterPrice && (
                      <p className="mt-1 text-[12px] text-white/38">
                        or charter {yacht.charterPrice} / night · whole yacht
                      </p>
                    )}
                    {yacht.charterOnly && (
                      <span
                        className="mt-2.5 inline-block border border-[#B89A5D]/30 bg-[#B89A5D]/10 px-2 py-[3px] text-[10px] tracking-[0.16em] text-[#f1d58a]"
                        style={{ fontFamily: "var(--bp-font-mono)" }}
                      >
                        Whole-yacht charter only
                      </span>
                    )}
                  </div>

                  {/* Vessel specs */}
                  <div className="border border-white/12 bg-[#03111d]/70 p-5 backdrop-blur-xl">
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-white/40"
                      style={{ fontFamily: "var(--bp-font-mono)" }}
                    >
                      Vessel
                    </p>
                    <dl className="mt-3 space-y-2">
                      {yacht.length !== "—" && <SpecRow label="Length" value={yacht.length} />}
                      <SpecRow label="Cabins" value={String(yacht.cabins)} />
                      <SpecRow label="Max guests" value={String(yacht.maxGuests)} />
                      <SpecRow label="Tier" value={yacht.tier} />
                      <SpecRow label="Build" value={yacht.build} />
                    </dl>
                  </div>

                  {/* Departures */}
                  <div className="border border-white/12 bg-[#03111d]/70 p-5 backdrop-blur-xl">
                    <p
                      className="text-[10px] uppercase tracking-[0.22em] text-white/40"
                      style={{ fontFamily: "var(--bp-font-mono)" }}
                    >
                      Next Departures
                    </p>
                    <ul className="mt-3 divide-y divide-white/[0.06]">
                      {yacht.departures.map((dep, i) => (
                        <li key={i} className="flex items-center justify-between py-2.5">
                          <div>
                            <p className="text-[0.8125rem] text-white/88">{dep.dates}</p>
                            <p
                              className="mt-0.5 text-[11px] text-white/38"
                              style={{ fontFamily: "var(--bp-font-mono)" }}
                            >
                              {dep.duration} · {dep.berths}
                            </p>
                          </div>
                          <Link
                            href="https://wa.me/628213143343"
                            className="text-[11px] text-[#5cc8be] transition-colors hover:text-white"
                            style={{ fontFamily: "var(--bp-font-mono)" }}
                          >
                            Hold ›
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 text-[11px] leading-[1.5] text-white/28">
                      Indicative departures — the operator confirms exact dates on quote.
                    </p>
                  </div>

                  {/* CTAs */}
                  <Link
                    href="https://wa.me/628213143343"
                    className="flex h-12 w-full items-center justify-center gap-2 bg-white text-[11px] font-medium tracking-[0.04em] text-[#071827] transition-colors hover:bg-white/90"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                    </svg>
                    + Plan with {yacht.firstName}
                  </Link>
                  <Link
                    href="https://wa.me/628213143343"
                    className="flex h-11 w-full items-center justify-center bg-[#1a7c72] text-[11px] font-medium tracking-[0.04em] text-white transition-colors hover:bg-[#1f9088]"
                  >
                    See trip details
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BluePassFooter />
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[10px] uppercase tracking-[0.22em] text-[#B89A5D]"
      style={{ fontFamily: "var(--bp-font-mono)" }}
    >
      {children}
    </p>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.06] pb-2 last:border-0 last:pb-0">
      <dt className="text-[12px] text-white/44">{label}</dt>
      <dd className="text-[0.8125rem] font-medium text-white">{value}</dd>
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span
      className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a7c72]"
      title="Verified BluePass operator"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}

function LeafIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#5cc8be]" aria-hidden="true">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
