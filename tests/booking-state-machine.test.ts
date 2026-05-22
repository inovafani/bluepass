import { describe, expect, it } from "vitest";
import { assertTransition, canTransition } from "@/lib/services/booking/state-machine";

describe("booking state machine", () => {
  it("allows the primary booking progression", () => {
    expect(canTransition("QUOTE_DRAFTED", "OPERATOR_NOTIFIED")).toBe(true);
    expect(canTransition("OPERATOR_NOTIFIED", "OPERATOR_ACCEPTED")).toBe(true);
    expect(canTransition("OPERATOR_ACCEPTED", "PMS_HOLD_PLACED")).toBe(true);
    expect(canTransition("PMS_HOLD_PLACED", "AWAITING_PAYMENT")).toBe(true);
    expect(canTransition("AWAITING_PAYMENT", "CONFIRMED")).toBe(true);
  });

  it("allows operator decline and counter-offer from notification", () => {
    expect(canTransition("OPERATOR_NOTIFIED", "OPERATOR_DECLINED")).toBe(true);
    expect(canTransition("OPERATOR_NOTIFIED", "COUNTER_REQUESTED")).toBe(true);
  });

  it("allows active bookings to be cancelled", () => {
    expect(canTransition("QUOTE_DRAFTED", "CANCELLED")).toBe(true);
    expect(canTransition("AWAITING_PAYMENT", "CANCELLED")).toBe(true);
  });

  it("allows confirmed bookings to be refunded", () => {
    expect(canTransition("CONFIRMED", "REFUNDED")).toBe(true);
  });

  it("rejects payment before a PMS hold is placed", () => {
    expect(canTransition("OPERATOR_ACCEPTED", "AWAITING_PAYMENT")).toBe(false);
    expect(() => assertTransition("OPERATOR_ACCEPTED", "AWAITING_PAYMENT")).toThrow(
      "Invalid booking status transition",
    );
  });

  it("does not allow terminal bookings to move back into active states", () => {
    expect(canTransition("CANCELLED", "AWAITING_PAYMENT")).toBe(false);
    expect(canTransition("REFUNDED", "CONFIRMED")).toBe(false);
  });
});
