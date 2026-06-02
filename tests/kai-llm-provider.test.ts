import { afterEach, describe, expect, it, vi } from "vitest";
import { generateKaiReply } from "@/lib/services/kai/llm-provider";

const originalEnv = { ...process.env };
const originalFetch = globalThis.fetch;

afterEach(() => {
  process.env = { ...originalEnv };
  globalThis.fetch = originalFetch;
  vi.restoreAllMocks();
});

const baseInput = {
  messages: [
    {
      sessionId: "kai_test_session",
      channel: "web" as const,
      role: "user" as const,
      content: "Komodo sailing",
    },
  ],
  intent: {
    destination: "Komodo",
    tripType: "sailing",
    missingSlots: ["guests", "dateWindow"],
  },
  missingSlots: ["guests", "dateWindow"],
  channel: "web" as const,
  deterministicReply: "How many people should Kai plan for?",
};

describe("generateKaiReply", () => {
  it("uses deterministic fallback when KAI_LLM_ENABLED is false", async () => {
    process.env.KAI_LLM_ENABLED = "false";
    globalThis.fetch = vi.fn();

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("uses deterministic fallback when OPENAI_API_KEY is missing", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    delete process.env.OPENAI_API_KEY;
    globalThis.fetch = vi.fn();

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("calls OpenAI and returns output text when enabled", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "openai";
    process.env.KAI_LLM_MODEL = "test-model";
    process.env.OPENAI_API_KEY = "test-api-key";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output_text: "Natural Kai reply" }),
    } as Response);

    await expect(generateKaiReply(baseInput)).resolves.toBe("Natural Kai reply");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-api-key",
        }),
        body: expect.stringContaining('"model":"test-model"'),
      }),
    );
  });

  it("falls back safely when OpenAI request fails", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "test-api-key";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(warnSpy).toHaveBeenCalledWith(
      "Kai LLM request failed with status 500; using fallback.",
    );
  });
});
