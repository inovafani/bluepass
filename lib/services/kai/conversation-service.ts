import { randomUUID } from "crypto";
import { planKaiConversation } from "@/lib/services/kai/conversation-planner";
import { sanitizeObjectForResponse } from "@/lib/services/kai/json-safety";
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

type PersistTurnInput = {
  session: PersistSessionInput;
  messages: KaiConversationMessage[];
};

export type KaiConversationStore = {
  upsertSession(session: PersistSessionInput): Promise<void>;
  addMessage(message: KaiConversationMessage): Promise<void>;
  persistTurn?(input: PersistTurnInput): Promise<void>;
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
      logKaiStage("kai.web_chat.request_received", {
        sessionId,
        channel: input.channel,
      });
      logKaiStage("kai.session.resolve_started", {
        sessionId,
        channel: input.channel,
        hasProvidedSessionId: Boolean(input.sessionId),
      });
      const previousContext = await loadSessionContextSafely(store, {
        sessionId,
        channel: input.channel,
        hasProvidedSessionId: Boolean(input.sessionId),
      });
      const contextKeys = previousContext ? Object.keys(previousContext) : [];
      logKaiStage("kai.session.loaded_or_created", {
        sessionId,
        channel: input.channel,
        hasExistingContext: Boolean(previousContext),
        contextKeys,
      });
      logKaiStage("kai.intent.extraction_started", {
        sessionId,
        channel: input.channel,
      });
      const intent = extractKaiTravelIntent(input.message, previousContext?.intent, {
        lastAskedSlot: previousContext?.lastAskedSlot,
      });
      const planner = planKaiConversation({
        intent,
        previousIntent: previousContext?.intent,
        lastAskedSlot: previousContext?.lastAskedSlot,
        latestUserMessage: input.message,
        channel: input.channel,
      });
      logKaiStage("kai.intent.extraction_succeeded", {
        sessionId,
        channel: input.channel,
        intentKeys: Object.keys(intent),
        missingSlots: planner.missingSlots,
      });
      logKaiStage("kai.intent.extracted", {
        sessionId,
        channel: input.channel,
        intentKeys: Object.keys(intent),
        missingSlots: planner.missingSlots,
      });
      const deterministicReply = buildDeterministicReply(intent, planner);
      const context = buildSessionContext(intent, planner);
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
      const previousMessages = await loadHistorySafely(store, {
        sessionId,
        channel: input.channel,
        hasProvidedSessionId: Boolean(input.sessionId),
      });
      logKaiStage("kai.llm.call_started", {
        sessionId,
        channel: input.channel,
        previousMessageCount: previousMessages.length,
      });
      const reply = await generateReplySafely({
        messages: [...previousMessages, userMessage],
        intent,
        missingSlots: planner.missingSlots,
        channel: input.channel,
        deterministicReply,
        planner,
      });
      logKaiStage("kai.assistant_reply.generated", {
        sessionId,
        channel: input.channel,
        replyLength: reply.length,
      });
      const assistantMessage = buildMessage({
        sessionId,
        channel: input.channel,
        role: "assistant",
        content: reply,
        metadata: { intent, lastAskedSlot: context.lastAskedSlot },
      });

      const sessionToPersist = {
          id: sessionId,
          channel: input.channel,
          externalUserId: input.externalUserId,
          travellerPhone: input.travellerPhone,
          status: "open",
          context,
        } satisfies PersistSessionInput;

      try {
        if (store.persistTurn) {
          await store.persistTurn({
            session: sessionToPersist,
            messages: [userMessage, assistantMessage],
          });
        } else {
          await store.upsertSession(sessionToPersist);
          await store.addMessage(userMessage);
          await store.addMessage(assistantMessage);
        }
        logKaiStage("kai.session.context.persisted", {
          sessionId,
          channel: input.channel,
        });
        logKaiStage("kai.messages.persisted", {
          sessionId,
          channel: input.channel,
          messageCount: 2,
        });
      } catch (error) {
        logPersistenceFailure("kai.turn.persisted", sessionId, input.channel, "persistTurn", error);
      }

      logKaiStage("kai.web_chat.response_ready", {
        sessionId,
        channel: input.channel,
        replyLength: assistantMessage.content.length,
      });

      return {
        sessionId,
        reply: assistantMessage.content,
        intent: sanitizeObjectForResponse(intent),
        planner: shouldExposePlanner() ? sanitizeObjectForResponse(planner) : undefined,
        messages: [userMessage, assistantMessage],
      };
    },
  };
}

export const kaiConversationService = createKaiConversationService(prismaKaiConversationStore);

export function generateKaiSessionId() {
  return `kai_${randomUUID()}`;
}

export function buildDeterministicReply(
  intent: KaiTravelIntent,
  planner = planKaiConversation({
    intent,
    latestUserMessage: "",
    channel: "web",
  }),
) {
  if (intent.unsupportedDestination) {
    return "BluePass is currently focused on Indonesia. I can help with places like Komodo, Raja Ampat, Bali, Nusa Penida, Alor, Wakatobi, and other Indonesian marine destinations. Are you open to an Indonesia-based trip?";
  }

  if (planner.missingSlots.includes("destination")) {
    return "BluePass is focused on Indonesian marine trips. Where in Indonesia are you hoping to go - Komodo, Raja Ampat, Bali, Nusa Penida, Alor, Wakatobi, or somewhere else?";
  }

  if (planner.missingSlots.includes("tripType")) {
    return `Great, ${intent.destination} is a strong Indonesia option. What kind of ocean experience are you looking for - diving, liveaboard, sailing, snorkelling, surf, or something conservation-led?`;
  }

  if (planner.missingSlots.includes("guests")) {
    return `Nice - ${intent.destination} for ${intent.tripType}. How many people should Kai plan for?`;
  }

  if (
    planner.missingSlots.includes("dateWindow") &&
    planner.missingSlots.includes("certificationLevel")
  ) {
    return `Got it: ${intent.destination}, ${intent.tripType}, for ${intent.guests} guests. When are you hoping to travel, and what certification level are the divers?`;
  }

  if (planner.missingSlots.includes("dateWindow")) {
    return `Got it: ${intent.destination}, ${intent.tripType}, for ${intent.guests} people. When are you hoping to travel?`;
  }

  if (planner.missingSlots.includes("certificationLevel")) {
    return "For diving or liveaboard trips, what certification level should Kai plan around - beginner, open water, advanced open water, rescue, divemaster, or instructor?";
  }

  return `Thanks - Kai can start matching suitable Indonesia trips for ${intent.destination} based on your ${intent.tripType} plans.`;
}

export function buildSessionContext(
  intent: KaiTravelIntent,
  planner = planKaiConversation({
    intent,
    latestUserMessage: "",
    channel: "web",
  }),
): KaiSessionContext {
  return {
    intent,
    missingSlots: planner.missingSlots,
    lastAskedSlot: planner.nextSlotToAsk as KaiMissingSlot | undefined,
  };
}

async function generateReplySafely(input: Parameters<typeof generateKaiReply>[0]) {
  try {
    const reply = await generateKaiReply(input);

    return normalizeAssistantReply(reply) ?? input.deterministicReply;
  } catch (error) {
    console.warn("Kai reply generation failed; using deterministic fallback.", {
      error: error instanceof Error ? error.message : "unknown error",
    });
    return input.deterministicReply;
  }
}

function normalizeAssistantReply(reply: unknown) {
  if (typeof reply !== "string") {
    return undefined;
  }

  const normalized = reply.trim();

  return normalized.length > 0 ? normalized : undefined;
}

async function loadSessionContextSafely(
  store: KaiConversationStore,
  input: { sessionId: string; channel: KaiChannel; hasProvidedSessionId: boolean },
) {
  if (!input.hasProvidedSessionId) {
    logKaiStage("kai.session.no_session_id_create_started", {
      sessionId: input.sessionId,
      channel: input.channel,
    });
    logKaiStage("kai.session.no_session_id_create_succeeded", {
      sessionId: input.sessionId,
      channel: input.channel,
    });

    return undefined;
  }

  logKaiStage("kai.session.provided_lookup_started", {
    sessionId: input.sessionId,
    channel: input.channel,
  });

  if (!store.getSessionContext) {
    logKaiStage("kai.session.provided_lookup_not_found", {
      sessionId: input.sessionId,
      channel: input.channel,
    });

    return undefined;
  }

  try {
    logKaiStage("kai.session.context_parse_started", {
      sessionId: input.sessionId,
      channel: input.channel,
    });
    const context = await store.getSessionContext({
      sessionId: input.sessionId,
      channel: input.channel,
    });

    if (!context) {
      logKaiStage("kai.session.provided_lookup_not_found", {
        sessionId: input.sessionId,
        channel: input.channel,
      });
      logKaiStage("kai.session.context_parse_succeeded", {
        sessionId: input.sessionId,
        channel: input.channel,
        contextKeys: [],
      });

      return undefined;
    }

    logKaiStage("kai.session.provided_lookup_succeeded", {
      sessionId: input.sessionId,
      channel: input.channel,
    });
    logKaiStage("kai.session.context_parse_succeeded", {
      sessionId: input.sessionId,
      channel: input.channel,
      contextKeys: Object.keys(context),
    });

    return context;
  } catch (error) {
    logReadFailure("kai.session.context_parse_failed", input.sessionId, input.channel, error);

    return undefined;
  }
}

async function loadHistorySafely(
  store: KaiConversationStore,
  input: { sessionId: string; channel: KaiChannel; hasProvidedSessionId: boolean },
) {
  if (!input.hasProvidedSessionId || !store.listMessages) {
    return [];
  }

  logKaiStage("kai.history.load_started", {
    sessionId: input.sessionId,
    channel: input.channel,
  });

  try {
    const messages = await store.listMessages({
      sessionId: input.sessionId,
      channel: input.channel,
      limit: 8,
    });
    const safeMessages = Array.isArray(messages)
      ? messages.filter((message) => isSafeConversationMessage(message, input.channel))
      : [];

    logKaiStage("kai.history.load_succeeded", {
      sessionId: input.sessionId,
      channel: input.channel,
      previousMessageCount: safeMessages.length,
    });

    return safeMessages;
  } catch (error) {
    logReadFailure("kai.history.load_failed", input.sessionId, input.channel, error);

    return [];
  }
}

function isSafeConversationMessage(
  message: unknown,
  channel: KaiChannel,
): message is KaiConversationMessage {
  return (
    message !== null &&
    typeof message === "object" &&
    "channel" in message &&
    "role" in message &&
    "content" in message &&
    message.channel === channel &&
    (message.role === "user" || message.role === "assistant" || message.role === "system") &&
    typeof message.content === "string"
  );
}

function logKaiStage(stage: string, data: Record<string, unknown>) {
  console.info(stage, {
    ...data,
    sessionId: maskSessionId(data.sessionId),
  });
}

function logPersistenceFailure(
  stage: string,
  sessionId: string,
  channel: KaiChannel,
  operation: string,
  error: unknown,
) {
  console.warn("kai.persistence.failed", {
    stage,
    sessionId: maskSessionId(sessionId),
    channel,
    operation,
    errorName: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : "Unknown persistence error",
    prismaCode: getPrismaErrorCode(error),
  });
}

function logReadFailure(stage: string, sessionId: string, channel: KaiChannel, error: unknown) {
  console.warn(stage, {
    sessionId: maskSessionId(sessionId),
    channel,
    errorName: error instanceof Error ? error.name : "UnknownError",
    message: error instanceof Error ? error.message : "Unknown read error",
    prismaCode: getPrismaErrorCode(error),
  });
}

function getPrismaErrorCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;

    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}

function maskSessionId(sessionId: unknown) {
  if (typeof sessionId !== "string") {
    return undefined;
  }

  return `${sessionId.slice(0, 8)}...${sessionId.slice(-4)}`;
}

function shouldExposePlanner() {
  return process.env.NODE_ENV !== "production" || process.env.KAI_DEBUG === "true";
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
