import { describe, expect, it } from "vitest";
import {
  buildOperatorAcceptedFreeText,
  buildOperatorCounterPrompt,
  buildOperatorDeclinedFreeText,
  buildOperatorInquiryTemplatePayload,
} from "@/lib/services/whatsapp/operator-dispatch";

describe("operator dispatch builders", () => {
  it("builds booking inquiry template payload with quick replies", () => {
    const payload = buildOperatorInquiryTemplatePayload({
      to: "628213143342",
      bookingId: "booking_123",
      inquiryTitle: "New Komodo inquiry",
      travellerName: "Ari",
      travellerPhone: "+62821",
      dateRange: "June 10-14",
      guests: "2",
      quote: "$1,000",
      tripTitle: "Komodo Liveaboard",
      notes: "AOW divers",
    });

    expect(payload.template.name).toBe("booking_inquiry_operator");
    expect(JSON.stringify(payload)).toContain("accept:booking_123");
    expect(JSON.stringify(payload)).toContain("decline:booking_123");
    expect(JSON.stringify(payload)).toContain("counter:booking_123");
  });

  it("includes key financial split fields in accepted free text", () => {
    const message = buildOperatorAcceptedFreeText({
      bookingShortCode: "BP-123",
      travellerName: "Ari",
      travellerEmail: "ari@example.com",
      travellerWhatsApp: "+62821",
      dateRange: "June 10-14",
      guestCount: 2,
      certificationLevel: "AOW",
      dietaryRestrictions: "Vegetarian",
      insuranceStatus: "Confirmed",
      insurancePolicy: "POL-1",
      arrivalFlight: "GA-123",
      totalUsd: 1000,
      pmsReference: "REZ-1",
    });

    expect(message.body).toContain("Total price: $1000.00");
    expect(message.body).toContain("Operator net: $820.00");
    expect(message.body).toContain("BluePass commission: $100.00");
    expect(message.body).toContain("Conservation amount: $50.00");
    expect(message.body).toContain("Payment processor estimate: $29.30");
    expect(message.body).toContain("PMS reference: REZ-1");
  });

  it("builds decline reason capture copy", () => {
    const message = buildOperatorDeclinedFreeText({
      peerOperatorName: "Blue Lagoon Dive Resort",
    });

    expect(message.body).toContain("Got it, declined");
    expect(message.body).toContain("Sold out");
    expect(message.body).toContain("Reply with a number or skip");
  });

  it("builds counter-offer prompt copy", () => {
    const message = buildOperatorCounterPrompt({ bookingShortCode: "BP-123" });

    expect(message.body).toContain("Counter requested for BP-123");
    expect(message.body).toContain("plain text");
  });
});
