import { afterEach, describe, expect, it, vi } from "vitest";
import { createKaiConversationService, type KaiConversationStore } from "@/lib/services/kai/conversation-service";
import { generateKaiReply } from "@/lib/services/kai/llm-provider";

const llmMocks = vi.hoisted(() => ({
  generateKaiReply: vi.fn(async (input: { deterministicReply: string }) => input.deterministicReply),
}));

vi.mock("@/lib/services/kai/llm-provider", () => ({
  generateKaiReply: llmMocks.generateKaiReply,
}));

afterEach(() => {
  llmMocks.generateKaiReply.mockReset();
  llmMocks.generateKaiReply.mockImplementation(async (input: { deterministicReply: string }) => input.deterministicReply);
});

function buildStore(): KaiConversationStore {
  return {
    upsertSession: vi.fn(),
    addMessage: vi.fn(),
    getSessionContext: vi.fn(),
  };
}

describe("Kai conversation service", () => {
  it("supports the web channel and asks for an Indonesia destination when missing", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "I want a marine trip",
    });

    expect(result.sessionId).toMatch(/^kai_/);
    expect(result.reply).toContain("Where in Indonesia");
    expect(result.intent.missingSlots).toContain("destination");
    expect(store.upsertSession).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: "web",
        status: "open",
        context: expect.objectContaining({
          intent: result.intent,
          lastAskedSlot: "destination",
        }),
      }),
    );
  });

  it("supports the whatsapp channel", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    await service.handleUserMessage({
      channel: "whatsapp",
      sessionId: "kai_whatsapp_session",
      travellerPhone: "+628213143342",
      message: "Looking for manta rays",
    });

    expect(store.upsertSession).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "kai_whatsapp_session",
        channel: "whatsapp",
        travellerPhone: "+628213143342",
      }),
    );
  });

  it("explains the Indonesia-only focus for unsupported destinations", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "I want to go to the Maldives",
    });

    expect(result.intent.unsupportedDestination).toBe("Maldives");
    expect(result.reply).toContain("currently focused on Indonesia");
  });

  it("asks for guests when destination and trip type exist but guests are missing", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "I want a Komodo sailing trip",
    });

    expect(result.intent.destination).toBe("Komodo");
    expect(result.intent.tripType).toBe("sailing");
    expect(result.reply).toContain("How many people");
  });

  it("asks for certification level for diving or liveaboard trips", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "Komodo diving in October for 2 people",
    });

    expect(result.intent.missingSlots).toContain("certificationLevel");
    expect(result.reply).toContain("certification level");
  });

  it("loads previous session intent before extracting the next answer", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Raja Ampat",
        tripType: "liveaboard",
      },
      lastAskedSlot: "dateWindow",
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_existing_session",
      message: "October for two advanced divers",
    });

    expect(store.getSessionContext).toHaveBeenCalledWith({
      sessionId: "kai_existing_session",
      channel: "web",
    });
    expect(result.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "liveaboard",
        dateWindow: "October",
        guests: 2,
        certificationLevel: "advanced open water",
      }),
    );
  });

  it("treats a bare number as guests when Kai last asked for guests", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Nusa Penida",
        tripType: "sailing",
        missingSlots: ["guests", "dateWindow", "budget"],
      },
      lastAskedSlot: "guests",
      missingSlots: ["guests", "dateWindow", "budget"],
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_short_guest_session",
      message: "2",
    });

    expect(result.intent.guests).toBe(2);
    expect(result.reply).toContain("When are you hoping to travel");
    expect(result.reply).not.toContain("How many people");
    expect(store.upsertSession).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({
          lastAskedSlot: "dateWindow",
        }),
      }),
    );
  });

  it("treats a bare number word as guests when Kai last asked for guests", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Nusa Penida",
        tripType: "sailing",
      },
      lastAskedSlot: "guests",
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_short_guest_word_session",
      message: "two",
    });

    expect(result.intent.guests).toBe(2);
    expect(result.reply).toContain("When are you hoping to travel");
  });

  it("captures next month when Kai last asked for dateWindow", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Nusa Penida",
        tripType: "sailing",
        guests: 2,
      },
      lastAskedSlot: "dateWindow",
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_date_session",
      message: "next month",
    });

    expect(result.intent.dateWindow).toBe("next month");
    expect(result.reply).toContain("start matching suitable Indonesia trips");
  });

  it("merges Nusa Penida sailing answers across multiple web messages", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext)
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        intent: {
          destination: "Nusa Penida",
          tripType: "sailing",
          missingSlots: ["guests", "dateWindow", "budget"],
        },
        lastAskedSlot: "guests",
      })
      .mockResolvedValueOnce({
        intent: {
          destination: "Nusa Penida",
          tripType: "sailing",
          guests: 2,
          missingSlots: ["dateWindow", "budget"],
        },
        lastAskedSlot: "dateWindow",
      });
    const service = createKaiConversationService(store);

    await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_multi_turn_session",
      message: "Nusa Penida sailing",
    });
    const guestResult = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_multi_turn_session",
      message: "2",
    });
    const dateResult = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_multi_turn_session",
      message: "next month",
    });

    expect(guestResult.intent.guests).toBe(2);
    expect(guestResult.reply).toContain("When are you hoping to travel");
    expect(dateResult.intent).toEqual(
      expect.objectContaining({
        destination: "Nusa Penida",
        tripType: "sailing",
        guests: 2,
        dateWindow: "next month",
      }),
    );
    expect(dateResult.reply).toContain("start matching suitable Indonesia trips");
  });

  it("uses an LLM reply when the provider returns one", async () => {
    const store = buildStore();
    llmMocks.generateKaiReply.mockResolvedValue("A more natural Kai reply.");
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "Komodo sailing for 2 people next month",
    });

    expect(result.reply).toBe("A more natural Kai reply.");
    expect(generateKaiReply).toHaveBeenCalledWith(
      expect.objectContaining({
        channel: "web",
        intent: expect.objectContaining({
          destination: "Komodo",
          tripType: "sailing",
          guests: 2,
          dateWindow: "next month",
        }),
      }),
    );
  });

  it("falls back safely when LLM reply generation throws", async () => {
    const store = buildStore();
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    llmMocks.generateKaiReply.mockRejectedValue(new Error("provider failure"));
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "Nusa Penida sailing",
    });

    expect(result.reply).toContain("How many people");
    expect(warnSpy).toHaveBeenCalledWith(
      "Kai reply generation failed; using deterministic fallback.",
      expect.objectContaining({ error: "provider failure" }),
    );

    warnSpy.mockRestore();
  });
});
