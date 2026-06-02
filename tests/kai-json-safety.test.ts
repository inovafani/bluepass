import { describe, expect, it } from "vitest";
import { sanitizeJsonForPrisma } from "@/lib/services/kai/json-safety";

describe("sanitizeJsonForPrisma", () => {
  it("removes nested undefined values and converts dates to ISO strings", () => {
    const sanitized = sanitizeJsonForPrisma({
      intent: {
        destination: "Komodo",
        tripType: undefined,
        nested: {
          keep: "yes",
          drop: undefined,
          when: new Date("2026-06-02T01:00:00.000Z"),
        },
        values: ["a", undefined, new Date("2026-06-02T02:00:00.000Z")],
      },
      fn: () => "nope",
    });

    expect(sanitized).toEqual({
      intent: {
        destination: "Komodo",
        nested: {
          keep: "yes",
          when: "2026-06-02T01:00:00.000Z",
        },
        values: ["a", "2026-06-02T02:00:00.000Z"],
      },
    });
  });
});
