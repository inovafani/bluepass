import type { CertLevel } from "@prisma/client";
import type { BookingAdapterPlatform } from "@/lib/services/booking/adapters/types";

export type KaiChannel = "web" | "whatsapp";

export type KaiMessageRole = "user" | "assistant" | "system";

export type KaiSessionStatus = "open" | "handoff" | "closed";

export type KaiSlots = {
  destination?: string;
  dateWindow?: string;
  travellerCount?: number;
  certLevel?: CertLevel;
  budgetUsd?: number;
  activityType?: string;
};

export type KaiTravelIntent = {
  destination?: string;
  tripType?: string;
  dateWindow?: string;
  guests?: number;
  budget?: string;
  certificationLevel?: string;
  interests?: string[];
  conservationPreference?: string;
  unsupportedDestination?: string;
  missingSlots?: string[];
};

export type KaiMissingSlot = NonNullable<KaiTravelIntent["missingSlots"]>[number];

export type KaiSessionContext = {
  intent: KaiTravelIntent;
  lastAskedSlot?: KaiMissingSlot;
  missingSlots?: KaiMissingSlot[];
};

export type MatchResult = {
  tripId: string;
  operatorId: string;
  externalId?: string;
  operatorName?: string;
  title: string;
  description?: string;
  location?: string;
  imageUrl?: string;
  priceCents?: number;
  currency?: string;
  orderUrl?: string;
  score: number;
  reason: string;
  pmsPlatform?: BookingAdapterPlatform;
};

export type KaiBookingContext = {
  slots?: KaiSlots;
  bookingId?: string;
  tripId?: string;
  operatorId?: string;
  metadata?: Record<string, unknown>;
};

export type KaiConversationMessage = {
  id?: string;
  sessionId: string;
  channel: KaiChannel;
  role: KaiMessageRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt?: Date;
};

export type KaiConversationInput = {
  channel: KaiChannel;
  sessionId?: string;
  externalUserId?: string;
  travellerPhone?: string;
  message: string;
  recentMessages?: Array<Pick<KaiConversationMessage, "role" | "content">>;
  bookingContext?: KaiBookingContext;
};

export type KaiConversationResult = {
  sessionId: string;
  reply: string;
  intent: KaiTravelIntent;
  matches?: MatchResult[];
  planner?: KaiConversationPlan;
  messages: KaiConversationMessage[];
};

export type KaiConversationStage = "discovery" | "qualification" | "ready_to_match";

export type KaiConversationPlan = {
  knownSlots: string[];
  missingSlots: string[];
  nextSlotToAsk?: string;
  conversationStage: KaiConversationStage;
  instructionForReply: string;
};
