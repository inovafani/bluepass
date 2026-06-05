import { afterEach, describe, expect, it, vi } from "vitest";
import {
  canCreateInquiryFromIntent,
  createInquiryFromKaiSession,
} from "@/lib/services/booking/booking-inquiry-service";

const prismaMocks = vi.hoisted(() => ({
  kaiSession: {
    findUnique: vi.fn(),
  },
  bookingInquiry: {
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.kaiSession.findUnique.mockReset();
  prismaMocks.bookingInquiry.create.mockReset();
  prismaMocks.bookingInquiry.findFirst.mockReset();
  prismaMocks.bookingInquiry.update.mockReset();
});

describe("BookingInquiry service", () => {
  it("canCreateInquiryFromIntent returns false when required slots are missing", () => {
    expect(canCreateInquiryFromIntent({ destination: "Raja Ampat" })).toEqual({
      ok: false,
      missingSlots: [
        "tripType",
        "guests",
        "dateWindow",
        "budget",
        "selectedYachtSlug",
        "travellerName",
        "travellerEmail",
        "travellerPhone",
      ],
    });
  });

  it("canCreateInquiryFromIntent returns true when core slots, contact, and yacht are present", () => {
    expect(
      canCreateInquiryFromIntent(
        {
          destination: "Komodo",
          tripType: "sailing",
          guests: 2,
          dateWindow: "October",
          budget: "$2,000",
          travellerName: "Ari",
          travellerEmail: "ari@example.com",
          travellerPhone: "+628123",
        },
        { selectedYachtSlug: "alexa" },
      ),
    ).toEqual({ ok: true, missingSlots: [] });
  });

  it("does not require certification for diving or liveaboard before dispatch readiness", () => {
    expect(
      canCreateInquiryFromIntent(
        {
          destination: "Raja Ampat",
          tripType: "liveaboard",
          guests: 3,
          dateWindow: "October",
          budget: "$2,000",
          travellerName: "Ari",
          travellerEmail: "ari@example.com",
          travellerPhone: "+628123",
        },
        { selectedYachtSlug: "aliikai" },
      ),
    ).toEqual({ ok: true, missingSlots: [] });
  });

  it("rejects selectedYachtSlug values that do not exist in yachts.ts", async () => {
    await expect(
      createInquiryFromKaiSession({
        sessionId: "kai_ready_session",
        selectedYachtSlug: "not-real",
      }),
    ).resolves.toEqual({
      ok: false,
      missingSlots: ["selectedYachtSlug"],
      error: "Selected yacht was not found in the BluePass preview catalog.",
    });
    expect(prismaMocks.kaiSession.findUnique).not.toHaveBeenCalled();
  });

  it("creates BookingInquiry from KaiSession intent", async () => {
    prismaMocks.kaiSession.findUnique.mockResolvedValue({
      id: "kai_ready_session",
      channel: "WEB",
      travellerPhone: "+628123",
      slots: {
        intent: {
          destination: "Raja Ampat",
          tripType: "liveaboard",
          guests: 3,
          dateWindow: "October",
          certificationLevel: "advanced open water",
          budget: "$2,000",
          travellerName: "Ari",
          travellerEmail: "ari@example.com",
          travellerPhone: "+628123",
          interests: ["mantas"],
        },
      },
    });
    prismaMocks.bookingInquiry.findFirst.mockResolvedValue(null);
    prismaMocks.bookingInquiry.create.mockResolvedValue({
      id: "inq_123",
      status: "READY_TO_DISPATCH",
      selectedYachtSlug: "aliikai",
    });

    const result = await createInquiryFromKaiSession({
      sessionId: "kai_ready_session",
      selectedYachtSlug: "aliikai",
    });

    expect(result).toEqual(
      expect.objectContaining({
        ok: true,
        inquiry: expect.objectContaining({ id: "inq_123" }),
        reusedExisting: false,
      }),
    );
    expect(prismaMocks.bookingInquiry.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sourceChannel: "WEB",
        kaiSessionId: "kai_ready_session",
        selectedYachtSlug: "aliikai",
        selectedYachtName: "Aliikai",
        destination: "Raja Ampat",
        tripType: "liveaboard",
        guests: 3,
        dateWindow: "October",
        certificationLevel: "advanced open water",
        travellerName: "Ari",
        travellerEmail: "ari@example.com",
        travellerPhone: "+628123",
        interests: ["mantas"],
        status: "READY_TO_DISPATCH",
      }),
    });
  });

  it("does not create duplicate active inquiry for the same session", async () => {
    prismaMocks.kaiSession.findUnique.mockResolvedValue({
      id: "kai_existing_session",
      channel: "WEB",
      travellerPhone: null,
      slots: {
        intent: {
          destination: "Komodo",
          tripType: "sailing",
          guests: 2,
          dateWindow: "October",
          budget: "$2,000",
          travellerName: "Ari",
          travellerEmail: "ari@example.com",
          travellerPhone: "+628123",
        },
      },
    });
    prismaMocks.bookingInquiry.findFirst.mockResolvedValue({
      id: "inq_existing",
      selectedYachtSlug: "alexa",
      selectedYachtName: "Alexa",
      travellerName: null,
      travellerEmail: null,
      travellerPhone: null,
      notes: null,
    });
    prismaMocks.bookingInquiry.update.mockResolvedValue({
      id: "inq_existing",
      status: "READY_TO_DISPATCH",
      selectedYachtSlug: "alexa",
    });

    const result = await createInquiryFromKaiSession({
      sessionId: "kai_existing_session",
      selectedYachtSlug: "alexa",
    });

    expect(result).toEqual(expect.objectContaining({ ok: true, reusedExisting: true }));
    expect(prismaMocks.bookingInquiry.create).not.toHaveBeenCalled();
    expect(prismaMocks.bookingInquiry.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "inq_existing" },
        data: expect.objectContaining({ status: "READY_TO_DISPATCH" }),
      }),
    );
  });
});
