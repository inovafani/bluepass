import { afterEach, describe, expect, it, vi } from "vitest";
import {
  approveOperatorClaim,
  createOperatorClaimForAccount,
} from "@/lib/services/operators/operator-claim-service";

const prismaMocks = vi.hoisted(() => ({
  bluePassAccount: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  operatorClaim: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  operatorProfile: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
    update: vi.fn(),
  },
  referralPartner: {
    create: vi.fn(),
  },
  referralLink: {
    findUnique: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.bluePassAccount.findUnique.mockReset();
  prismaMocks.bluePassAccount.update.mockReset();
  prismaMocks.operatorClaim.create.mockReset();
  prismaMocks.operatorClaim.findFirst.mockReset();
  prismaMocks.operatorClaim.findUnique.mockReset();
  prismaMocks.operatorClaim.update.mockReset();
  prismaMocks.operatorProfile.findUnique.mockReset();
  prismaMocks.operatorProfile.upsert.mockReset();
  prismaMocks.operatorProfile.update.mockReset();
  prismaMocks.referralPartner.create.mockReset();
  prismaMocks.referralLink.findUnique.mockReset();
});

describe("operator claim service", () => {
  it("creates a pending claim and pending operator profile for an account", async () => {
    prismaMocks.bluePassAccount.findUnique.mockResolvedValue({
      id: "acct_123",
      email: "owner@mermaid-liveaboards.com",
      roles: ["TRAVELLER"],
    });
    prismaMocks.operatorClaim.findFirst.mockResolvedValue(null);
    prismaMocks.operatorClaim.create.mockResolvedValue({
      id: "claim_123",
      operatorSlug: "mermaid-liveaboards",
      status: "PENDING_REVIEW",
    });
    prismaMocks.operatorProfile.upsert.mockResolvedValue({
      id: "op_profile_123",
      status: "PENDING_REVIEW",
    });

    await expect(
      createOperatorClaimForAccount({
        accountId: "acct_123",
        operatorSlug: "mermaid-liveaboards",
        claimantName: "Mira",
        claimantEmail: "owner@mermaid-liveaboards.com",
        claimantPhone: "+628123",
        claimantRole: "Owner",
        websiteUrl: "mermaid-liveaboards.com",
        proofUrl: "",
        notes: "I run this business.",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        id: "claim_123",
        operatorSlug: "mermaid-liveaboards",
        status: "PENDING_REVIEW",
      }),
    );

    expect(prismaMocks.bluePassAccount.update).toHaveBeenCalledWith({
      where: { id: "acct_123" },
      data: { roles: { set: ["TRAVELLER", "OPERATOR"] } },
      select: { id: true },
    });
    expect(prismaMocks.operatorClaim.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          accountId: "acct_123",
          operatorSlug: "mermaid-liveaboards",
          operatorName: "Mermaid Liveaboards",
          yachtSlugs: ["mermaid-i", "mermaid-ii"],
          claimantEmail: "owner@mermaid-liveaboards.com",
          websiteUrl: "https://mermaid-liveaboards.com",
          status: "PENDING_REVIEW",
        }),
      }),
    );
    expect(prismaMocks.operatorProfile.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: "acct_123" },
        create: expect.objectContaining({
          accountId: "acct_123",
          companyName: "Mermaid Liveaboards",
          status: "PENDING_REVIEW",
        }),
      }),
    );
  });

  it("approves a claim and creates an operator referral partner link", async () => {
    prismaMocks.operatorClaim.findUnique.mockResolvedValue({
      id: "claim_123",
      operatorSlug: "scuba-republic",
      operatorName: "Scuba Republic",
      yachtSlugs: ["bajak", "capoeng", "jaya", "epica"],
      accountId: "acct_123",
      claimantName: "Sri",
      claimantEmail: "owner@scuba-republic.com",
      claimantPhone: "+628123",
      websiteUrl: "https://scuba-republic.com",
      account: {
        id: "acct_123",
        email: "owner@scuba-republic.com",
        displayName: "Sri",
        phone: "+628123",
      },
    });
    prismaMocks.operatorProfile.findUnique.mockResolvedValue({
      id: "op_profile_123",
      accountId: "acct_123",
      referralPartnerId: null,
      referralPartner: null,
    });
    prismaMocks.referralLink.findUnique.mockResolvedValue(null);
    prismaMocks.referralPartner.create.mockResolvedValue({
      id: "partner_123",
      links: [{ code: "scuba-republic", targetPath: "/yachts/bajak" }],
    });
    prismaMocks.operatorClaim.update.mockResolvedValue({
      id: "claim_123",
      status: "APPROVED",
    });
    prismaMocks.operatorProfile.update.mockResolvedValue({
      id: "op_profile_123",
      status: "APPROVED",
      referralPartnerId: "partner_123",
    });

    await expect(
      approveOperatorClaim({
        claimId: "claim_123",
        reviewerEmail: "admin@bluepass.co",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        claim: expect.objectContaining({ status: "APPROVED" }),
        operatorProfile: expect.objectContaining({
          referralPartnerId: "partner_123",
        }),
      }),
    );

    expect(prismaMocks.referralPartner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          role: "OPERATOR",
          name: "Scuba Republic",
          email: "owner@scuba-republic.com",
          links: {
            create: expect.objectContaining({
              code: "scuba-republic",
              targetPath: "/yachts/bajak",
            }),
          },
        }),
      }),
    );
    expect(prismaMocks.operatorProfile.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { accountId: "acct_123" },
        data: expect.objectContaining({
          status: "APPROVED",
          referralPartnerId: "partner_123",
          claimedOperatorSlug: "scuba-republic",
          claimedYachtSlugs: ["bajak", "capoeng", "jaya", "epica"],
        }),
      }),
    );
  });
});
