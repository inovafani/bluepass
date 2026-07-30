import { NextResponse } from "next/server";
import { buildBluePassCatalogSnapshot } from "@/lib/services/kai-core/client";

// Distinct regions currently live in the catalog (static yachts + live operator listings) - the
// same source of truth Kai's own reply engine uses. Lets the widget's greeting reflect whatever
// regions actually have inventory today, instead of a hardcoded destination list that goes stale
// every time a new region/operator is added.
export async function GET() {
  try {
    const snapshot = await buildBluePassCatalogSnapshot();
    const regions = Array.from(new Set(snapshot.map((item) => item.region).filter((region): region is string => Boolean(region))));

    return NextResponse.json({ regions });
  } catch (error) {
    console.warn("kai.regions_failed", {
      errorName: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unable to fetch catalog regions",
    });

    return NextResponse.json({ regions: [] });
  }
}
