import type { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/kai/web-chat/history/route";
import { POST } from "@/app/api/kai/web-chat/route";
import { buildDeterministicReply, DEFAULT_KAI_REPLY } from "@/lib/services/kai/conversation-service";

const storeMocks = vi.hoisted(() => ({
  upsertSession: vi.fn(),
  addMessage: vi.fn(),
  getSessionContext: vi.fn(),
  listMessages: vi.fn(),
}));
const llmMocks = vi.hoisted(() => ({
  generateKaiReply: vi.fn(async (input: { deterministicReply: string }) => input.deterministicReply),
}));
// buildBluePassCatalogSnapshot() (called when Kai Core is enabled) merges in LIVE
// OperatorListing rows - keep that a no-op DB call here rather than an unmocked real connection.
const prismaMocks = vi.hoisted(() => ({
  operatorListing: {
    findMany: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("@/lib/services/kai/prisma-conversation-store", () => ({
  prismaKaiConversationStore: storeMocks,
}));
vi.mock("@/lib/services/kai/llm-provider", () => ({
  generateKaiReply: llmMocks.generateKaiReply,
}));
vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

beforeEach(() => {
  vi.stubEnv("KAI_CORE_ENABLED", "false");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  storeMocks.upsertSession.mockReset();
  storeMocks.addMessage.mockReset();
  storeMocks.getSessionContext.mockReset();
  storeMocks.listMessages.mockReset();
  llmMocks.generateKaiReply.mockReset();
  llmMocks.generateKaiReply.mockImplementation(async (input: { deterministicReply: string }) => input.deterministicReply);
});

function buildPostRequest(body: unknown): NextRequest {
  return new Request("http://localhost:3000/api/kai/web-chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }) as NextRequest;
}

function buildHistoryRequest(sessionId?: string): NextRequest {
  const url = new URL("http://localhost:3000/api/kai/web-chat/history");

  if (sessionId !== undefined) {
    url.searchParams.set("sessionId", sessionId);
  }

  return new Request(url, { method: "GET" }) as NextRequest;
}

describe("POST /api/kai/web-chat", () => {
  it("rejects empty messages", async () => {
    const response = await POST(buildPostRequest({ message: "   " }));

    await expect(response.json()).resolves.toEqual({ error: "Message is required." });
    expect(response.status).toBe(400);
  });

  it("rejects non-string messages", async () => {
    const response = await POST(buildPostRequest({ message: 123 }));

    await expect(response.json()).resolves.toEqual({ error: "Message is required." });
    expect(response.status).toBe(400);
  });

  it("returns a sessionId when none is provided", async () => {
    const response = await POST(buildPostRequest({ message: "Find me a reef trip" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.sessionId).toEqual(expect.stringMatching(/^kai_/));
    expect(body.reply).toContain("Komodo or Raja Ampat");
    expect(body.intent.missingSlots).toContain("destination");
    expect(body.suggestedReplies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ label: "Tell me about Komodo" }),
        expect.objectContaining({ label: "Tell me about Raja Ampat" }),
      ]),
    );
  });

  it("routes web chat through Kai Core when the feature flag is enabled", async () => {
    vi.stubEnv("KAI_CORE_ENABLED", "true");
    vi.stubEnv("KAI_CORE_BASE_URL", "http://127.0.0.1:3107");
    vi.stubEnv("KAI_CORE_WIDGET_KEY", "pk_test_bluepass");
    vi.stubEnv("KAI_CORE_ORIGIN", "https://bluepass.co");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          conversation: { id: "core_conversation_1" },
        }),
      )
      .mockResolvedValueOnce(
        Response.json({
          assistantMessage: { content: "Kai Core reply" },
          bluepassMatches: [
            {
              slug: "alila-purnama",
              name: "Alila Purnama",
              region: "Komodo",
              reasons: ["matches Komodo"],
            },
          ],
        }),
      );
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(buildPostRequest({ message: "Komodo yacht for 8 guests" }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      sessionId: "core_conversation_1",
      reply: "Kai Core reply",
      matches: [
        {
          slug: "alila-purnama",
          matchingReasons: ["matches Komodo"],
        },
      ],
    });
    expect(storeMocks.upsertSession).not.toHaveBeenCalled();
  });

  it("handles first then second web chat POST with the same sessionId", async () => {
    const firstResponse = await POST(
      buildPostRequest({
        message: "Komodo sailing",
      }),
    );
    const firstBody = await firstResponse.json();

    storeMocks.getSessionContext.mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
        missingSlots: ["guests", "dateWindow", "budget"],
      },
      lastAskedSlot: "guests",
    });
    storeMocks.listMessages.mockResolvedValue([]);

    const secondResponse = await POST(
      buildPostRequest({
        sessionId: firstBody.sessionId,
        message: "2",
      }),
    );
    const secondBody = await secondResponse.json();

    expect(firstResponse.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    expect(secondBody.sessionId).toBe(firstBody.sessionId);
    expect(secondBody.reply).toContain("When are you hoping to travel");
    expect(secondBody.intent.guests).toBe(2);
  });

  it("handles first then second POST when LLM returns Groq-like success", async () => {
    llmMocks.generateKaiReply
      .mockResolvedValueOnce("Groq first reply")
      .mockResolvedValueOnce("Groq second reply");

    const firstResponse = await POST(buildPostRequest({ message: "Komodo sailing" }));
    const firstBody = await firstResponse.json();

    storeMocks.getSessionContext.mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
        missingSlots: ["guests", "dateWindow", "budget"],
      },
      lastAskedSlot: "guests",
    });
    storeMocks.listMessages.mockResolvedValue([]);

    const secondResponse = await POST(
      buildPostRequest({
        sessionId: firstBody.sessionId,
        message: "2",
      }),
    );

    await expect(secondResponse.json()).resolves.toEqual(
      expect.objectContaining({
        sessionId: firstBody.sessionId,
        reply: "Groq second reply",
        intent: expect.objectContaining({
          guests: 2,
        }),
      }),
    );
    expect(secondResponse.status).toBe(200);
  });

  it("reuses a provided sessionId", async () => {
    const response = await POST(
      buildPostRequest({
        sessionId: "kai_existing_session",
        message: "I want a Komodo sailing trip",
      }),
    );

    const body = await response.json();

    expect(body).toEqual(
      expect.objectContaining({
        sessionId: "kai_existing_session",
        reply: expect.stringContaining("How many people"),
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "sailing",
        }),
      }),
    );
    expect(response.status).toBe(200);
  });

  it("persists the web session, user message, and assistant reply", async () => {
    await POST(
      buildPostRequest({
        sessionId: "kai_persisted_session",
        message: "Find a Komodo diving trip with mantas",
      }),
    );

    expect(storeMocks.upsertSession).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "kai_persisted_session",
        channel: "web",
        status: "open",
        context: expect.objectContaining({
          intent: expect.objectContaining({
            tripType: "diving",
            interests: expect.arrayContaining(["mantas"]),
          }),
          lastAskedSlot: "guests",
        }),
      }),
    );
    expect(storeMocks.addMessage).toHaveBeenCalledTimes(2);
    expect(storeMocks.addMessage).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        sessionId: "kai_persisted_session",
        channel: "web",
        role: "user",
        content: "Find a Komodo diving trip with mantas",
      }),
    );
    expect(storeMocks.addMessage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        sessionId: "kai_persisted_session",
        channel: "web",
        role: "assistant",
        content: expect.stringContaining("How many people"),
      }),
    );
  });

  it("appends messages to the same provided sessionId", async () => {
    await POST(buildPostRequest({ sessionId: "kai_repeat_session", message: "First" }));
    await POST(buildPostRequest({ sessionId: "kai_repeat_session", message: "Second" }));

    expect(storeMocks.upsertSession).toHaveBeenCalledTimes(2);
    expect(storeMocks.addMessage).toHaveBeenCalledTimes(4);
    expect(storeMocks.addMessage).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ sessionId: "kai_repeat_session", content: "First" }),
    );
    expect(storeMocks.addMessage).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ sessionId: "kai_repeat_session", content: "Second" }),
    );
  });

  it("returns structured intent in the response", async () => {
    const response = await POST(
      buildPostRequest({
        sessionId: "kai_intent_session",
        message: "I want to dive in Komodo in October for 2 people",
      }),
    );

    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        sessionId: "kai_intent_session",
        reply: buildDeterministicReply({
          destination: "Komodo",
          tripType: "diving",
          dateWindow: "October",
          guests: 2,
          missingSlots: ["budget"],
        }),
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "diving",
          dateWindow: "October",
          guests: 2,
          missingSlots: expect.arrayContaining(["budget"]),
        }),
      }),
    );
  });

  it("does not include static yacht catalog matches until required slots are complete", async () => {
    const response = await POST(
      buildPostRequest({
        sessionId: "kai_catalog_matches_session",
        message: "Raja Ampat liveaboard for 3 guests",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        sessionId: "kai_catalog_matches_session",
        intent: expect.objectContaining({
          destination: "Raja Ampat",
          tripType: "liveaboard",
          guests: 3,
        }),
        matches: [],
      }),
    );
  });

  it("includes static yacht catalog matches when the inquiry is ready to match", async () => {
    const response = await POST(
      buildPostRequest({
        sessionId: "kai_catalog_ready_matches_session",
        message:
          "Raja Ampat liveaboard for 3 guests around October with $4000 budget, beginner. My name is Ari, ari@example.com, +628123456789",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        sessionId: "kai_catalog_ready_matches_session",
        intent: expect.objectContaining({
          destination: "Raja Ampat",
          tripType: "liveaboard",
          guests: 3,
          dateWindow: "October",
          budget: "$4000",
          certificationLevel: "beginner",
          travellerName: "Ari",
          travellerEmail: "ari@example.com",
          travellerPhone: "+628123456789",
        }),
        matches: expect.arrayContaining([
          expect.objectContaining({
            slug: expect.any(String),
            name: expect.any(String),
            region: "Raja Ampat",
            tier: expect.any(String),
            cabinBookable: expect.any(Boolean),
            matchingReasons: expect.arrayContaining(["Raja Ampat route", "fits 3 guests"]),
          }),
        ]),
      }),
    );
  });

  it("uses stored lastAskedSlot to resolve a short guests answer", async () => {
    storeMocks.getSessionContext.mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
        missingSlots: ["guests", "dateWindow", "budget"],
      },
      lastAskedSlot: "guests",
      missingSlots: ["guests", "dateWindow", "budget"],
    });

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_short_answer_session",
        message: "2",
      }),
    );

    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        sessionId: "kai_short_answer_session",
        reply: expect.stringContaining("When are you hoping to travel"),
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "sailing",
          guests: 2,
        }),
      }),
    );
    expect(storeMocks.upsertSession).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({
          lastAskedSlot: "dateWindow",
        }),
      }),
    );
  });

  it("uses browser-visible recent messages to avoid asking known slots again", async () => {
    storeMocks.getSessionContext.mockResolvedValue(undefined);
    storeMocks.listMessages.mockResolvedValue([]);

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_recent_visible_route",
        message: "yup maybe diving and i have 3 guests",
        recentMessages: [
          {
            role: "assistant",
            content:
              "Got it: sailing. Where feels best for this liveaboard - Komodo or Raja Ampat?",
          },
          {
            role: "user",
            content: "Raja ampat maybe?",
          },
          {
            role: "assistant",
            content:
              "Raja Ampat is a great choice. Are you thinking of a diving, snorkelling, or liveaboard trip, or perhaps something else? How many guests will be travelling?",
          },
        ],
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "diving",
        guests: 3,
      }),
    );
    expect(body.reply).toContain("When are you hoping to travel");
    expect(body.reply).not.toMatch(/where in indonesia|what kind|how many/i);
  });

  it("does not crash when existing session context is null", async () => {
    storeMocks.getSessionContext.mockResolvedValue(null);
    storeMocks.listMessages.mockResolvedValue([]);

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_null_context_session",
        message: "Komodo sailing",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        sessionId: "kai_null_context_session",
        reply: expect.stringContaining("How many people"),
      }),
    );
  });

  it("does not crash when existing session context has an old unexpected shape", async () => {
    storeMocks.getSessionContext.mockResolvedValue({
      slots: {
        destination: "Komodo",
      },
    });
    storeMocks.listMessages.mockResolvedValue([]);

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_old_context_session",
        message: "Komodo sailing",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        sessionId: "kai_old_context_session",
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "sailing",
        }),
      }),
    );
  });

  it("does not crash when history load returns an empty array for an existing session", async () => {
    storeMocks.getSessionContext.mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
      },
      lastAskedSlot: "guests",
    });
    storeMocks.listMessages.mockResolvedValue([]);

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_empty_history_session",
        message: "2",
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        sessionId: "kai_empty_history_session",
        intent: expect.objectContaining({
          guests: 2,
        }),
      }),
    );
  });

  it("continues when existing session context lookup fails before LLM", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    storeMocks.getSessionContext.mockRejectedValue(
      Object.assign(new Error("Database read failed"), { code: "P2028" }),
    );
    storeMocks.listMessages.mockResolvedValue([]);

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_lookup_failure_session",
        message: "Komodo sailing",
      }),
    );

    expect(response.status).toBe(200);
    expect(warnSpy).toHaveBeenCalledWith("kai.session.context_parse_failed", {
      sessionId: "kai_look...sion",
      channel: "web",
      errorName: "Error",
      message: "Database read failed",
      prismaCode: "P2028",
    });

    warnSpy.mockRestore();
  });

  it("continues when history load fails before LLM", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    storeMocks.getSessionContext.mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
      },
    });
    storeMocks.listMessages.mockRejectedValue(new Error("History read failed"));

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_history_failure_session",
        message: "2 people",
      }),
    );

    expect(response.status).toBe(200);
    expect(warnSpy).toHaveBeenCalledWith("kai.history.load_failed", {
      sessionId: "kai_hist...sion",
      channel: "web",
      errorName: "Error",
      message: "History read failed",
      prismaCode: undefined,
    });

    warnSpy.mockRestore();
  });

  it("returns 200 with fallback when LLM output is invalid", async () => {
    llmMocks.generateKaiReply.mockResolvedValue("");

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_invalid_llm_session",
        message: "I want a Komodo sailing trip",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        sessionId: "kai_invalid_llm_session",
        reply: expect.stringContaining("How many people"),
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "sailing",
        }),
      }),
    );
    expect(storeMocks.addMessage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        role: "assistant",
        content: expect.stringContaining("How many people"),
      }),
    );
  });

  it("does not persist undefined assistant content when LLM returns nullish output", async () => {
    llmMocks.generateKaiReply.mockResolvedValue(undefined as unknown as string);

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_null_llm_session",
        message: "I want a Komodo sailing trip",
      }),
    );

    expect(response.status).toBe(200);
    expect(storeMocks.addMessage).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        role: "assistant",
        content: expect.stringContaining("How many people"),
      }),
    );
  });

  it("returns 200 and logs the failed stage when persistence fails after LLM success", async () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    llmMocks.generateKaiReply.mockResolvedValue("LLM reply after Groq success.");
    storeMocks.addMessage.mockRejectedValue(new Error("Prisma JSON field rejected undefined"));

    const response = await POST(
      buildPostRequest({
        sessionId: "kai_persist_failure_session",
        message: "I want a Komodo sailing trip",
      }),
    );

    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        sessionId: "kai_persist_failure_session",
        reply: "LLM reply after Groq success.",
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "sailing",
        }),
      }),
    );
    expect(response.status).toBe(200);
    expect(warnSpy).toHaveBeenCalledWith("kai.persistence.failed", {
      stage: "kai.turn.persisted",
      sessionId: "kai_pers...sion",
      channel: "web",
      operation: "persistTurn",
      errorName: "Error",
      message: "Prisma JSON field rejected undefined",
      prismaCode: undefined,
    });
    expect(JSON.stringify(warnSpy.mock.calls)).not.toContain("GROQ_API_KEY");

    warnSpy.mockRestore();
  });

  it("ignores invalid localStorage sessionIds and returns a fresh sessionId", async () => {
    const response = await POST(
      buildPostRequest({
        sessionId: "not-a-safe-session-id",
        message: "I want a Komodo sailing trip",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.sessionId).toEqual(expect.stringMatching(/^kai_/));
    expect(body.sessionId).not.toBe("not-a-safe-session-id");
    expect(storeMocks.getSessionContext).not.toHaveBeenCalled();
  });
});

describe("GET /api/kai/web-chat/history", () => {
  it("rejects missing sessionId", async () => {
    const response = await GET(buildHistoryRequest());

    await expect(response.json()).resolves.toEqual({ error: "Valid sessionId is required." });
    expect(response.status).toBe(400);
  });

  it("returns messages for a valid web session", async () => {
    storeMocks.listMessages.mockResolvedValue([
      {
        sessionId: "kai_history_session",
        channel: "web",
        role: "user",
        content: "Komodo please",
        createdAt: new Date("2026-06-02T01:00:00.000Z"),
      },
      {
        sessionId: "kai_history_session",
        channel: "web",
        role: "assistant",
        content: DEFAULT_KAI_REPLY,
        createdAt: new Date("2026-06-02T01:00:01.000Z"),
      },
    ]);

    const response = await GET(buildHistoryRequest("kai_history_session"));

    await expect(response.json()).resolves.toEqual({
      sessionId: "kai_history_session",
      messages: [
        {
          role: "user",
          content: "Komodo please",
          createdAt: "2026-06-02T01:00:00.000Z",
        },
        {
          role: "assistant",
          content: DEFAULT_KAI_REPLY,
          createdAt: "2026-06-02T01:00:01.000Z",
        },
      ],
    });
    expect(response.status).toBe(200);
    expect(storeMocks.listMessages).toHaveBeenCalledWith({
      sessionId: "kai_history_session",
      channel: "web",
    });
  });

  it("returns messages after multiple turns", async () => {
    storeMocks.listMessages.mockResolvedValue([
      {
        sessionId: "kai_multi_history",
        channel: "web",
        role: "user",
        content: "Komodo liveaboard",
        createdAt: new Date("2026-06-02T01:00:00.000Z"),
      },
      {
        sessionId: "kai_multi_history",
        channel: "web",
        role: "assistant",
        content: "How many people should Kai plan for?",
        createdAt: new Date("2026-06-02T01:00:01.000Z"),
      },
      {
        sessionId: "kai_multi_history",
        channel: "web",
        role: "user",
        content: "2",
        createdAt: new Date("2026-06-02T01:00:02.000Z"),
      },
      {
        sessionId: "kai_multi_history",
        channel: "web",
        role: "assistant",
        content: "When are you hoping to travel?",
        createdAt: new Date("2026-06-02T01:00:03.000Z"),
      },
    ]);

    const response = await GET(buildHistoryRequest("kai_multi_history"));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.messages).toHaveLength(4);
    expect(body.messages.map((message: { role: string }) => message.role)).toEqual([
      "user",
      "assistant",
      "user",
      "assistant",
    ]);
  });

  it("does not return messages for non-web channels", async () => {
    storeMocks.listMessages.mockResolvedValue([]);

    const response = await GET(buildHistoryRequest("kai_whatsapp_only_session"));

    await expect(response.json()).resolves.toEqual({
      sessionId: "kai_whatsapp_only_session",
      messages: [],
    });
    expect(storeMocks.listMessages).toHaveBeenCalledWith({
      sessionId: "kai_whatsapp_only_session",
      channel: "web",
    });
  });
});
