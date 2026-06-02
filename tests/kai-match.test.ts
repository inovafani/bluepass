import { describe, expect, it, vi, afterEach } from "vitest";
import { encryptCredentials } from "@/lib/services/booking/adapters/credentials";
import { limitMatchResults, matchTripsForKai } from "@/lib/services/kai/match";

const prismaMocks = vi.hoisted(() => ({
  tripFindMany: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    trip: {
      findMany: prismaMocks.tripFindMany,
    },
  },
}));

afterEach(() => {
  prismaMocks.tripFindMany.mockReset();
});

describe("matchTripsForKai", () => {
  it("returns top synced Bokun trip matches for a completed Kai intent", async () => {
    prismaMocks.tripFindMany.mockResolvedValue([
      {
        id: "trip_1",
        operatorId: "operator_1",
        externalId: "raja_1",
        title: "Raja Ampat Sailing Expedition",
        description: "Private sailing route with reefs and remote islands.",
        location: "Raja Ampat",
        priceCents: 120000,
        currency: "USD",
        operator: {
          name: "Raja Blue",
          integrations: [{ platform: "BOKUN" }],
        },
      },
      {
        id: "trip_2",
        operatorId: "operator_2",
        externalId: "komodo_1",
        title: "Komodo Day Trip",
        description: "Speedboat day trip.",
        location: "Komodo",
        priceCents: 25000,
        currency: "USD",
        operator: {
          name: "Komodo Boats",
          integrations: [{ platform: "BOKUN" }],
        },
      },
    ]);

    const results = await matchTripsForKai({
      destination: "Raja Ampat",
      tripType: "sailing",
      guests: 3,
      dateWindow: "October",
    });

    expect(prismaMocks.tripFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          operator: expect.objectContaining({
            integrations: expect.objectContaining({
              some: { platform: "BOKUN" },
            }),
          }),
        }),
      }),
    );
    expect(results[0]).toEqual(
      expect.objectContaining({
        tripId: "trip_1",
        operatorName: "Raja Blue",
        title: "Raja Ampat Sailing Expedition",
        priceCents: 120000,
        currency: "USD",
        pmsPlatform: "bokun",
      }),
    );
  });

  it("matches Komodo intent against Labuan Bajo Bokun product aliases", async () => {
    prismaMocks.tripFindMany.mockResolvedValue([
      {
        id: "trip_labuan_bajo_sunset",
        operatorId: "operator_lucid_tours",
        externalId: "1222945",
        title: "Labuan Bajo Sunset Tour",
        description: null,
        location: "Asia/Jakarta",
        priceCents: 0,
        currency: "USD",
        operator: {
          name: "Lucid Tours",
          integrations: [
            {
              platform: "BOKUN",
              encryptedCredentials: encryptCredentials({
                publicProductUrlTemplate: "https://lucid-tours.bokun.io/book/{productId}",
              }),
            },
          ],
        },
      },
    ]);

    const results = await matchTripsForKai({
      destination: "Komodo",
      tripType: "sunset tour",
      guests: 2,
      dateWindow: "20th June",
    });

    expect(results[0]).toEqual(
      expect.objectContaining({
        tripId: "trip_labuan_bajo_sunset",
        externalId: "1222945",
        operatorName: "Lucid Tours",
        title: "Labuan Bajo Sunset Tour",
        orderUrl: "https://lucid-tours.bokun.io/book/1222945",
        reason: expect.stringContaining("matches Komodo"),
      }),
    );
  });

  it("does not query trips until required intent is complete", async () => {
    await expect(
      matchTripsForKai({
        destination: "Raja Ampat",
        tripType: "sailing",
      }),
    ).resolves.toEqual([]);

    expect(prismaMocks.tripFindMany).not.toHaveBeenCalled();
  });

  it("limits results to the three highest scores", () => {
    expect(
      limitMatchResults([
        { tripId: "1", operatorId: "op", title: "One", score: 1, reason: "low" },
        { tripId: "2", operatorId: "op", title: "Two", score: 50, reason: "high" },
        { tripId: "3", operatorId: "op", title: "Three", score: 20, reason: "mid" },
        { tripId: "4", operatorId: "op", title: "Four", score: 10, reason: "mid" },
      ]).map((match) => match.tripId),
    ).toEqual(["2", "3", "4"]);
  });
});
