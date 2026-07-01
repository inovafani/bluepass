import { describe, expect, it } from "vitest";
import { yachtBySlug } from "@/lib/data/yachts";

describe("BluePass yacht catalog data", () => {
  it("includes Mermaid I and Mermaid II as discoverable liveaboard products", () => {
    const mermaidI = yachtBySlug["mermaid-i"];
    const mermaidII = yachtBySlug["mermaid-ii"];

    expect(mermaidI).toEqual(
      expect.objectContaining({
        name: "Mermaid I",
        firstName: "Mermaid I",
        cabinBookable: true,
        maxGuests: 15,
        cabins: 8,
        length: "28 m",
      }),
    );
    expect(mermaidI.images.gallery).toHaveLength(5);

    expect(mermaidII).toEqual(
      expect.objectContaining({
        name: "Mermaid II",
        firstName: "Mermaid II",
        cabinBookable: true,
        maxGuests: 20,
        cabins: 9,
        length: "33 m",
      }),
    );
    expect(mermaidII.images.gallery).toHaveLength(5);
  });

  it("includes Scuba Republic liveaboards as discoverable products", () => {
    const expectedProducts = [
      { slug: "bajak", name: "Bajak", region: "Komodo", itineraryLength: 7 },
      { slug: "capoeng", name: "Capoeng", region: "Komodo", itineraryLength: 7 },
      { slug: "jaya", name: "Jaya", region: "Raja Ampat", itineraryLength: 7 },
      { slug: "epica", name: "Epica", region: "Raja Ampat", itineraryLength: 7 },
    ] as const;

    for (const product of expectedProducts) {
      const yacht = yachtBySlug[product.slug];

      expect(yacht).toEqual(
        expect.objectContaining({
          name: product.name,
          firstName: product.name,
          region: product.region,
          cabinBookable: true,
          charterOnly: false,
          pricePerCabin: "Quote on request",
        }),
      );
      expect(yacht.itinerary).toHaveLength(product.itineraryLength);
      expect(yacht.images.card).toContain(`/yachts/${product.slug}/`);
      expect(yacht.images.hero).toContain(`/yachts/${product.slug}/`);
      expect(yacht.images.gallery).toHaveLength(5);
    }
  });
});
