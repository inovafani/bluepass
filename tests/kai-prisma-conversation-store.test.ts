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
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.kaiSession.upsert.mockReset();
  prismaMocks.kaiSession.findFirst.mockReset();
  prismaMocks.kaiMessage.create.mockReset();
  prismaMocks.kaiMessage.findMany.mockReset();
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
});
