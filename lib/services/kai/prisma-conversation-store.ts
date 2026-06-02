import type { Prisma } from "@prisma/client";
import type { KaiConversationStore } from "@/lib/services/kai/conversation-service";
import type { KaiChannel, KaiMessageRole, KaiSessionStatus } from "@/lib/services/kai/types";
import { prisma } from "@/lib/db/prisma";

const channelToPrisma = {
  web: "WEB",
  whatsapp: "WHATSAPP",
} as const;

const roleToPrisma = {
  user: "USER",
  assistant: "ASSISTANT",
  system: "SYSTEM",
} as const;

const statusToPrisma = {
  open: "OPEN",
  handoff: "HANDOFF",
  closed: "CLOSED",
} as const;

const channelFromPrisma = {
  WEB: "web",
  WHATSAPP: "whatsapp",
} as const;

const roleFromPrisma = {
  USER: "user",
  ASSISTANT: "assistant",
  SYSTEM: "system",
} as const;

export const prismaKaiConversationStore: KaiConversationStore = {
  async upsertSession(session) {
    await prisma.kaiSession.upsert({
      where: { id: session.id },
      create: {
        id: session.id,
        channel: toPrismaChannel(session.channel),
        externalUserId: session.externalUserId,
        travellerPhone: session.travellerPhone,
        status: toPrismaStatus(session.status),
        // TODO: Upgrade anonymous sessions with optional email/WhatsApp capture,
        // Traveller profiles, magic-link login, and cross-device session merge.
      },
      update: {
        channel: toPrismaChannel(session.channel),
        externalUserId: session.externalUserId,
        travellerPhone: session.travellerPhone,
        status: toPrismaStatus(session.status),
      },
    });
  },

  async addMessage(message) {
    await prisma.kaiMessage.create({
      data: {
        id: message.id,
        sessionId: message.sessionId,
        channel: toPrismaChannel(message.channel),
        role: toPrismaRole(message.role),
        content: message.content,
        metadata: message.metadata as Prisma.InputJsonValue | undefined,
        createdAt: message.createdAt,
      },
    });
  },

  async listMessages(input) {
    const messages = await prisma.kaiMessage.findMany({
      where: {
        sessionId: input.sessionId,
        channel: toPrismaChannel(input.channel),
      },
      orderBy: { createdAt: "asc" },
      take: input.limit ?? 50,
      select: {
        id: true,
        sessionId: true,
        channel: true,
        role: true,
        content: true,
        metadata: true,
        createdAt: true,
      },
    });

    return messages.map((message) => ({
      id: message.id,
      sessionId: message.sessionId,
      channel: channelFromPrisma[message.channel],
      role: roleFromPrisma[message.role],
      content: message.content,
      metadata:
        message.metadata && typeof message.metadata === "object" && !Array.isArray(message.metadata)
          ? message.metadata
          : undefined,
      createdAt: message.createdAt,
    }));
  },
};

function toPrismaChannel(channel: KaiChannel) {
  return channelToPrisma[channel];
}

function toPrismaRole(role: KaiMessageRole) {
  return roleToPrisma[role];
}

function toPrismaStatus(status: KaiSessionStatus) {
  return statusToPrisma[status];
}
