import { describe, expect, it } from "vitest";
import {
  claimableOperatorBySlug,
  claimableOperatorByYachtSlug,
} from "@/lib/data/operator-claims";

describe("claimable operator metadata", () => {
  it("groups Mermaid vessels under Mermaid Liveaboards", () => {
    expect(claimableOperatorBySlug["mermaid-liveaboards"]).toEqual(
      expect.objectContaining({
        slug: "mermaid-liveaboards",
        name: "Mermaid Liveaboards",
        representativeYachtSlug: "mermaid-i",
        yachtSlugs: ["mermaid-i", "mermaid-ii"],
      }),
    );
    expect(claimableOperatorByYachtSlug["mermaid-i"]?.slug).toBe(
      "mermaid-liveaboards",
    );
    expect(claimableOperatorByYachtSlug["mermaid-ii"]?.slug).toBe(
      "mermaid-liveaboards",
    );
  });

  it("groups Scuba Republic vessels under Scuba Republic", () => {
    expect(claimableOperatorBySlug["scuba-republic"]).toEqual(
      expect.objectContaining({
        slug: "scuba-republic",
        name: "Scuba Republic",
        representativeYachtSlug: "bajak",
        yachtSlugs: ["bajak", "capoeng", "jaya", "epica"],
      }),
    );

    for (const slug of ["bajak", "capoeng", "jaya", "epica"]) {
      expect(claimableOperatorByYachtSlug[slug]?.slug).toBe("scuba-republic");
    }
  });

  it("allows Calico Jack to be claimed as an operator", () => {
    expect(claimableOperatorBySlug["calico-jack"]).toEqual(
      expect.objectContaining({
        slug: "calico-jack",
        name: "Calico Jack",
        representativeYachtSlug: "calico-jack",
        yachtSlugs: ["calico-jack"],
      }),
    );
    expect(claimableOperatorByYachtSlug["calico-jack"]?.slug).toBe("calico-jack");
  });
});
