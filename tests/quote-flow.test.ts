import { describe, expect, it } from "vitest";
import { formatQuoteOperationalStep } from "@/app/quotes/[quoteId]/quote-flow";

describe("quote operational flow copy", () => {
  it("guides the traveller after quote approval while payment is pending", () => {
    expect(
      formatQuoteOperationalStep({
        status: "TRAVELLER_APPROVED",
        operationalStatus: "TRAVELLER_APPROVED",
        paymentText: null,
        confirmationText: null,
      }),
    ).toEqual({
      label: "Quote approved",
      tone: "waiting",
      body: "BluePass is waiting for the operator payment path and final confirmation instructions.",
    });
  });

  it("shows payment instructions and final confirmation copy", () => {
    expect(
      formatQuoteOperationalStep({
        status: "TRAVELLER_APPROVED",
        operationalStatus: "PAYMENT_READY",
        paymentText: "Slot held. Payment link: https://pay.example/cj-22.",
        confirmationText: null,
      }),
    ).toEqual({
      label: "Payment path received",
      tone: "ready",
      body: "Slot held. Payment link: https://pay.example/cj-22.",
    });

    expect(
      formatQuoteOperationalStep({
        status: "TRAVELLER_APPROVED",
        operationalStatus: "BOOKING_CONFIRMED",
        paymentText: "Slot held. Payment link: https://pay.example/cj-22.",
        confirmationText: "Payment received. Booking confirmed. Reference CJ-2207.",
      }),
    ).toEqual({
      label: "Booking confirmed",
      tone: "done",
      body: "Payment received. Booking confirmed. Reference CJ-2207.",
    });
  });
});
