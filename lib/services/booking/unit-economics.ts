import {
  COMMISSION_CAP_USD,
  COMMISSION_PCT,
  CONSERVATION_PCT,
  CREATOR_SHARE_PCT,
  STRIPE_FIXED_FEE_USD,
  STRIPE_PERCENT_FEE,
} from "@/lib/constants/economics";

export type BookingSplit = {
  total: number;
  operatorNet: number;
  commission: number;
  creatorShare: number;
  bluepassNet: number;
  conservation: number;
  capApplied: boolean;
  stripeEstimatedFee: number;
};

const roundCurrency = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function splitBooking(totalUsd: number, creatorAttributed = false): BookingSplit {
  if (!Number.isFinite(totalUsd) || totalUsd < 0) {
    throw new Error("Booking total must be a non-negative finite number.");
  }

  const conservation = totalUsd * CONSERVATION_PCT;
  const uncappedCommission = totalUsd * COMMISSION_PCT;
  const commission = Math.min(uncappedCommission, COMMISSION_CAP_USD);
  const creatorShare = creatorAttributed ? commission * CREATOR_SHARE_PCT : 0;
  const bluepassNet = commission - creatorShare;
  const operatorNet = totalUsd - commission - conservation;
  const stripeEstimatedFee = totalUsd * STRIPE_PERCENT_FEE + STRIPE_FIXED_FEE_USD;

  return {
    total: roundCurrency(totalUsd),
    operatorNet: roundCurrency(operatorNet),
    commission: roundCurrency(commission),
    creatorShare: roundCurrency(creatorShare),
    bluepassNet: roundCurrency(bluepassNet),
    conservation: roundCurrency(conservation),
    capApplied: uncappedCommission > COMMISSION_CAP_USD,
    stripeEstimatedFee: roundCurrency(stripeEstimatedFee),
  };
}
