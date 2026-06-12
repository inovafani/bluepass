import { afterEach, describe, expect, it, vi } from "vitest";
import { handleWhatsAppWebhook } from "@/lib/services/whatsapp/webhook-handler";

const prismaMocks = vi.hoisted(() => ({
  whatsAppOutboundMessage: {
    updateMany: vi.fn(),
    findFirst: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.whatsAppOutboundMessage.updateMany.mockReset();
  prismaMocks.whatsAppOutboundMessage.findFirst.mockReset();
});

function metaPayload(payload: string, type = "button", phoneNumberId = "shared_phone_id") {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              metadata: {
                phone_number_id: phoneNumberId,
              },
              messages: [
                {
                  from: "628213143342",
                  id: "wamid.test",
                  type,
                  button: type === "button" ? { payload, text: "Action" } : undefined,
                  text: type === "text" ? { body: "hello" } : undefined,
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function metaStatusPayload(status: string) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              statuses: [
                {
                  id: "wamid.outbound",
                  status,
                  recipient_id: "6285337210180",
                  timestamp: "1780590600",
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function metaButtonTextOnlyPayload(text: string) {
  return {
    object: "whatsapp_business_account",
    entry: [
      {
        changes: [
          {
            value: {
              messages: [
                {
                  from: "628213143342",
                  id: "wamid.test",
                  type: "button",
                  button: { text },
                },
              ],
            },
          },
        ],
      },
    ],
  };
}

function mockOptions() {
  return {
    orchestrator: {
      acceptByOperator: vi.fn().mockResolvedValue(undefined),
      declineByOperator: vi.fn().mockResolvedValue(undefined),
      requestCounterOffer: vi.fn().mockResolvedValue(undefined),
    },
    inquiryActions: {
      processOperatorInquiryAction: vi.fn().mockResolvedValue({
        processed: false,
        reason: "not_found",
      }),
    },
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  };
}

describe("handleWhatsAppWebhook", () => {
  it("updates outbound messages from Meta delivery statuses", async () => {
    const options = mockOptions();
    prismaMocks.whatsAppOutboundMessage.updateMany.mockResolvedValue({ count: 1 });

    await handleWhatsAppWebhook(metaStatusPayload("delivered"), options);

    expect(prismaMocks.whatsAppOutboundMessage.updateMany).toHaveBeenCalledWith({
      where: { providerMessageId: "wamid.outbound" },
      data: {
        status: "SENT",
        sentAt: undefined,
      },
    });
    expect(options.logger.info).toHaveBeenCalledWith(
      "whatsapp.webhook.status_processed",
      expect.objectContaining({
        providerMessageId: "present",
        status: "delivered",
        recipient: "*********0180",
        matchedOutboundMessages: 1,
      }),
    );
  });

  it("marks outbound messages failed from Meta failed statuses", async () => {
    const options = mockOptions();
    prismaMocks.whatsAppOutboundMessage.updateMany.mockResolvedValue({ count: 1 });

    await handleWhatsAppWebhook(metaStatusPayload("failed"), options);

    expect(prismaMocks.whatsAppOutboundMessage.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { providerMessageId: "wamid.outbound" },
        data: expect.objectContaining({ status: "FAILED" }),
      }),
    );
  });

  it("calls accept orchestrator for accept button payloads", async () => {
    const options = mockOptions();

    await handleWhatsAppWebhook(metaPayload("accept:booking_123"), options);

    expect(options.inquiryActions.processOperatorInquiryAction).toHaveBeenCalledWith({
      inquiryId: "booking_123",
      action: "accept",
      actorPayload: expect.objectContaining({ source: "whatsapp" }),
    });
    expect(options.orchestrator.acceptByOperator).toHaveBeenCalledWith(
      "booking_123",
      expect.objectContaining({ source: "whatsapp" }),
    );
    expect(options.orchestrator.declineByOperator).not.toHaveBeenCalled();
    expect(options.orchestrator.requestCounterOffer).not.toHaveBeenCalled();
  });

  it("treats accept button payloads as operator actions in one-number mode", async () => {
    const options = mockOptions();

    await handleWhatsAppWebhook(metaPayload("accept:booking_123", "button", "kai_and_ops"), options);

    expect(options.orchestrator.acceptByOperator).toHaveBeenCalledWith(
      "booking_123",
      expect.objectContaining({ source: "whatsapp" }),
    );
  });

  it("calls decline orchestrator for decline button payloads", async () => {
    const options = mockOptions();
    const onOperatorFollowUp = vi.fn();

    await handleWhatsAppWebhook(metaPayload("decline:booking_123"), {
      ...options,
      peerOperatorName: "Komodo Backup Crew",
      onOperatorFollowUp,
    });

    expect(options.orchestrator.declineByOperator).toHaveBeenCalledWith(
      "booking_123",
      expect.objectContaining({ source: "whatsapp" }),
    );
    expect(onOperatorFollowUp).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Komodo Backup Crew"),
      }),
      { to: "628213143342" },
    );
  });

  it("updates inquiry status for inquiry button payloads before falling back to booking orchestrator", async () => {
    const options = mockOptions();
    options.inquiryActions.processOperatorInquiryAction.mockResolvedValue({
      processed: true,
      inquiryId: "inq_123",
      fromStatus: "OPERATOR_PENDING",
      toStatus: "OPERATOR_ACCEPTED",
    });

    await handleWhatsAppWebhook(metaPayload("accept:inq_123"), options);

    expect(options.inquiryActions.processOperatorInquiryAction).toHaveBeenCalledWith({
      inquiryId: "inq_123",
      action: "accept",
      actorPayload: expect.objectContaining({
        source: "whatsapp",
        operatorWhatsApp: "628213143342",
      }),
    });
    expect(options.orchestrator.acceptByOperator).not.toHaveBeenCalled();
    expect(options.logger.info).toHaveBeenCalledWith(
      "whatsapp.webhook.operator_inquiry_action_processed",
      {
        action: "accept",
        inquiryId: "inq_123",
        fromStatus: "OPERATOR_PENDING",
        toStatus: "OPERATOR_ACCEPTED",
      },
    );
  });

  it("resolves text-only template button replies to the latest pending operator inquiry", async () => {
    const options = mockOptions();
    options.inquiryActions.processOperatorInquiryAction.mockResolvedValue({
      processed: true,
      inquiryId: "inq_latest",
      fromStatus: "OPERATOR_PENDING",
      toStatus: "OPERATOR_ACCEPTED",
    });
    prismaMocks.whatsAppOutboundMessage.findFirst.mockResolvedValue({
      bookingInquiryId: "inq_latest",
      bookingInquiry: { id: "inq_latest", status: "OPERATOR_PENDING" },
    });

    await handleWhatsAppWebhook(metaButtonTextOnlyPayload("Accept"), options);

    expect(prismaMocks.whatsAppOutboundMessage.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          recipientPhone: "628213143342",
          bookingInquiry: expect.objectContaining({
            status: { in: ["READY_TO_DISPATCH", "OPERATOR_PENDING", "COUNTER_OFFERED"] },
          }),
        }),
      }),
    );
    expect(options.inquiryActions.processOperatorInquiryAction).toHaveBeenCalledWith({
      inquiryId: "inq_latest",
      action: "accept",
      actorPayload: expect.objectContaining({
        source: "whatsapp",
        operatorWhatsApp: "628213143342",
      }),
    });
    expect(options.orchestrator.acceptByOperator).not.toHaveBeenCalled();
  });

  it("calls counter orchestrator for counter button payloads", async () => {
    const options = mockOptions();
    const onOperatorFollowUp = vi.fn();

    await handleWhatsAppWebhook(metaPayload("counter:booking_123"), {
      ...options,
      onOperatorFollowUp,
    });

    expect(options.orchestrator.requestCounterOffer).toHaveBeenCalledWith(
      "booking_123",
      expect.objectContaining({ source: "whatsapp" }),
    );
    expect(onOperatorFollowUp).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.stringContaining("Counter requested"),
      }),
      { to: "628213143342" },
    );
  });

  it("ignores unsupported message types", async () => {
    const options = mockOptions();

    await handleWhatsAppWebhook(metaPayload("", "text"), options);

    expect(options.orchestrator.acceptByOperator).not.toHaveBeenCalled();
    expect(options.orchestrator.declineByOperator).not.toHaveBeenCalled();
    expect(options.orchestrator.requestCounterOffer).not.toHaveBeenCalled();
  });

  it("does not call orchestrator when button text has no booking id", async () => {
    const options = mockOptions();

    await handleWhatsAppWebhook(metaButtonTextOnlyPayload("Accept"), options);

    expect(options.orchestrator.acceptByOperator).not.toHaveBeenCalled();
    expect(options.orchestrator.declineByOperator).not.toHaveBeenCalled();
    expect(options.orchestrator.requestCounterOffer).not.toHaveBeenCalled();
  });

  it("logs text-only operator buttons when no pending inquiry context is found", async () => {
    const options = mockOptions();

    await handleWhatsAppWebhook(metaButtonTextOnlyPayload("Counter-offer"), options);

    expect(options.logger.info).toHaveBeenCalledWith(
      "whatsapp.operator_button_without_booking_context",
      {
        action: "counter",
        sender: "********3342",
        messageId: "wamid.test",
        buttonPayloadOrText: "Counter-offer",
        note: "Unable to resolve a pending inquiry for this operator reply.",
      },
    );
  });

  it("does not crash the handler for malformed button payloads", async () => {
    const options = mockOptions();

    await expect(
      handleWhatsAppWebhook(metaPayload("bad-payload"), options),
    ).resolves.toBeUndefined();
    expect(options.logger.warn).toHaveBeenCalled();
  });
});
