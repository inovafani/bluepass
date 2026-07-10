import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildOperatorOutreachPaginationItems,
  loadOperatorOutreachList,
  operatorOutreachFilterOptions,
} from "@/lib/services/operators/operator-outreach-list";

const prismaMocks = vi.hoisted(() => ({
  operatorLead: {
    count: vi.fn(),
    groupBy: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorLead.count.mockReset();
  prismaMocks.operatorLead.groupBy.mockReset();
  prismaMocks.operatorLead.findMany.mockReset();
});

describe("operator outreach list", () => {
  it("loads approved/live leads with canonical BluePass claim links", async () => {
    prismaMocks.operatorLead.groupBy.mockResolvedValue([
      { status: "IMPORTED", _count: { _all: 500 } },
      { status: "APPROVED", _count: { _all: 12 } },
      { status: "LIVE", _count: { _all: 2 } },
    ]);
    prismaMocks.operatorLead.count.mockResolvedValue(14);
    prismaMocks.operatorLead.findMany.mockResolvedValue([
      {
        id: "lead_1",
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
        category: "Liveaboard",
        region: "Indonesia-Wide",
        email: "info@dewi-nusantara.com",
        phone: null,
        status: "APPROVED",
        lastOutreachAt: new Date("2026-07-10T01:00:00.000Z"),
        updatedAt: new Date("2026-07-10T02:00:00.000Z"),
      },
    ]);

    await expect(
      loadOperatorOutreachList({
        filter: "approved",
        q: "dewi",
        page: "2",
        pageSize: 20,
        baseUrl: "https://bluepass.co",
      }),
    ).resolves.toMatchObject({
      activeFilter: "approved",
      search: "dewi",
      page: 2,
      pageSize: 20,
      totalPages: 1,
      filteredTotal: 14,
      totals: {
        all: 514,
        needsOutreach: 500,
        pendingClaim: 0,
        approved: 14,
        declined: 0,
      },
      leads: [
        {
          slug: "dewi-nusantara",
          name: "Dewi Nusantara",
          status: "APPROVED",
          claimUrl: "https://bluepass.co/operator/claim/start/dewi-nusantara",
          publicUrl: "https://bluepass.co/operators/dewi-nusantara",
        },
      ],
    });

    expect(prismaMocks.operatorLead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 20,
        take: 20,
        where: expect.objectContaining({
          status: { in: ["APPROVED", "LIVE"] },
          OR: expect.any(Array),
        }),
      }),
    );
  });

  it("defines the dashboard filter menu Tony needs for outreach tracking", () => {
    expect(operatorOutreachFilterOptions.map((option) => option.key)).toEqual([
      "all",
      "needs_outreach",
      "pending_claim",
      "approved",
      "declined",
    ]);
  });

  it("normalizes invalid page input and keeps pagination metadata stable", async () => {
    prismaMocks.operatorLead.groupBy.mockResolvedValue([
      { status: "IMPORTED", _count: { _all: 41 } },
    ]);
    prismaMocks.operatorLead.count.mockResolvedValue(41);
    prismaMocks.operatorLead.findMany.mockResolvedValue([]);

    await expect(
      loadOperatorOutreachList({
        filter: "needs_outreach",
        page: "-10",
      }),
    ).resolves.toMatchObject({
      activeFilter: "needs_outreach",
      page: 1,
      pageSize: 20,
      totalPages: 3,
      filteredTotal: 41,
    });

    expect(prismaMocks.operatorLead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      }),
    );
  });

  it("allows export callers to request all rows with a larger page size", async () => {
    prismaMocks.operatorLead.groupBy.mockResolvedValue([
      { status: "IMPORTED", _count: { _all: 524 } },
    ]);
    prismaMocks.operatorLead.count.mockResolvedValue(524);
    prismaMocks.operatorLead.findMany.mockResolvedValue([]);

    await loadOperatorOutreachList({
      filter: "all",
      pageSize: 1000,
    });

    expect(prismaMocks.operatorLead.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 1000,
      }),
    );
  });

  it("builds compact numbered pagination for long outreach lists", () => {
    expect(buildOperatorOutreachPaginationItems(1, 27)).toEqual([
      1,
      2,
      3,
      4,
      "ellipsis",
      27,
    ]);
    expect(buildOperatorOutreachPaginationItems(14, 27)).toEqual([
      1,
      "ellipsis",
      12,
      13,
      14,
      15,
      16,
      "ellipsis",
      27,
    ]);
  });
});
