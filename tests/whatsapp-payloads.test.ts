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
      source: "structured_payload",
    });
  });

  it("parses valid decline payloads", () => {
    expect(parseOperatorButtonPayload("decline:booking_123")).toEqual({
      action: "decline",
      bookingId: "booking_123",
      source: "structured_payload",
    });
  });

  it("parses valid counter payloads", () => {
    expect(parseOperatorButtonPayload("counter:booking_123")).toEqual({
      action: "counter",
      bookingId: "booking_123",
      source: "structured_payload",
    });
  });

  it("parses Meta quick reply button text", () => {
    expect(parseOperatorButtonPayload("Accept")).toEqual({
      action: "accept",
      bookingId: null,
      source: "button_text",
    });
    expect(parseOperatorButtonPayload("Decline")).toEqual({
      action: "decline",
      bookingId: null,
      source: "button_text",
    });
    expect(parseOperatorButtonPayload("Counter-offer")).toEqual({
      action: "counter",
      bookingId: null,
      source: "button_text",
    });
    expect(parseOperatorButtonPayload("Counter")).toEqual({
      action: "counter",
      bookingId: null,
      source: "button_text",
    });
    expect(parseOperatorButtonPayload("accept")).toEqual({
      action: "accept",
      bookingId: null,
      source: "button_text",
    });
    expect(parseOperatorButtonPayload("decline")).toEqual({
      action: "decline",
      bookingId: null,
      source: "button_text",
    });
    expect(parseOperatorButtonPayload("counter")).toEqual({
      action: "counter",
      bookingId: null,
      source: "button_text",
    });
  });

  it("rejects empty payloads", () => {
    expect(() => parseOperatorButtonPayload("")).toThrow(
      "Invalid operator button payload: payload is empty.",
    );
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
      source: "structured_payload",
    });
  });

  it("builds quick reply payloads", () => {
    expect(buildAcceptPayload(" booking_123 ")).toBe("accept:booking_123");
    expect(buildDeclinePayload(" booking_123 ")).toBe("decline:booking_123");
    expect(buildCounterPayload(" booking_123 ")).toBe("counter:booking_123");
  });
});
