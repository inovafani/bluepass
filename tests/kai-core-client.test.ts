import { describe, expect, it, vi } from "vitest";
import { forwardWhatsAppWebhookToKaiCore, handleKaiCoreWebChat } from "@/lib/services/kai-core/client";

describe("handleKaiCoreWebChat", () => {
  it("creates a Kai Core session, sends the message, and maps BluePass response to the existing chat shape", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          conversation: {
            id: "core_conversation_1",
          },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          assistantMessage: {
            content: "I prepared BluePass inquiry inquiry_1. This is not a confirmed booking.",
          },
          bluepassMatches: [
            {
              slug: "alila-purnama",
              name: "Alila Purnama",
              region: "Komodo",
              tier: "Legend",
              maxGuests: 10,
              cabins: 5,
              priceSignal: "from USD 3,000 per cabin",
          charterPriceSignal: "from USD 15,000 private charter",
          reasons: ["matches Komodo", "fits up to 10 guests"],
          score: 70,
          productUrl: "https://bluepass.co/yachts/alila-purnama",
        },
      ],
      contactRequest: {
        conversationId: "core_conversation_1",
        fields: ["name", "email", "phone"],
        status: "CONTACT_DETAILS_REQUIRED",
      },
    }),
      );

    const result = await handleKaiCoreWebChat(
      {
        sessionId: undefined,
        message: "Komodo yacht for 8 guests",
        referralAttribution: {
          code: "creator42",
          referralLinkId: "link_1",
          referralPartnerId: "partner_1",
          role: "CREATOR",
        },
      },
      {
        KAI_CORE_BASE_URL: "http://127.0.0.1:3107",
        KAI_CORE_WIDGET_KEY: "pk_test_bluepass",
        KAI_CORE_ORIGIN: "https://bluepass.co",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "http://127.0.0.1:3107/api/widget/session",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          origin: "https://bluepass.co",
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "http://127.0.0.1:3107/api/widget/messages",
      expect.objectContaining({
        method: "POST",
      }),
    );
    const messageRequest = fetchMock.mock.calls[1]?.[1] as RequestInit;
    const messageBody = JSON.parse(String(messageRequest.body));
    expect(messageBody).toMatchObject({
      key: "pk_test_bluepass",
      conversationId: "core_conversation_1",
      content: "Komodo yacht for 8 guests",
      referral: {
        referralCode: "creator42",
        referralLinkId: "link_1",
        referralPartnerId: "partner_1",
        referralRole: "CREATOR",
      },
    });
    expect(messageBody.bluepassCatalog).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slug: "calico-jack",
          name: "Calico Jack",
          region: "Komodo",
          productUrl: "https://bluepass.co/yachts/calico-jack",
        }),
      ]),
    );
    expect(result).toEqual({
      sessionId: "core_conversation_1",
      reply: "I prepared BluePass inquiry inquiry_1. This is not a confirmed booking.",
      matches: [
        {
          slug: "alila-purnama",
          name: "Alila Purnama",
          region: "Komodo",
          tier: "Legend",
          cabinBookable: true,
          maxGuests: 10,
          cabins: 5,
          pricePerCabin: "from USD 3,000 per cabin",
          charterPrice: "from USD 15,000 private charter",
          charterOnly: false,
          matchingReasons: ["matches Komodo", "fits up to 10 guests"],
          departuresPreview: [],
          score: 70,
          productUrl: "https://bluepass.co/yachts/alila-purnama",
        },
      ],
      contactRequest: {
        conversationId: "core_conversation_1",
        fields: ["name", "email", "phone"],
        status: "CONTACT_DETAILS_REQUIRED",
      },
    });
  });

  it("reuses an existing Kai Core conversation id without creating a new session", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      Response.json({
        assistantMessage: { content: "Please share your name, email, and phone." },
      }),
    );

    const result = await handleKaiCoreWebChat(
      {
        sessionId: "core_conversation_1",
        message: "next month",
      },
      {
        KAI_CORE_BASE_URL: "http://127.0.0.1:3107",
        KAI_CORE_WIDGET_KEY: "pk_test_bluepass",
        KAI_CORE_ORIGIN: "https://bluepass.co",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3107/api/widget/messages",
      expect.objectContaining({ method: "POST" }),
    );
    const messageRequest = fetchMock.mock.calls[0]?.[1] as RequestInit;
    const messageBody = JSON.parse(String(messageRequest.body));
    expect(messageBody).toMatchObject({
      key: "pk_test_bluepass",
      conversationId: "core_conversation_1",
      content: "next month",
    });
    expect(messageBody.bluepassCatalog.length).toBeGreaterThan(30);
    expect(result.sessionId).toBe("core_conversation_1");
  });
});

describe("forwardWhatsAppWebhookToKaiCore", () => {
  it("forwards Meta webhook payloads to Kai Core when enabled", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ ok: true }));
    const payload = {
      entry: [
        {
          changes: [
            {
              value: {
                messages: [
                  {
                    type: "button",
                    button: { text: "Accept" },
                  },
                ],
              },
            },
          ],
        },
      ],
    };

    const forwarded = await forwardWhatsAppWebhookToKaiCore(
      payload,
      {
        KAI_CORE_ENABLED: "true",
        KAI_CORE_BASE_URL: "http://127.0.0.1:3107",
        KAI_CORE_WIDGET_KEY: "pk_test_bluepass",
        KAI_CORE_ORIGIN: "https://bluepass.co",
      },
      fetchMock,
    );

    expect(forwarded).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://127.0.0.1:3107/api/whatsapp/webhook",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
      }),
    );
  });
});
