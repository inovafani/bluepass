import { afterEach, describe, expect, it, vi } from "vitest";
import {
  isYachtClaimedByApprovedOperator,
  listClaimedOperatorYachtSlugs,
} from "@/lib/services/operators/operator-claim-status";

const prismaMocks = vi.hoisted(() => ({
  operatorProfile: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorProfile.findMany.mockReset();
  prismaMocks.operatorProfile.findFirst.mockReset();
});

describe("operator claim status", () => {
  it("lists unique claimed yacht slugs from approved/live operator profiles", async () => {
    prismaMocks.operatorProfile.findMany.mockResolvedValue([
      { claimedYachtSlugs: ["calico-jack", "Calico-Jack"] },
      { claimedYachtSlugs: ["bajak"] },
    ]);

    await expect(listClaimedOperatorYachtSlugs()).resolves.toEqual(["calico-jack", "bajak"]);
    expect(prismaMocks.operatorProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { in: ["APPROVED", "LIVE"] },
        }),
      }),
    );
  });

  it("checks whether one yacht is claimed by an approved/live operator profile", async () => {
    prismaMocks.operatorProfile.findFirst.mockResolvedValue({ id: "operator_profile_1" });

    await expect(isYachtClaimedByApprovedOperator("calico-jack")).resolves.toBe(true);
    expect(prismaMocks.operatorProfile.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          claimedYachtSlugs: { has: "calico-jack" },
        }),
      }),
    );
  });
});
