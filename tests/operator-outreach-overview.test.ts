import { afterEach, describe, expect, it, vi } from "vitest";
import { loadOperatorOutreachOverview } from "@/lib/services/operators/operator-outreach-overview";

const prismaMocks = vi.hoisted(() => ({
  operatorLead: {
    groupBy: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorLead.groupBy.mockReset();
  prismaMocks.operatorLead.findMany.mockReset();
});

describe("operator outreach overview", () => {
  it("summarizes lead counts by status and includes recent lead events", async () => {
    prismaMocks.operatorLead.groupBy.mockResolvedValue([
      { status: "IMPORTED", _count: { _all: 500 } },
      { status: "CLAIM_LINK_REQUESTED", _count: { _all: 12 } },
    ]);
    prismaMocks.operatorLead.findMany.mockResolvedValue([
      {
        id: "lead_1",
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
        email: "claims@dewi-nusantara.com",
        status: "CLAIM_LINK_REQUESTED",
        lastOutreachAt: new Date("2026-07-10T02:00:00.000Z"),
        outreachEvents: [
          {
            id: "event_1",
            type: "CLAIM_LINK_REQUESTED",
            message: "Claim link sent.",
            createdAt: new Date("2026-07-10T02:00:00.000Z"),
          },
        ],
      },
    ]);

    await expect(loadOperatorOutreachOverview()).resolves.toEqual({
      statusCounts: [
        { status: "IMPORTED", count: 500 },
        { status: "CLAIM_LINK_REQUESTED", count: 12 },
      ],
      total: 512,
      recentLeads: [
        expect.objectContaining({
          slug: "dewi-nusantara",
          name: "Dewi Nusantara",
          events: [
            expect.objectContaining({
              type: "CLAIM_LINK_REQUESTED",
            }),
          ],
        }),
      ],
    });
  });
});
