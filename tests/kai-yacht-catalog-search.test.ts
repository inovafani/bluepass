import { describe, expect, it, vi } from "vitest";
import {
  formatYachtSuggestionForKai,
  getYachtBySlug,
  searchYachtsForIntent,
} from "@/lib/services/kai/yacht-catalog-search";

describe("Kai yacht catalog search", () => {
  it("returns Raja Ampat yachts for Raja Ampat diving for 3 guests", () => {
    const matches = searchYachtsForIntent({
      destination: "Raja Ampat",
      tripType: "diving",
      guests: 3,
      interests: ["mantas"],
    });

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => match.region === "Raja Ampat")).toBe(true);
    expect(matches[0].matchingReasons).toEqual(
      expect.arrayContaining(["Raja Ampat route", "fits 3 guests"]),
    );
  });

  it("returns Komodo yachts for Komodo liveaboard for 2 guests", () => {
    const matches = searchYachtsForIntent({
      destination: "Labuan Bajo",
      tripType: "liveaboard",
      guests: 2,
    });

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((match) => match.region === "Komodo")).toBe(true);
    expect(matches[0].matchingReasons).toContain("Komodo route");
  });

  it("filters or penalizes yachts above maxGuests", () => {
    const matches = searchYachtsForIntent({
      destination: "Raja Ampat",
      tripType: "sailing",
      guests: 30,
    });

    expect(matches.every((match) => match.maxGuests >= 30)).toBe(true);
  });

  it("prefers cabin-bookable and lower-price options for budget intent", () => {
    const matches = searchYachtsForIntent({
      destination: "Raja Ampat",
      tripType: "liveaboard",
      guests: 3,
      budget: "budget",
    });

    expect(matches[0]).toEqual(
      expect.objectContaining({
        cabinBookable: true,
      }),
    );
    expect(matches[0].matchingReasons).toEqual(
      expect.arrayContaining(["cabin bookable"]),
    );
  });

  it("prefers Premium, Legend, or charter options for luxury/private intent", () => {
    const matches = searchYachtsForIntent({
      destination: "Komodo",
      tripType: "yacht charter",
      guests: 2,
      budget: "luxury private charter",
    });

    expect(matches[0].matchingReasons).toEqual(
      expect.arrayContaining([expect.stringMatching(/tier|charter/i)]),
    );
    expect(
      matches.some(
        (match) =>
          match.tier === "Premium" ||
          match.tier === "Legend" ||
          match.charterOnly ||
          Boolean(match.charterPrice),
      ),
    ).toBe(true);
  });

  it("getYachtBySlug returns the static catalog yacht", () => {
    expect(getYachtBySlug("aliikai")).toEqual(
      expect.objectContaining({
        slug: "aliikai",
        name: "Aliikai",
        region: "Raja Ampat",
      }),
    );
  });

  it("does not invent operator phone numbers or call the network", () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const matches = searchYachtsForIntent({
      destination: "Komodo",
      tripType: "sailing",
      guests: 2,
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(JSON.stringify(matches)).not.toMatch(/\+?\d{8,}/);
    expect(formatYachtSuggestionForKai(matches[0])).toContain(matches[0].name);

    fetchSpy.mockRestore();
  });
});
