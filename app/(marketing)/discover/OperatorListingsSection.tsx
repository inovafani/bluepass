export type DiscoverOperatorListing = {
  id: string;
  title: string;
  category: string;
  region: string;
  description: string;
  heroImageUrl: string | null;
  maxGuests: number | null;
  priceSignal: string | null;
  currency: string;
  operatorName: string | null;
};

// Operator-authored listings don't share the static `Yacht` shape (no gallery, itinerary, or a
// /yachts/[slug] detail page exists for them yet), so this renders as its own additive section
// rather than being forced into FleetBrowser's grid - keeps the curated Indonesia catalog
// (lib/data/yachts.ts) completely untouched while still making live operator listings visible.
export function OperatorListingsSection({
  listings,
}: {
  listings: DiscoverOperatorListing[];
}) {
  if (!listings.length) {
    return null;
  }

  return (
    <section className="px-[var(--cinematic-screen-x)] pb-16 md:pb-20">
      <div className="mx-auto max-w-6xl">
        <p className="bp-eyebrow">Listed by operators</p>
        <h2 className="bp-page-title mt-3 max-w-2xl text-2xl leading-[1.1] text-white md:text-3xl">
          Trips operators added themselves.
        </h2>
        <p className="mt-2 max-w-xl text-sm font-light text-white/50">
          Reach out to Kai to ask about availability - these are newly listed
          and still building up reviews.
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
          {listings.map((listing) => (
            <article
              key={listing.id}
              className="flex h-full flex-col overflow-hidden rounded-[var(--bp-radius-md)] border border-white/12 bg-[#0d1f2e] shadow-[0_14px_44px_rgba(0,0,0,0.32)]"
            >
              <div className="relative aspect-[3/2] overflow-hidden bg-[#0a1620]">
                {listing.heroImageUrl ? (
                  // Operator-submitted URLs can be any host, so next/image's remotePatterns
                  // allowlist doesn't apply here.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={listing.heroImageUrl}
                    alt={listing.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-white/24">
                    No image yet
                  </div>
                )}
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(3,17,29,0.72) 0%, rgba(3,17,29,0.22) 44%, transparent 72%)",
                  }}
                />
                <div className="absolute left-2.5 top-2.5 z-10">
                  <span
                    className="border border-white/16 bg-black/52 px-2 py-[3px] text-[9px] font-bold tracking-[0.16em] text-white/80"
                    style={{ borderRadius: "4px", backdropFilter: "blur(8px)" }}
                  >
                    {listing.region}
                  </span>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="bp-page-title text-[1.1rem] leading-tight text-white">
                  {listing.title}
                </h3>
                <p className="mt-1 text-[11px] text-white/46">
                  {listing.category}
                  {listing.maxGuests ? ` / up to ${listing.maxGuests} guests` : ""}
                </p>
                <p className="mt-2 line-clamp-2 text-[12px] leading-[1.5] text-white/52">
                  {listing.description}
                </p>

                <div className="mt-auto border-t border-white/[0.07] pt-2.5">
                  {listing.priceSignal ? (
                    <p className="text-[0.8125rem] font-medium text-white">
                      {listing.priceSignal}{" "}
                      <span className="font-light text-white/50">
                        ({listing.currency})
                      </span>
                    </p>
                  ) : (
                    <p className="text-[0.8125rem] font-medium text-[#B89A5D]">
                      Quote on request
                    </p>
                  )}
                  {listing.operatorName && (
                    <p className="mt-0.5 text-[11px] text-white/36">
                      Listed by {listing.operatorName}
                    </p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
