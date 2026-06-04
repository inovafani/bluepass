"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";
import { yachts } from "@/lib/data/yachts";

type Region = "All" | "Komodo" | "Raja Ampat";
type Tier = "All" | "Explorer" | "Premium" | "Legend";
type Booking = "Any" | "Cabin-bookable only";

export function FleetBrowser() {
  const [region, setRegion] = useState<Region>("All");
  const [tier, setTier] = useState<Tier>("All");
  const [booking, setBooking] = useState<Booking>("Any");

  const filtered = useMemo(() => {
    return yachts.filter((y) => {
      if (region !== "All" && y.region !== region) return false;
      if (tier !== "All" && y.tier !== tier) return false;
      if (booking === "Cabin-bookable only" && !y.cabinBookable) return false;
      return true;
    });
  }, [region, tier, booking]);

  return (
    <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <p
          className="text-[10px] uppercase tracking-[0.22em] text-[#B89A5D]"
         
        >
          Browse the fleet
        </p>
        <h2 className="bp-page-title mt-3 text-[2.5rem] leading-none text-white md:text-[3rem]">
          {filtered.length} charters
        </h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-white/55">
          Every vetted Indonesian liveaboard partner on BluePass. Filter by
          region, tier, or cabin-booking availability — or ask Kai for a match
          based on your dates and dive style.
        </p>

        {/* Filters */}
        <div className="mt-8 space-y-3">
          <FilterRow
            label="REGION"
            options={["All", "Komodo", "Raja Ampat"] as Region[]}
            active={region}
            onChange={setRegion}
          />
          <FilterRow
            label="TIER"
            options={["All", "Explorer", "Premium", "Legend"] as Tier[]}
            active={tier}
            onChange={setTier}
          />
          <FilterRow
            label="BOOKING"
            options={["Any", "Cabin-bookable only"] as Booking[]}
            active={booking}
            onChange={setBooking}
          />
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((yacht) => (
            <Link key={yacht.slug} href={`/yachts/${yacht.slug}`} className="group block">
              <article className="overflow-hidden border border-white/[0.08] bg-[#03111d]/40 transition-colors hover:border-white/18">
                {/* Image */}
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={yacht.images.card}
                    alt={yacht.images.gallery[0]?.alt ?? yacht.name}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    loading="lazy"
                    quality={72}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(3,17,29,0.72) 0%, rgba(3,17,29,0.22) 44%, transparent 72%)",
                    }}
                  />
                  {/* Badges */}
                  <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap gap-1.5">
                    <Badge>{yacht.locationBadge}</Badge>
                    {yacht.tier && <TierBadge tier={yacht.tier} />}
                    {yacht.cabinBookable && <GreenBadge>Cabin OK</GreenBadge>}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="bp-page-title text-[1.1rem] leading-tight text-white">
                    {yacht.name}
                  </h3>
                  <p
                    className="mt-1 text-[11px] text-white/46"
                   
                  >
                    {yacht.length !== "—" ? `${yacht.length} · ` : ""}
                    {yacht.maxGuests} guests · {yacht.cabins} cabins
                  </p>

                  <div className="mt-2.5 border-t border-white/[0.07] pt-2.5">
                    {yacht.pricePerCabin.startsWith("Quote") ? (
                      <p className="text-[0.8125rem] font-medium text-[#B89A5D]">
                        Quote on request
                      </p>
                    ) : (
                      <>
                        <p className="text-[0.8125rem] font-medium text-white">
                          from {yacht.pricePerCabin}{" "}
                          <span className="font-light text-white/50">
                            / cabin · night
                          </span>
                        </p>
                        {yacht.charterPrice && (
                          <p
                            className="mt-0.5 text-[11px] text-white/36"
                           
                          >
                            or charter {yacht.charterPrice} / night · whole yacht
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="mt-16 text-center text-sm text-white/38">
            No vessels match the current filters.
          </p>
        )}
      </div>
    </section>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function FilterRow<T extends string>({
  label,
  options,
  active,
  onChange,
}: {
  label: string;
  options: T[];
  active: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className="w-[3.75rem] shrink-0 text-[10px] tracking-[0.20em] text-white/36"
       
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`h-7 rounded-full border px-3 text-[11px] font-medium transition-colors ${
              active === opt
                ? "border-white/40 bg-white/12 text-white"
                : "border-white/14 bg-transparent text-white/46 hover:border-white/24 hover:text-white/70"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="border border-white/16 bg-black/52 px-2 py-[3px] text-[9px] tracking-[0.16em] text-white/80"
      style={{
        borderRadius: "4px",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </span>
  );
}

function TierBadge({ tier }: { tier: string }) {
  const colors: Record<string, string> = {
    Explorer: "border-[#5cc8be]/30 bg-[#0d3d38]/80 text-[#5cc8be]",
    Premium: "border-[#B89A5D]/30 bg-[#3a2800]/80 text-[#f1d58a]",
    Legend: "border-white/24 bg-white/10 text-white",
  };
  return (
    <span
      className={`border px-2 py-[3px] text-[9px] tracking-[0.16em] ${colors[tier] ?? "border-white/16 bg-black/52 text-white/80"}`}
      style={{
        borderRadius: "4px",
        backdropFilter: "blur(8px)",
      }}
    >
      {tier}
    </span>
  );
}

function GreenBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="border border-emerald-500/30 bg-emerald-500/14 px-2 py-[3px] text-[9px] tracking-[0.14em] text-emerald-300"
      style={{
        borderRadius: "4px",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </span>
  );
}
