import { afterEach, describe, expect, it, vi } from "vitest";
import { processOperatorInquiryAction } from "@/lib/services/booking/booking-inquiry-actions";

const txMocks = vi.hoisted(() => ({
  bookingInquiry: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  bookingInquiryEvent: {
    create: vi.fn(),
  },
}));

const prismaMocks = vi.hoisted(() => ({
  $transaction: vi.fn((callback) => callback(txMocks)),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.$transaction.mockClear();
  txMocks.bookingInquiry.findUnique.mockReset();
  txMocks.bookingInquiry.update.mockReset();
  txMocks.bookingInquiryEvent.create.mockReset();
});

describe("processOperatorInquiryAction", () => {
  it("updates the inquiry and writes an audit event", async () => {
    txMocks.bookingInquiry.findUnique.mockResolvedValue({
      id: "inq_123",
      status: "OPERATOR_PENDING",
    });
    txMocks.bookingInquiry.update.mockResolvedValue({
      id: "inq_123",
      status: "OPERATOR_ACCEPTED",
    });

    await expect(
      processOperatorInquiryAction({
        inquiryId: "inq_123",
        action: "accept",
        actorPayload: {
          source: "whatsapp",
          messageId: "wamid.test",
        },
      }),
    ).resolves.toEqual({
      processed: true,
      inquiryId: "inq_123",
      fromStatus: "OPERATOR_PENDING",
      toStatus: "OPERATOR_ACCEPTED",
    });
    expect(txMocks.bookingInquiry.update).toHaveBeenCalledWith({
      where: { id: "inq_123" },
      data: { status: "OPERATOR_ACCEPTED" },
      select: { id: true, status: true },
    });
    expect(txMocks.bookingInquiryEvent.create).toHaveBeenCalledWith({
      data: {
        bookingInquiryId: "inq_123",
        fromStatus: "OPERATOR_PENDING",
        toStatus: "OPERATOR_ACCEPTED",
        actorType: "OPERATOR",
        payload: {
          source: "whatsapp",
          messageId: "wamid.test",
          action: "accept",
        },
      },
    });
  });

  it("returns not_found when the id is not a BookingInquiry", async () => {
    txMocks.bookingInquiry.findUnique.mockResolvedValue(null);

    await expect(
      processOperatorInquiryAction({
        inquiryId: "booking_123",
        action: "accept",
      }),
    ).resolves.toEqual({
      processed: false,
      reason: "not_found",
    });
    expect(txMocks.bookingInquiry.update).not.toHaveBeenCalled();
    expect(txMocks.bookingInquiryEvent.create).not.toHaveBeenCalled();
  });

  it("rejects terminal inquiry transitions", async () => {
    txMocks.bookingInquiry.findUnique.mockResolvedValue({
      id: "inq_123",
      status: "OPERATOR_DECLINED",
    });

    await expect(
      processOperatorInquiryAction({
        inquiryId: "inq_123",
        action: "accept",
      }),
    ).rejects.toThrow(
      "Invalid inquiry status transition: OPERATOR_DECLINED -> OPERATOR_ACCEPTED",
    );
  });
});
