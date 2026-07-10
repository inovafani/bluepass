import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/operator-claim-tokens/route";
import { requestOperatorClaimToken } from "@/lib/services/operators/operator-claim-tokens";

vi.mock("@/lib/services/operators/operator-claim-tokens", () => ({
  requestOperatorClaimToken: vi.fn(),
}));

afterEach(() => {
  vi.mocked(requestOperatorClaimToken).mockReset();
});

describe("operator claim token route", () => {
  it("requests a claim email link for a public operator lead", async () => {
    vi.mocked(requestOperatorClaimToken).mockResolvedValue({
      ok: true,
      claimUrl:
        "http://localhost:3000/operator/claim/verify?token=development-token",
      expiresAt: new Date("2026-07-17T02:00:00.000Z"),
      delivery: {
        delivered: false,
        provider: "development",
        reason: "RESEND_API_KEY is not configured.",
      },
    });

    const response = await POST(
      buildRequest({ operatorSlug: "dewi-nusantara" }),
    );

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      ok: true,
      developmentClaimUrl:
        "http://localhost:3000/operator/claim/verify?token=development-token",
    });
    expect(requestOperatorClaimToken).toHaveBeenCalledWith(
      expect.objectContaining({
        operatorSlug: "dewi-nusantara",
        baseUrl: "http://localhost",
      }),
    );
  });

  it("returns manual review copy when a lead has no email", async () => {
    vi.mocked(requestOperatorClaimToken).mockResolvedValue({
      ok: false,
      reason: "missing_email",
    });

    const response = await POST(
      buildRequest({ operatorSlug: "no-email-operator" }),
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({
      ok: false,
      reason: "missing_email",
      message:
        "We do not have a verified business email for this listing yet. BluePass will review it manually.",
    });
  });
});

function buildRequest(body: Record<string, unknown>) {
  return new NextRequest("http://localhost/api/operator-claim-tokens", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
}
