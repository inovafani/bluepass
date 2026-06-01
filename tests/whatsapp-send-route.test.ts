import type { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/whatsapp/send/route";
import { sendTemplateMessage } from "@/lib/services/whatsapp/client";

vi.mock("@/lib/services/whatsapp/client", () => ({
  sendTemplateMessage: vi.fn(),
}));

const originalInternalServiceToken = process.env.INTERNAL_SERVICE_TOKEN;

afterEach(() => {
  if (originalInternalServiceToken === undefined) {
    delete process.env.INTERNAL_SERVICE_TOKEN;
  } else {
    process.env.INTERNAL_SERVICE_TOKEN = originalInternalServiceToken;
  }

  vi.mocked(sendTemplateMessage).mockReset();
});

function buildRequest(body: unknown): NextRequest {
  return new Request("http://localhost:3000/api/whatsapp/send", {
    method: "POST",
    headers: {
      Authorization: "Bearer test-service-token",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }) as NextRequest;
}

describe("POST /api/whatsapp/send", () => {
  it("allows the production Bluepass utility test template without components", async () => {
    process.env.INTERNAL_SERVICE_TOKEN = "test-service-token";

    const response = await POST(
      buildRequest({
        to: "+62 821-3143-342",
        role: "kai",
        templateName: "bluepass_test_message",
      }),
    );

    await expect(response.json()).resolves.toEqual({ queued: true });
    expect(response.status).toBe(200);
    expect(sendTemplateMessage).toHaveBeenCalledWith({
      to: "+62 821-3143-342",
      role: "kai",
      name: "bluepass_test_message",
      languageCode: "en_US",
    });
  });
});
