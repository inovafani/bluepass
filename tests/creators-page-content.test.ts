import { describe, expect, it } from "vitest";
import {
  featuredReels,
  partnerBenefitCards,
  partnerHero,
  partnerRegions,
  partnerSteps,
} from "@/lib/data/creators-page-content";

describe("partners page partner program content", () => {
  it("positions the page around partner earnings, no markup, and reef funding", () => {
    expect(partnerHero.title).toContain("5% on every Indonesia booking");
    expect(partnerHero.body).toContain("operator's own rate");
    expect(partnerHero.body).toContain("funds reef conservation");
    expect(partnerHero.primaryLabel).toBe("Claim my founding-partner link");
  });

  it("keeps the partner flow concise and booking-led", () => {
    expect(partnerSteps.map((step) => step.title)).toEqual([
      "Claim your link",
      "Book or refer",
      "Client pays the operator's rate",
      "You earn - the reef wins",
    ]);
  });

  it("surfaces the requested partner benefits and Indonesia regions", () => {
    expect(partnerBenefitCards.map((card) => card.title)).toEqual([
      "Earn - no markup to your client",
      "Trust - vetted operators",
      "Differentiate - 5% to the reef",
    ]);
    expect(partnerRegions).toEqual([
      "Raja Ampat",
      "Komodo",
      "Lembeh",
      "Bali",
      "Wakatobi",
      "Bunaken",
      "Mentawai",
    ]);
  });

  it("keeps reel cards tied to Instagram reel URLs instead of partner profile posters", () => {
    expect(featuredReels).toHaveLength(4);
    expect(featuredReels.every((reel) => reel.reelHref.includes("/reel/"))).toBe(true);
    expect(featuredReels.every((reel) => reel.thumbnail === undefined)).toBe(true);
  });
});
