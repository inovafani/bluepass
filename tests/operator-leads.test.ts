import { afterEach, describe, expect, it, vi } from "vitest";
import {
  findOperatorLeadBySlug,
  parseOperatorLeadCsv,
  upsertOperatorLeads,
} from "@/lib/services/operators/operator-leads";

const prismaMocks = vi.hoisted(() => ({
  operatorLead: {
    findUnique: vi.fn(),
    upsert: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorLead.findUnique.mockReset();
  prismaMocks.operatorLead.upsert.mockReset();
});

describe("operator leads", () => {
  it("parses Tony's outreach CSV into normalized lead rows", () => {
    const csv = [
      "slug,name,category,region,email,phone,claim_url",
      "dewi-nusantara,Dewi Nusantara,Liveaboard,Indonesia-Wide,info@dewi-nusantara.com,,https://bluepass.co/operator/claim/start/dewi-nusantara",
      'explorer-ventures-indonesia,"Explorer Ventures (Indonesia)",Liveaboard,Indonesia-Wide,info@explorerventures.com,+1 307 235 0683,https://bluepass.co/operator/claim/start/explorer-ventures-indonesia',
    ].join("\n");

    expect(parseOperatorLeadCsv(csv)).toEqual([
      {
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
        category: "Liveaboard",
        region: "Indonesia-Wide",
        email: "info@dewi-nusantara.com",
        phone: undefined,
        claimUrl: "https://bluepass.co/operator/claim/start/dewi-nusantara",
      },
      {
        slug: "explorer-ventures-indonesia",
        name: "Explorer Ventures (Indonesia)",
        category: "Liveaboard",
        region: "Indonesia-Wide",
        email: "info@explorerventures.com",
        phone: "+1 307 235 0683",
        claimUrl:
          "https://bluepass.co/operator/claim/start/explorer-ventures-indonesia",
      },
    ]);
  });

  it("upserts leads without resetting existing statuses", async () => {
    prismaMocks.operatorLead.upsert.mockResolvedValue({ id: "lead_1" });

    await expect(
      upsertOperatorLeads([
        {
          slug: "dewi-nusantara",
          name: "Dewi Nusantara",
          category: "Liveaboard",
          region: "Indonesia-Wide",
          email: "info@dewi-nusantara.com",
          phone: undefined,
          claimUrl: "https://bluepass.co/operator/claim/start/dewi-nusantara",
        },
      ]),
    ).resolves.toEqual({ imported: 1 });

    expect(prismaMocks.operatorLead.upsert).toHaveBeenCalledWith({
      where: { slug: "dewi-nusantara" },
      create: expect.objectContaining({
        slug: "dewi-nusantara",
        name: "Dewi Nusantara",
        status: "IMPORTED",
        source: "csv",
      }),
      update: expect.objectContaining({
        name: "Dewi Nusantara",
        email: "info@dewi-nusantara.com",
      }),
    });
    expect(
      prismaMocks.operatorLead.upsert.mock.calls[0][0].update.status,
    ).toBeUndefined();
  });

  it("finds a lead by normalized slug", async () => {
    prismaMocks.operatorLead.findUnique.mockResolvedValue({
      slug: "dewi-nusantara",
      name: "Dewi Nusantara",
    });

    await expect(findOperatorLeadBySlug(" Dewi Nusantara ")).resolves.toEqual({
      slug: "dewi-nusantara",
      name: "Dewi Nusantara",
    });

    expect(prismaMocks.operatorLead.findUnique).toHaveBeenCalledWith({
      where: { slug: "dewi-nusantara" },
    });
  });
});
