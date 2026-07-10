import { describe, expect, it } from "vitest";
import { buildOperatorDashboardClaimView } from "@/lib/services/operators/operator-dashboard-view";

describe("operator dashboard claim view", () => {
  it("links static claimed operators to their representative yacht page", () => {
    expect(
      buildOperatorDashboardClaimView({
        status: "APPROVED",
        companyName: "Calico Jack",
        claimedOperatorSlug: "calico-jack",
        claimedYachtSlugs: [],
      }),
    ).toMatchObject({
      companyName: "Calico Jack",
      claimedYachtSlugs: ["calico-jack"],
      primaryHref: "/yachts/calico-jack",
    });
  });

  it("links imported approved operators to their public operator profile until inventory is ready", () => {
    expect(
      buildOperatorDashboardClaimView({
        status: "APPROVED",
        companyName: "Dewi Nusantara",
        claimedOperatorSlug: "dewi-nusantara",
        claimedYachtSlugs: [],
      }),
    ).toMatchObject({
      companyName: "Dewi Nusantara",
      claimedYachtSlugs: [],
      primaryHref: "/operators/dewi-nusantara",
      inventoryLabel:
        "Your operator profile is approved. Add trips or claimed vessels to become Discover-ready.",
    });
  });

  it("does not unlock the claimed workspace before approval", () => {
    expect(
      buildOperatorDashboardClaimView({
        status: "PENDING_REVIEW",
        companyName: "Dewi Nusantara",
        claimedOperatorSlug: "dewi-nusantara",
        claimedYachtSlugs: [],
      }),
    ).toBeNull();
  });
});
