import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { bokunAdapter, normalizeBokunAvailability } from "@/lib/services/booking/adapters/bokun";
import { getBookingAdapter } from "@/lib/services/booking/adapters";

describe("bokun adapter", () => {
  it("is registered as a booking adapter", () => {
    expect(getBookingAdapter("bokun")).toBe(bokunAdapter);
    expect(bokunAdapter.capabilities).toEqual({
      supportsHold: true,
      supportsCancellation: true,
      supportsLiveAvailability: true,
    });
  });

  it("normalizes OCTO availability into the BluePass adapter shape", () => {
    expect(
      normalizeBokunAvailability(
        {
          id: "availability-1",
          status: "LIMITED",
          vacancies: 4,
          pricing: {
            retail: 125,
            currency: "USD",
          },
        },
        2,
      ),
    ).toEqual({
      available: true,
      priceCents: 12500,
      currency: "USD",
      holdable: true,
    });
  });

  it("rejects availability without enough vacancies", () => {
    expect(
      normalizeBokunAvailability(
        {
          id: "availability-1",
          status: "AVAILABLE",
          vacancies: 1,
          pricing: {
            retail: 75,
            currency: "USD",
          },
        },
        2,
      ).available,
    ).toBe(false);
  });

  it("verifies Bokun webhook signatures with timing-safe HMAC comparison", () => {
    const secret = "webhook-secret";
    const rawBody = JSON.stringify({ event: "booking.updated", booking: { uuid: "hold-1" } });
    const signature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    process.env.BOKUN_WEBHOOK_SECRET = secret;

    expect(
      bokunAdapter.verifyWebhook(new Headers({ "x-bokun-signature": `sha256=${signature}` }), rawBody),
    ).toBe(true);
    expect(
      bokunAdapter.verifyWebhook(new Headers({ "x-bokun-signature": "sha256=bad" }), rawBody),
    ).toBe(false);
  });
});
