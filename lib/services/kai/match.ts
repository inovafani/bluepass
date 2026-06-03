import { prisma } from "@/lib/db/prisma";
import { decryptCredentials } from "@/lib/services/booking/adapters/credentials";
import type { BokunCredentials } from "@/lib/services/booking/adapters/bokun";
import type { KaiTravelIntent, MatchResult } from "./types";

type TripForMatching = {
  id: string;
  operatorId: string;
  externalId: string | null;
  title: string;
  description: string | null;
  location: string | null;
  imageUrl: string | null;
  priceCents: number;
  currency: string;
  operator: {
    name: string;
    integrations: Array<{
      platform: "BOKUN" | "REZDY" | "FAREHARBOR" | "NATIVE";
      encryptedCredentials?: string;
    }>;
  };
};

export async function matchTripsForKai(intent: KaiTravelIntent): Promise<MatchResult[]> {
  if (!intent.destination || !intent.tripType || !intent.guests || !intent.dateWindow) {
    return [];
  }

  const trips = await prisma.trip.findMany({
    where: {
      operator: {
        integrations: {
          some: {
            platform: "BOKUN",
          },
        },
      },
    },
    include: {
      operator: {
        select: {
          name: true,
          integrations: {
            where: { platform: "BOKUN" },
            select: { platform: true, encryptedCredentials: true },
          },
        },
      },
    },
    take: 40,
  });

  return limitMatchResults(
    trips
      .map((trip) => scoreTripForIntent(trip as TripForMatching, intent))
      .filter((match) => match.score > 0),
  );
}

export function limitMatchResults(results: MatchResult[]): MatchResult[] {
  return results
    .slice()
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}

function scoreTripForIntent(trip: TripForMatching, intent: KaiTravelIntent): MatchResult {
  const haystack = [trip.title, trip.description, trip.location].filter(Boolean).join(" ").toLowerCase();
  const destinationTerms = buildDestinationTerms(intent.destination);
  const tripTypeTerms = buildTripTypeTerms(intent.tripType);
  const destinationMatches = destinationTerms.some((term) => haystack.includes(term));
  const tripTypeMatches = tripTypeTerms.some((term) => haystack.includes(term));
  const reasons: string[] = [];
  let score = 0;

  if (!destinationMatches) {
    return buildUnmatchedResult(trip);
  }

  if (intent.tripType && !tripTypeMatches) {
    return buildUnmatchedResult(trip);
  }

  score += 55;
  reasons.push(`matches ${intent.destination}`);

  if (tripTypeMatches) {
    score += 35;
    reasons.push(`fits ${intent.tripType}`);
  }

  for (const interest of intent.interests ?? []) {
    if (haystack.includes(interest.toLowerCase())) {
      score += 8;
      reasons.push(`mentions ${interest}`);
    }
  }

  if (score > 0 && trip.operator.integrations.some((integration) => integration.platform === "BOKUN")) {
    score += 5;
    reasons.push("from a synced Bokun operator");
  }

  return {
    tripId: trip.id,
    operatorId: trip.operatorId,
    externalId: trip.externalId ?? undefined,
    operatorName: trip.operator.name,
    title: trip.title,
    description: trip.description ?? undefined,
    location: trip.location ?? undefined,
    imageUrl: trip.imageUrl ?? undefined,
    priceCents: trip.priceCents,
    currency: trip.currency,
    orderUrl: buildPmsOrderUrl(trip),
    score,
    reason: reasons.join(", ") || "similar marine trip",
    pmsPlatform: "bokun",
  };
}

function buildUnmatchedResult(trip: TripForMatching): MatchResult {
  return {
    tripId: trip.id,
    operatorId: trip.operatorId,
    externalId: trip.externalId ?? undefined,
    operatorName: trip.operator.name,
    title: trip.title,
    description: trip.description ?? undefined,
    location: trip.location ?? undefined,
    imageUrl: trip.imageUrl ?? undefined,
    priceCents: trip.priceCents,
    currency: trip.currency,
    orderUrl: undefined,
    score: 0,
    reason: "does not match the requested destination and activity",
    pmsPlatform: "bokun",
  };
}

function buildPmsOrderUrl(trip: TripForMatching) {
  if (!trip.externalId) {
    return undefined;
  }

  const credentials = getBokunPublicCredentials(trip);
  const template = credentials?.publicProductUrlTemplate;

  if (template) {
    return template
      .replace(/\{productId\}/g, encodeURIComponent(trip.externalId))
      .replace(/\{externalId\}/g, encodeURIComponent(trip.externalId));
  }

  const baseUrl = credentials?.publicBookingBaseUrl;

  if (!baseUrl) {
    return undefined;
  }

  return `${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(trip.externalId)}`;
}

function getBokunPublicCredentials(trip: TripForMatching) {
  const integration = trip.operator.integrations.find(
    (item) => item.platform === "BOKUN" && item.encryptedCredentials,
  );

  if (!integration?.encryptedCredentials) {
    return undefined;
  }

  try {
    return decryptCredentials<BokunCredentials>(integration.encryptedCredentials);
  } catch (error) {
    console.warn("kai.match.bokun_public_credentials_failed", {
      operatorId: trip.operatorId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
    return undefined;
  }
}

function buildDestinationTerms(destination?: string) {
  if (!destination) {
    return [];
  }

  const normalized = destination.toLowerCase();
  const aliases: Record<string, string[]> = {
    komodo: ["komodo", "labuan bajo", "flores"],
    "raja ampat": ["raja ampat", "misool", "sorong"],
    bali: ["bali", "denpasar", "sanur"],
    "nusa penida": ["nusa penida", "penida"],
    "nusa lembongan": ["nusa lembongan", "lembongan"],
    lombok: ["lombok", "gili"],
  };

  return aliases[normalized] ?? [normalized];
}

function buildTripTypeTerms(tripType?: string) {
  if (!tripType) {
    return [];
  }

  const normalized = tripType.toLowerCase();
  const aliases: Record<string, string[]> = {
    sailing: ["sailing", "sail", "boat", "cruise", "yacht", "sunset tour"],
    "boat tour": ["boat tour", "boat", "cruise", "sunset tour"],
    "sunset tour": ["sunset tour", "sunset", "boat", "cruise"],
    diving: ["diving", "dive", "scuba"],
    liveaboard: ["liveaboard", "live aboard"],
    snorkelling: ["snorkelling", "snorkeling", "snorkel"],
    surf: ["surf", "surfing"],
  };

  return aliases[normalized] ?? [normalized];
}
