import { describe, expect, it } from "vitest";
import {
  formatAlternativeChain,
  formatInquiryEventDetail,
  formatInquiryEventSummary,
  formatInquiryPipelineState,
} from "@/app/admin/inquiries/event-format";

describe("admin inquiry event formatting", () => {
  it("summarizes alternative inquiry chains from event payload", () => {
    expect(
      formatAlternativeChain({
        reason: "operator_declined",
        previousInquiryId: "inq_calico",
        previousYachtSlug: "calico-jack",
        alternativeYachtSlug: "alila-purnama",
      }),
    ).toBe("alternative chain: Calico Jack declined -> Alila Purnama dispatched");
  });

  it("appends alternative chain context to the event summary", () => {
    const summary = formatInquiryEventSummary({
      type: "INQUIRY_CREATED",
      actorType: "SYSTEM",
      fromStatus: null,
      toStatus: "READY_TO_DISPATCH",
      createdAt: new Date("2026-07-01T06:00:00.000Z"),
      payload: {
        reason: "operator_declined",
        previousYachtSlug: "calico-jack",
        alternativeYachtSlug: "alila-purnama",
      },
    });

    expect(summary).toContain("Inquiry created");
    expect(summary).toContain("Calico Jack declined -> Alila Purnama dispatched");
  });

  it("formats Kai Core operator acceptance without duplicated status transitions", () => {
    const summary = formatInquiryEventSummary({
      type: "OPERATOR_RESPONSE_ACCEPTED",
      actorType: null,
      fromStatus: "OPERATOR_ACCEPTED",
      toStatus: "OPERATOR_ACCEPTED",
      createdAt: new Date("2026-07-01T06:00:00.000Z"),
      payload: null,
    });

    expect(summary).toContain("Operator accepted");
    expect(summary).not.toContain("operator_accepted -> operator_accepted");
  });

  it("formats traveller notification and counter offer events for admins", () => {
    const travellerSummary = formatInquiryEventSummary({
      type: "TRAVELLER_WHATSAPP_NOTIFICATION_SENT",
      actorType: null,
      fromStatus: "OPERATOR_ACCEPTED",
      toStatus: "OPERATOR_ACCEPTED",
      createdAt: new Date("2026-07-01T06:00:00.000Z"),
      payload: null,
    });
    const counterSummary = formatInquiryEventSummary({
      type: "OPERATOR_RESPONSE_COUNTERED",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:00:00.000Z"),
      payload: { counterDetails: "Available 3 July, USD 3,900 per cabin." },
    });

    expect(travellerSummary).toContain("Traveller WhatsApp notified");
    expect(counterSummary).toContain("Counter-offer received");
  });

  it("formats quote approval readiness events for admins", () => {
    const approvedSummary = formatInquiryEventSummary({
      type: "BLUEPASS_QUOTE_APPROVED",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:00:00.000Z"),
      payload: null,
    });
    const operatorSummary = formatInquiryEventSummary({
      type: "QUOTE_APPROVAL_OPERATOR_NOTIFICATION_SENT",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:01:00.000Z"),
      payload: null,
    });
    const travellerSummary = formatInquiryEventSummary({
      type: "QUOTE_APPROVAL_TRAVELLER_NOTIFICATION_SENT",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:02:00.000Z"),
      payload: null,
    });

    expect(approvedSummary).toContain("Quote approved by traveller");
    expect(operatorSummary).toContain("Operator asked to hold slot");
    expect(travellerSummary).toContain("Traveller approval follow-up sent");
  });

  it("formats payment-ready handoff events for admins", () => {
    const paymentSummary = formatInquiryEventSummary({
      type: "OPERATOR_PAYMENT_READY",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:03:00.000Z"),
      payload: {
        paymentText: "Slot held. Payment link: https://pay.example/cj-22.",
      },
    });
    const waitingSummary = formatInquiryEventSummary({
      type: "OPERATOR_PAYMENT_READY_WAITING_FOR_TRAVELLER_APPROVAL",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:04:00.000Z"),
      payload: null,
    });

    expect(paymentSummary).toContain("Payment path received");
    expect(waitingSummary).toContain("Payment path waiting for traveller approval");
  });

  it("formats booking confirmation events for admins", () => {
    const summary = formatInquiryEventSummary({
      type: "OPERATOR_BOOKING_CONFIRMED",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "CLOSED",
      createdAt: new Date("2026-07-01T06:05:00.000Z"),
      payload: {
        confirmationText: "Payment received. Booking confirmed. Reference CJ-2207.",
      },
    });

    expect(summary).toContain("Booking confirmed");
    expect(summary).not.toContain("Counter Offered -> Closed");
  });

  it("surfaces human-readable event details for admin audit cards", () => {
    expect(
      formatInquiryEventDetail({
        type: "OPERATOR_PAYMENT_READY",
        actorType: null,
        fromStatus: "COUNTER_OFFERED",
        toStatus: "COUNTER_OFFERED",
        createdAt: new Date("2026-07-01T06:03:00.000Z"),
        payload: {
          paymentText: "Slot held. Payment link: https://pay.example/cj-22.",
          providerMessageId: "wamid.raw-id",
        },
      }),
    ).toBe("Payment: Slot held. Payment link: https://pay.example/cj-22.");

    expect(
      formatInquiryEventDetail({
        type: "OPERATOR_RESPONSE_COUNTERED",
        actorType: null,
        fromStatus: "COUNTER_OFFERED",
        toStatus: "COUNTER_OFFERED",
        createdAt: new Date("2026-07-01T06:03:00.000Z"),
        payload: {
          counterDetails: "Available 22 July. Final price USD 3,900.",
        },
      }),
    ).toBe("Counter: Available 22 July. Final price USD 3,900.");

    expect(
      formatInquiryEventDetail({
        type: "OPERATOR_BOOKING_CONFIRMED",
        actorType: null,
        fromStatus: "COUNTER_OFFERED",
        toStatus: "CLOSED",
        createdAt: new Date("2026-07-01T06:05:00.000Z"),
        payload: {
          confirmationText: "Payment received. Booking confirmed. Reference CJ-2207.",
        },
      }),
    ).toBe("Confirmation: Payment received. Booking confirmed. Reference CJ-2207.");
  });

  it("does not expose raw provider identifiers as admin event details", () => {
    expect(
      formatInquiryEventDetail({
        type: "TRAVELLER_WHATSAPP_NOTIFICATION_SENT",
        actorType: null,
        fromStatus: "COUNTER_OFFERED",
        toStatus: "COUNTER_OFFERED",
        createdAt: new Date("2026-07-01T06:03:00.000Z"),
        payload: {
          providerMessageId: "wamid.raw-id",
        },
      }),
    ).toBeNull();
  });

  it("formats WhatsApp conversational context events for admins", () => {
    const receivedSummary = formatInquiryEventSummary({
      type: "WHATSAPP_CONTEXT_MESSAGE_RECEIVED",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:06:00.000Z"),
      payload: {
        participant: "traveller",
        body: "what is my booking status?",
      },
    });
    const sentSummary = formatInquiryEventSummary({
      type: "WHATSAPP_CONTEXT_REPLY_SENT",
      actorType: null,
      fromStatus: "COUNTER_OFFERED",
      toStatus: "COUNTER_OFFERED",
      createdAt: new Date("2026-07-01T06:07:00.000Z"),
      payload: {
        participant: "traveller",
        providerMessageId: "wamid.context.reply",
      },
    });

    expect(receivedSummary).toContain("WhatsApp context question received");
    expect(sentSummary).toContain("WhatsApp context reply sent");
    expect(
      formatInquiryEventDetail({
        type: "WHATSAPP_CONTEXT_MESSAGE_RECEIVED",
        actorType: null,
        fromStatus: "COUNTER_OFFERED",
        toStatus: "COUNTER_OFFERED",
        createdAt: new Date("2026-07-01T06:06:00.000Z"),
        payload: {
          participant: "traveller",
          body: "what is my booking status?",
        },
      }),
    ).toBe("Traveller asked: what is my booking status?");
    expect(
      formatInquiryEventDetail({
        type: "WHATSAPP_CONTEXT_REPLY_SENT",
        actorType: null,
        fromStatus: "COUNTER_OFFERED",
        toStatus: "COUNTER_OFFERED",
        createdAt: new Date("2026-07-01T06:07:00.000Z"),
        payload: {
          participant: "traveller",
          providerMessageId: "wamid.context.reply",
        },
      }),
    ).toBeNull();
  });

  it("summarizes traveller approval into the next operator payment action", () => {
    const state = formatInquiryPipelineState({
      status: "COUNTER_OFFERED",
      events: [
        {
          type: "BLUEPASS_QUOTE_APPROVED",
          fromStatus: "COUNTER_OFFERED",
          toStatus: "COUNTER_OFFERED",
          createdAt: new Date("2026-07-01T06:00:00.000Z"),
        },
      ],
    });

    expect(state).toEqual({
      label: "Traveller approved quote",
      tone: "action",
      nextAction: "Operator should hold the slot and send payment instructions.",
    });
  });

  it("summarizes payment path and confirmed booking states for admins", () => {
    const paymentState = formatInquiryPipelineState({
      status: "COUNTER_OFFERED",
      events: [
        {
          type: "OPERATOR_PAYMENT_READY",
          fromStatus: "COUNTER_OFFERED",
          toStatus: "COUNTER_OFFERED",
          createdAt: new Date("2026-07-01T06:03:00.000Z"),
        },
      ],
    });
    const confirmedState = formatInquiryPipelineState({
      status: "CLOSED",
      events: [
        {
          type: "OPERATOR_BOOKING_CONFIRMED",
          fromStatus: "COUNTER_OFFERED",
          toStatus: "CLOSED",
          createdAt: new Date("2026-07-01T06:05:00.000Z"),
        },
      ],
    });

    expect(paymentState).toEqual({
      label: "Payment path received",
      tone: "ready",
      nextAction: "Traveller has payment instructions; wait for payment confirmation.",
    });
    expect(confirmedState).toEqual({
      label: "Booking confirmed",
      tone: "done",
      nextAction: "Trip is secured; BluePass can keep supporting pre-departure follow-up.",
    });
  });
});
