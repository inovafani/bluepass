import { afterEach, describe, expect, it, vi } from "vitest";
import { listApprovedOperatorDirectory } from "@/lib/services/operators/operator-directory";

const prismaMocks = vi.hoisted(() => ({
  operatorProfile: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorProfile.findMany.mockReset();
});

describe("operator directory", () => {
  it("returns approved operator profiles with WhatsApp routing data", async () => {
    prismaMocks.operatorProfile.findMany.mockResolvedValue([
      {
        id: "profile_1",
        status: "APPROVED",
        companyName: "Calico Jack",
        whatsappE164: "+6281111111111",
        claimedOperatorSlug: "calico-jack",
        claimedYachtSlugs: ["calico-jack"],
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
        account: { phone: "+6289999999999" },
      },
      {
        id: "profile_2",
        status: "LIVE",
        companyName: "Scuba Republic",
        whatsappE164: "",
        claimedOperatorSlug: "scuba-republic",
        claimedYachtSlugs: ["bajak", "Bajak", "epica"],
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
        account: { phone: "+6282222222222" },
      },
      {
        id: "profile_3",
        status: "APPROVED",
        companyName: "No Phone Operator",
        whatsappE164: null,
        claimedOperatorSlug: "no-phone",
        claimedYachtSlugs: ["no-phone"],
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
        account: { phone: null },
      },
    ]);

    await expect(listApprovedOperatorDirectory()).resolves.toEqual([
      {
        operatorSlug: "calico-jack",
        operatorName: "Calico Jack",
        yachtSlugs: ["calico-jack"],
        whatsappPhone: "+6281111111111",
        status: "APPROVED",
        source: "operator_profile",
      },
      {
        operatorSlug: "scuba-republic",
        operatorName: "Scuba Republic",
        yachtSlugs: ["bajak", "epica"],
        whatsappPhone: "+6282222222222",
        status: "LIVE",
        source: "operator_profile",
      },
    ]);
    expect(prismaMocks.operatorProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: { in: ["APPROVED", "LIVE"] } },
      }),
    );
  });
});
