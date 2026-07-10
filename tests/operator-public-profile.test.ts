import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getOperatorDiscoverVisibility,
  getPublicOperatorProfile,
} from "@/lib/services/operators/operator-public-profile";

const prismaMocks = vi.hoisted(() => ({
  operatorLead: {
    findUnique: vi.fn(),
  },
  operatorProfile: {
    findFirst: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorLead.findUnique.mockReset();
  prismaMocks.operatorProfile.findFirst.mockReset();
});

describe("operator public profile visibility", () => {
  it("shows imported outreach leads as unclaimed preview pages, not live Discover inventory", async () => {
    prismaMocks.operatorProfile.findFirst.mockResolvedValue(null);
    prismaMocks.operatorLead.findUnique.mockResolvedValue({
      slug: "dewi-nusantara",
      name: "Dewi Nusantara",
      category: "liveaboard",
      region: "Raja Ampat",
      email: "hello@dewi-nusantara.com",
      phone: "+628123456789",
      websiteUrl: "https://www.dewi-nusantara.com",
      source: "tony_524_csv",
      status: "IMPORTED",
      claimUrl: "https://bluepass.co/operator/claim/start/dewi-nusantara",
    });

    await expect(getPublicOperatorProfile("Dewi Nusantara")).resolves.toEqual(
      expect.objectContaining({
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
        status: "UNCLAIMED_PREVIEW",
        visibility: "PUBLIC_PREVIEW",
        showClaimCta: true,
        showInDiscover: false,
      }),
    );
  });

  it("shows approved operator profiles as verified public pages and enables Discover only when they have claimed products", async () => {
    prismaMocks.operatorProfile.findFirst.mockResolvedValue({
      id: "profile_1",
      status: "APPROVED",
      companyName: "Dewi Nusantara",
      whatsappE164: "628123456789",
      websiteUrl: "https://www.dewi-nusantara.com",
      claimedOperatorSlug: "dewi-nusantara",
      claimedYachtSlugs: ["dewi-nusantara"],
      claimedAt: new Date("2026-07-10T01:00:00.000Z"),
      account: {
        email: "ops@dewi-nusantara.com",
      },
    });
    prismaMocks.operatorLead.findUnique.mockResolvedValue(null);

    await expect(getPublicOperatorProfile("dewi-nusantara")).resolves.toEqual(
      expect.objectContaining({
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
        status: "VERIFIED",
        visibility: "DISCOVER_READY",
        showClaimCta: false,
        showInDiscover: true,
        claimedYachtSlugs: ["dewi-nusantara"],
      }),
    );
  });

  it("keeps approved operators out of main Discover until they have claimed yacht or trip inventory", () => {
    expect(
      getOperatorDiscoverVisibility({
        status: "APPROVED",
        claimedYachtSlugs: [],
      }),
    ).toBe("PUBLIC_VERIFIED");

    expect(
      getOperatorDiscoverVisibility({
        status: "APPROVED",
        claimedYachtSlugs: ["calico-jack"],
      }),
    ).toBe("DISCOVER_READY");
  });
});
