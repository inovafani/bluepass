import { afterEach, describe, expect, it, vi } from "vitest";
import { getClaimableOperator } from "@/lib/services/operators/claimable-operators";

const prismaMocks = vi.hoisted(() => ({
  operatorLead: {
    findUnique: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorLead.findUnique.mockReset();
});

describe("claimable operator resolver", () => {
  it("keeps static yacht-linked operators available for claim pages", async () => {
    await expect(getClaimableOperator("calico-jack")).resolves.toEqual(
      expect.objectContaining({
        slug: "calico-jack",
        name: "Calico Jack",
        representativeYachtSlug: "calico-jack",
        yachtSlugs: ["calico-jack"],
      }),
    );
    expect(prismaMocks.operatorLead.findUnique).not.toHaveBeenCalled();
  });

  it("falls back to imported operator leads for generated outreach claim links", async () => {
    prismaMocks.operatorLead.findUnique.mockResolvedValue({
      slug: "dewi-nusantara",
      name: "Dewi Nusantara",
      websiteUrl: "https://www.dewi-nusantara.com",
      source: "tony_524_csv",
    });

    await expect(getClaimableOperator("Dewi Nusantara")).resolves.toEqual(
      expect.objectContaining({
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
        websiteUrl: "https://www.dewi-nusantara.com",
        yachtSlugs: [],
        representativeYachtSlug: null,
        sourceLabel: "tony_524_csv operator lead",
      }),
    );
  });
});
