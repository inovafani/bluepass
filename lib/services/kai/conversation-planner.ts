import type {
  KaiChannel,
  KaiConversationPlan,
  KaiMissingSlot,
  KaiTravelIntent,
} from "@/lib/services/kai/types";

type PlanKaiConversationInput = {
  intent: KaiTravelIntent;
  previousIntent?: KaiTravelIntent;
  lastAskedSlot?: KaiMissingSlot;
  latestUserMessage: string;
  channel: KaiChannel;
};

const requiredSlots = ["destination", "tripType", "guests", "dateWindow"] as const;
const optionalUsefulSlots = ["budget", "interests"] as const;

export function planKaiConversation(input: PlanKaiConversationInput): KaiConversationPlan {
  const knownSlots = buildKnownSlots(input.intent);
  const missingSlots = buildMissingSlots(input.intent);
  const nextSlotToAsk = chooseNextSlot(missingSlots);
  const conversationStage = chooseStage(missingSlots);
  const instructionForReply = buildInstruction(input.intent, missingSlots);

  return {
    knownSlots,
    missingSlots,
    nextSlotToAsk,
    conversationStage,
    instructionForReply,
  };
}

function buildKnownSlots(intent: KaiTravelIntent) {
  const knownSlots: string[] = [];

  for (const slot of [...requiredSlots, "certificationLevel", ...optionalUsefulSlots]) {
    const value = intent[slot as keyof KaiTravelIntent];

    if (Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null) {
      knownSlots.push(slot);
    }
  }

  return knownSlots;
}

function buildMissingSlots(intent: KaiTravelIntent) {
  if (intent.unsupportedDestination) {
    return [];
  }

  const missingSlots: string[] = [];

  for (const slot of requiredSlots) {
    if (!intent[slot]) {
      missingSlots.push(slot);
    }
  }

  if (requiresCertification(intent.tripType) && !intent.certificationLevel) {
    missingSlots.push("certificationLevel");
  }

  return missingSlots;
}

function chooseNextSlot(missingSlots: string[]) {
  return missingSlots[0];
}

function chooseStage(missingSlots: string[]) {
  if (missingSlots.length === 0) {
    return "ready_to_match";
  }

  return missingSlots.some((slot) => slot === "destination" || slot === "tripType")
    ? "discovery"
    : "qualification";
}

function buildInstruction(
  intent: KaiTravelIntent,
  missingSlots: string[],
) {
  if (intent.unsupportedDestination) {
    return "Explain BluePass is currently focused on Indonesia and ask whether the traveller is open to an Indonesia-based marine trip.";
  }

  const knownSlots = buildKnownSlots(intent);
  const knownInstruction =
    knownSlots.length > 0
      ? `Do not ask again for known slots: ${knownSlots.join(", ")}.`
      : "No required travel slots are known yet.";

  if (missingSlots.length === 0) {
    return `${knownInstruction} Say Kai can start matching suitable Indonesia trips, but do not claim live availability, exact prices, or confirmed booking.`;
  }

  const slotsToAsk = chooseSlotsToAsk(missingSlots);
  const askInstruction = `Ask only for: ${slotsToAsk.join(", ")}.`;

  return `${knownInstruction} ${askInstruction} Ask at most one or two concise follow-up questions.`;
}

function chooseSlotsToAsk(missingSlots: string[]) {
  if (missingSlots.includes("dateWindow") && missingSlots.includes("certificationLevel")) {
    return ["dateWindow", "certificationLevel"];
  }

  return missingSlots.slice(0, 2);
}

function requiresCertification(tripType?: string) {
  return tripType === "diving" || tripType === "liveaboard";
}
