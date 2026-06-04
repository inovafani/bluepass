import { randomUUID } from "crypto";
import { planKaiConversation } from "@/lib/services/kai/conversation-planner";
import { sanitizeObjectForResponse } from "@/lib/services/kai/json-safety";
import { generateKaiReply } from "@/lib/services/kai/llm-provider";
import { matchTripsForKai } from "@/lib/services/kai/match";
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
  MatchResult,
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
      const previousMessages = await loadHistorySafely(store, {
        sessionId,
        channel: input.channel,
        hasProvidedSessionId: Boolean(input.sessionId),
      });
      const recentClientMessages = normalizeRecentClientMessages(input.recentMessages, {
        sessionId,
        channel: input.channel,
        latestUserMessage: input.message,
      });
      const conversationMemory = mergeConversationMemory(previousMessages, recentClientMessages);
      const reconstructedIntent = reconstructIntentFromHistory(
        conversationMemory,
        previousContext?.intent,
      );
      const inferredLastAskedSlot =
        previousContext?.lastAskedSlot ?? inferLastAskedSlotFromHistory(conversationMemory);
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
      const intent = extractKaiTravelIntent(input.message, reconstructedIntent, {
        lastAskedSlot: inferredLastAskedSlot,
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
      const matches = await matchTripsSafely(intent, planner, sessionId, input.channel);
      const deterministicReply = buildDeterministicReply(intent, planner, input.message, matches);
      const context = buildSessionContext(intent, planner);
      const userMessage = buildMessage({
        sessionId,
        channel: input.channel,
        role: "user",
        content: input.message,
        metadata: {
          ...(input.bookingContext ? { bookingContext: input.bookingContext } : {}),
          intent,
          matches,
          lastAskedSlot: inferredLastAskedSlot,
        },
      });
      logKaiStage("kai.llm.call_started", {
        sessionId,
        channel: input.channel,
        previousMessageCount: previousMessages.length,
        recentClientMessageCount: recentClientMessages.length,
      });
      const reply = await generateReplySafely({
        messages: [...conversationMemory, userMessage],
        intent,
        missingSlots: planner.missingSlots,
        channel: input.channel,
        deterministicReply,
        planner,
        matches,
      });
      const safeReply = enforcePlannerReply(
        reply,
        deterministicReply,
        planner,
        input.message,
        matches,
      );
      logKaiStage("kai.assistant_reply.generated", {
        sessionId,
        channel: input.channel,
        replyLength: safeReply.length,
      });
      const assistantMessage = buildMessage({
        sessionId,
        channel: input.channel,
        role: "assistant",
        content: safeReply,
        metadata: { intent, matches, lastAskedSlot: context.lastAskedSlot },
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
        matches: sanitizeObjectForResponse(matches),
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
  latestUserMessage = "",
  matches: MatchResult[] = [],
) {
  if (intent.unsupportedDestination) {
    return "BluePass is currently focused on Indonesia. I can help with places like Komodo, Raja Ampat, Bali, Nusa Penida, Alor, Wakatobi, and other Indonesian marine destinations. Are you open to an Indonesia-based trip?";
  }

  const travelAdviceReply = buildTravelAdviceReply(intent, latestUserMessage);

  if (travelAdviceReply) {
    return travelAdviceReply;
  }

  if (planner.missingSlots.includes("destination")) {
    const knownParts = [
      intent.tripType ? `${intent.tripType}` : undefined,
      intent.guests ? `for ${intent.guests}` : undefined,
    ].filter(Boolean);
    const prefix = knownParts.length > 0 ? `Got it: ${knownParts.join(" ")}. ` : "";

    return `${prefix}Where in Indonesia feels best - Komodo, Raja Ampat, Bali/Nusa Penida, Lombok/Gili, or somewhere else in Indonesia?`;
  }

  if (planner.missingSlots.includes("tripType")) {
    const guestText = intent.guests ? ` for ${intent.guests}` : "";

    return `${intent.destination}${guestText} works. Are you thinking sailing, diving or liveaboard, snorkelling, surf, an eco resort, or something conservation-led?`;
  }

  if (planner.missingSlots.includes("guests")) {
    return `${intent.destination} for ${intent.tripType} sounds good. How many people should I plan around?`;
  }

  if (
    planner.missingSlots.includes("dateWindow") &&
    planner.missingSlots.includes("certificationLevel")
  ) {
    return `${intent.destination} ${intent.tripType} for ${intent.guests} guests - got it. When are you hoping to travel, and what certification level should I plan around?`;
  }

  if (planner.missingSlots.includes("dateWindow")) {
    return `${intent.destination} ${intent.tripType} for ${intent.guests} guests - got it. When are you hoping to travel?`;
  }

  if (planner.missingSlots.includes("certificationLevel")) {
    return "What certification level should I plan around - beginner, open water, advanced, rescue, divemaster, or instructor?";
  }

  if (planner.missingSlots.includes("budget")) {
    const certificationText = intent.certificationLevel ? `, ${intent.certificationLevel}` : "";

    return `${intent.destination} ${intent.tripType} for ${intent.guests} guests${certificationText} - got it. What budget range should I keep this within, per cabin/night or whole-yacht charter?`;
  }

  if (matches.length > 0) {
    return buildMatchedTripsReply(intent, matches);
  }

  return `Perfect. I can start matching suitable Indonesia trips for ${intent.destination} based on your ${intent.tripType} plans for ${intent.guests} guests. I won't claim live availability yet, but I can help narrow the right fit.`;
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

function normalizeRecentClientMessages(
  messages: KaiConversationInput["recentMessages"],
  input: { sessionId: string; channel: KaiChannel; latestUserMessage: string },
) {
  if (!Array.isArray(messages)) {
    return [];
  }

  return messages
    .slice(-12)
    .filter((message) => {
      if (!message || typeof message.content !== "string") {
        return false;
      }

      if (
        message.role !== "user" &&
        message.role !== "assistant" &&
        message.role !== "system"
      ) {
        return false;
      }

      return message.content.trim().length > 0;
    })
    .filter((message, index, safeMessages) => {
      const isLastMessage = index === safeMessages.length - 1;

      return !(isLastMessage && message.role === "user" && message.content.trim() === input.latestUserMessage.trim());
    })
    .map((message) => ({
      sessionId: input.sessionId,
      channel: input.channel,
      role: message.role,
      content: message.content.trim(),
    }));
}

function mergeConversationMemory(
  storedMessages: KaiConversationMessage[],
  recentClientMessages: KaiConversationMessage[],
) {
  if (recentClientMessages.length === 0) {
    return storedMessages;
  }

  if (storedMessages.length === 0) {
    return recentClientMessages;
  }

  const merged = [...storedMessages, ...recentClientMessages];
  const seen = new Set<string>();

  return merged.filter((message) => {
    const key = `${message.role}:${message.content}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  }).slice(-12);
}

function reconstructIntentFromHistory(
  messages: KaiConversationMessage[],
  initialIntent: KaiTravelIntent = {},
) {
  let intent = initialIntent;
  let lastAskedSlot: KaiMissingSlot | undefined;

  for (const message of messages) {
    if (message.role === "assistant") {
      lastAskedSlot = inferLastAskedSlotFromText(message.content) ?? lastAskedSlot;
    }

    if (message.role === "user") {
      intent = extractKaiTravelIntent(message.content, intent, { lastAskedSlot });
    }
  }

  return intent;
}

function inferLastAskedSlotFromHistory(messages: KaiConversationMessage[]) {
  for (const message of [...messages].reverse()) {
    if (message.role === "assistant") {
      const inferred = inferLastAskedSlotFromText(message.content);

      if (inferred) {
        return inferred;
      }
    }
  }

  return undefined;
}

function inferLastAskedSlotFromText(text: string): KaiMissingSlot | undefined {
  const normalized = text.toLowerCase();

  if (/how many|guests?|people|travelers|travellers/.test(normalized)) {
    return "guests";
  }

  if (/when|date|month|travel/.test(normalized)) {
    return "dateWindow";
  }

  if (/certification|certified|open water|advanced|divers/.test(normalized)) {
    return "certificationLevel";
  }

  if (/what kind|trip type|experience|diving|sailing|liveaboard|snorkel/.test(normalized)) {
    return "tripType";
  }

  if (/where|destination|area|komodo|raja ampat|bali|indonesia/.test(normalized)) {
    return "destination";
  }

  return undefined;
}

function enforcePlannerReply(
  reply: string,
  deterministicReply: string,
  planner: ReturnType<typeof planKaiConversation>,
  latestUserMessage = "",
  matches: MatchResult[] = [],
) {
  if (matches.length > 0 && !replyMentionsAnyMatch(reply, matches)) {
    console.warn("kai.reply.overrode_missing_matched_packages", {
      knownSlots: planner.knownSlots,
      missingSlots: planner.missingSlots,
      nextSlotToAsk: planner.nextSlotToAsk,
      matchCount: matches.length,
    });

    return deterministicReply;
  }

  if (isTravelTimingQuestion(latestUserMessage) && !replyAnswersTravelTiming(reply)) {
    console.warn("kai.reply.overrode_missing_travel_advice_answer", {
      knownSlots: planner.knownSlots,
      missingSlots: planner.missingSlots,
      nextSlotToAsk: planner.nextSlotToAsk,
    });

    return deterministicReply;
  }

  const repeatedKnownSlot = planner.knownSlots.some((slot) =>
    replyAppearsToAskSlot(reply, slot),
  );

  if (!repeatedKnownSlot) {
    return reply;
  }

  console.warn("kai.reply.overrode_repeated_known_slot_question", {
    knownSlots: planner.knownSlots,
    missingSlots: planner.missingSlots,
    nextSlotToAsk: planner.nextSlotToAsk,
  });

  return deterministicReply;
}

function replyMentionsAnyMatch(reply: string, matches: MatchResult[]) {
  const normalized = reply.toLowerCase();

  return matches.some((match) => normalized.includes(match.title.toLowerCase()));
}

function buildTravelAdviceReply(intent: KaiTravelIntent, latestUserMessage: string) {
  if (!isTravelTimingQuestion(latestUserMessage) || !intent.destination) {
    return undefined;
  }

  const season = getDestinationSeasonAdvice(intent.destination);

  if (!season) {
    return undefined;
  }

  const tripTypeText = intent.tripType ? ` for ${intent.tripType}` : "";
  const guestText = intent.guests ? ` for ${intent.guests} guests` : "";
  const dateText = intent.dateWindow ? ` Your ${intent.dateWindow} timing can still work, but it may not be the peak window.` : "";
  const nextStep =
    intent.budget || intent.dateWindow
      ? "I can use that to narrow the best-fit options."
      : "If you have rough dates or budget, I can narrow the fit.";

  return `${season.destination} is usually best ${season.bestWindow}.${dateText} For ${season.destination}${tripTypeText}${guestText}, ${season.note} ${nextStep}`;
}

async function matchTripsSafely(
  intent: KaiTravelIntent,
  planner: ReturnType<typeof planKaiConversation>,
  sessionId: string,
  channel: KaiChannel,
) {
  if (planner.conversationStage !== "ready_to_match") {
    return [];
  }

  try {
    const matches = await matchTripsForKai(intent);

    logKaiStage("kai.matches.loaded", {
      sessionId,
      channel,
      matchCount: matches.length,
    });

    return matches;
  } catch (error) {
    console.warn("kai.matches.failed", {
      sessionId: maskSessionId(sessionId),
      channel,
      errorName: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unable to load Kai matches",
      prismaCode: getPrismaErrorCode(error),
    });

    return [];
  }
}

function buildMatchedTripsReply(intent: KaiTravelIntent, matches: MatchResult[]) {
  const allSynced = matches.every((match) => Boolean(match.pmsPlatform));
  const candidateLabel = allSynced ? "synced operator package" : "BluePass operator candidate";
  const intro =
    matches.length === 1
      ? `I found a ${candidateLabel} that looks close for ${intent.destination} ${intent.tripType} for ${intent.guests} guests:`
      : `I found a few ${candidateLabel}s that look close for ${intent.destination} ${intent.tripType} for ${intent.guests} guests:`;
  const rows = matches
    .map((match, index) => {
      const operator = match.operatorName ? ` with ${match.operatorName}` : "";
      const price = formatMatchPrice(match);

      return `${index + 1}. ${match.title}${operator}${price ? ` - ${price}` : ""}. ${match.reason}.`;
    })
    .join("\n");

  return `${intro}\n${rows}\nI can use these as candidates, but I still won't claim live availability or confirm a booking until the operator/PMS hold step is wired.`;
}

function formatMatchPrice(match: MatchResult) {
  if (!match.priceCents || !match.currency) {
    return undefined;
  }

  return `from ${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: match.currency,
    maximumFractionDigits: 0,
  }).format(match.priceCents / 100)}`;
}

function isTravelTimingQuestion(message: string) {
  const normalized = message.toLowerCase();

  return (
    /\b(best|better|ideal|recommended|good)\s+(time|month|season)\b/.test(normalized) ||
    /\bwhen\s+(?:is\s+)?(?:the\s+)?best\b/.test(normalized) ||
    /\bwhat\s+(?:is\s+)?(?:the\s+)?best\s+time\b/.test(normalized) ||
    /\bbest\s+time\s+to\s+go\b/.test(normalized)
  );
}

function replyAnswersTravelTiming(reply: string) {
  const normalized = reply.toLowerCase();

  return (
    /\b(october|november|december|january|february|march|april|may|june|july|august|september)\b/.test(normalized) ||
    /\b(dry season|wet season|shoulder season|monsoon|season)\b/.test(normalized) ||
    /\b(best|ideal|recommended)\s+(?:window|time|season|months?)\b/.test(normalized)
  );
}

function getDestinationSeasonAdvice(destination: string) {
  const normalized = destination.toLowerCase();

  if (normalized.includes("raja ampat") || normalized.includes("misool")) {
    return {
      destination,
      bestWindow: "from October to April, with calmer seas and stronger liveaboard conditions",
      note: "June is shoulder/off-peak: possible, but conditions can be less predictable and fewer boats may run",
    };
  }

  if (normalized.includes("komodo") || normalized.includes("flores")) {
    return {
      destination,
      bestWindow: "from April to November, with June to September often excellent for dry-season sailing",
      note: "June is generally a strong time for Komodo, though exact route choice still depends on sea conditions and operator schedules",
    };
  }

  if (normalized.includes("bali") || normalized.includes("nusa penida") || normalized.includes("nusa lembongan") || normalized.includes("lombok") || normalized.includes("gili")) {
    return {
      destination,
      bestWindow: "from April to October during the drier months",
      note: "June usually fits well, especially for cleaner weather and easier sea days",
    };
  }

  if (normalized.includes("alor")) {
    return {
      destination,
      bestWindow: "from April to November, with the driest stretch usually around June to September",
      note: "June can be a good fit, but Alor can be current-heavy, so operator style matters",
    };
  }

  if (normalized.includes("wakatobi")) {
    return {
      destination,
      bestWindow: "around March to December, with especially steady conditions often from April to November",
      note: "June is usually a sensible window for Wakatobi",
    };
  }

  return {
    destination,
    bestWindow: "during Indonesia's drier months, roughly April to October, depending on the exact island chain",
    note: "June is often workable, but the best fit depends on the destination and trip style",
  };
}

function replyAppearsToAskSlot(reply: string, slot: string) {
  const normalized = reply.toLowerCase();
  const questionText = extractQuestionText(normalized);
  const asksQuestion = questionText.includes("?") || /\b(can you|could you|tell me|what|where|how many|when)\b/.test(questionText);

  if (!asksQuestion) {
    return false;
  }

  if (slot === "destination") {
    return /\b(where|destination|area|place|which island|where in indonesia)\b/.test(questionText);
  }

  if (slot === "tripType") {
    return /\b(what kind|trip type|experience|diving|sailing|liveaboard|snorkelling|snorkeling|surf)\b/.test(questionText);
  }

  if (slot === "guests") {
    return /\b(how many|guests?|people|travelers|travellers|joining|traveling|travelling)\b/.test(questionText);
  }

  if (slot === "dateWindow") {
    return /\b(when|date|month|travel)\b/.test(questionText);
  }

  if (slot === "certificationLevel") {
    return /\b(certification|certified|open water|advanced|rescue|divemaster|instructor)\b/.test(questionText);
  }

  return false;
}

function extractQuestionText(normalizedReply: string) {
  if (!normalizedReply.includes("?")) {
    return normalizedReply;
  }

  return normalizedReply
    .split("?")
    .slice(0, -1)
    .map((part) => part.split(/[.!]/).pop()?.trim() ?? "")
    .filter(Boolean)
    .join("? ");
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
