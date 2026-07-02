type InquiryEventSummaryInput = {
  type?: string | null;
  actorType?: string | null;
  fromStatus: string | null;
  toStatus: string | null;
  createdAt: Date | string;
  payload?: unknown;
};

export function formatInquiryEventSummary(event: InquiryEventSummaryInput) {
  const label = formatEventLabel(event);
  const base = `${label} | ${formatInquiryEventDate(event.createdAt)}`;
  const chain = formatAlternativeChain(event.payload);

  return chain ? `${base} | ${chain}` : base;
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
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
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

function formatInquiryEventDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
