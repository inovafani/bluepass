import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  buildYachtClaimDisplay,
  UnclaimedOperatorInlineClaim,
} from "@/app/yachts/[slug]/page";
import { yachtBySlug } from "@/lib/data/yachts";

describe("yacht unclaimed claim banner", () => {
  it("builds Mermaid claim display from yacht slug", () => {
    const display = buildYachtClaimDisplay(
      "mermaid-i",
      yachtBySlug["mermaid-i"],
    );

    expect(display).toEqual(
      expect.objectContaining({
        operatorName: "Mermaid Liveaboards",
        claimHref: "/operator/claim/start/mermaid-liveaboards",
        eyebrow: "BluePass - Unclaimed Listing - Komodo",
      }),
    );
  });

  it("does not build a claim display once the yacht has an approved operator profile", () => {
    const display = buildYachtClaimDisplay("calico-jack", yachtBySlug["calico-jack"], {
      isClaimed: true,
    });

    expect(display).toBeUndefined();
  });

  it("renders an inline unclaimed claim CTA for the hero meta area", () => {
    const html = renderToStaticMarkup(
      createElement(UnclaimedOperatorInlineClaim, {
        operatorName: "Scuba Republic",
        claimHref: "/operator/claim/start/scuba-republic",
      }),
    );

    expect(html).toContain("Unclaimed - this page was built by BluePass");
    expect(html).toContain("/operator/claim/start/scuba-republic");
    expect(html).toContain("Claim Scuba Republic");
    expect(html).toContain("w-screen");
    expect(html).toContain("px-[var(--cinematic-screen-x)]");
  });
});
