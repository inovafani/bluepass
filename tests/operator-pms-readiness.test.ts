import { afterEach, describe, expect, it, vi } from "vitest";
import { submitOperatorPmsReadiness } from "@/lib/services/operators/operator-pms-readiness";

const prismaMocks = vi.hoisted(() => ({
  operatorProfile: {
    findUnique: vi.fn(),
  },
  operatorPmsReadiness: {
    upsert: vi.fn(),
  },
  operatorOutreachEvent: {
    create: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorProfile.findUnique.mockReset();
  prismaMocks.operatorPmsReadiness.upsert.mockReset();
  prismaMocks.operatorOutreachEvent.create.mockReset();
});

describe("operator PMS readiness", () => {
  it("captures PMS setup readiness for the signed-in claimed operator profile", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValue({
      id: "profile_123",
      accountId: "acct_123",
      companyName: "Calico Jack",
      claimedOperatorSlug: "calico-jack",
    });
    prismaMocks.operatorPmsReadiness.upsert.mockResolvedValue({
      id: "pms_123",
      operatorProfileId: "profile_123",
      platform: "REZDY",
      status: "CREDENTIALS_SUBMITTED",
    });

    await expect(
      submitOperatorPmsReadiness({
        accountId: "acct_123",
        platform: "REZDY",
        contactEmail: "ops@calicojack.com",
        contactWhatsapp: "6285337210180",
        notes: "Use Rezdy for availability.",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: "pms_123",
        platform: "REZDY",
        status: "CREDENTIALS_SUBMITTED",
      }),
    );

    expect(prismaMocks.operatorPmsReadiness.upsert).toHaveBeenCalledWith({
      where: { operatorProfileId: "profile_123" },
      create: expect.objectContaining({
        operatorProfileId: "profile_123",
        platform: "REZDY",
        status: "CREDENTIALS_SUBMITTED",
      }),
      update: expect.objectContaining({
        platform: "REZDY",
        status: "CREDENTIALS_SUBMITTED",
      }),
    });
    expect(prismaMocks.operatorOutreachEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operatorSlug: "calico-jack",
        type: "PMS_READINESS_SUBMITTED",
      }),
    });
  });
});
