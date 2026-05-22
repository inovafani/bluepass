import type { KaiSlots, MatchResult } from "./types";

export async function matchTripsForKai(_slots: KaiSlots): Promise<MatchResult[]> {
  void _slots;

  return [];
}

export function limitMatchResults(results: MatchResult[]): MatchResult[] {
  return results
    .slice()
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);
}
