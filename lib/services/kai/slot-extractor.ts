import type { KaiMissingSlot, KaiTravelIntent } from "@/lib/services/kai/types";

const destinationPatterns = [
  { destination: "Komodo", patterns: ["komodo islands", "komodo", "labuan bajo"] },
  { destination: "Raja Ampat", patterns: ["raja ampat", "r4", "raja"] },
  { destination: "Misool", patterns: ["misool"] },
  { destination: "Bali", patterns: ["bali"] },
  { destination: "Nusa Penida", patterns: ["nusa penida", "penida"] },
  { destination: "Nusa Lembongan", patterns: ["nusa lembongan", "lembongan"] },
  { destination: "Lombok", patterns: ["lombok"] },
  { destination: "Gili Islands", patterns: ["gili islands", "gilis", "gili t", "gili"] },
  { destination: "Alor", patterns: ["alor"] },
  { destination: "Wakatobi", patterns: ["wakatobi national park", "wakatobi"] },
  { destination: "Banda Sea", patterns: ["banda sea", "banda"] },
  { destination: "Ambon", patterns: ["ambon"] },
  { destination: "Derawan", patterns: ["derawan"] },
  { destination: "Bunaken", patterns: ["bunaken"] },
  { destination: "Lembeh", patterns: ["lembeh"] },
  { destination: "Flores", patterns: ["flores"] },
  { destination: "Sumba", patterns: ["sumba"] },
  { destination: "Mentawai", patterns: ["mentawai"] },
  { destination: "Cenderawasih Bay", patterns: ["cenderawasih bay", "cenderawasih"] },
] as const;

const unsupportedDestinations = [
  "maldives",
  "philippines",
  "fiji",
  "great barrier reef",
  "thailand",
  "palau",
  "egypt",
] as const;

const tripTypes = [
  "liveaboard",
  "diving",
  "sailing",
  "eco resort",
  "snorkelling",
  "freediving",
  "surf",
  "whale watching",
  "yacht charter",
  "conservation trip",
] as const;

const tripTypeAliases = [
  { tripType: "snorkelling", patterns: ["snorkeling", "snorkelling", "snorkel"] },
  { tripType: "diving", patterns: ["scuba", "dive", "diving"] },
  { tripType: "freediving", patterns: ["freedive", "freediving"] },
  { tripType: "surf", patterns: ["surf", "surfing"] },
] as const;

const interests = [
  { interest: "mantas", patterns: ["manta", "mantas"] },
  { interest: "sharks", patterns: ["shark", "sharks"] },
  { interest: "turtles", patterns: ["turtle", "turtles"] },
  { interest: "coral reefs", patterns: ["coral reef", "coral reefs", "reef", "reefs"] },
  { interest: "muck diving", patterns: ["muck diving", "muck"] },
  { interest: "macro", patterns: ["macro"] },
  { interest: "underwater photography", patterns: ["underwater photography", "photography", "photo"] },
  { interest: "conservation", patterns: ["conservation"] },
  { interest: "remote islands", patterns: ["remote islands", "remote"] },
  { interest: "luxury", patterns: ["luxury", "luxurious"] },
  { interest: "budget", patterns: ["budget", "affordable"] },
  { interest: "family-friendly", patterns: ["family-friendly", "family friendly", "family"] },
  { interest: "beginner-friendly", patterns: ["beginner-friendly", "beginner friendly", "beginners"] },
  { interest: "adventure", patterns: ["adventure"] },
  { interest: "wellness", patterns: ["wellness"] },
] as const;

const certificationPatterns = [
  { certificationLevel: "advanced open water", patterns: ["advanced open water", "aow", "advanced divers"] },
  { certificationLevel: "open water", patterns: ["open water", "ow"] },
  { certificationLevel: "rescue", patterns: ["rescue"] },
  { certificationLevel: "divemaster", patterns: ["divemaster", "dive master"] },
  { certificationLevel: "instructor", patterns: ["instructor"] },
  { certificationLevel: "non-diver", patterns: ["non-diver", "non diver", "nondiver"] },
  { certificationLevel: "beginner", patterns: ["beginner", "beginners"] },
] as const;

const monthAliases = [
  { value: "January", patterns: ["january", "jan"] },
  { value: "February", patterns: ["february", "feb"] },
  { value: "March", patterns: ["march", "mar"] },
  { value: "April", patterns: ["april", "apr"] },
  { value: "May", patterns: ["may"] },
  { value: "June", patterns: ["june", "jun"] },
  { value: "July", patterns: ["july", "jul"] },
  { value: "August", patterns: ["august", "aug"] },
  { value: "September", patterns: ["september", "sep", "sept"] },
  { value: "October", patterns: ["october", "oct"] },
  { value: "November", patterns: ["november", "nov"] },
  { value: "December", patterns: ["december", "dec"] },
] as const;

const numberWords = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
} as const;

export function extractKaiTravelIntent(
  message: string,
  previousIntent: KaiTravelIntent = {},
  options: { lastAskedSlot?: KaiMissingSlot } = {},
): KaiTravelIntent {
  const normalized = normalize(message);
  const nextIntent: KaiTravelIntent = {
    ...previousIntent,
    interests: previousIntent.interests ? [...previousIntent.interests] : undefined,
  };

  const unsupportedDestination = findFirstPattern(normalized, unsupportedDestinations);

  if (unsupportedDestination) {
    nextIntent.unsupportedDestination = titleCase(unsupportedDestination);
  } else {
    const destination = findDestination(normalized);

    if (destination) {
      nextIntent.destination = destination;
      delete nextIntent.unsupportedDestination;
    }
  }

  const tripType = findTripType(normalized);

  if (tripType) {
    nextIntent.tripType = tripType;
  }

  const dateWindow = findDateWindow(message, normalized, options.lastAskedSlot);

  if (dateWindow) {
    nextIntent.dateWindow = dateWindow;
  }

  const guests = findGuestCount(normalized, options.lastAskedSlot);

  if (guests) {
    nextIntent.guests = guests;
  }

  const budget = findBudget(message, normalized);

  if (budget) {
    nextIntent.budget = budget;
  }

  const certificationLevel = findCertification(normalized, options.lastAskedSlot);

  if (certificationLevel) {
    nextIntent.certificationLevel = certificationLevel;
  }

  const extractedInterests = findInterests(normalized);

  if (extractedInterests.length > 0) {
    nextIntent.interests = unique([...(nextIntent.interests ?? []), ...extractedInterests]);
  }

  if (containsAny(normalized, ["conservation", "reef restoration", "marine protection"])) {
    nextIntent.conservationPreference = "interested";
  }

  nextIntent.missingSlots = computeMissingSlots(nextIntent);

  return stripEmptyArrays(nextIntent);
}

function findDestination(text: string) {
  for (const item of destinationPatterns) {
    if (containsAny(text, item.patterns)) {
      return item.destination;
    }
  }

  return undefined;
}

function findTripType(text: string) {
  for (const item of tripTypes) {
    if (containsPhrase(text, item)) {
      return item;
    }
  }

  for (const alias of tripTypeAliases) {
    if (containsAny(text, alias.patterns)) {
      return alias.tripType;
    }
  }

  return undefined;
}

function findDateWindow(original: string, normalized: string, lastAskedSlot?: KaiMissingSlot) {
  const rangeMatch = original.match(
    /\b\d{1,2}\s*[-–]\s*\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december)(?:\s+\d{4})?\b/i,
  );

  if (rangeMatch) {
    return rangeMatch[0].trim();
  }

  const monthYearMatch = original.match(
    /\b(?:in\s+)?(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}\b/i,
  );

  if (monthYearMatch) {
    return trimLeadingIn(monthYearMatch[0]);
  }

  const relativeMatch = original.match(
    /\b(next\s+(?:week|month|year)|this\s+(?:week|month|year)|tomorrow)\b/i,
  );

  if (relativeMatch) {
    return relativeMatch[1];
  }

  const month = monthAliases.find((candidate) => containsAny(normalized, candidate.patterns));

  if (month) {
    return month.value;
  }

  if (lastAskedSlot === "dateWindow") {
    const shortMonth = monthAliases.find((candidate) =>
      candidate.patterns.some((pattern) => normalized === pattern || normalized === `in ${pattern}`),
    );

    if (shortMonth) {
      return shortMonth.value;
    }
  }

  return undefined;
}

function findGuestCount(text: string, lastAskedSlot?: KaiMissingSlot) {
  const numericMatch = text.match(/\b(\d{1,2})\s*(?:people|person|guests?|travellers?|travelers?|divers?)\b/);

  if (numericMatch) {
    return Number(numericMatch[1]);
  }

  const forNumericMatch = text.match(/\bfor\s+(\d{1,2})\b/);

  if (forNumericMatch) {
    return Number(forNumericMatch[1]);
  }

  const forWordMatch = text.match(
    /\bfor\s+(one|two|three|four|five|six|seven|eight|nine|ten)\b/,
  );

  if (forWordMatch) {
    return numberWords[forWordMatch[1] as keyof typeof numberWords];
  }

  const weAreNumericMatch = text.match(/\b(?:we are|there are)\s+(\d{1,2})(?:\s+of us)?\b/);

  if (weAreNumericMatch) {
    return Number(weAreNumericMatch[1]);
  }

  const weAreWordMatch = text.match(
    /\b(?:we are|there are)\s+(one|two|three|four|five|six|seven|eight|nine|ten)(?:\s+of us)?\b/,
  );

  if (weAreWordMatch) {
    return numberWords[weAreWordMatch[1] as keyof typeof numberWords];
  }

  if (lastAskedSlot === "guests") {
    const bareNumericMatch = text.match(/^\d{1,2}$/);

    if (bareNumericMatch) {
      return Number(bareNumericMatch[0]);
    }

    if (text in numberWords) {
      return numberWords[text as keyof typeof numberWords];
    }
  }

  return undefined;
}

function findBudget(original: string, normalized: string) {
  const moneyMatch = original.match(/\b(?:usd\s*)?\$?\s?(\d{1,3}(?:,\d{3})+|\d{3,6})(?:\s*(?:usd|dollars?))?\b/i);

  if (moneyMatch && (original.includes("$") || /\busd\b/i.test(original))) {
    return moneyMatch[0].trim();
  }

  if (containsPhrase(normalized, "luxury")) {
    return "luxury";
  }

  if (containsPhrase(normalized, "budget")) {
    return "budget";
  }

  return undefined;
}

function findCertification(text: string, lastAskedSlot?: KaiMissingSlot) {
  if (lastAskedSlot === "certificationLevel" && containsPhrase(text, "advanced")) {
    return "advanced open water";
  }

  for (const item of certificationPatterns) {
    if (containsAny(text, item.patterns)) {
      return item.certificationLevel;
    }
  }

  return undefined;
}

function findInterests(text: string) {
  return interests
    .filter((item) => containsAny(text, item.patterns))
    .map((item) => item.interest);
}

function computeMissingSlots(intent: KaiTravelIntent) {
  const missingSlots: string[] = [];

  if (intent.unsupportedDestination) {
    return missingSlots;
  }

  if (!intent.destination) {
    missingSlots.push("destination");
  }

  if (!intent.tripType) {
    missingSlots.push("tripType");
  }

  if (!intent.guests) {
    missingSlots.push("guests");
  }

  if (!intent.dateWindow) {
    missingSlots.push("dateWindow");
  }

  if (requiresCertification(intent.tripType) && !intent.certificationLevel) {
    missingSlots.push("certificationLevel");
  }

  if (!intent.budget) {
    missingSlots.push("budget");
  }

  return missingSlots;
}

function requiresCertification(tripType?: string) {
  return tripType === "diving" || tripType === "liveaboard";
}

function findFirstPattern(text: string, patterns: readonly string[]) {
  return patterns.find((pattern) => containsPhrase(text, pattern));
}

function containsAny(text: string, patterns: readonly string[]) {
  return patterns.some((pattern) => containsPhrase(text, pattern));
}

function containsPhrase(text: string, phrase: string) {
  return new RegExp(`(^|\\W)${escapeRegExp(phrase)}($|\\W)`, "i").test(text);
}

function normalize(value: string) {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function trimLeadingIn(value: string) {
  return value.replace(/^in\s+/i, "").trim();
}

function titleCase(value: string) {
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function unique(values: string[]) {
  return Array.from(new Set(values));
}

function stripEmptyArrays(intent: KaiTravelIntent) {
  if (intent.interests?.length === 0) {
    delete intent.interests;
  }

  return intent;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
