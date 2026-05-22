import type { MatchResult } from "./types";

export type KaiQuoteDraft = {
  match: MatchResult;
  quoteText: string;
};

export function draftKaiQuote(match: MatchResult): KaiQuoteDraft {
  return {
    match,
    quoteText: `${match.title} is ready for operator review.`,
  };
}
