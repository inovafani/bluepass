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

export type MatchResult = {
  tripId: string;
  operatorId: string;
  title: string;
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
  bookingContext?: KaiBookingContext;
};

export type KaiConversationResult = {
  sessionId: string;
  reply: string;
  messages: KaiConversationMessage[];
};
