import { describe, expect, it, vi } from "vitest";
import {
  DEFAULT_KAI_REPLY,
  createKaiConversationService,
  type KaiConversationStore,
} from "@/lib/services/kai/conversation-service";

function buildStore(): KaiConversationStore {
  return {
    upsertSession: vi.fn(),
    addMessage: vi.fn(),
  };
}

describe("Kai conversation service", () => {
  it("supports the web channel", async () => {
    const store = buildStore();
    const service = createKaiConversationService(store);

    const result = await service.handleUserMessage({
      channel: "web",
      message: "I want to dive in Komodo",
    });

    expect(result.sessionId).toMatch(/^kai_/);
    expect(result.reply).toBe(DEFAULT_KAI_REPLY);
    expect(store.upsertSession).toHaveBeenCalledWith(
      expect.objectContaining({ channel: "web", status: "open" }),
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
});
