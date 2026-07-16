import type { ReferralAttribution } from "@/lib/services/referrals/attribution";
import { yachts } from "@/lib/data/yachts";
import { detectKaiRegion, KAI_REGION_CLARIFYING_QUESTION, type KaiRegion } from "./region-router";

type FetchLike = typeof fetch;

export type KaiCoreClientEnv = Record<string, string | undefined> & {
  KAI_CORE_ENABLED?: string;
  KAI_CORE_BASE_URL?: string;
  KAI_CORE_WIDGET_KEY?: string;
  KAI_CORE_WIDGET_KEY_AU?: string;
  KAI_CORE_ORIGIN?: string;
  KAI_CORE_ADMIN_TOKEN?: string;
};

export type KaiCoreWebChatInput = {
  sessionId?: string;
  message: string;
  region?: KaiRegion;
  referralAttribution?: ReferralAttribution;
};

type KaiCoreSessionResponse = {
  conversation?: {
    id?: string;
  };
};

type KaiCoreMessageResponse = {
  assistantMessage?: {
    content?: string;
  };
  bluepassMatches?: KaiCoreBluePassMatch[];
  contactRequest?: KaiCoreContactRequest | null;
  paymentRequest?: KaiCorePaymentRequest | null;
};

export type KaiCorePaymentRequest = {
  conversationId: string;
  productTitle: string | null;
  dateText: string | null;
  guests: number | null;
  status: "PAYMENT_PENDING";
};

export type KaiCorePaymentIntent = {
  provider: "REZDYPAY_STRIPE";
  publishableKey: string;
  conversationId: string;
};

export type KaiCorePaymentConfirmation = {
  status: "CONFIRMED";
  externalBookingId: string;
  provider: string;
};

type KaiCoreBluePassMatch = {
  slug: string;
  name: string;
  region: "Komodo" | "Raja Ampat";
  tier?: string;
  maxGuests?: number;
  cabins?: number;
  priceSignal?: string;
  charterPriceSignal?: string | null;
  reasons?: string[];
  score?: number;
  productUrl?: string | null;
};

type KaiCoreContactRequest = {
  conversationId: string;
  fields: ["name", "email", "phone"];
  status: "CONTACT_DETAILS_REQUIRED";
};

type KaiCoreBluePassInquiryResponse = {
  id: string;
  status: string;
  travellerName?: string | null;
  travellerEmail?: string | null;
  travellerPhone?: string | null;
  destination?: string | null;
  dateWindow?: string | null;
  guests?: number | null;
  budget?: string | null;
  selectedYachtName?: string | null;
  operatorName?: string | null;
  createdAt: string;
  events?: KaiCoreBluePassInquiryEventResponse[];
  dispatches?: KaiCoreBluePassInquiryDispatchResponse[];
  tenant?: { slug: string; name: string };
};

type KaiCoreBluePassInquiryEventResponse = {
  id: string;
  type: string;
  fromStatus?: string | null;
  toStatus?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
};

type KaiCoreBluePassInquiryDispatchResponse = {
  id: string;
  status: string;
  operatorPhone?: string | null;
  createdAt: string;
};

type KaiCoreBluePassQuoteResponse = {
  id: string;
  inquiryId: string;
  status: "NEEDS_FINAL_PRICE" | "READY_FOR_TRAVELLER" | "TRAVELLER_APPROVED";
  operationalStatus?:
    | "NEEDS_FINAL_PRICE"
    | "READY_FOR_TRAVELLER"
    | "TRAVELLER_APPROVED"
    | "PAYMENT_READY"
    | "BOOKING_CONFIRMED";
  selectedYachtName: string | null;
  operatorName: string | null;
  destination: string | null;
  dateWindow: string | null;
  guests: number | null;
  currency: string;
  grossPriceCents: number | null;
  conservationContributionCents: number | null;
  inclusions: string | null;
  exclusions: string | null;
  terms: string | null;
  paymentText?: string | null;
  confirmationText?: string | null;
  source: "operator_accept" | "operator_counter";
  quoteUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type KaiCoreBluePassInquiry = {
  source: "kai-core";
  id: string;
  status: string;
  travellerName: string | null;
  travellerEmail: string | null;
  travellerPhone: string | null;
  destination: string | null;
  dateWindow: string | null;
  guests: number | null;
  budget: string | null;
  selectedYachtName: string | null;
  operatorName: string | null;
  createdAt: string;
  latestDispatchStatus: string | null;
  latestOperatorPhone: string | null;
  events: Array<{
    id: string;
    type: string;
    fromStatus: string | null;
    toStatus: string | null;
    payload: Record<string, unknown> | null;
    createdAt: string;
  }>;
};

export type KaiCoreBluePassQuote = KaiCoreBluePassQuoteResponse;

export type KaiCoreWebChatResult = {
  reply: string;
  sessionId?: string;
  region?: KaiRegion;
  matches?: ReturnType<typeof toBluePassChatMatch>[];
  contactRequest?: KaiCoreContactRequest | null;
  paymentRequest?: KaiCorePaymentRequest | null;
};

export async function handleKaiCoreWebChat(
  input: KaiCoreWebChatInput,
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<KaiCoreWebChatResult> {
  // Region decides which Kai Core tenant (Indonesia's native marketplace vs the Australia Rezdy
  // pilot) this conversation talks to. Once a conversation has a sessionId, its region is normally
  // already locked in and passed back by the caller - only a brand-new conversation needs
  // detection. Ambiguous first messages get a cheap, deterministic clarifying question with no Kai
  // Core call at all, rather than guessing.
  let region = input.region;
  let effectiveSessionId = input.sessionId;

  if (!region) {
    if (input.sessionId) {
      // A sessionId with no cached region only happens for conversations that started before
      // region-routing existed (or otherwise lost their cached region) - forcing these onto
      // Indonesia forever regardless of what the traveller says next is a real bug, not a safe
      // default (a stale pre-existing session could sit on this path indefinitely). If the current
      // message is an unambiguous Australia signal, treat it as a fresh start under the right
      // tenant rather than silently continuing the old conversation.
      const detected = detectKaiRegion(input.message);
      if (detected === "australia") {
        region = "australia";
        effectiveSessionId = undefined;
      } else {
        region = "indonesia";
      }
    } else {
      const detected = detectKaiRegion(input.message);
      if (detected === "ambiguous") {
        return { reply: KAI_REGION_CLARIFYING_QUESTION };
      }
      region = detected;
    }
  }

  const config = resolveKaiCoreConfig(env, region);
  const conversationId =
    effectiveSessionId ??
    (await createKaiCoreSession({
      config,
      fetchImpl,
    }));
  const payload = {
    key: config.widgetKey,
    conversationId,
    content: input.message,
    ...(region === "indonesia" ? { bluepassCatalog: buildBluePassCatalogSnapshot() } : {}),
    ...(input.referralAttribution
      ? {
          referral: {
            referralCode: input.referralAttribution.code,
            referralLinkId: input.referralAttribution.referralLinkId,
            referralPartnerId: input.referralAttribution.referralPartnerId,
            referralRole: input.referralAttribution.role,
          },
        }
      : {}),
  };

  const response = await fetchKaiCoreWithRetry(fetchImpl, `${config.baseUrl}/api/widget/messages`, {
    method: "POST",
    headers: buildKaiCoreHeaders(config),
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Kai Core message request failed.");
  }

  const data = (await response.json()) as KaiCoreMessageResponse;

  return {
    sessionId: conversationId,
    region,
    reply: data.assistantMessage?.content ?? "Kai Core did not return a reply.",
    ...(data.contactRequest ? { contactRequest: data.contactRequest } : {}),
    ...(data.paymentRequest ? { paymentRequest: data.paymentRequest } : {}),
    ...(data.bluepassMatches && data.bluepassMatches.length > 0
      ? { matches: data.bluepassMatches.map(toBluePassChatMatch) }
      : {}),
  };
}

export function shouldUseKaiCore(env: KaiCoreClientEnv = process.env) {
  return env.KAI_CORE_ENABLED === "true";
}

export async function createKaiCorePaymentIntent(
  input: { conversationId: string; region?: KaiRegion },
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<KaiCorePaymentIntent> {
  const config = resolveKaiCoreConfig(env, input.region);
  const response = await fetchKaiCoreWithRetry(fetchImpl, `${config.baseUrl}/api/widget/payments/intent`, {
    method: "POST",
    headers: buildKaiCoreHeaders(config),
    body: JSON.stringify({ key: config.widgetKey, conversationId: input.conversationId }),
  });

  if (!response.ok) {
    throw new Error("Kai Core payment intent request failed.");
  }

  return (await response.json()) as KaiCorePaymentIntent;
}

export async function confirmKaiCorePayment(
  input: { conversationId: string; cardToken: string; region?: KaiRegion },
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<KaiCorePaymentConfirmation> {
  const config = resolveKaiCoreConfig(env, input.region);
  const response = await fetchKaiCoreWithRetry(fetchImpl, `${config.baseUrl}/api/widget/payments/confirm`, {
    method: "POST",
    headers: buildKaiCoreHeaders(config),
    body: JSON.stringify({
      key: config.widgetKey,
      conversationId: input.conversationId,
      cardToken: input.cardToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Kai Core payment confirmation request failed.");
  }

  return (await response.json()) as KaiCorePaymentConfirmation;
}

export async function forwardWhatsAppWebhookToKaiCore(
  payload: unknown,
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
) {
  if (!shouldUseKaiCore(env)) {
    return false;
  }

  const config = resolveKaiCoreConfig(env);
  const response = await fetchKaiCoreWithRetry(fetchImpl, `${config.baseUrl}/api/whatsapp/webhook`, {
    method: "POST",
    headers: buildKaiCoreHeaders(config),
    body: JSON.stringify(payload),
  });

  return response.ok;
}

export async function listKaiCoreBluePassInquiries(
  input: { tenantSlug: string; take?: number },
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<KaiCoreBluePassInquiry[]> {
  const config = resolveKaiCoreConfig(env);
  const adminToken = env.KAI_CORE_ADMIN_TOKEN?.trim();

  if (!adminToken) {
    throw new Error("Kai Core admin token is not configured.");
  }

  const params = new URLSearchParams({ take: String(input.take ?? 40) });
  const response = await fetchKaiCoreWithRetry(
    fetchImpl,
    `${config.baseUrl}/api/admin/${encodeURIComponent(input.tenantSlug)}/bluepass-inquiries?${params.toString()}`,
    {
      method: "GET",
      headers: {
        ...buildKaiCoreHeaders(config),
        authorization: `Bearer ${adminToken}`,
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Kai Core BluePass inquiries request failed.");
  }

  const data = (await response.json()) as { inquiries?: KaiCoreBluePassInquiryResponse[] };
  return (data.inquiries ?? []).map(toKaiCoreBluePassInquiry);
}

export async function getKaiCoreBluePassQuote(
  input: { quoteId: string },
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<KaiCoreBluePassQuote | null> {
  const config = resolveKaiCoreConfig(env);
  const response = await fetchKaiCoreWithRetry(
    fetchImpl,
    `${config.baseUrl}/api/bluepass/quotes/${encodeURIComponent(input.quoteId)}`,
    {
      method: "GET",
      headers: buildKaiCoreHeaders(config),
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Kai Core BluePass quote request failed.");
  }

  const data = (await response.json()) as { quote?: KaiCoreBluePassQuoteResponse };
  return data.quote ?? null;
}

export async function approveKaiCoreBluePassQuote(
  input: { quoteId: string },
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<KaiCoreBluePassQuote> {
  const config = resolveKaiCoreConfig(env);
  const response = await fetchKaiCoreWithRetry(
    fetchImpl,
    `${config.baseUrl}/api/bluepass/quotes/${encodeURIComponent(input.quoteId)}`,
    {
      method: "POST",
      headers: buildKaiCoreHeaders(config),
      body: JSON.stringify({ action: "approve" }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw new Error("Kai Core BluePass quote approval failed.");
  }

  const data = (await response.json()) as { quote?: KaiCoreBluePassQuoteResponse };
  if (!data.quote) {
    throw new Error("Kai Core quote approval response did not include a quote.");
  }

  return data.quote;
}

async function createKaiCoreSession(input: {
  config: ReturnType<typeof resolveKaiCoreConfig>;
  fetchImpl: FetchLike;
}) {
  const response = await fetchKaiCoreWithRetry(input.fetchImpl, `${input.config.baseUrl}/api/widget/session`, {
    method: "POST",
    headers: buildKaiCoreHeaders(input.config),
    body: JSON.stringify({ key: input.config.widgetKey }),
  });

  if (!response.ok) {
    throw new Error("Kai Core session request failed.");
  }

  const data = (await response.json()) as KaiCoreSessionResponse;
  const conversationId = data.conversation?.id;

  if (!conversationId) {
    throw new Error("Kai Core session response did not include a conversation id.");
  }

  return conversationId;
}

function resolveKaiCoreConfig(env: KaiCoreClientEnv, region: KaiRegion = "indonesia") {
  return {
    baseUrl: (env.KAI_CORE_BASE_URL ?? "http://127.0.0.1:3107").replace(/\/$/, ""),
    widgetKey:
      region === "australia"
        ? (env.KAI_CORE_WIDGET_KEY_AU ?? "pk_test_bluepass_au")
        : (env.KAI_CORE_WIDGET_KEY ?? "pk_test_bluepass"),
    origin: env.KAI_CORE_ORIGIN ?? "https://bluepass.co",
  };
}

function buildKaiCoreHeaders(config: ReturnType<typeof resolveKaiCoreConfig>) {
  return {
    "Content-Type": "application/json",
    origin: config.origin,
  };
}

async function fetchKaiCoreWithRetry(fetchImpl: FetchLike, url: string, init: RequestInit) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetchImpl(url, init);
      if (response.ok || response.status < 500) {
        return response;
      }
      lastError = new Error(`Kai Core returned ${response.status}.`);
    } catch (error) {
      lastError = error;
    }

    if (attempt === 0) {
      await delay(250);
    }
  }

  if (lastError instanceof Error) {
    throw lastError;
  }

  throw new Error("Kai Core request failed.");
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toBluePassChatMatch(match: KaiCoreBluePassMatch) {
  return {
    slug: match.slug,
    name: match.name,
    region: match.region,
    tier: match.tier ?? "",
    cabinBookable: Boolean(match.priceSignal && !/private/i.test(match.priceSignal)),
    maxGuests: match.maxGuests ?? 0,
    cabins: match.cabins ?? 0,
    pricePerCabin: match.priceSignal ?? "Quote on request",
    charterPrice: match.charterPriceSignal ?? null,
    charterOnly: Boolean(match.charterPriceSignal === null),
    matchingReasons: match.reasons ?? [],
    departuresPreview: [],
    score: match.score ?? 0,
    productUrl: match.productUrl ?? `/yachts/${match.slug}`,
  };
}

function toKaiCoreBluePassInquiry(inquiry: KaiCoreBluePassInquiryResponse): KaiCoreBluePassInquiry {
  const latestDispatch = inquiry.dispatches?.[0] ?? null;

  return {
    source: "kai-core",
    id: inquiry.id,
    status: inquiry.status,
    travellerName: inquiry.travellerName ?? null,
    travellerEmail: inquiry.travellerEmail ?? null,
    travellerPhone: inquiry.travellerPhone ?? null,
    destination: inquiry.destination ?? null,
    dateWindow: inquiry.dateWindow ?? null,
    guests: inquiry.guests ?? null,
    budget: inquiry.budget ?? null,
    selectedYachtName: inquiry.selectedYachtName ?? null,
    operatorName: inquiry.operatorName ?? null,
    createdAt: inquiry.createdAt,
    latestDispatchStatus: latestDispatch?.status ?? null,
    latestOperatorPhone: latestDispatch?.operatorPhone ?? null,
    events: (inquiry.events ?? []).map((event) => ({
      id: event.id,
      type: event.type,
      fromStatus: event.fromStatus ?? null,
      toStatus: event.toStatus ?? null,
      payload: event.metadata ?? null,
      createdAt: event.createdAt,
    })),
  };
}

function buildBluePassCatalogSnapshot() {
  return yachts.map((yacht) => ({
    slug: yacht.slug,
    name: yacht.name,
    region: yacht.region,
    tier: yacht.tier,
    maxGuests: yacht.maxGuests,
    cabins: yacht.cabins,
    priceSignal: formatPriceSignal(yacht.pricePerCabin, "per cabin"),
    charterPriceSignal: yacht.charterPrice ? formatPriceSignal(yacht.charterPrice, "private charter") : null,
    operatorId: `operator_${yacht.slug.replace(/-/g, "_")}`,
    operatorName: yacht.name,
    cabinBookable: yacht.cabinBookable,
    about: yacht.about,
    productUrl: buildBluePassProductUrl(yacht.slug),
    departuresPreview: yacht.departures.slice(0, 3).map((departure) => departure.dates),
    interests: buildCatalogInterests(yacht),
  }));
}

function buildBluePassProductUrl(slug: string) {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://bluepass.co").replace(/\/$/, "");

  return `${baseUrl}/yachts/${slug}`;
}

function formatPriceSignal(value: string, label: string) {
  if (!value || /quote/i.test(value)) {
    return "Quote on request";
  }

  return `from ${value} ${label}`;
}

function buildCatalogInterests(yacht: (typeof yachts)[number]) {
  const text = [yacht.name, yacht.build, yacht.about, yacht.tier, yacht.region].join(" ").toLowerCase();
  const interests = [
    /dive|diving|scuba|liveaboard/.test(text) ? "dive" : null,
    /private|charter/.test(text) || yacht.charterOnly || Boolean(yacht.charterPrice) ? "private" : null,
    /phinisi|sailing|yacht/.test(text) ? "phinisi" : null,
    yacht.cabinBookable ? "cabin" : null,
    /luxury|legend|premium/.test(text) ? "luxury" : null,
  ].filter(Boolean) as string[];

  return Array.from(new Set(interests));
}
