import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildWhatsAppTemplatePayload,
  maskPhoneNumber,
  resolveWhatsAppPhoneId,
  sendTemplateMessage,
} from "@/lib/services/whatsapp/client";

const originalKaiPhoneId = process.env.WHATSAPP_PHONE_ID_KAI;
const originalOpsPhoneId = process.env.WHATSAPP_PHONE_ID_OPS;
const originalGraphVersion = process.env.META_GRAPH_VERSION;
const originalAccessToken = process.env.WHATSAPP_ACCESS_TOKEN;

function setPhoneIds({
  kai,
  ops,
}: {
  kai?: string;
  ops?: string;
}) {
  if (kai === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_KAI;
  } else {
    process.env.WHATSAPP_PHONE_ID_KAI = kai;
  }

  if (ops === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_OPS;
  } else {
    process.env.WHATSAPP_PHONE_ID_OPS = ops;
  }
}

afterEach(() => {
  if (originalKaiPhoneId === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_KAI;
  } else {
    process.env.WHATSAPP_PHONE_ID_KAI = originalKaiPhoneId;
  }

  if (originalOpsPhoneId === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_OPS;
  } else {
    process.env.WHATSAPP_PHONE_ID_OPS = originalOpsPhoneId;
  }

  if (originalGraphVersion === undefined) {
    delete process.env.META_GRAPH_VERSION;
  } else {
    process.env.META_GRAPH_VERSION = originalGraphVersion;
  }

  if (originalAccessToken === undefined) {
    delete process.env.WHATSAPP_ACCESS_TOKEN;
  } else {
    process.env.WHATSAPP_ACCESS_TOKEN = originalAccessToken;
  }

  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("resolveWhatsAppPhoneId", () => {
  it("returns WHATSAPP_PHONE_ID_KAI for the kai role", () => {
    setPhoneIds({ kai: "kai_phone_id", ops: "ops_phone_id" });

    expect(resolveWhatsAppPhoneId("kai")).toBe("kai_phone_id");
  });

  it("returns WHATSAPP_PHONE_ID_OPS for the ops role when available", () => {
    setPhoneIds({ kai: "kai_phone_id", ops: "ops_phone_id" });

    expect(resolveWhatsAppPhoneId("ops")).toBe("ops_phone_id");
  });

  it("falls back to WHATSAPP_PHONE_ID_KAI for the ops role when OPS is missing", () => {
    setPhoneIds({ kai: "kai_phone_id" });

    expect(resolveWhatsAppPhoneId("ops")).toBe("kai_phone_id");
  });

  it("throws a clear error when WHATSAPP_PHONE_ID_KAI is missing for kai", () => {
    setPhoneIds({ ops: "ops_phone_id" });

    expect(() => resolveWhatsAppPhoneId("kai")).toThrow(
      "WHATSAPP_PHONE_ID_KAI is required for Kai WhatsApp sends.",
    );
  });

  it("throws a clear error when both OPS and KAI are missing for ops", () => {
    setPhoneIds({});

    expect(() => resolveWhatsAppPhoneId("ops")).toThrow(
      "WHATSAPP_PHONE_ID_OPS is not set and WHATSAPP_PHONE_ID_KAI fallback is unavailable for Ops WhatsApp sends.",
    );
  });
});

describe("buildWhatsAppTemplatePayload", () => {
  it("builds a hello_world template payload without components", () => {
    expect(
      buildWhatsAppTemplatePayload({
        to: "+62 821-3143-342",
        name: "hello_world",
      }),
    ).toEqual({
      messaging_product: "whatsapp",
      to: "628213143342",
      type: "template",
      template: {
        name: "hello_world",
        language: { code: "en_US" },
      },
    });
  });

  it("includes approved template components when provided", () => {
    const payload = buildWhatsAppTemplatePayload({
      to: "628213143342",
      name: "booking_inquiry_operator",
      languageCode: "en",
      components: [
        {
          type: "body",
          parameters: [{ type: "text", text: "New inquiry" }],
        },
      ],
    });

    expect(payload.template.components).toEqual([
      {
        type: "body",
        parameters: [{ type: "text", text: "New inquiry" }],
      },
    ]);
  });

  it("masks recipient phone numbers for logs", () => {
    expect(maskPhoneNumber("+62 821-3143-342")).toBe("********3342");
  });
});

describe("sendTemplateMessage", () => {
  it("posts a template payload to Meta without exposing the access token in the body", async () => {
    setPhoneIds({ kai: "1115079071692326" });
    process.env.META_GRAPH_VERSION = "v20.0";
    process.env.WHATSAPP_ACCESS_TOKEN = "secret_access_token";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({
        messages: [{ id: "wamid.test_send" }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      sendTemplateMessage({
      to: "+62 821-3143-342",
      name: "hello_world",
      role: "kai",
      }),
    ).resolves.toEqual({ providerMessageId: "wamid.test_send" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://graph.facebook.com/v20.0/1115079071692326/messages",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer secret_access_token",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: "628213143342",
          type: "template",
          template: {
            name: "hello_world",
            language: { code: "en_US" },
          },
        }),
      }),
    );
  });
});
