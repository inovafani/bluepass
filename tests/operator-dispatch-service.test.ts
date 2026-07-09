import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildInquiryTemplateInput,
  dispatchInquiryToOperator,
} from "@/lib/services/operators/operator-dispatch-service";
import {
  sendTemplateMessage,
  sendWhatsAppText,
} from "@/lib/services/whatsapp/client";

const prismaMocks = vi.hoisted(() => ({
  bookingInquiry: {
    findUniqueOrThrow: vi.fn(),
    update: vi.fn(),
  },
  whatsAppOutboundMessage: {
    create: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

vi.mock("@/lib/services/whatsapp/client", () => ({
  sendTemplateMessage: vi.fn(),
  sendWhatsAppText: vi.fn(),
}));

afterEach(() => {
  prismaMocks.bookingInquiry.findUniqueOrThrow.mockReset();
  prismaMocks.bookingInquiry.update.mockReset();
  prismaMocks.whatsAppOutboundMessage.create.mockReset();
  prismaMocks.whatsAppOutboundMessage.update.mockReset();
  vi.mocked(sendTemplateMessage).mockReset();
  vi.mocked(sendWhatsAppText).mockReset();
  delete process.env.WHATSAPP_OPERATOR_INQUIRY_SEND_MODE;
});

const readyInquiry = {
  id: "inq_123",
  selectedYachtSlug: "aliikai",
  selectedYachtName: "Aliikai",
  travellerName: "Ari",
  travellerPhone: "+628123",
  destination: "Raja Ampat",
  tripType: "liveaboard",
  dateWindow: "October",
  guests: 3,
  certificationLevel: "advanced open water",
  budget: "$2,000",
  notes: "Mantas please",
  operatorId: null,
  referralCode: null,
  referralRole: null,
};

describe("operator dispatch service", () => {
  it("formats booking_inquiry_operator params from inquiry data", () => {
    expect(
      buildInquiryTemplateInput({
        inquiry: readyInquiry,
        operatorPhone: "+628213143342",
      }),
    ).toEqual(
      expect.objectContaining({
        to: "+628213143342",
        bookingId: "inq_123",
        inquiryTitle: "Raja Ampat / liveaboard / 3 guests",
        travellerName: "Ari",
        travellerPhone: "+628123",
        dateRange: "October",
        guests: "3",
        quote: "$2,000",
        tripTitle: "Aliikai inquiry",
        notes: expect.stringContaining("Certification: advanced open water"),
      }),
    );
  });

  it("calls WhatsApp send pipeline, persists outbound context, and marks inquiry pending", async () => {
    process.env.WHATSAPP_OPERATOR_INQUIRY_SEND_MODE = "template";
    prismaMocks.bookingInquiry.findUniqueOrThrow.mockResolvedValue(
      readyInquiry,
    );
    prismaMocks.whatsAppOutboundMessage.create.mockResolvedValue({
      id: "wa_out_123",
    });
    prismaMocks.whatsAppOutboundMessage.update.mockResolvedValue({
      id: "wa_out_123",
    });
    prismaMocks.bookingInquiry.update.mockResolvedValue({
      id: "inq_123",
      status: "OPERATOR_PENDING",
    });
    vi.mocked(sendTemplateMessage).mockResolvedValue({
      providerMessageId: "wamid.operator_template",
    });

    await expect(
      dispatchInquiryToOperator({
        inquiryId: "inq_123",
        operatorPhone: "+62 821-3143-342",
      }),
    ).resolves.toEqual({
      ok: true,
      inquiryId: "inq_123",
      status: "OPERATOR_PENDING",
      providerMessageId: "wamid.operator_template",
      outboundMessageId: "wa_out_123",
    });
    expect(sendTemplateMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "628213143342",
        role: "ops",
        name: "booking_inquiry_operator",
        languageCode: "en",
        components: expect.arrayContaining([
          expect.objectContaining({ type: "body" }),
          expect.objectContaining({ type: "button", index: "0" }),
        ]),
      }),
    );
    expect(prismaMocks.whatsAppOutboundMessage.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        bookingInquiryId: "inq_123",
        recipientPhone: "628213143342",
        templateName: "booking_inquiry_operator",
        status: "QUEUED",
      }),
    });
    expect(prismaMocks.whatsAppOutboundMessage.update).toHaveBeenCalledWith({
      where: { id: "wa_out_123" },
      data: expect.objectContaining({
        status: "SENT",
        sentAt: expect.any(Date),
        providerMessageId: "wamid.operator_template",
      }),
    });
    expect(prismaMocks.bookingInquiry.update).toHaveBeenCalledWith({
      where: { id: "inq_123" },
      data: {
        status: "OPERATOR_PENDING",
        operatorId: null,
      },
    });
  });

  it("sends operator inquiry as free text by default for demo-safe local sends", async () => {
    prismaMocks.bookingInquiry.findUniqueOrThrow.mockResolvedValue(
      readyInquiry,
    );
    prismaMocks.whatsAppOutboundMessage.create.mockResolvedValue({
      id: "wa_out_text_default",
      templateName: "booking_inquiry_operator",
    });
    prismaMocks.whatsAppOutboundMessage.update.mockResolvedValue({
      id: "wa_out_text_default",
    });
    prismaMocks.bookingInquiry.update.mockResolvedValue({
      id: "inq_123",
      status: "OPERATOR_PENDING",
    });
    vi.mocked(sendWhatsAppText).mockResolvedValue({
      providerMessageId: "wamid.operator_text",
    });

    await expect(
      dispatchInquiryToOperator({
        inquiryId: "inq_123",
        operatorPhone: "+62 821-3143-342",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        providerMessageId: "wamid.operator_text",
      }),
    );
    expect(sendTemplateMessage).not.toHaveBeenCalled();
    expect(sendWhatsAppText).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "628213143342",
        role: "ops",
        body: expect.stringContaining("New BluePass inquiry"),
      }),
    );
    expect(prismaMocks.whatsAppOutboundMessage.update).toHaveBeenCalledWith({
      where: { id: "wa_out_text_default" },
      data: expect.objectContaining({
        status: "SENT",
        templateName: "operator_inquiry_text",
        providerMessageId: "wamid.operator_text",
      }),
    });
  });

  it("falls back to text when Meta rejects the operator template as unavailable", async () => {
    process.env.WHATSAPP_OPERATOR_INQUIRY_SEND_MODE = "template";
    prismaMocks.bookingInquiry.findUniqueOrThrow.mockResolvedValue(
      readyInquiry,
    );
    prismaMocks.whatsAppOutboundMessage.create.mockResolvedValue({
      id: "wa_out_fallback",
      templateName: "booking_inquiry_operator",
    });
    prismaMocks.whatsAppOutboundMessage.update.mockResolvedValue({
      id: "wa_out_fallback",
    });
    prismaMocks.bookingInquiry.update.mockResolvedValue({
      id: "inq_123",
      status: "OPERATOR_PENDING",
    });
    vi.mocked(sendTemplateMessage).mockRejectedValue(
      new Error("Meta Graph API rejected the WhatsApp send. code=132001"),
    );
    vi.mocked(sendWhatsAppText).mockResolvedValue({
      providerMessageId: "wamid.operator_text",
    });

    await dispatchInquiryToOperator({
      inquiryId: "inq_123",
      operatorPhone: "+62 821-3143-342",
    });

    expect(sendWhatsAppText).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "628213143342",
        role: "ops",
        body: expect.stringContaining("New BluePass inquiry"),
      }),
    );
    expect(prismaMocks.whatsAppOutboundMessage.update).toHaveBeenCalledWith({
      where: { id: "wa_out_fallback" },
      data: expect.objectContaining({
        status: "SENT",
        templateName: "operator_inquiry_text",
        providerMessageId: "wamid.operator_text",
      }),
    });
  });

  it("falls back to text when Meta rejects the operator template for any template send error", async () => {
    process.env.WHATSAPP_OPERATOR_INQUIRY_SEND_MODE = "template";
    prismaMocks.bookingInquiry.findUniqueOrThrow.mockResolvedValue(
      readyInquiry,
    );
    prismaMocks.whatsAppOutboundMessage.create.mockResolvedValue({
      id: "wa_out_template_error",
      templateName: "booking_inquiry_operator",
    });
    prismaMocks.whatsAppOutboundMessage.update.mockResolvedValue({
      id: "wa_out_template_error",
    });
    prismaMocks.bookingInquiry.update.mockResolvedValue({
      id: "inq_123",
      status: "OPERATOR_PENDING",
    });
    vi.mocked(sendTemplateMessage).mockRejectedValue(
      new Error("Meta Graph API rejected the WhatsApp send. code=100"),
    );
    vi.mocked(sendWhatsAppText).mockResolvedValue({
      providerMessageId: "wamid.operator_text",
    });

    await expect(
      dispatchInquiryToOperator({
        inquiryId: "inq_123",
        operatorPhone: "+62 821-3143-342",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        ok: true,
        providerMessageId: "wamid.operator_text",
      }),
    );
    expect(sendWhatsAppText).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "628213143342",
        role: "ops",
        body: expect.stringContaining("New BluePass inquiry"),
      }),
    );
    expect(prismaMocks.whatsAppOutboundMessage.update).toHaveBeenCalledWith({
      where: { id: "wa_out_template_error" },
      data: expect.objectContaining({
        status: "SENT",
        templateName: "operator_inquiry_text",
        providerMessageId: "wamid.operator_text",
      }),
    });
  });
});
