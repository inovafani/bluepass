import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/kai/operator-directory/route";
import { listApprovedOperatorDirectory } from "@/lib/services/operators/operator-directory";

vi.mock("@/lib/services/operators/operator-directory", () => ({
  listApprovedOperatorDirectory: vi.fn(),
}));

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.mocked(listApprovedOperatorDirectory).mockReset();
});

describe("Kai operator directory route", () => {
  it("rejects requests without the bridge token", async () => {
    process.env.KAI_CORE_ADMIN_TOKEN = "bridge_secret";

    const response = await GET(buildRequest());

    expect(response.status).toBe(401);
    expect(listApprovedOperatorDirectory).not.toHaveBeenCalled();
  });

  it("returns the operator directory for Kai Core", async () => {
    process.env.KAI_CORE_ADMIN_TOKEN = "bridge_secret";
    vi.mocked(listApprovedOperatorDirectory).mockResolvedValue([
      {
        operatorSlug: "calico-jack",
        operatorName: "Calico Jack",
        yachtSlugs: ["calico-jack"],
        whatsappPhone: "+6281111111111",
        status: "APPROVED",
        source: "operator_profile",
      },
    ]);

    const response = await GET(buildRequest("bridge_secret"));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({
      operators: [
        {
          operatorSlug: "calico-jack",
          operatorName: "Calico Jack",
          yachtSlugs: ["calico-jack"],
          whatsappPhone: "+6281111111111",
          status: "APPROVED",
          source: "operator_profile",
        },
      ],
    });
  });
});

function buildRequest(token?: string) {
  return new NextRequest("http://localhost/api/kai/operator-directory", {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
