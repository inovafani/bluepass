import type { ReferralAttribution } from "@/lib/services/referrals/attribution";

type FetchLike = typeof fetch;

export type KaiCoreClientEnv = Record<string, string | undefined> & {
  KAI_CORE_ENABLED?: string;
  KAI_CORE_BASE_URL?: string;
  KAI_CORE_WIDGET_KEY?: string;
  KAI_CORE_ORIGIN?: string;
};

export type KaiCoreWebChatInput = {
  sessionId?: string;
  message: string;
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
};

export async function handleKaiCoreWebChat(
  input: KaiCoreWebChatInput,
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
) {
  const config = resolveKaiCoreConfig(env);
  const conversationId =
    input.sessionId ??
    (await createKaiCoreSession({
      config,
      fetchImpl,
    }));
  const payload = {
    key: config.widgetKey,
    conversationId,
    content: input.message,
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

  const response = await fetchImpl(`${config.baseUrl}/api/widget/messages`, {
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
    reply: data.assistantMessage?.content ?? "Kai Core did not return a reply.",
    ...(data.bluepassMatches && data.bluepassMatches.length > 0
      ? { matches: data.bluepassMatches.map(toBluePassChatMatch) }
      : {}),
  };
}

export function shouldUseKaiCore(env: KaiCoreClientEnv = process.env) {
  return env.KAI_CORE_ENABLED === "true";
}

async function createKaiCoreSession(input: {
  config: ReturnType<typeof resolveKaiCoreConfig>;
  fetchImpl: FetchLike;
}) {
  const response = await input.fetchImpl(`${input.config.baseUrl}/api/widget/session`, {
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

function resolveKaiCoreConfig(env: KaiCoreClientEnv) {
  return {
    baseUrl: (env.KAI_CORE_BASE_URL ?? "http://127.0.0.1:3107").replace(/\/$/, ""),
    widgetKey: env.KAI_CORE_WIDGET_KEY ?? "pk_test_bluepass",
    origin: env.KAI_CORE_ORIGIN ?? "https://bluepass.co",
  };
}

function buildKaiCoreHeaders(config: ReturnType<typeof resolveKaiCoreConfig>) {
  return {
    "Content-Type": "application/json",
    origin: config.origin,
  };
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
  };
}
