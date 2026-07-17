import { afterEach, describe, expect, it, vi } from "vitest";
import { requestOperatorClaimToken } from "@/lib/services/operators/operator-claim-tokens";

const prismaMocks = vi.hoisted(() => ({
  operatorLead: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  operatorClaimToken: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
  operatorOutreachEvent: {
    create: vi.fn(),
  },
}));

const emailMocks = vi.hoisted(() => ({
  sendAuthEmail: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

vi.mock("@/lib/services/auth/email", () => ({
  sendAuthEmail: emailMocks.sendAuthEmail,
}));

afterEach(() => {
  prismaMocks.operatorLead.findUnique.mockReset();
  prismaMocks.operatorLead.update.mockReset();
  prismaMocks.operatorClaimToken.create.mockReset();
  prismaMocks.operatorClaimToken.findUnique.mockReset();
  prismaMocks.operatorOutreachEvent.create.mockReset();
  emailMocks.sendAuthEmail.mockReset();
});

describe("operator claim token service", () => {
  it("emails a secure claim link to the imported operator lead address", async () => {
    const now = new Date("2026-07-10T02:00:00.000Z");
    prismaMocks.operatorLead.findUnique.mockResolvedValue({
      id: "lead_123",
      slug: "dewi-nusantara",
      name: "Dewi Nusantara",
      email: "claims@dewi-nusantara.com",
    });
    prismaMocks.operatorClaimToken.create.mockResolvedValue({
      id: "token_123",
    });
    emailMocks.sendAuthEmail.mockResolvedValue({
      delivered: false,
      provider: "development",
      reason: "RESEND_API_KEY is not configured.",
    });

    await expect(
      requestOperatorClaimToken({
        operatorSlug: "Dewi Nusantara",
        baseUrl: "https://bluepass.co",
        now,
        tokenFactory: () => "raw-claim-token",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        claimUrl:
          "https://bluepass.co/operator/claim/verify?token=raw-claim-token",
        expiresAt: new Date("2026-07-17T02:00:00.000Z"),
      }),
    );

    expect(prismaMocks.operatorClaimToken.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operatorLeadId: "lead_123",
        email: "claims@dewi-nusantara.com",
        tokenHash: expect.not.stringContaining("raw-claim-token"),
        expiresAt: new Date("2026-07-17T02:00:00.000Z"),
      }),
    });
    expect(prismaMocks.operatorLead.update).toHaveBeenCalledWith({
      where: { id: "lead_123" },
      data: {
        status: "CLAIM_LINK_REQUESTED",
        lastOutreachAt: now,
      },
    });
    expect(prismaMocks.operatorOutreachEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operatorLeadId: "lead_123",
        operatorSlug: "dewi-nusantara",
        type: "CLAIM_LINK_REQUESTED",
      }),
    });
    expect(emailMocks.sendAuthEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "claims@dewi-nusantara.com",
        subject: "Claim Dewi Nusantara on BluePass",
        text: expect.stringContaining(
          "https://bluepass.co/operator/claim/verify?token=raw-claim-token",
        ),
      }),
    );
  });

  it("does not mark the lead as sent when the email send actually fails", async () => {
    const now = new Date("2026-07-10T02:00:00.000Z");
    prismaMocks.operatorLead.findUnique.mockResolvedValue({
      id: "lead_789",
      slug: "bad-inbox-operator",
      name: "Bad Inbox Operator",
      email: "claims@bad-inbox-operator.com",
    });
    prismaMocks.operatorClaimToken.create.mockResolvedValue({
      id: "token_789",
    });
    emailMocks.sendAuthEmail.mockRejectedValue(
      new Error("Unable to send auth email: 500 upstream error"),
    );

    await expect(
      requestOperatorClaimToken({
        operatorSlug: "bad-inbox-operator",
        baseUrl: "https://bluepass.co",
        now,
        tokenFactory: () => "raw-claim-token",
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "send_failed",
    });

    // The token row is still created (so a retry can reuse it), but the lead must not be marked
    // as sent, and the outreach event must reflect the failure, not a fake success.
    expect(prismaMocks.operatorClaimToken.create).toHaveBeenCalled();
    expect(prismaMocks.operatorLead.update).not.toHaveBeenCalled();
    expect(prismaMocks.operatorOutreachEvent.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        operatorLeadId: "lead_789",
        operatorSlug: "bad-inbox-operator",
        type: "CLAIM_LINK_SEND_FAILED",
      }),
    });
  });

  it("returns a missing-email result instead of minting a token", async () => {
    prismaMocks.operatorLead.findUnique.mockResolvedValue({
      id: "lead_456",
      slug: "no-email-operator",
      name: "No Email Operator",
      email: null,
    });

    await expect(
      requestOperatorClaimToken({
        operatorSlug: "no-email-operator",
        baseUrl: "https://bluepass.co",
        tokenFactory: () => "raw-claim-token",
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "missing_email",
    });

    expect(prismaMocks.operatorClaimToken.create).not.toHaveBeenCalled();
    expect(emailMocks.sendAuthEmail).not.toHaveBeenCalled();
  });

  it("resolves a valid claim token to its operator lead", async () => {
    const { resolveOperatorClaimToken } = await import(
      "@/lib/services/operators/operator-claim-tokens"
    );
    prismaMocks.operatorClaimToken.findUnique.mockResolvedValue({
      id: "token_123",
      usedAt: null,
      expiresAt: new Date("2026-07-17T02:00:00.000Z"),
      operatorLead: {
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
      },
    });

    await expect(
      resolveOperatorClaimToken(
        "raw-claim-token",
        new Date("2026-07-10T02:00:00.000Z"),
      ),
    ).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        operatorLead: expect.objectContaining({
          slug: "dewi-nusantara",
        }),
      }),
    );
  });
});
