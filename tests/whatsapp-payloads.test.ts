import { describe, expect, it } from "vitest";
import { parseOperatorButtonPayload } from "@/lib/services/whatsapp/payloads";
import {
  buildAcceptPayload,
  buildCounterPayload,
  buildDeclinePayload,
} from "@/lib/services/whatsapp/templates";

describe("WhatsApp operator payloads", () => {
  it("parses valid accept payloads", () => {
    expect(parseOperatorButtonPayload("accept:booking_123")).toEqual({
      action: "accept",
      bookingId: "booking_123",
    });
  });

  it("parses valid decline payloads", () => {
    expect(parseOperatorButtonPayload("decline:booking_123")).toEqual({
      action: "decline",
      bookingId: "booking_123",
    });
  });

  it("parses valid counter payloads", () => {
    expect(parseOperatorButtonPayload("counter:booking_123")).toEqual({
      action: "counter",
      bookingId: "booking_123",
    });
  });

  it("rejects invalid actions", () => {
    expect(() => parseOperatorButtonPayload("hold:booking_123")).toThrow(
      "Invalid operator button payload action",
    );
  });

  it("rejects missing booking ids", () => {
    expect(() => parseOperatorButtonPayload("accept:")).toThrow(
      "bookingId is required",
    );
  });

  it("trims whitespace", () => {
    expect(parseOperatorButtonPayload("  counter: booking_123  ")).toEqual({
      action: "counter",
      bookingId: "booking_123",
    });
  });

  it("builds quick reply payloads", () => {
    expect(buildAcceptPayload(" booking_123 ")).toBe("accept:booking_123");
    expect(buildDeclinePayload(" booking_123 ")).toBe("decline:booking_123");
    expect(buildCounterPayload(" booking_123 ")).toBe("counter:booking_123");
  });
});
