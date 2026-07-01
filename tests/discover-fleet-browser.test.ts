import { describe, expect, it } from "vitest";
import {
  filterDiscoverYachts,
  getDiscoverYachtBadges,
} from "@/app/(marketing)/discover/FleetBrowser";
import { yachtBySlug } from "@/lib/data/yachts";

describe("discover fleet browser", () => {
  it("searches by yacht name and relevant operator claim metadata", () => {
    const mermaidResults = filterDiscoverYachts({
      region: "All",
      tier: "All",
      booking: "Any",
      search: "mermaid liveaboards",
    });
    const scubaResults = filterDiscoverYachts({
      region: "All",
      tier: "All",
      booking: "Any",
      search: "scuba republic",
    });

    expect(mermaidResults.map((yacht) => yacht.slug)).toEqual(
      expect.arrayContaining(["mermaid-i", "mermaid-ii"]),
    );
    expect(scubaResults.map((yacht) => yacht.slug)).toEqual(
      expect.arrayContaining(["bajak", "capoeng", "jaya", "epica"]),
    );
  });

  it("keeps booking filters and search terms working together", () => {
    const results = filterDiscoverYachts({
      region: "Raja Ampat",
      tier: "All",
      booking: "Cabin-bookable only",
      search: "epica",
    });

    expect(results.map((yacht) => yacht.slug)).toEqual(["epica"]);
  });

  it("shows an unclaimed badge without the old cabin badge", () => {
    const badges = getDiscoverYachtBadges(yachtBySlug["mermaid-i"]);

    expect(badges).toContainEqual(
      expect.objectContaining({ label: "UNCLAIMED", kind: "unclaimed" }),
    );
    expect(badges.map((badge) => badge.label)).not.toContain("Cabin OK");
  });
});
