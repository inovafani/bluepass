import { randomUUID } from "crypto";
import { generateKaiReply } from "@/lib/services/kai/llm-provider";
import { prismaKaiConversationStore } from "@/lib/services/kai/prisma-conversation-store";
import { extractKaiTravelIntent } from "@/lib/services/kai/slot-extractor";
import type {
  KaiChannel,
  KaiConversationInput,
  KaiConversationMessage,
  KaiConversationResult,
  KaiMissingSlot,
  KaiSessionContext,
  KaiSessionStatus,
  KaiTravelIntent,
} from "@/lib/services/kai/types";

export const DEFAULT_KAI_REPLY =
  "Thanks - I can help you find the right marine trip. Where are you hoping to go, and what kind of experience are you looking for?";

type PersistSessionInput = {
  id: string;
  channel: KaiChannel;
  externalUserId?: string;
  travellerPhone?: string;
  status: KaiSessionStatus;
  context?: KaiSessionContext;
};

export type KaiConversationStore = {
  upsertSession(session: PersistSessionInput): Promise<void>;
  addMessage(message: KaiConversationMessage): Promise<void>;
  getSessionContext?(input: {
    sessionId: string;
    channel: KaiChannel;
  }): Promise<KaiSessionContext | undefined>;
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
      const previousContext = input.sessionId
        ? await store.getSessionContext?.({
            sessionId,
            channel: input.channel,
          })
        : undefined;
      const intent = extractKaiTravelIntent(input.message, previousContext?.intent, {
        lastAskedSlot: previousContext?.lastAskedSlot,
      });
      const deterministicReply = buildDeterministicReply(intent);
      const context = buildSessionContext(intent);
      const userMessage = buildMessage({
        sessionId,
        channel: input.channel,
        role: "user",
        content: input.message,
        metadata: {
          ...(input.bookingContext ? { bookingContext: input.bookingContext } : {}),
          intent,
          lastAskedSlot: previousContext?.lastAskedSlot,
        },
      });
      const storedMessages =
        input.sessionId && store.listMessages
          ? await store.listMessages({
              sessionId,
              channel: input.channel,
              limit: 8,
            })
          : [];
      const previousMessages = Array.isArray(storedMessages) ? storedMessages : [];
      const reply = await generateReplySafely({
        messages: [...previousMessages, userMessage],
        intent,
        missingSlots: context.missingSlots,
        channel: input.channel,
        deterministicReply,
      });
      const assistantMessage = buildMessage({
        sessionId,
        channel: input.channel,
        role: "assistant",
        content: reply,
        metadata: { intent, lastAskedSlot: context.lastAskedSlot },
      });

      await store.upsertSession({
        id: sessionId,
        channel: input.channel,
        externalUserId: input.externalUserId,
        travellerPhone: input.travellerPhone,
        status: "open",
        context,
      });
      await store.addMessage(userMessage);
      await store.addMessage(assistantMessage);

      return {
        sessionId,
        reply: assistantMessage.content,
        intent,
        messages: [userMessage, assistantMessage],
      };
    },
  };
}

export const kaiConversationService = createKaiConversationService(prismaKaiConversationStore);

export function generateKaiSessionId() {
  return `kai_${randomUUID()}`;
}

export function buildDeterministicReply(intent: KaiTravelIntent) {
  if (intent.unsupportedDestination) {
    return "BluePass is currently focused on Indonesia. I can help with places like Komodo, Raja Ampat, Bali, Nusa Penida, Alor, Wakatobi, and other Indonesian marine destinations. Are you open to an Indonesia-based trip?";
  }

  if (!intent.destination) {
    return "BluePass is focused on Indonesian marine trips. Where in Indonesia are you hoping to go - Komodo, Raja Ampat, Bali, Nusa Penida, Alor, Wakatobi, or somewhere else?";
  }

  if (!intent.tripType) {
    return `Great, ${intent.destination} is a strong Indonesia option. What kind of ocean experience are you looking for - diving, liveaboard, sailing, snorkelling, surf, or something conservation-led?`;
  }

  if (!intent.guests) {
    return `Nice - ${intent.destination} for ${intent.tripType}. How many people should Kai plan for?`;
  }

  if (!intent.dateWindow) {
    return `Got it: ${intent.destination}, ${intent.tripType}, for ${intent.guests} people. When are you hoping to travel?`;
  }

  if (requiresCertification(intent.tripType) && !intent.certificationLevel) {
    return "For diving or liveaboard trips, what certification level should Kai plan around - beginner, open water, advanced open water, rescue, divemaster, or instructor?";
  }

  return `Thanks - Kai can start matching suitable Indonesia trips for ${intent.destination} based on your ${intent.tripType} plans.`;
}

export function buildSessionContext(intent: KaiTravelIntent): KaiSessionContext {
  return {
    intent,
    missingSlots: intent.missingSlots,
    lastAskedSlot: getNextAskedSlot(intent),
  };
}

function getNextAskedSlot(intent: KaiTravelIntent): KaiMissingSlot | undefined {
  if (intent.unsupportedDestination) {
    return undefined;
  }

  if (!intent.destination) {
    return "destination";
  }

  if (!intent.tripType) {
    return "tripType";
  }

  if (!intent.guests) {
    return "guests";
  }

  if (!intent.dateWindow) {
    return "dateWindow";
  }

  if (requiresCertification(intent.tripType) && !intent.certificationLevel) {
    return "certificationLevel";
  }

  return undefined;
}

function requiresCertification(tripType?: string) {
  return tripType === "diving" || tripType === "liveaboard";
}

async function generateReplySafely(input: Parameters<typeof generateKaiReply>[0]) {
  try {
    return await generateKaiReply(input);
  } catch (error) {
    console.warn("Kai reply generation failed; using deterministic fallback.", {
      error: error instanceof Error ? error.message : "unknown error",
    });
    return input.deterministicReply;
  }
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
