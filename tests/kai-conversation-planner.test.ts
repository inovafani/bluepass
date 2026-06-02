import { describe, expect, it } from "vitest";
import { planKaiConversation } from "@/lib/services/kai/conversation-planner";

describe("planKaiConversation", () => {
  it("asks only for dateWindow and certification when destination, tripType, and guests are known", () => {
    const plan = planKaiConversation({
      intent: {
        destination: "Raja Ampat",
        tripType: "diving",
        guests: 3,
      },
      latestUserMessage: "3 guests",
      channel: "web",
    });

    expect(plan.knownSlots).toEqual(["destination", "tripType", "guests"]);
    expect(plan.missingSlots).toEqual(["dateWindow", "certificationLevel"]);
    expect(plan.nextSlotToAsk).toBe("dateWindow");
    expect(plan.conversationStage).toBe("qualification");
    expect(plan.instructionForReply).toContain("Do not ask again for known slots");
    expect(plan.instructionForReply).toContain("Ask only for: dateWindow, certificationLevel");
  });

  it("marks ready to match once required and conditional slots are known", () => {
    const plan = planKaiConversation({
      intent: {
        destination: "Raja Ampat",
        tripType: "diving",
        guests: 3,
        dateWindow: "October",
        certificationLevel: "advanced open water",
      },
      latestUserMessage: "Advanced, October",
      channel: "web",
    });

    expect(plan.missingSlots).toEqual([]);
    expect(plan.conversationStage).toBe("ready_to_match");
    expect(plan.instructionForReply).toContain("start matching suitable Indonesia trips");
  });
});
