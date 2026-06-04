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

  it("keeps OpenAI on OPENAI_API_KEY even when GROQ_API_KEY exists", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "openai-key";
    process.env.GROQ_API_KEY = "groq-key";
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ output_text: "OpenAI reply" }),
    } as Response);

    await expect(generateKaiReply(baseInput)).resolves.toBe("OpenAI reply");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.openai.com/v1/responses",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer openai-key",
        }),
      }),
    );
  });

  it("calls Groq with GROQ_API_KEY when provider is groq", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    process.env.KAI_LLM_MODEL = "test-groq-model";
    process.env.OPENAI_API_KEY = "openai-key";
    process.env.GROQ_API_KEY = "groq-key";
    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: " Groq Kai reply " } }],
      }),
    } as Response);

    await expect(generateKaiReply(baseInput)).resolves.toBe("Groq Kai reply");
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer groq-key",
        }),
        body: expect.stringContaining('"model":"test-groq-model"'),
      }),
    );
    expect(infoSpy).toHaveBeenCalledWith("kai.llm.groq.success", {
      provider: "groq",
      model: "test-groq-model",
      status: 200,
      replyLength: "Groq Kai reply".length,
    });
  });

  it("uses Groq default model when KAI_LLM_MODEL is missing", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    delete process.env.KAI_LLM_MODEL;
    process.env.GROQ_API_KEY = "groq-key";
    vi.spyOn(console, "info").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: "Groq default model reply" } }],
      }),
    } as Response);

    await generateKaiReply(baseInput);
    expect(globalThis.fetch).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({
        body: expect.stringContaining('"model":"llama-3.3-70b-versatile"'),
      }),
    );
  });

  it("includes planner state card and do-not-ask-known-slots instruction", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "groq-key";
    vi.spyOn(console, "info").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: "When are you hoping to travel, and what certification level are the divers?" } }],
      }),
    } as Response);

    await generateKaiReply({
      ...baseInput,
      intent: {
        destination: "Raja Ampat",
        tripType: "diving",
        guests: 3,
      },
      missingSlots: ["dateWindow", "certificationLevel"],
      planner: {
        knownSlots: ["destination", "tripType", "guests"],
        missingSlots: ["dateWindow", "certificationLevel"],
        nextSlotToAsk: "dateWindow",
        conversationStage: "qualification",
        instructionForReply:
          "Do not ask again for known slots: destination, tripType, guests. Ask only for: dateWindow, certificationLevel.",
      },
    });

    const [, request] = vi.mocked(globalThis.fetch).mock.calls[0];
    const body = JSON.parse(String((request as RequestInit).body));
    const contextMessage = body.messages.find(
      (message: { role: string; content: string }) =>
        message.role === "user" && message.content.startsWith("Structured Kai context:"),
    );
    const context = JSON.parse(contextMessage.content.replace("Structured Kai context:\n", ""));

    expect(context.stateCard).toEqual(
      expect.objectContaining({
        Destination: "Raja Ampat",
        "Trip type": "diving",
        Guests: 3,
        "Date window": "missing",
        "Certification level": "missing",
      }),
    );
    expect(context.planner.instructionForReply).toContain("Do not ask again for known slots");
    expect(context.planner.instructionForReply).toContain("Ask only for: dateWindow, certificationLevel");
  });

  it("includes static yacht suggestion constraints in LLM context", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "groq-key";
    vi.spyOn(console, "info").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        choices: [{ message: { content: "I would shortlist Aliikai." } }],
      }),
    } as Response);

    await generateKaiReply({
      ...baseInput,
      matches: [
        {
          slug: "aliikai",
          name: "Aliikai",
          region: "Raja Ampat",
          tier: "Premium",
          cabinBookable: true,
          maxGuests: 15,
          cabins: 7,
          pricePerCabin: "$690",
          charterPrice: "$8,900",
          charterOnly: false,
          matchingReasons: ["Raja Ampat route", "fits 3 guests", "cabin bookable"],
          departuresPreview: ["Jul 5 - Jul 12"],
          score: 112,
        },
      ],
    });

    const [, request] = vi.mocked(globalThis.fetch).mock.calls[0];
    const body = JSON.parse(String((request as RequestInit).body));
    const contextMessage = body.messages.find(
      (message: { role: string; content: string }) =>
        message.role === "user" && message.content.startsWith("Structured Kai context:"),
    );
    const context = JSON.parse(contextMessage.content.replace("Structured Kai context:\n", ""));

    expect(context.stateCard["Yacht suggestions"]).toEqual([
      expect.objectContaining({
        slug: "aliikai",
        name: "Aliikai",
        matchingReasons: ["Raja Ampat route", "fits 3 guests", "cabin bookable"],
      }),
    ]);
    expect(context.stateCard["Yacht suggestion constraints"]).toContain(
      "Static BluePass preview catalog only",
    );
    expect(body.messages[0].content).toContain("Do not invent additional yachts");
    expect(body.messages[0].content).toContain("Do not claim real-time availability");
  });

  it("falls back when GROQ_API_KEY is missing", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    delete process.env.GROQ_API_KEY;
    globalThis.fetch = vi.fn();

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("falls back when provider is unsupported", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "mystery";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    globalThis.fetch = vi.fn();

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(globalThis.fetch).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledWith(
      "Kai LLM provider is unsupported; using deterministic fallback.",
    );
  });

  it("falls back when Groq returns non-2xx", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "groq-secret-key";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      headers: new Headers({ "x-request-id": "req_123" }),
      json: async () => ({
        error: {
          message: "rate limited",
          type: "rate_limit",
          code: "rate_limit_exceeded",
        },
      }),
    } as Response);

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(warnSpy).toHaveBeenCalledWith("kai.llm.groq.error", {
      status: 429,
      message: "rate limited",
      type: "rate_limit",
      code: "rate_limit_exceeded",
      requestId: "req_123",
    });
    expect(JSON.stringify(warnSpy.mock.calls)).not.toContain("groq-secret-key");
  });

  it("falls back when Groq returns 200 with malformed response", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "groq-secret-key";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "x-request-id": "req_malformed" }),
      json: async () => ({ choices: [{}] }),
    } as Response);

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(warnSpy).toHaveBeenCalledWith("kai.llm.groq.malformed_response", {
      status: 200,
      requestId: "req_malformed",
    });
    expect(JSON.stringify(warnSpy.mock.calls)).not.toContain("groq-secret-key");
  });

  it("falls back when Groq returns 200 with empty content", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "groq";
    process.env.GROQ_API_KEY = "groq-secret-key";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ choices: [{ message: { content: "   " } }] }),
    } as Response);

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(warnSpy).toHaveBeenCalledWith("kai.llm.groq.malformed_response", {
      status: 200,
      requestId: undefined,
    });
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

  it("does not log API keys on provider exceptions", async () => {
    process.env.KAI_LLM_ENABLED = "true";
    process.env.KAI_LLM_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "openai-secret-key";
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("network down"));

    await expect(generateKaiReply(baseInput)).resolves.toBe(baseInput.deterministicReply);
    expect(JSON.stringify(warnSpy.mock.calls)).not.toContain("openai-secret-key");
  });
});
