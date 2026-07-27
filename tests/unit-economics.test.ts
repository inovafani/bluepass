import { describe, expect, it } from "vitest";
import { splitBooking } from "@/lib/services/booking/unit-economics";

describe("splitBooking", () => {
  it("splits an unreferred $1000 booking into the real 18% (5/0/3/10) breakdown, operator keeps 82%", () => {
    const split = splitBooking(1000);

    expect(split.conservation).toBe(50);
    expect(split.creatorShare).toBe(0);
    expect(split.paymentProcessing).toBe(30);
    expect(split.commission).toBe(100);
    expect(split.operatorNet).toBe(820);
  });

  it("splits a referred $1000 booking into the real 18% (5/5/3/5) breakdown, operator still keeps 82%", () => {
    const split = splitBooking(1000, true);

    expect(split.conservation).toBe(50);
    expect(split.creatorShare).toBe(50);
    expect(split.paymentProcessing).toBe(30);
    expect(split.commission).toBe(50);
    expect(split.operatorNet).toBe(820);
  });

  it("keeps conservation at 5% of total regardless of size or referral", () => {
    expect(splitBooking(1000).conservation).toBe(50);
    expect(splitBooking(5000).conservation).toBe(250);
    expect(splitBooking(5000, true).conservation).toBe(250);
  });

  it("applies the identical percentage split at any size - no dollar cap", () => {
    const split = splitBooking(5000, true);

    expect(split.conservation).toBe(250);
    expect(split.creatorShare).toBe(250);
    expect(split.paymentProcessing).toBe(150);
    expect(split.commission).toBe(250);
    expect(split.operatorNet).toBe(4100);
  });

  it("keeps a real, separate Stripe fee estimate distinct from the internal payment-processing line", () => {
    const split = splitBooking(1000);

    expect(split.stripeEstimatedFee).toBeCloseTo(1000 * 0.029 + 0.3, 5);
    expect(split.stripeEstimatedFee).not.toBe(split.paymentProcessing);
  });
});
