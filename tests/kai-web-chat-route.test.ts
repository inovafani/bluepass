import type { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
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

vi.mock("@/lib/services/kai/prisma-conversation-store", () => ({
  prismaKaiConversationStore: storeMocks,
}));
vi.mock("@/lib/services/kai/llm-provider", () => ({
  generateKaiReply: llmMocks.generateKaiReply,
}));

afterEach(() => {
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
    expect(body.reply).toContain("Where in Indonesia");
    expect(body.intent.missingSlots).toContain("destination");
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
          missingSlots: ["certificationLevel", "budget"],
        }),
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "diving",
          dateWindow: "October",
          guests: 2,
          missingSlots: expect.arrayContaining(["certificationLevel", "budget"]),
        }),
      }),
    );
  });

  it("uses stored lastAskedSlot to resolve a short guests answer", async () => {
    storeMocks.getSessionContext.mockResolvedValue({
      intent: {
        destination: "Nusa Penida",
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
          destination: "Nusa Penida",
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
