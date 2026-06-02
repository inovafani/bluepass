import { randomUUID } from "crypto";
import { prismaKaiConversationStore } from "@/lib/services/kai/prisma-conversation-store";
import type {
  KaiChannel,
  KaiConversationInput,
  KaiConversationMessage,
  KaiConversationResult,
  KaiSessionStatus,
} from "@/lib/services/kai/types";

export const DEFAULT_KAI_REPLY =
  "Thanks - I can help you find the right marine trip. Where are you hoping to go, and what kind of experience are you looking for?";

type PersistSessionInput = {
  id: string;
  channel: KaiChannel;
  externalUserId?: string;
  travellerPhone?: string;
  status: KaiSessionStatus;
};

export type KaiConversationStore = {
  upsertSession(session: PersistSessionInput): Promise<void>;
  addMessage(message: KaiConversationMessage): Promise<void>;
  listMessages?(input: {
    sessionId: string;
    channel: KaiChannel;
    limit?: number;
  }): Promise<KaiConversationMessage[]>;
};

const noopStore: KaiConversationStore = {
  async upsertSession() {},
  async addMessage() {},
};

export type KaiConversationService = {
  handleUserMessage(input: KaiConversationInput): Promise<KaiConversationResult>;
};

export function createKaiConversationService(
  store: KaiConversationStore = noopStore,
): KaiConversationService {
  return {
    async handleUserMessage(input) {
      const sessionId = input.sessionId ?? generateKaiSessionId();
      const userMessage = buildMessage({
        sessionId,
        channel: input.channel,
        role: "user",
        content: input.message,
        metadata: input.bookingContext ? { bookingContext: input.bookingContext } : undefined,
      });
      const assistantMessage = buildMessage({
        sessionId,
        channel: input.channel,
        role: "assistant",
        content: DEFAULT_KAI_REPLY,
      });

      await store.upsertSession({
        id: sessionId,
        channel: input.channel,
        externalUserId: input.externalUserId,
        travellerPhone: input.travellerPhone,
        status: "open",
      });
      await store.addMessage(userMessage);
      await store.addMessage(assistantMessage);

      return {
        sessionId,
        reply: assistantMessage.content,
        messages: [userMessage, assistantMessage],
      };
    },
  };
}

export const kaiConversationService = createKaiConversationService(prismaKaiConversationStore);

export function generateKaiSessionId() {
  return `kai_${randomUUID()}`;
}

function buildMessage(
  message: Omit<KaiConversationMessage, "id" | "createdAt">,
): KaiConversationMessage {
  return {
    id: `kaimsg_${randomUUID()}`,
    createdAt: new Date(),
    ...message,
  };
}
