import { describe, expect, it, vi } from "vitest";
import { handleWhatsAppWebhook } from "@/lib/services/whatsapp/webhook-handler";

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

function mockOptions() {
  return {
    orchestrator: {
      acceptByOperator: vi.fn().mockResolvedValue(undefined),
      declineByOperator: vi.fn().mockResolvedValue(undefined),
      requestCounterOffer: vi.fn().mockResolvedValue(undefined),
    },
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    },
  };
}

describe("handleWhatsAppWebhook", () => {
  it("calls accept orchestrator for accept button payloads", async () => {
    const options = mockOptions();

    await handleWhatsAppWebhook(metaPayload("accept:booking_123"), options);

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
    );
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
    );
  });

  it("ignores unsupported message types", async () => {
    const options = mockOptions();

    await handleWhatsAppWebhook(metaPayload("", "text"), options);

    expect(options.orchestrator.acceptByOperator).not.toHaveBeenCalled();
    expect(options.orchestrator.declineByOperator).not.toHaveBeenCalled();
    expect(options.orchestrator.requestCounterOffer).not.toHaveBeenCalled();
  });

  it("does not crash the handler for malformed button payloads", async () => {
    const options = mockOptions();

    await expect(
      handleWhatsAppWebhook(metaPayload("bad-payload"), options),
    ).resolves.toBeUndefined();
    expect(options.logger.warn).toHaveBeenCalled();
  });
});
