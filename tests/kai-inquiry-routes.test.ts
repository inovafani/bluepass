import type { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { POST as CREATE_INQUIRY } from "@/app/api/kai/web-chat/inquiry/route";
import { POST as DISPATCH_INQUIRY } from "@/app/api/kai/web-chat/inquiry/dispatch/route";
import { createInquiryFromKaiSession } from "@/lib/services/booking/booking-inquiry-service";
import { dispatchInquiryToOperator } from "@/lib/services/operators/operator-dispatch-service";

vi.mock("@/lib/services/booking/booking-inquiry-service", () => ({
  createInquiryFromKaiSession: vi.fn(),
}));

vi.mock("@/lib/services/operators/operator-dispatch-service", () => ({
  dispatchInquiryToOperator: vi.fn(),
}));

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.mocked(createInquiryFromKaiSession).mockReset();
  vi.mocked(dispatchInquiryToOperator).mockReset();
});

function buildRequest(url: string, body: unknown, token = "test-service-token"): NextRequest {
  return new Request(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }) as NextRequest;
}

describe("POST /api/kai/web-chat/inquiry", () => {
  it("returns missingSlots when inquiry is not ready", async () => {
    vi.mocked(createInquiryFromKaiSession).mockResolvedValue({
      ok: false,
      missingSlots: ["dateWindow"],
    });

    const response = await CREATE_INQUIRY(
      buildRequest("http://localhost:3000/api/kai/web-chat/inquiry", {
        sessionId: "kai_missing_session",
        selectedYachtSlug: "aliikai",
        confirm: true,
      }),
    );

    await expect(response.json()).resolves.toEqual({
      ok: false,
      missingSlots: ["dateWindow"],
    });
    expect(response.status).toBe(200);
  });

  it("creates inquiry when ready", async () => {
    process.env.BLUEPASS_TEST_OPERATOR_PHONE = "628200000000";
    vi.mocked(createInquiryFromKaiSession).mockResolvedValue({
      ok: true,
      inquiry: {
        id: "inq_123",
        status: "READY_TO_DISPATCH",
        selectedYachtSlug: "aliikai",
      } as Awaited<ReturnType<typeof createInquiryFromKaiSession>> extends { inquiry: infer Inquiry }
        ? Inquiry
        : never,
      missingSlots: [],
      reusedExisting: false,
    });
    vi.mocked(dispatchInquiryToOperator).mockResolvedValue({
      ok: true,
      inquiryId: "inq_123",
      status: "OPERATOR_PENDING",
      providerMessageId: "wamid.operator",
      outboundMessageId: "wa_out_123",
    });

    const response = await CREATE_INQUIRY(
      buildRequest("http://localhost:3000/api/kai/web-chat/inquiry", {
        sessionId: "kai_ready_session",
        selectedYachtSlug: "aliikai",
        confirm: true,
      }),
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      dispatched: true,
      inquiryId: "inq_123",
      status: "OPERATOR_PENDING",
      selectedYachtSlug: "aliikai",
      providerMessageId: "wamid.operator",
      missingSlots: [],
    });
    expect(createInquiryFromKaiSession).toHaveBeenCalledWith({
      sessionId: "kai_ready_session",
      selectedYachtSlug: "aliikai",
    });
    expect(dispatchInquiryToOperator).toHaveBeenCalledWith({
      inquiryId: "inq_123",
      operatorPhone: "628200000000",
    });
  });

  it("rejects selectedYachtSlug values not found in yachts.ts", async () => {
    const response = await CREATE_INQUIRY(
      buildRequest("http://localhost:3000/api/kai/web-chat/inquiry", {
        sessionId: "kai_ready_session",
        selectedYachtSlug: "nope",
        confirm: true,
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      missingSlots: ["selectedYachtSlug"],
      error: "Selected yacht was not found in the BluePass preview catalog.",
    });
    expect(createInquiryFromKaiSession).not.toHaveBeenCalled();
  });
});

describe("POST /api/kai/web-chat/inquiry/dispatch", () => {
  it("requires INTERNAL_SERVICE_TOKEN", async () => {
    process.env.INTERNAL_SERVICE_TOKEN = "test-service-token";

    const response = await DISPATCH_INQUIRY(
      buildRequest(
        "http://localhost:3000/api/kai/web-chat/inquiry/dispatch",
        { inquiryId: "inq_123", operatorPhone: "628213143342" },
        "wrong-token",
      ),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized." });
  });

  it("dispatches with explicit operatorPhone", async () => {
    process.env.INTERNAL_SERVICE_TOKEN = "test-service-token";
    vi.mocked(dispatchInquiryToOperator).mockResolvedValue({
      ok: true,
      inquiryId: "inq_123",
      status: "OPERATOR_PENDING",
      providerMessageId: null,
      outboundMessageId: "wa_out_123",
    });

    const response = await DISPATCH_INQUIRY(
      buildRequest("http://localhost:3000/api/kai/web-chat/inquiry/dispatch", {
        inquiryId: "inq_123",
        operatorPhone: "628213143342",
      }),
    );

    await expect(response.json()).resolves.toEqual({
      ok: true,
      inquiryId: "inq_123",
      status: "OPERATOR_PENDING",
      providerMessageId: null,
    });
    expect(dispatchInquiryToOperator).toHaveBeenCalledWith({
      inquiryId: "inq_123",
      operatorPhone: "628213143342",
      operatorId: undefined,
    });
  });

  it("uses BLUEPASS_TEST_OPERATOR_PHONE when operatorPhone is missing", async () => {
    process.env.INTERNAL_SERVICE_TOKEN = "test-service-token";
    process.env.BLUEPASS_TEST_OPERATOR_PHONE = "628200000000";
    vi.mocked(dispatchInquiryToOperator).mockResolvedValue({
      ok: true,
      inquiryId: "inq_env",
      status: "OPERATOR_PENDING",
      providerMessageId: null,
      outboundMessageId: "wa_out_env",
    });

    const response = await DISPATCH_INQUIRY(
      buildRequest("http://localhost:3000/api/kai/web-chat/inquiry/dispatch", {
        inquiryId: "inq_env",
      }),
    );

    expect(response.status).toBe(200);
    expect(dispatchInquiryToOperator).toHaveBeenCalledWith({
      inquiryId: "inq_env",
      operatorPhone: "628200000000",
      operatorId: undefined,
    });
  });

  it("returns 400 when operatorPhone and BLUEPASS_TEST_OPERATOR_PHONE are missing", async () => {
    process.env.INTERNAL_SERVICE_TOKEN = "test-service-token";
    delete process.env.BLUEPASS_TEST_OPERATOR_PHONE;

    const response = await DISPATCH_INQUIRY(
      buildRequest("http://localhost:3000/api/kai/web-chat/inquiry/dispatch", {
        inquiryId: "inq_no_phone",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "operatorPhone is required unless BLUEPASS_TEST_OPERATOR_PHONE is configured.",
    });
  });
});
