"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { claimableOperatorByYachtSlug } from "@/lib/data/operator-claims";
import { yachts } from "@/lib/data/yachts";
import type { Yacht } from "@/lib/data/yachts";

type Region = "All" | "Komodo" | "Raja Ampat";
type Tier = "All" | "Explorer" | "Premium" | "Legend";
type Booking = "Any" | "Cabin-bookable only";
type DiscoverBadgeKind = "region" | "tier" | "unclaimed";

export type DiscoverFilters = {
  region: Region;
  tier: Tier;
  booking: Booking;
  search: string;
};

export function FleetBrowser({
  claimedYachtSlugs = [],
}: {
  claimedYachtSlugs?: string[];
}) {
  const [region, setRegion] = useState<Region>("All");
  const [tier, setTier] = useState<Tier>("All");
  const [booking, setBooking] = useState<Booking>("Any");
  const [search, setSearch] = useState("");
  const claimedYachtSlugSet = useMemo(
    () => new Set(claimedYachtSlugs.map(normalizeClaimedYachtSlug)),
    [claimedYachtSlugs],
  );

  const filtered = useMemo(
    () => filterDiscoverYachts({ region, tier, booking, search }),
    [region, tier, booking, search],
  );

  return (
    <section className="px-[var(--cinematic-screen-x)] py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="bp-eyebrow">
          Browse the fleet
        </p>
        <h2 className="bp-page-title mt-3 text-[2.5rem] leading-none text-white md:text-[3rem]">
          {filtered.length} charters
        </h2>
        <p className="mt-3 max-w-2xl text-sm font-light leading-6 text-white/55">
          Every vetted Indonesian liveaboard partner on BluePass. Filter by
          region, tier, or cabin-booking availability - or ask Kai for a match
          based on your dates and dive style.
        </p>

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
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <FilterRow
              label="BOOKING"
              options={["Any", "Cabin-bookable only"] as Booking[]}
              active={booking}
              onChange={setBooking}
            />
            <SearchControl value={search} onChange={setSearch} />
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {filtered.map((yacht) => (
            <Link
              key={yacht.slug}
              href={`/yachts/${yacht.slug}`}
              className="group flex h-full"
            >
              <article className="flex h-full w-full flex-col overflow-hidden rounded-[var(--bp-radius-md)] border border-white/12 bg-[#0d1f2e] shadow-[0_14px_44px_rgba(0,0,0,0.32)] transition-colors hover:border-white/22 hover:bg-[#112738]">
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
                  <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap gap-1.5">
                    {getDiscoverYachtBadges(yacht, claimedYachtSlugSet).map((badge) => (
                      <DiscoverBadge
                        key={`${badge.kind}-${badge.label}`}
                        kind={badge.kind}
                      >
                        {badge.label}
                      </DiscoverBadge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <h3 className="bp-page-title text-[1.1rem] leading-tight text-white">
                    {yacht.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-white/46">
                    {yacht.length !== "\u2014" ? `${yacht.length} / ` : ""}
                    {yacht.maxGuests} guests / {yacht.cabins} cabins
                  </p>

                  <div className="mt-auto border-t border-white/[0.07] pt-2.5">
                    {yacht.pricePerCabin.startsWith("Quote") ? (
                      <p className="text-[0.8125rem] font-medium text-[#B89A5D]">
                        Quote on request
                      </p>
                    ) : (
                      <>
                        <p className="text-[0.8125rem] font-medium text-white">
                          from {yacht.pricePerCabin}{" "}
                          <span className="font-light text-white/50">
                            / cabin / night
                          </span>
                        </p>
                        {yacht.charterPrice && (
                          <p className="mt-0.5 text-[11px] text-white/36">
                            or charter {yacht.charterPrice} / night / whole
                            yacht
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

export function filterDiscoverYachts(filters: DiscoverFilters) {
  const searchTerms = normalizeSearch(filters.search)
    .split(" ")
    .filter(Boolean);

  return yachts.filter((yacht) => {
    if (filters.region !== "All" && yacht.region !== filters.region) return false;
    if (filters.tier !== "All" && yacht.tier !== filters.tier) return false;
    if (filters.booking === "Cabin-bookable only" && !yacht.cabinBookable) {
      return false;
    }
    if (!searchTerms.length) return true;

    const searchable = buildYachtSearchText(yacht);
    return searchTerms.every((term) => searchable.includes(term));
  });
}

export function buildYachtSearchText(yacht: Yacht) {
  const operator = claimableOperatorByYachtSlug[yacht.slug];
  const parts = [
    yacht.slug,
    yacht.name,
    yacht.firstName,
    yacht.locationBadge,
    yacht.region,
    yacht.tier,
    yacht.length,
    String(yacht.maxGuests),
    String(yacht.cabins),
    yacht.build,
    yacht.pricePerCabin,
    yacht.charterPrice,
    yacht.tagline,
    yacht.about,
    yacht.conservation,
    operator?.name,
    operator?.slug,
    operator?.sourceLabel,
    ...yacht.departures.flatMap((departure) => [
      departure.dates,
      departure.duration,
      departure.berths,
    ]),
    ...yacht.itinerary.flatMap((day) => [day.title, day.description]),
  ];

  return normalizeSearch(parts.filter(Boolean).join(" "));
}

export function getDiscoverYachtBadges(yacht: Yacht, claimedYachtSlugs?: ReadonlySet<string> | string[]) {
  const badges: Array<{ label: string; kind: DiscoverBadgeKind }> = [
    { label: yacht.locationBadge, kind: "region" },
  ];

  if (yacht.tier) {
    badges.push({ label: yacht.tier, kind: "tier" });
  }

  if (claimableOperatorByYachtSlug[yacht.slug] && !isYachtClaimed(yacht.slug, claimedYachtSlugs)) {
    badges.push({ label: "UNCLAIMED", kind: "unclaimed" });
  }

  return badges;
}

function isYachtClaimed(yachtSlug: string, claimedYachtSlugs?: ReadonlySet<string> | string[]) {
  const normalizedSlug = normalizeClaimedYachtSlug(yachtSlug);
  if (!claimedYachtSlugs) return false;
  if (Array.isArray(claimedYachtSlugs)) {
    return claimedYachtSlugs.map(normalizeClaimedYachtSlug).includes(normalizedSlug);
  }

  return claimedYachtSlugs.has(normalizedSlug);
}

function normalizeClaimedYachtSlug(value: string) {
  return value.trim().toLowerCase();
}

function normalizeSearch(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

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
      <span className="w-[3.75rem] shrink-0 text-[10px] tracking-[0.20em] text-white/36">
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

function SearchControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex w-full flex-wrap items-center gap-2 lg:w-auto">
      <span className="w-[3.75rem] shrink-0 text-[10px] tracking-[0.20em] text-white/36 lg:w-auto">
        SEARCH
      </span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Name, region, operator..."
        className="h-8 min-w-0 flex-1 rounded-full border border-white/14 bg-white/[0.04] px-3 text-[11px] font-medium text-white outline-none transition-colors placeholder:text-white/28 focus:border-[#B89A5D]/70 focus:bg-white/[0.07] lg:w-72 lg:flex-none"
      />
    </label>
  );
}

function DiscoverBadge({
  kind,
  children,
}: {
  kind: DiscoverBadgeKind;
  children: React.ReactNode;
}) {
  const colors: Record<DiscoverBadgeKind, string> = {
    region: "border-white/16 bg-black/52 text-white/80",
    tier: "border-white/16 bg-black/52 text-white/80",
    unclaimed: "border-[#B89A5D]/42 bg-[#B89A5D]/90 text-[#071827]",
  };

  return (
    <span
      className={`border px-2 py-[3px] text-[9px] font-bold tracking-[0.16em] ${colors[kind]}`}
      style={{
        borderRadius: "4px",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </span>
  );
}
