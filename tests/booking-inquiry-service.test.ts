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
  commissionLedgerEntry: {
    deleteMany: vi.fn(),
    createMany: vi.fn(),
  },
  creatorProfile: {
    findFirst: vi.fn(),
  },
  operatorProfile: {
    findFirst: vi.fn(),
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
  prismaMocks.commissionLedgerEntry.deleteMany.mockReset();
  prismaMocks.commissionLedgerEntry.createMany.mockReset();
  prismaMocks.creatorProfile.findFirst.mockReset();
  prismaMocks.operatorProfile.findFirst.mockReset();
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

  it("creates pending commission ledger entries for referred inquiries", async () => {
    prismaMocks.kaiSession.findUnique.mockResolvedValue({
      id: "kai_referred_session",
      channel: "WEB",
      travellerPhone: "+628123",
      referralLinkId: "ref_link_123",
      referralPartnerId: "ref_partner_123",
      referralCode: "inov-afani",
      referralRole: "CREATOR",
      slots: {
        intent: {
          destination: "Komodo",
          tripType: "liveaboard",
          guests: 2,
          dateWindow: "October",
          budget: "$2,000",
          travellerName: "Ari",
          travellerEmail: "ari@example.com",
          travellerPhone: "+628123",
        },
      },
    });
    prismaMocks.bookingInquiry.findFirst.mockResolvedValue(null);
    prismaMocks.bookingInquiry.create.mockResolvedValue({
      id: "inq_referred",
      status: "READY_TO_DISPATCH",
      selectedYachtSlug: "aliikai",
      referralLinkId: "ref_link_123",
      referralPartnerId: "ref_partner_123",
      referralCode: "inov-afani",
      referralRole: "CREATOR",
      budget: "$2,000",
    });
    prismaMocks.creatorProfile.findFirst.mockResolvedValue({
      accountId: "account_creator",
    });

    await createInquiryFromKaiSession({
      sessionId: "kai_referred_session",
      selectedYachtSlug: "aliikai",
    });

    expect(prismaMocks.commissionLedgerEntry.deleteMany).toHaveBeenCalledWith({
      where: {
        bookingInquiryId: "inq_referred",
        status: "PENDING",
        kind: {
          in: [
            "CREATOR_COMMISSION_ESTIMATE",
            "BLUEPASS_PLATFORM_COMMISSION",
            "CONSERVATION_ALLOCATION",
            "PAYMENT_PROCESSING_ALLOCATION",
            "OPERATOR_PAYOUT_PLACEHOLDER",
          ],
        },
      },
    });
    // Real 18% (5/5/3/5) split on a $2,000 referred booking: 5% conservation ($100), 5% partner
    // ($100), 3% payments ($60), 5% platform fee ($100, referred rate), operator nets 82% ($1,640).
    expect(prismaMocks.commissionLedgerEntry.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        expect.objectContaining({
          kind: "CONSERVATION_ALLOCATION",
          amountCents: 10000,
        }),
        expect.objectContaining({
          kind: "PAYMENT_PROCESSING_ALLOCATION",
          amountCents: 6000,
        }),
        expect.objectContaining({
          kind: "BLUEPASS_PLATFORM_COMMISSION",
          amountCents: 10000,
        }),
        expect.objectContaining({
          kind: "OPERATOR_PAYOUT_PLACEHOLDER",
          amountCents: 164000,
        }),
        expect.objectContaining({
          bookingInquiryId: "inq_referred",
          accountId: "account_creator",
          referralPartnerId: "ref_partner_123",
          role: "CREATOR",
          kind: "CREATOR_COMMISSION_ESTIMATE",
          amountCents: 10000,
          status: "PENDING",
        }),
      ]),
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
