import type { CertLevel } from "@prisma/client";

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
};
