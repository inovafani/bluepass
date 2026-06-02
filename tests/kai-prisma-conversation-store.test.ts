import { afterEach, describe, expect, it, vi } from "vitest";
import { prismaKaiConversationStore } from "@/lib/services/kai/prisma-conversation-store";

const prismaMocks = vi.hoisted(() => ({
  kaiSession: {
    upsert: vi.fn(),
    findFirst: vi.fn(),
  },
  kaiMessage: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  $transaction: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.kaiSession.upsert.mockReset();
  prismaMocks.kaiSession.findFirst.mockReset();
  prismaMocks.kaiMessage.create.mockReset();
  prismaMocks.kaiMessage.findMany.mockReset();
  prismaMocks.$transaction.mockReset();
  prismaMocks.$transaction.mockImplementation(async (callback) => callback(prismaMocks));
});

describe("prismaKaiConversationStore", () => {
  it("sanitizes session context before Prisma JSON persistence", async () => {
    await prismaKaiConversationStore.upsertSession({
      id: "kai_sanitize_session",
      channel: "web",
      status: "open",
      context: {
        intent: {
          destination: "Komodo",
          tripType: undefined,
          missingSlots: ["tripType", undefined as never],
        },
        lastAskedSlot: undefined,
      },
    });

    expect(prismaMocks.kaiSession.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          slots: {
            intent: {
              destination: "Komodo",
              missingSlots: ["tripType"],
            },
          },
        }),
        update: expect.objectContaining({
          slots: {
            intent: {
              destination: "Komodo",
              missingSlots: ["tripType"],
            },
          },
        }),
      }),
    );
  });

  it("sanitizes message metadata before Prisma JSON persistence", async () => {
    await prismaKaiConversationStore.addMessage({
      id: "kaimsg_sanitize",
      sessionId: "kai_sanitize_session",
      channel: "web",
      role: "assistant",
      content: "Safe reply",
      metadata: {
        keep: "yes",
        drop: undefined,
        nested: {
          at: new Date("2026-06-02T01:00:00.000Z"),
          fn: () => "no",
        },
      },
    });

    expect(prismaMocks.kaiMessage.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          metadata: {
            keep: "yes",
            nested: {
              at: "2026-06-02T01:00:00.000Z",
            },
          },
        }),
      }),
    );
  });

  it("upserts session before creating both messages in a transaction", async () => {
    await prismaKaiConversationStore.persistTurn?.({
      session: {
        id: "kai_turn_session",
        channel: "web",
        status: "open",
        context: {
          intent: {
            destination: "Komodo",
          },
          lastAskedSlot: "tripType",
        },
      },
      messages: [
        {
          id: "kaimsg_user",
          sessionId: "kai_turn_session",
          channel: "web",
          role: "user",
          content: "Komodo",
          metadata: { intent: { destination: "Komodo" } },
        },
        {
          id: "kaimsg_assistant",
          sessionId: "kai_turn_session",
          channel: "web",
          role: "assistant",
          content: "What kind of ocean experience are you looking for?",
          metadata: { intent: { destination: "Komodo" } },
        },
      ],
    });

    expect(prismaMocks.$transaction).toHaveBeenCalledTimes(1);
    expect(prismaMocks.kaiSession.upsert.mock.invocationCallOrder[0]).toBeLessThan(
      prismaMocks.kaiMessage.create.mock.invocationCallOrder[0],
    );
    expect(prismaMocks.kaiMessage.create).toHaveBeenCalledTimes(2);
    expect(prismaMocks.kaiMessage.create).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        data: expect.objectContaining({
          sessionId: "kai_turn_session",
          role: "USER",
          content: "Komodo",
        }),
      }),
    );
    expect(prismaMocks.kaiMessage.create).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        data: expect.objectContaining({
          sessionId: "kai_turn_session",
          role: "ASSISTANT",
          content: "What kind of ocean experience are you looking for?",
        }),
      }),
    );
  });
});
