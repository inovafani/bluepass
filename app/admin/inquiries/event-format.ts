type InquiryEventSummaryInput = {
  type?: string | null;
  actorType?: string | null;
  fromStatus: string | null;
  toStatus: string | null;
  createdAt: Date | string;
  payload?: unknown;
};

type InquiryPipelineStateInput = {
  status?: string | null;
  events?: Array<{
    type?: string | null;
    fromStatus?: string | null;
    toStatus?: string | null;
    createdAt?: Date | string;
    payload?: unknown;
  }>;
};

export type InquiryPipelineState = {
  label: string;
  tone: "waiting" | "action" | "ready" | "done" | "blocked";
  nextAction: string;
};

export function formatInquiryPipelineState(input: InquiryPipelineStateInput): InquiryPipelineState {
  const eventTypes = new Set((input.events ?? []).map((event) => event.type?.toUpperCase()).filter(Boolean));
  const status = input.status?.toUpperCase() ?? "";

  if (eventTypes.has("OPERATOR_BOOKING_CONFIRMED") || status === "CLOSED") {
    return {
      label: "Booking confirmed",
      tone: "done",
      nextAction: "Trip is secured; BluePass can keep supporting pre-departure follow-up.",
    };
  }

  if (eventTypes.has("OPERATOR_PAYMENT_READY")) {
    return {
      label: "Payment path received",
      tone: "ready",
      nextAction: "Traveller has payment instructions; wait for payment confirmation.",
    };
  }

  if (eventTypes.has("BLUEPASS_QUOTE_APPROVED")) {
    return {
      label: "Traveller approved quote",
      tone: "action",
      nextAction: "Operator should hold the slot and send payment instructions.",
    };
  }

  if (eventTypes.has("OPERATOR_RESPONSE_COUNTERED") || status === "COUNTER_OFFERED") {
    return {
      label: "Counter-offer sent",
      tone: "action",
      nextAction: "Traveller can approve, negotiate, or compare alternatives.",
    };
  }

  if (eventTypes.has("OPERATOR_RESPONSE_DECLINED") || status === "DECLINED") {
    return {
      label: "Operator declined",
      tone: "blocked",
      nextAction: "Compare alternatives before dispatching another operator inquiry.",
    };
  }

  if (eventTypes.has("OPERATOR_RESPONSE_ACCEPTED") || status === "OPERATOR_ACCEPTED") {
    return {
      label: "Operator accepted",
      tone: "action",
      nextAction: "Collect final quote and payment readiness from the operator.",
    };
  }

  if (eventTypes.has("OPERATOR_WHATSAPP_DISPATCH_SENT") || status === "OPERATOR_PENDING") {
    return {
      label: "Waiting for operator",
      tone: "waiting",
      nextAction: "Operator needs to accept, decline, or send a counter-offer.",
    };
  }

  return {
    label: "Inquiry prepared",
    tone: "waiting",
    nextAction: "Dispatch to the matched operator when traveller confirmation is ready.",
  };
}

export function formatInquiryEventSummary(event: InquiryEventSummaryInput) {
  const label = formatEventLabel(event);
  const base = `${label} | ${formatInquiryEventDate(event.createdAt)}`;
  const chain = formatAlternativeChain(event.payload);

  return chain ? `${base} | ${chain}` : base;
}

export function formatInquiryEventDetail(event: InquiryEventSummaryInput) {
  const payload = readPayloadRecord(event.payload);
  if (!payload) {
    return null;
  }

  const paymentText = readPayloadString(payload, "paymentText");
  if (paymentText) {
    return `Payment: ${paymentText}`;
  }

  const confirmationText = readPayloadString(payload, "confirmationText");
  if (confirmationText) {
    return `Confirmation: ${confirmationText}`;
  }

  const counterDetails =
    readPayloadString(payload, "counterDetails") ?? readPayloadString(payload, "counterText");
  if (counterDetails) {
    return `Counter: ${counterDetails}`;
  }

  const quoteUrl = readPayloadString(payload, "quoteUrl");
  if (quoteUrl) {
    return `Quote: ${quoteUrl}`;
  }

  const body = readPayloadString(payload, "body");
  if (body) {
    const participant = readPayloadString(payload, "participant");
    return `${formatParticipantLabel(participant)} asked: ${body}`;
  }

  const reason = readPayloadString(payload, "reason");
  if (reason && reason !== "operator_declined") {
    return `Reason: ${formatIdentifier(reason)}`;
  }

  return null;
}

function formatEventLabel(event: InquiryEventSummaryInput) {
  const eventType = event.type?.toUpperCase() ?? null;

  switch (eventType) {
    case "INQUIRY_CREATED":
      return "Inquiry created";
    case "INQUIRY_UPDATED":
      return "Inquiry updated";
    case "OPERATOR_WHATSAPP_DISPATCH_QUEUED":
      return "Operator WhatsApp queued";
    case "OPERATOR_WHATSAPP_DISPATCH_SENT":
      return "Operator WhatsApp sent";
    case "OPERATOR_WHATSAPP_DISPATCH_FAILED":
      return "Operator WhatsApp failed";
    case "OPERATOR_COUNTER_REQUEST_SENT":
      return "Counter request sent to operator";
    case "OPERATOR_RESPONSE_ACCEPTED":
      return "Operator accepted";
    case "OPERATOR_RESPONSE_DECLINED":
      return "Operator declined";
    case "OPERATOR_RESPONSE_COUNTERED":
      return "Counter-offer received";
    case "TRAVELLER_WHATSAPP_NOTIFICATION_SENT":
      return "Traveller WhatsApp notified";
    case "TRAVELLER_WHATSAPP_NOTIFICATION_FAILED":
      return "Traveller WhatsApp failed";
    case "TRAVELLER_WHATSAPP_DELIVERY_STATUS":
      return formatTravellerDeliveryLabel(event.payload);
    case "BLUEPASS_QUOTE_APPROVED":
      return "Quote approved by traveller";
    case "QUOTE_APPROVAL_OPERATOR_NOTIFICATION_SENT":
      return "Operator asked to hold slot";
    case "QUOTE_APPROVAL_OPERATOR_NOTIFICATION_SKIPPED":
      return "Operator hold notification skipped";
    case "QUOTE_APPROVAL_OPERATOR_NOTIFICATION_FAILED":
      return "Operator hold notification failed";
    case "QUOTE_APPROVAL_TRAVELLER_NOTIFICATION_SENT":
      return "Traveller approval follow-up sent";
    case "QUOTE_APPROVAL_TRAVELLER_NOTIFICATION_SKIPPED":
      return "Traveller approval follow-up skipped";
    case "QUOTE_APPROVAL_TRAVELLER_NOTIFICATION_FAILED":
      return "Traveller approval follow-up failed";
    case "OPERATOR_PAYMENT_READY":
      return "Payment path received";
    case "OPERATOR_PAYMENT_READY_WAITING_FOR_TRAVELLER_APPROVAL":
      return "Payment path waiting for traveller approval";
    case "OPERATOR_PAYMENT_READY_IGNORED":
      return "Payment path ignored";
    case "OPERATOR_BOOKING_CONFIRMED":
      return "Booking confirmed";
    case "OPERATOR_BOOKING_CONFIRMATION_IGNORED":
      return "Booking confirmation ignored";
    case "WHATSAPP_CONTEXT_MESSAGE_RECEIVED":
      return "WhatsApp context question received";
    case "WHATSAPP_CONTEXT_REPLY_SENT":
      return "WhatsApp context reply sent";
    case "WHATSAPP_CONTEXT_REPLY_FAILED":
      return "WhatsApp context reply failed";
    default:
      return formatTransitionLabel(event);
  }
}

function formatTravellerDeliveryLabel(payload?: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return "Traveller WhatsApp delivery updated";
  }

  const status = (payload as Record<string, unknown>).status;
  if (typeof status !== "string" || !status.trim()) {
    return "Traveller WhatsApp delivery updated";
  }

  return `Traveller WhatsApp ${formatIdentifier(status)}`;
}

function formatTransitionLabel(event: InquiryEventSummaryInput) {
  const fromStatus = event.fromStatus ? event.fromStatus.toLowerCase() : null;
  const toStatus = event.toStatus ? event.toStatus.toLowerCase() : null;
  const actor = formatIdentifier(event.actorType ?? "core");

  if (toStatus && fromStatus === toStatus) {
    return `${actor}: ${formatIdentifier(toStatus)}`;
  }

  if (fromStatus || toStatus) {
    return `${actor}: ${formatIdentifier(fromStatus ?? "new")} -> ${formatIdentifier(
      toStatus ?? "unchanged",
    )}`;
  }

  return actor;
}

export function formatAlternativeChain(payload?: unknown) {
  const record = readPayloadRecord(payload);
  if (!record) {
    return null;
  }

  const reason = typeof record.reason === "string" ? record.reason : null;
  const previousYachtSlug =
    typeof record.previousYachtSlug === "string" ? record.previousYachtSlug : null;
  const alternativeYachtSlug =
    typeof record.alternativeYachtSlug === "string" ? record.alternativeYachtSlug : null;

  if (reason !== "operator_declined" || !previousYachtSlug || !alternativeYachtSlug) {
    return null;
  }

  return `alternative chain: ${formatSlug(previousYachtSlug)} declined -> ${formatSlug(alternativeYachtSlug)} dispatched`;
}

function readPayloadRecord(payload?: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  return payload as Record<string, unknown>;
}

function readPayloadString(record: Record<string, unknown>, key: string) {
  const value = record[key];
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed || null;
}

function formatSlug(value: string) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatIdentifier(value: string) {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatParticipantLabel(value?: string | null) {
  if (value === "operator") return "Operator";
  if (value === "traveller") return "Traveller";
  return "Participant";
}

function formatInquiryEventDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
