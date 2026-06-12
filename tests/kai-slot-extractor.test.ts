import { describe, expect, it } from "vitest";
import { extractKaiTravelIntent } from "@/lib/services/kai/slot-extractor";

describe("extractKaiTravelIntent", () => {
  it("extracts a Komodo diving request with date and guests", () => {
    expect(extractKaiTravelIntent("I want to dive in Komodo in October for 2 people")).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "diving",
        dateWindow: "October",
        guests: 2,
      }),
    );
  });

  it("extracts Raja Ampat liveaboard preferences", () => {
    expect(
      extractKaiTravelIntent(
        "Looking for a Raja Ampat liveaboard, advanced divers, love mantas and photography",
      ),
    ).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "liveaboard",
        certificationLevel: "advanced open water",
        interests: expect.arrayContaining(["mantas", "underwater photography"]),
      }),
    );
  });

  it("marks Bali as unsupported for now", () => {
    expect(extractKaiTravelIntent("We are beginners in Bali and want snorkelling")).toEqual(
      expect.objectContaining({
        unsupportedDestination: "Bali",
        tripType: "snorkelling",
        certificationLevel: "beginner",
        interests: expect.arrayContaining(["beginner-friendly"]),
      }),
    );
  });

  it("treats both as mixed diving and cruising when Kai asked for trip type", () => {
    expect(
      extractKaiTravelIntent("both", {}, { lastAskedSlot: "tripType" }),
    ).toEqual(
      expect.objectContaining({
        tripType: "mixed diving/cruising",
      }),
    );
  });

  it("extracts a luxury sailing group around Labuan Bajo", () => {
    expect(extractKaiTravelIntent("Luxury sailing trip for 4 guests around Labuan Bajo")).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "sailing",
        guests: 4,
        budget: "luxury",
        interests: expect.arrayContaining(["luxury"]),
      }),
    );
  });

  it("extracts Labuan Bajo sunset tours as Komodo sunset tour intent", () => {
    expect(extractKaiTravelIntent("Labuan Bajo sunset tour for 2 people on 20th June")).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "sunset tour",
        guests: 2,
        dateWindow: "20th June",
      }),
    );
  });

  it("marks Maldives as unsupported without setting it as a destination", () => {
    const intent = extractKaiTravelIntent("I want to go to the Maldives");

    expect(intent.unsupportedDestination).toBe("Maldives");
    expect(intent.destination).toBeUndefined();
  });

  it("normalizes R4 to Raja Ampat", () => {
    expect(extractKaiTravelIntent("R4 liveaboard for two advanced divers")).toEqual(
      expect.objectContaining({
        destination: "Raja Ampat",
        tripType: "liveaboard",
        guests: 2,
        certificationLevel: "advanced open water",
      }),
    );
  });

  it("merges previous intent with a new answer", () => {
    expect(
      extractKaiTravelIntent("October for 2 people", {
        destination: "Komodo",
        tripType: "diving",
      }),
    ).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "diving",
        dateWindow: "October",
        guests: 2,
      }),
    );
  });

  it("uses lastAskedSlot to interpret a bare number as guests", () => {
    expect(
      extractKaiTravelIntent(
        "2",
        {
          destination: "Komodo",
          tripType: "sailing",
        },
        { lastAskedSlot: "guests" },
      ),
    ).toEqual(
      expect.objectContaining({
        destination: "Komodo",
        tripType: "sailing",
        guests: 2,
      }),
    );
  });

  it("uses lastAskedSlot to interpret a bare number word as guests", () => {
    expect(
      extractKaiTravelIntent(
        "two",
        {
          destination: "Komodo",
          tripType: "sailing",
        },
        { lastAskedSlot: "guests" },
      ).guests,
    ).toBe(2);
  });

  it("does not interpret a bare number as guests without guests context", () => {
    expect(extractKaiTravelIntent("2").guests).toBeUndefined();
  });

  it("extracts strongly implied guest counts", () => {
    expect(extractKaiTravelIntent("we are 2").guests).toBe(2);
    expect(extractKaiTravelIntent("there are two of us").guests).toBe(2);
    expect(extractKaiTravelIntent("for 2").guests).toBe(2);
    expect(extractKaiTravelIntent("Sailing and 3 guests").guests).toBe(3);
    expect(extractKaiTravelIntent("yup maybe diving and i have 3 guests").guests).toBe(3);
    expect(extractKaiTravelIntent("we'll be three pax").guests).toBe(3);
  });

  it("extracts simple relative and month date windows", () => {
    expect(extractKaiTravelIntent("next month").dateWindow).toBe("next month");
    expect(extractKaiTravelIntent("in October").dateWindow).toBe("October");
    expect(extractKaiTravelIntent("Oct").dateWindow).toBe("October");
    expect(extractKaiTravelIntent("July 2026").dateWindow).toBe("July 2026");
    expect(extractKaiTravelIntent("20th of June").dateWindow).toBe("20th of June");
    expect(extractKaiTravelIntent("14-21 Oct 2026").dateWindow).toBe("14-21 Oct 2026");
  });

  it("uses lastAskedSlot to interpret short certification answers", () => {
    expect(
      extractKaiTravelIntent("advanced", { destination: "Komodo", tripType: "diving" }, {
        lastAskedSlot: "certificationLevel",
      }).certificationLevel,
    ).toBe("advanced open water");
  });

  it("does not treat yacht selection replies as traveller names", () => {
    const intent = extractKaiTravelIntent(
      "I'm interested in Calico Jack",
      {
        destination: "Komodo",
        tripType: "liveaboard",
        guests: 6,
        dateWindow: "10th of June",
        budget: "Around $4,000",
      },
      { lastAskedSlot: "travellerName" },
    );

    expect(intent.selectedYachtSlug).toBe("calico-jack");
    expect(intent.travellerName).toBeUndefined();
  });
});
