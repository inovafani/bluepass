import { describe, expect, it, vi } from "vitest";
import {
  approveKaiCoreBluePassQuote,
  forwardWhatsAppWebhookToKaiCore,
  getKaiCoreBluePassQuote,
  handleKaiCoreWebChat,
  listKaiCoreBluePassInquiries,
} from "@/lib/services/kai-core/client";

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

  it("retries a transient Kai Core session failure before sending the message", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ error: "pooler reset" }, { status: 500 }))
      .mockResolvedValueOnce(
        Response.json({
          conversation: { id: "core_conversation_retry" },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          assistantMessage: { content: "Retry recovered." },
        }),
      );

    const result = await handleKaiCoreWebChat(
      {
        message: "Komodo yacht for 4 guests",
      },
      {
        KAI_CORE_BASE_URL: "http://127.0.0.1:3108",
        KAI_CORE_WIDGET_KEY: "pk_test_bluepass",
        KAI_CORE_ORIGIN: "https://bluepass.co",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(result).toEqual({
      sessionId: "core_conversation_retry",
      reply: "Retry recovered.",
    });
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

describe("listKaiCoreBluePassInquiries", () => {
  it("fetches the Kai Core BluePass inquiry pipeline with the admin token", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      Response.json({
        inquiries: [
          {
            id: "inq_1",
            status: "OPERATOR_ACCEPTED",
            travellerName: "Inov",
            travellerEmail: "inov@example.com",
            travellerPhone: "6285156246329",
            destination: "Komodo",
            dateWindow: "6 July 2026",
            guests: 4,
            budget: "Quote requested",
            selectedYachtName: "Calico Jack",
            operatorName: "Calico Jack",
            createdAt: "2026-07-01T05:00:00.000Z",
            events: [
              {
                id: "event_1",
                type: "OPERATOR_RESPONSE_ACCEPTED",
                fromStatus: "OPERATOR_PENDING",
                toStatus: "OPERATOR_ACCEPTED",
                metadata: { providerMessageId: "wamid_1" },
                createdAt: "2026-07-01T05:01:00.000Z",
              },
            ],
            dispatches: [
              {
                id: "dispatch_1",
                status: "SENT",
                operatorPhone: "6285337210180",
                createdAt: "2026-07-01T05:00:30.000Z",
              },
            ],
            tenant: { slug: "bluepass", name: "BluePass" },
          },
        ],
      }),
    );

    const result = await listKaiCoreBluePassInquiries(
      { tenantSlug: "bluepass", take: 20 },
      {
        KAI_CORE_ENABLED: "true",
        KAI_CORE_BASE_URL: "https://kai-core.example.com",
        KAI_CORE_WIDGET_KEY: "pk_live_bluepass",
        KAI_CORE_ORIGIN: "https://bluepass.co",
        KAI_CORE_ADMIN_TOKEN: "admin_secret",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://kai-core.example.com/api/admin/bluepass/bluepass-inquiries?take=20",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          authorization: "Bearer admin_secret",
          origin: "https://bluepass.co",
        }),
      }),
    );
    expect(result).toEqual([
      expect.objectContaining({
        id: "inq_1",
        source: "kai-core",
        selectedYachtName: "Calico Jack",
        latestDispatchStatus: "SENT",
        events: [
          expect.objectContaining({
            type: "OPERATOR_RESPONSE_ACCEPTED",
            payload: { providerMessageId: "wamid_1" },
          }),
        ],
      }),
    ]);
  });
});

describe("Kai Core BluePass quotes", () => {
  it("fetches a verified quote from Kai Core", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      Response.json({
        quote: {
          id: "inq_1",
          inquiryId: "inq_1",
          status: "READY_FOR_TRAVELLER",
          selectedYachtName: "Calico Jack",
          operatorName: "Calico Jack",
          destination: "Komodo",
          dateWindow: "6 July",
          guests: 2,
          currency: "USD",
          grossPriceCents: 390000,
          conservationContributionCents: 19500,
          inclusions: "full board meals",
          exclusions: "flights",
          terms: "30% deposit",
          source: "operator_counter",
          quoteUrl: "https://bluepass.co/quotes/inq_1",
          createdAt: "2026-07-02T00:00:00.000Z",
          updatedAt: "2026-07-02T00:00:00.000Z",
        },
      }),
    );

    const quote = await getKaiCoreBluePassQuote(
      { quoteId: "inq_1" },
      {
        KAI_CORE_BASE_URL: "https://kai-core.example.com",
        KAI_CORE_ORIGIN: "https://bluepass.co",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://kai-core.example.com/api/bluepass/quotes/inq_1",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          origin: "https://bluepass.co",
        }),
      }),
    );
    expect(quote).toMatchObject({
      id: "inq_1",
      status: "READY_FOR_TRAVELLER",
      grossPriceCents: 390000,
    });
  });

  it("approves a verified quote through Kai Core", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      Response.json({
        quote: {
          id: "inq_1",
          inquiryId: "inq_1",
          status: "TRAVELLER_APPROVED",
          selectedYachtName: "Calico Jack",
          operatorName: "Calico Jack",
          destination: "Komodo",
          dateWindow: "6 July",
          guests: 2,
          currency: "USD",
          grossPriceCents: 390000,
          conservationContributionCents: 19500,
          inclusions: "full board meals",
          exclusions: "flights",
          terms: "30% deposit",
          source: "operator_counter",
          quoteUrl: "https://bluepass.co/quotes/inq_1",
          createdAt: "2026-07-02T00:00:00.000Z",
          updatedAt: "2026-07-02T00:01:00.000Z",
        },
      }),
    );

    const quote = await approveKaiCoreBluePassQuote(
      { quoteId: "inq_1" },
      {
        KAI_CORE_BASE_URL: "https://kai-core.example.com",
        KAI_CORE_ORIGIN: "https://bluepass.co",
      },
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://kai-core.example.com/api/bluepass/quotes/inq_1",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ action: "approve" }),
      }),
    );
    expect(quote.status).toBe("TRAVELLER_APPROVED");
  });
});
