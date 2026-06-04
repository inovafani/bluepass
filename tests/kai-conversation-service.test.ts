import { afterEach, describe, expect, it, vi } from "vitest";
import {
  createKaiConversationService,
  type KaiConversationStore,
} from "@/lib/services/kai/conversation-service";
import { generateKaiReply } from "@/lib/services/kai/llm-provider";

const llmMocks = vi.hoisted(() => ({
  generateKaiReply: vi.fn(
    async (input: { deterministicReply: string }) => input.deterministicReply,
  ),
}));
const matchMocks = vi.hoisted(() => ({
  matchTripsForKai: vi.fn(async () => []),
}));

vi.mock("@/lib/services/kai/llm-provider", () => ({
  generateKaiReply: llmMocks.generateKaiReply,
}));
vi.mock("@/lib/services/kai/match", () => ({
  matchTripsForKai: matchMocks.matchTripsForKai,
}));

afterEach(() => {
  llmMocks.generateKaiReply.mockReset();
  llmMocks.generateKaiReply.mockImplementation(
    async (input: { deterministicReply: string }) => input.deterministicReply,
  );
  matchMocks.matchTripsForKai.mockReset();
  matchMocks.matchTripsForKai.mockImplementation(async () => []);
});

function buildStore(): KaiConversationStore {
  return {
    upsertSession: vi.fn(),
    addMessage: vi.fn(),
    getSessionContext: vi.fn(),
  };
}

function buildInMemoryStore(): KaiConversationStore & {
  sessions: Map<string, unknown>;
  messages: Array<{ sessionId: string; role: string; content: string }>;
} {
  const sessions = new Map<string, unknown>();
  const messages: Array<{ sessionId: string; role: string; content: string }> =
    [];

  return {
    sessions,
    messages,
    async upsertSession(session) {
      sessions.set(session.id, session.context);
    },
    async addMessage(message) {
      messages.push({
        sessionId: message.sessionId,
        role: message.role,
        content: message.content,
      });
    },
    async persistTurn(input) {
      sessions.set(input.session.id, input.session.context);
      for (const message of input.messages) {
        messages.push({
          sessionId: message.sessionId,
          role: message.role,
          content: message.content,
        });
      }
    },
    async getSessionContext(input) {
      return sessions.get(input.sessionId) as never;
    },
    async listMessages(input) {
      return messages
        .filter((message) => message.sessionId === input.sessionId)
        .map((message) => ({
          sessionId: message.sessionId,
          channel: input.channel,
          role: message.role as "user" | "assistant",
          content: message.content,
        }));
    },
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
    expect(result.reply).toContain("What budget range");
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
    expect(dateResult.reply).toContain("What budget range");
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

  it("does not expose yacht cards while required inquiry slots are still missing", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "Raja Ampat sailing for 3 guests",
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "sailing",
        guests: 3,
      }),
    );
    expect(result.matches).toEqual([]);
    expect(result.reply).toContain("When are you hoping to travel");
  });

  it("returns static yacht catalog matches once the inquiry is ready to match", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message:
        "Raja Ampat sailing for 3 guests around October with a $4000 budget",
      recentMessages: [
        {
          role: "assistant",
          content:
            "Great, I have the trip details. What name, email, and WhatsApp number should I put on the inquiry?",
        },
        {
          role: "user",
          content: "My name is Ari, ari@example.com, +628123456789",
        },
      ],
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "sailing",
        guests: 3,
        dateWindow: "October",
        budget: "$4000",
        travellerName: "Ari",
        travellerEmail: "ari@example.com",
        travellerPhone: "+628123456789",
      }),
    );
    expect(result.matches?.length).toBeGreaterThan(0);
    expect(result.matches?.[0]).toEqual(
      expect.objectContaining({
        slug: expect.any(String),
        name: expect.any(String),
        region: "Raja Ampat",
        matchingReasons: expect.arrayContaining([
          "Raja Ampat route",
          "fits 3 guests",
        ]),
      }),
    );
  });

  it("asks for traveller contact instead of re-listing yachts after a yacht is selected", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
        guests: 4,
        dateWindow: "4th of July",
        budget: "$4000",
      },
      lastAskedSlot: "budget",
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_selected_yacht_contact",
      message: "yes calico jack please",
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        selectedYachtSlug: "calico-jack",
      }),
    );
    expect(result.matches).toEqual([]);
    expect(result.reply).toContain("Calico Jack");
    expect(result.reply).toContain("What name, email, and WhatsApp number");
    expect(result.reply).not.toContain("shortlist");
  });

  it("keeps the selected yacht focused once contact details are known", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
        guests: 4,
        dateWindow: "4th of July",
        budget: "$4000",
        selectedYachtSlug: "calico-jack",
      },
      lastAskedSlot: "travellerName",
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_selected_yacht_ready",
      message: "My name is Ari, ari@example.com, +628123456789",
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        selectedYachtSlug: "calico-jack",
        travellerName: "Ari",
        travellerEmail: "ari@example.com",
        travellerPhone: "+628123456789",
      }),
    );
    expect(result.matches).toHaveLength(1);
    expect(result.matches?.[0]).toEqual(
      expect.objectContaining({
        slug: "calico-jack",
        name: "Calico Jack",
      }),
    );
    expect(result.reply).toContain("Calico Jack");
    expect(result.reply).not.toContain("Rascal");
    expect(result.reply).not.toContain("Samara");
  });

  it("does not ask for traveller name again after extracting it with the budget", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
        guests: 4,
        dateWindow: "4th of July",
      },
      lastAskedSlot: "budget",
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_budget_name_contact",
      message: "$4000, my name is Alexandra",
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        budget: "4000",
        travellerName: "Alexandra",
      }),
    );
    expect(result.reply).toContain("What email and WhatsApp number");
    expect(result.reply).not.toContain("What name, email");
  });

  it("moves to send-inquiry guidance after a selected yacht has full contact details", async () => {
    const store = buildStore();
    vi.mocked(store.getSessionContext).mockResolvedValue({
      intent: {
        destination: "Komodo",
        tripType: "sailing",
        guests: 4,
        dateWindow: "4th of July",
        budget: "$4000",
        travellerName: "Alexandra",
        travellerEmail: "alexandra@gmail.com",
        travellerPhone: "088776543289",
        selectedYachtSlug: "calico-jack",
      },
      lastAskedSlot: "travellerPhone",
    });
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_selected_yacht_full_details",
      message: "yes please",
    });

    expect(result.matches).toHaveLength(1);
    expect(result.matches?.[0]).toEqual(
      expect.objectContaining({
        slug: "calico-jack",
      }),
    );
    expect(result.reply).toContain("Tap Send inquiry");
    expect(result.reply).toContain("Calico Jack");
    expect(result.reply).not.toContain("shortlist");
  });

  it("overrides a generic LLM reply when static yacht matches exist", async () => {
    const store = buildStore();
    llmMocks.generateKaiReply.mockResolvedValue(
      "Perfect. I can start matching suitable Indonesia trips for Komodo based on your sailing plans for 2 guests.",
    );
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "Labuan Bajo sailing for 2 people on 20th June under $1,000",
      recentMessages: [
        {
          role: "assistant",
          content:
            "Great, I have the trip details. What name, email, and WhatsApp number should I put on the inquiry?",
        },
        {
          role: "user",
          content: "My name is Ari, ari@example.com, +628123456789",
        },
      ],
    });

    expect(result.matches?.length).toBeGreaterThan(0);
    expect(result.reply).toContain("BluePass preview fleet");
    expect(result.reply).not.toContain("Perfect. I can start matching");
  });

  it("overrides LLM replies that claim an inquiry was prepared or sent from chat", async () => {
    const store = buildStore();
    llmMocks.generateKaiReply.mockResolvedValue(
      "I've prepared an inquiry for Calico Jack. I'll send it through our system to check availability.",
    );
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message:
        "Komodo liveaboard for 3 guests around July 3rd, budget $4000, beginner. My name is Ari, ari@example.com, +628123456789",
    });

    expect(result.reply).toContain(
      "Based on the current BluePass preview fleet",
    );
    expect(result.reply).toContain(
      "If you'd like to proceed, I can prepare an inquiry",
    );
    expect(result.reply).not.toContain("I've prepared an inquiry");
    expect(result.reply).not.toContain("I'll send it");
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

  it("creates a web session and appends messages across repeated turns", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);

    const first = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_repeat_memory_session",
      message: "Nusa Penida sailing",
    });
    const second = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_repeat_memory_session",
      message: "2",
    });

    expect(first.sessionId).toBe("kai_repeat_memory_session");
    expect(second.sessionId).toBe("kai_repeat_memory_session");
    expect(store.sessions.has("kai_repeat_memory_session")).toBe(true);
    expect(store.messages).toHaveLength(4);
    expect(store.messages.map((message) => message.role)).toEqual([
      "user",
      "assistant",
      "user",
      "assistant",
    ]);
    expect(second.intent.guests).toBe(2);
    expect(second.reply).toContain("When are you hoping to travel");
  });

  it("recovers a valid provided sessionId that has no stored session row", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_stale_local_storage",
      message: "Komodo diving for 2 people in October",
    });

    expect(result.sessionId).toBe("kai_stale_local_storage");
    expect(store.sessions.has("kai_stale_local_storage")).toBe(true);
    expect(store.messages).toHaveLength(2);
  });

  it("keeps structured state through the problematic repeated-question conversation", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);
    const sessionId = "kai_problem_conversation";

    await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "I want some sailing",
    });
    const raja = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "Maybe Raja Ampat",
    });
    const twoPeople = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "2 people",
    });
    const diving = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "maybe diving",
    });
    const rajaAgain = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "Raja Ampat",
    });
    await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "3",
    });
    const threeGuests = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "3 guests",
    });

    expect(raja.intent.destination).toBe("Raja Ampat");
    expect(twoPeople.intent.guests).toBe(2);
    expect(diving.intent.tripType).toBe("diving");
    expect(rajaAgain.reply).not.toMatch(/area|destination|where in indonesia/i);
    expect(threeGuests.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "diving",
        guests: 3,
      }),
    );
    expect(threeGuests.planner).toEqual(
      expect.objectContaining({
        missingSlots: [
          "dateWindow",
          "budget",
          "certificationLevel",
          "travellerName",
          "travellerEmail",
          "travellerPhone",
        ],
        nextSlotToAsk: "dateWindow",
      }),
    );
    expect(threeGuests.reply).toContain("When are you hoping to travel");
    expect(threeGuests.reply).toContain("certification level");
    expect(threeGuests.reply).not.toMatch(
      /what type|trip type|how many|destination|area/i,
    );
  });

  it("reconstructs state from history when stored context is missing", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);
    const sessionId = "kai_history_reconstruct";

    await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "Sailing maybe?",
    });
    store.sessions.delete(sessionId);

    const komodo = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "Komodo i think",
    });
    store.sessions.delete(sessionId);

    const guests = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "3 guests",
    });

    expect(komodo.intent).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "sailing",
      }),
    );
    expect(guests.intent).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "sailing",
        guests: 3,
      }),
    );
    expect(guests.reply).toContain("When are you hoping to travel");
    expect(guests.reply).not.toMatch(/where|what kind|how many/i);
  });

  it("overrides an LLM reply that asks for known slots again", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);
    const sessionId = "kai_bad_llm_guard";

    await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "Sailing maybe?",
    });
    await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "Komodo i think",
    });
    llmMocks.generateKaiReply.mockResolvedValue(
      "Komodo is a great choice. What kind of ocean experience are you looking for, and how many guests will be traveling?",
    );

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "3 guests",
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "sailing",
        guests: 3,
      }),
    );
    expect(result.reply).toContain("When are you hoping to travel");
    expect(result.reply).not.toMatch(/what kind|how many|guests will/i);
  });

  it("uses recent browser-visible messages when stored history is missing", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_visible_history_recovery",
      message: "Sailing and 3 guests",
      recentMessages: [
        {
          role: "assistant",
          content:
            "Where in Indonesia are you hoping to go - Komodo, Raja Ampat, Bali, or somewhere else?",
        },
        {
          role: "user",
          content: "Raja Ampat would be best",
        },
      ],
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "sailing",
        guests: 3,
      }),
    );
    expect(result.reply).toContain("When are you hoping to travel");
    expect(result.reply).not.toMatch(/where|what kind|how many/i);
  });

  it("answers a best-time question after required travel details are known", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_best_time_raja",
      message: "what best time to go there actually?",
      recentMessages: [
        { role: "user", content: "Sailing" },
        { role: "assistant", content: "Where in Indonesia feels best?" },
        { role: "user", content: "Raja Ampat maybe?" },
        { role: "assistant", content: "How many people should I plan around?" },
        { role: "user", content: "I have 3 people" },
        { role: "assistant", content: "When are you hoping to travel?" },
        { role: "user", content: "20th of June" },
      ],
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "sailing",
        guests: 3,
        dateWindow: "20th of June",
      }),
    );
    expect(result.reply).toMatch(/October to April|June is shoulder/i);
    expect(result.reply).not.toContain(
      "start matching suitable Indonesia trips",
    );
  });

  it("overrides a generic LLM matching reply when the user asks for best timing", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);
    llmMocks.generateKaiReply.mockResolvedValue(
      "Perfect. I can start matching suitable Indonesia trips for Komodo based on your sailing plans for 4 guests.",
    );

    const result = await service.handleUserMessage({
      channel: "web",
      sessionId: "kai_best_time_komodo",
      message: "what best time to go there actually?",
      recentMessages: [
        { role: "user", content: "Sailing" },
        { role: "user", content: "Maybe komodo" },
        { role: "assistant", content: "How many people should I plan around?" },
        { role: "user", content: "4" },
        { role: "assistant", content: "When are you hoping to travel?" },
        { role: "user", content: "20th june maybe" },
      ],
    });

    expect(result.intent).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "sailing",
        guests: 4,
        dateWindow: "20th june",
      }),
    );
    expect(result.reply).toMatch(/April to November|June to September/i);
    expect(result.reply).not.toContain(
      "start matching suitable Indonesia trips",
    );
  });

  it("recognizes liveaboard plural and typo answers without re-asking trip type", async () => {
    const store = buildInMemoryStore();
    const service = createKaiConversationService(store);
    const sessionId = "kai_liveaboard_typo_session";

    const liveaboard = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "liveaboards",
    });
    const raja = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "Raja ampat",
    });
    const guests = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "3 guests",
    });
    const typo = await service.handleUserMessage({
      channel: "web",
      sessionId,
      message: "liveaborad",
    });

    expect(liveaboard.intent.tripType).toBe("liveaboard");
    expect(raja.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "liveaboard",
      }),
    );
    expect(guests.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "liveaboard",
        guests: 3,
      }),
    );
    expect(guests.reply).toContain("When are you hoping to travel");
    expect(guests.reply).toContain("certification level");
    expect(guests.reply).not.toMatch(
      /thinking sailing|what kind|trip type|how many/i,
    );
    expect(typo.intent).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "liveaboard",
        guests: 3,
      }),
    );
    expect(typo.reply).not.toMatch(
      /thinking sailing|what kind|trip type|how many/i,
    );
  });
});
