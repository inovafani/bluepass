import type { KaiCoreBluePassQuote } from "@/lib/services/kai-core/client";

type QuoteOperationalStepInput = Pick<
  KaiCoreBluePassQuote,
  "status" | "operationalStatus" | "paymentText" | "confirmationText"
>;

export type QuoteOperationalStep = {
  label: string;
  tone: "waiting" | "ready" | "done" | "blocked";
  body: string;
};

export function formatQuoteOperationalStep(input: QuoteOperationalStepInput): QuoteOperationalStep {
  if (input.operationalStatus === "BOOKING_CONFIRMED") {
    return {
      label: "Booking confirmed",
      tone: "done",
      body: input.confirmationText || "The operator has confirmed this booking with BluePass.",
    };
  }

  if (input.operationalStatus === "PAYMENT_READY") {
    return {
      label: "Payment path received",
      tone: "ready",
      body: input.paymentText || "BluePass has received payment instructions from the operator.",
    };
  }

  if (input.status === "TRAVELLER_APPROVED") {
    return {
      label: "Quote approved",
      tone: "waiting",
      body: "BluePass is waiting for the operator payment path and final confirmation instructions.",
    };
  }

  if (input.status === "READY_FOR_TRAVELLER") {
    return {
      label: "Ready to approve",
      tone: "ready",
      body: "Review the operator quote, then approve it so BluePass can request the payment path.",
    };
  }

  return {
    label: "Final price pending",
    tone: "blocked",
    body: "BluePass is still waiting for final price details before this quote can be approved.",
  };
}
