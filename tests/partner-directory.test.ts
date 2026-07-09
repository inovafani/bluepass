import { afterEach, describe, expect, it, vi } from "vitest";
import { listApprovedPartnerDirectory } from "@/lib/services/partners/partner-directory";

const prismaMocks = vi.hoisted(() => ({
  creatorProfile: {
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.creatorProfile.findMany.mockReset();
});

describe("partner directory", () => {
  it("returns approved partner profiles with WhatsApp identity data", async () => {
    prismaMocks.creatorProfile.findMany.mockResolvedValue([
      {
        id: "creator_profile_1",
        referralPartnerId: "partner_1",
        status: "APPROVED",
        handle: "reefvoice",
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
        updatedAt: new Date("2026-07-02T00:00:00.000Z"),
        account: { displayName: "Reef Voice", phone: "+6281111111111" },
        referralPartner: {
          id: "partner_1",
          name: "Reef Voice Studio",
          role: "CREATOR",
          handle: "reefvoice",
          phone: "+6282222222222",
        },
      },
      {
        id: "creator_profile_2",
        referralPartnerId: "partner_2",
        status: "LIVE",
        handle: "komodo-club",
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
        updatedAt: new Date("2026-07-02T00:00:00.000Z"),
        account: { displayName: "Komodo Club", phone: "+6283333333333" },
        referralPartner: {
          id: "partner_2",
          name: "Komodo Club",
          role: "GROUP",
          handle: "komodo-club",
          phone: null,
        },
      },
      {
        id: "creator_profile_3",
        referralPartnerId: null,
        status: "APPROVED",
        handle: "no-phone",
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
        updatedAt: new Date("2026-07-02T00:00:00.000Z"),
        account: { displayName: "No Phone", phone: null },
        referralPartner: null,
      },
    ]);

    await expect(listApprovedPartnerDirectory()).resolves.toEqual([
      {
        partnerId: "partner_1",
        partnerName: "Reef Voice Studio",
        partnerRole: "CREATOR",
        handle: "reefvoice",
        whatsappPhone: "+6282222222222",
        status: "APPROVED",
        source: "creator_profile",
      },
      {
        partnerId: "partner_2",
        partnerName: "Komodo Club",
        partnerRole: "GROUP",
        handle: "komodo-club",
        whatsappPhone: "+6283333333333",
        status: "LIVE",
        source: "creator_profile",
      },
    ]);
    expect(prismaMocks.creatorProfile.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { status: { in: ["APPROVED", "LIVE"] } },
      }),
    );
  });
});
