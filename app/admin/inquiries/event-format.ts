type InquiryEventSummaryInput = {
  actorType?: string | null;
  fromStatus: string | null;
  toStatus: string | null;
  createdAt: Date | string;
  payload?: unknown;
};

export function formatInquiryEventSummary(event: InquiryEventSummaryInput) {
  const actor = event.actorType?.toLowerCase() ?? "core";
  const base = `${actor} | ${event.fromStatus?.toLowerCase() ?? "new"} -> ${
    event.toStatus?.toLowerCase() ?? "unchanged"
  } | ${formatInquiryEventDate(event.createdAt)}`;
  const chain = formatAlternativeChain(event.payload);

  return chain ? `${base} | ${chain}` : base;
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

function formatInquiryEventDate(date: Date | string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
