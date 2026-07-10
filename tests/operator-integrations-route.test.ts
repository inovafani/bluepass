import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/operator-integrations/route";
import { getCurrentTraveller } from "@/lib/services/auth/session";
import { submitOperatorPmsReadiness } from "@/lib/services/operators/operator-pms-readiness";

const prismaMocks = vi.hoisted(() => ({
  operator: {
    findUnique: vi.fn(),
  },
  operatorIntegration: {
    upsert: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

vi.mock("@/lib/services/auth/session", () => ({
  getCurrentTraveller: vi.fn(),
}));

vi.mock("@/lib/services/operators/operator-pms-readiness", () => ({
  operatorPmsReadinessSchema: {
    safeParse: vi.fn((value) => ({ success: true, data: value })),
  },
  submitOperatorPmsReadiness: vi.fn(),
}));

vi.mock("@/lib/services/booking/adapters/credentials", () => ({
  encryptCredentials: vi.fn((value) => JSON.stringify(value)),
}));

vi.mock("@/lib/services/booking/adapters/bokun-sync", () => ({
  validateBokunCredentials: vi.fn(),
  syncBokunCatalog: vi.fn(),
}));

afterEach(() => {
  prismaMocks.operator.findUnique.mockReset();
  prismaMocks.operatorIntegration.upsert.mockReset();
  vi.mocked(getCurrentTraveller).mockReset();
  vi.mocked(submitOperatorPmsReadiness).mockReset();
});

describe("operator integrations route", () => {
  it("captures PMS readiness for a signed-in claimed operator without raw operator id", async () => {
    vi.mocked(getCurrentTraveller).mockResolvedValue({
      accountId: "acct_123",
      id: "traveller_123",
      email: "owner@calicojack.com",
      name: "Calico Jack",
      phone: "6285337210180",
      roles: ["OPERATOR"],
    });
    vi.mocked(submitOperatorPmsReadiness).mockResolvedValue({
      id: "pms_123",
      operatorProfileId: "profile_123",
      platform: "REZDY",
      status: "CREDENTIALS_SUBMITTED",
    } as Awaited<ReturnType<typeof submitOperatorPmsReadiness>>);

    const response = await POST(
      buildRequest({
        platform: "REZDY",
        contactEmail: "owner@calicojack.com",
        contactWhatsapp: "6285337210180",
        notes: "Rezdy account ready.",
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      readiness: {
        id: "pms_123",
        operatorProfileId: "profile_123",
        platform: "REZDY",
        status: "CREDENTIALS_SUBMITTED",
      },
      sync: null,
    });
    expect(submitOperatorPmsReadiness).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "acct_123",
        platform: "REZDY",
        contactEmail: "owner@calicojack.com",
      }),
    );
  });
});

function buildRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/operator-integrations", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}
