import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/operator-claims/route";
import { getCurrentTraveller } from "@/lib/services/auth/session";
import { createOperatorClaimForAccount } from "@/lib/services/operators/operator-claim-service";

vi.mock("@/lib/services/auth/session", () => ({
  getCurrentTraveller: vi.fn(),
}));

vi.mock("@/lib/services/operators/operator-claim-service", () => ({
  operatorClaimSchema: {
    safeParse: vi.fn((value) => ({ success: true, data: value })),
  },
  createOperatorClaimForAccount: vi.fn(),
}));

afterEach(() => {
  vi.mocked(getCurrentTraveller).mockReset();
  vi.mocked(createOperatorClaimForAccount).mockReset();
});

describe("operator claim route", () => {
  it("rejects signed-out claim submissions", async () => {
    vi.mocked(getCurrentTraveller).mockResolvedValue(undefined);

    const response = await POST(buildRequest({ operatorSlug: "scuba-republic" }));

    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Please create or sign in to your BluePass account first.",
    });
    expect(createOperatorClaimForAccount).not.toHaveBeenCalled();
  });

  it("creates a claim for the signed-in account", async () => {
    vi.mocked(getCurrentTraveller).mockResolvedValue({
      accountId: "acct_123",
      id: "account_traveller_123",
      email: "owner@scuba-republic.com",
      name: "Sri",
      phone: "+628123",
      roles: ["OPERATOR"],
    });
    vi.mocked(createOperatorClaimForAccount).mockResolvedValue({
      id: "claim_123",
      operatorSlug: "scuba-republic",
      status: "PENDING_REVIEW",
    } as Awaited<ReturnType<typeof createOperatorClaimForAccount>>);

    const response = await POST(
      buildRequest({
        operatorSlug: "scuba-republic",
        claimantName: "Sri",
        claimantEmail: "owner@scuba-republic.com",
        authorized: true,
      }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      claim: {
        id: "claim_123",
        operatorSlug: "scuba-republic",
        status: "PENDING_REVIEW",
      },
    });
    expect(createOperatorClaimForAccount).toHaveBeenCalledWith(
      expect.objectContaining({
        accountId: "acct_123",
        operatorSlug: "scuba-republic",
        claimantEmail: "owner@scuba-republic.com",
      }),
    );
  });
});

function buildRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/operator-claims", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}
