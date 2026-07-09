import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/kai/partner-directory/route";
import { listApprovedPartnerDirectory } from "@/lib/services/partners/partner-directory";

vi.mock("@/lib/services/partners/partner-directory", () => ({
  listApprovedPartnerDirectory: vi.fn(),
}));

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.mocked(listApprovedPartnerDirectory).mockReset();
});

describe("Kai partner directory route", () => {
  it("rejects requests without the bridge token", async () => {
    process.env.KAI_CORE_ADMIN_TOKEN = "bridge_secret";

    const response = await GET(buildRequest());

    expect(response.status).toBe(401);
    expect(listApprovedPartnerDirectory).not.toHaveBeenCalled();
  });

  it("returns the partner directory for Kai Core", async () => {
    process.env.KAI_CORE_ADMIN_TOKEN = "bridge_secret";
    vi.mocked(listApprovedPartnerDirectory).mockResolvedValue([
      {
        partnerId: "partner_1",
        partnerName: "Reef Voice Studio",
        partnerRole: "CREATOR",
        handle: "reefvoice",
        whatsappPhone: "+6282222222222",
        status: "APPROVED",
        source: "creator_profile",
      },
    ]);

    const response = await GET(buildRequest("bridge_secret"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      partners: [
        {
          partnerId: "partner_1",
          partnerName: "Reef Voice Studio",
          partnerRole: "CREATOR",
          handle: "reefvoice",
          whatsappPhone: "+6282222222222",
          status: "APPROVED",
          source: "creator_profile",
        },
      ],
    });
  });
});

function buildRequest(token?: string) {
  return new NextRequest("http://localhost/api/kai/partner-directory", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
