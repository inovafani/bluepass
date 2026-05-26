import type { ActorPayload } from "@/lib/services/booking/orchestrator";
import {
  acceptByOperator,
  declineByOperator,
  requestCounterOffer,
} from "@/lib/services/booking/orchestrator";
import {
  buildOperatorCounterPrompt,
  buildOperatorDeclinedFreeText,
  type FreeTextMessage,
} from "@/lib/services/whatsapp/operator-dispatch";
import { parseOperatorButtonPayload } from "@/lib/services/whatsapp/payloads";

type OrchestratorDeps = {
  acceptByOperator: (bookingId: string, actorPayload: ActorPayload) => Promise<unknown>;
  declineByOperator: (bookingId: string, actorPayload: ActorPayload) => Promise<unknown>;
  requestCounterOffer: (
    bookingId: string,
    actorPayload: ActorPayload,
  ) => Promise<unknown>;
};

export type WhatsAppWebhookHandlerOptions = {
  orchestrator?: Partial<OrchestratorDeps>;
  logger?: Pick<typeof console, "info" | "warn" | "error">;
  peerOperatorName?: string;
  onOperatorFollowUp?: (message: FreeTextMessage) => Promise<void> | void;
};

type IncomingWhatsAppMessage = {
  id?: string;
  from?: string;
  type?: string;
  buttonPayload?: string;
};

type IncomingMessageRoute = "operator_action" | "traveller_or_unclassified";

const defaultOrchestrator: OrchestratorDeps = {
  acceptByOperator,
  declineByOperator,
  requestCounterOffer,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getButtonPayload(message: Record<string, unknown>): string | undefined {
  const button = message.button;
  if (isRecord(button)) {
    const payload = asString(button.payload);
    if (payload) {
      return payload;
    }
  }

  const interactive = message.interactive;
  if (isRecord(interactive)) {
    const buttonReply = interactive.button_reply;
    if (isRecord(buttonReply)) {
      return asString(buttonReply.id) ?? asString(buttonReply.payload);
    }
  }

  return undefined;
}

function extractIncomingMessages(payload: unknown): IncomingWhatsAppMessage[] {
  if (!isRecord(payload) || !Array.isArray(payload.entry)) {
    return [];
  }

  const messages: IncomingWhatsAppMessage[] = [];

  for (const entry of payload.entry) {
    if (!isRecord(entry) || !Array.isArray(entry.changes)) {
      continue;
    }

    for (const change of entry.changes) {
      if (!isRecord(change) || !isRecord(change.value)) {
        continue;
      }

      const rawMessages = change.value.messages;
      if (!Array.isArray(rawMessages)) {
        continue;
      }

      for (const rawMessage of rawMessages) {
        if (!isRecord(rawMessage)) {
          continue;
        }

        messages.push({
          id: asString(rawMessage.id),
          from: asString(rawMessage.from),
          type: asString(rawMessage.type),
          buttonPayload: getButtonPayload(rawMessage),
        });
      }
    }
  }

  return messages;
}

function buildActorPayload(message: IncomingWhatsAppMessage): ActorPayload {
  return {
    source: "whatsapp",
    messageType: message.type ?? "unknown",
    messageId: message.id ?? null,
    operatorWhatsApp: message.from ?? null,
  };
}

function classifyIncomingMessage(message: IncomingWhatsAppMessage): IncomingMessageRoute {
  if (message.buttonPayload) {
    return "operator_action";
  }

  return "traveller_or_unclassified";
}

export async function handleWhatsAppWebhook(
  payload: unknown,
  options: WhatsAppWebhookHandlerOptions = {},
): Promise<void> {
  const logger = options.logger ?? console;
  const orchestrator = {
    ...defaultOrchestrator,
    ...options.orchestrator,
  };

  const parsedPayload =
    typeof payload === "string" ? (JSON.parse(payload) as unknown) : payload;

  const messages = extractIncomingMessages(parsedPayload);

  for (const message of messages) {
    try {
      const route = classifyIncomingMessage(message);

      /*
       * In one-number MVP mode, Kai conversations and operator notifications can share
       * the same Meta phone_number_id. Inbound routing must therefore be based on the
       * sender and booking/session context instead of the destination phone number:
       * if the sender matches an Operator.whatsappNumber or has an active operator
       * action context, route to operator flow; otherwise route to traveller Kai flow.
       * Sprint 2 only supports operator button payloads, so quick replies remain
       * operator actions regardless of the destination phone_number_id.
       */
      if (route !== "operator_action" || !message.buttonPayload) {
        logger.info("whatsapp.webhook.ignored_message", {
          messageType: message.type ?? "unknown",
          hasButtonPayload: false,
        });
        continue;
      }

      const parsedButton = parseOperatorButtonPayload(message.buttonPayload);
      const actorPayload = buildActorPayload(message);

      if (parsedButton.action === "accept") {
        await orchestrator.acceptByOperator(parsedButton.bookingId, actorPayload);
      }

      if (parsedButton.action === "decline") {
        await orchestrator.declineByOperator(parsedButton.bookingId, actorPayload);
        await options.onOperatorFollowUp?.(
          buildOperatorDeclinedFreeText({
            peerOperatorName: options.peerOperatorName ?? "a peer operator",
          }),
        );
      }

      if (parsedButton.action === "counter") {
        await orchestrator.requestCounterOffer(parsedButton.bookingId, actorPayload);
        await options.onOperatorFollowUp?.(
          buildOperatorCounterPrompt({
            bookingShortCode: parsedButton.bookingId,
          }),
        );
      }

      logger.info("whatsapp.webhook.operator_action_processed", {
        action: parsedButton.action,
        bookingId: parsedButton.bookingId,
      });
    } catch (error) {
      logger.warn("whatsapp.webhook.message_failed", {
        messageType: message.type ?? "unknown",
        reason: error instanceof Error ? error.message : "Unknown webhook error.",
      });
    }
  }
}
