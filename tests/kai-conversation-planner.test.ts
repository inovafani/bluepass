import { describe, expect, it } from "vitest";
import { planKaiConversation } from "@/lib/services/kai/conversation-planner";

describe("planKaiConversation", () => {
  it("asks for dateWindow and budget when destination, tripType, and guests are known", () => {
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
    expect(plan.missingSlots).toEqual([
      "dateWindow",
      "budget",
      "travellerName",
      "travellerEmail",
      "travellerPhone",
    ]);
    expect(plan.nextSlotToAsk).toBe("dateWindow");
    expect(plan.conversationStage).toBe("qualification");
    expect(plan.instructionForReply).toContain("Do not ask again for known slots");
    expect(plan.instructionForReply).toContain("Ask only for: dateWindow, budget");
  });

  it("asks for contact details once travel details are known", () => {
    const plan = planKaiConversation({
      intent: {
        destination: "Raja Ampat",
        tripType: "diving",
        guests: 3,
        dateWindow: "October",
        budget: "$2,000",
        certificationLevel: "advanced open water",
      },
      latestUserMessage: "Advanced, October",
      channel: "web",
    });

    expect(plan.missingSlots).toEqual([
      "travellerName",
      "travellerEmail",
      "travellerPhone",
    ]);
    expect(plan.conversationStage).toBe("qualification");
    expect(plan.instructionForReply).toContain(
      "Ask only for: travellerName, travellerEmail, travellerPhone",
    );
  });

  it("marks ready to match once travel and contact slots are known", () => {
    const plan = planKaiConversation({
      intent: {
        destination: "Raja Ampat",
        tripType: "diving",
        guests: 3,
        dateWindow: "October",
        budget: "$2,000",
        certificationLevel: "advanced open water",
        travellerName: "Ari",
        travellerEmail: "ari@example.com",
        travellerPhone: "+628123456789",
      },
      latestUserMessage: "Ari ari@example.com +628123456789",
      channel: "web",
    });

    expect(plan.missingSlots).toEqual([]);
    expect(plan.conversationStage).toBe("ready_to_match");
    expect(plan.instructionForReply).toContain("start matching suitable Indonesia trips");
  });
});
