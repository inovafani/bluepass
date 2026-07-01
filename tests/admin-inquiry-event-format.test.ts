import { describe, expect, it } from "vitest";
import { formatAlternativeChain, formatInquiryEventSummary } from "@/app/admin/inquiries/event-format";

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

    expect(summary).toContain("system");
    expect(summary).toContain("new -> ready_to_dispatch");
    expect(summary).toContain("Calico Jack declined -> Alila Purnama dispatched");
  });
});
