import { afterEach, describe, expect, it, vi } from "vitest";

const prismaMocks = vi.hoisted(() => ({
  operatorProfile: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

import { handleStripeAccountUpdated, verifyStripeConnectWebhookEvent } from "@/lib/services/stripe/stripe-connect-webhook";

describe("verifyStripeConnectWebhookEvent", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("throws when STRIPE_CONNECT_WEBHOOK_SECRET is not configured", () => {
    expect(() => verifyStripeConnectWebhookEvent("{}", "t=1,v1=fake", {})).toThrow(
      "STRIPE_CONNECT_WEBHOOK_SECRET is not configured.",
    );
  });

  it("throws a verification error for a bad signature rather than an auth error", () => {
    expect(() =>
      verifyStripeConnectWebhookEvent("{}", "t=1,v1=fake", { STRIPE_CONNECT_WEBHOOK_SECRET: "whsec_test" }),
    ).toThrow(/signature|timestamp/i);
  });
});

describe("handleStripeAccountUpdated", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does nothing for an account with no matching OperatorProfile", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValueOnce(null);

    await handleStripeAccountUpdated({ id: "acct_unknown", charges_enabled: true, payouts_enabled: true } as never);

    expect(prismaMocks.operatorProfile.update).not.toHaveBeenCalled();
  });

  it("updates charges/payouts enabled flags and stamps stripeOnboardedAt once both are true", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValueOnce({
      id: "profile_1",
      stripeConnectAccountId: "acct_123",
      stripeOnboardedAt: null,
    });

    await handleStripeAccountUpdated({ id: "acct_123", charges_enabled: true, payouts_enabled: true } as never);

    expect(prismaMocks.operatorProfile.update).toHaveBeenCalledWith({
      where: { id: "profile_1" },
      data: {
        stripeChargesEnabled: true,
        stripePayoutsEnabled: true,
        stripeOnboardedAt: expect.any(Date),
      },
    });
  });

  it("updates flags without touching stripeOnboardedAt when only one capability is enabled", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValueOnce({
      id: "profile_2",
      stripeConnectAccountId: "acct_456",
      stripeOnboardedAt: null,
    });

    await handleStripeAccountUpdated({ id: "acct_456", charges_enabled: true, payouts_enabled: false } as never);

    expect(prismaMocks.operatorProfile.update).toHaveBeenCalledWith({
      where: { id: "profile_2" },
      data: { stripeChargesEnabled: true, stripePayoutsEnabled: false },
    });
  });

  it("does not re-stamp stripeOnboardedAt once it is already set", async () => {
    const existingDate = new Date("2026-07-01T00:00:00.000Z");
    prismaMocks.operatorProfile.findUnique.mockResolvedValueOnce({
      id: "profile_3",
      stripeConnectAccountId: "acct_789",
      stripeOnboardedAt: existingDate,
    });

    await handleStripeAccountUpdated({ id: "acct_789", charges_enabled: true, payouts_enabled: true } as never);

    expect(prismaMocks.operatorProfile.update).toHaveBeenCalledWith({
      where: { id: "profile_3" },
      data: { stripeChargesEnabled: true, stripePayoutsEnabled: true },
    });
  });
});
