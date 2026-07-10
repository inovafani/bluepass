import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ClaimEmailLinkForm } from "@/app/operator/claim/start/[operatorSlug]/ClaimEmailLinkForm";

describe("claim email link form", () => {
  it("renders the public claim link request action for imported operator leads", () => {
    const html = renderToStaticMarkup(
      createElement(ClaimEmailLinkForm, {
        operatorSlug: "dewi-nusantara",
        operatorName: "Dewi Nusantara",
      }),
    );

    expect(html).toContain("Email me my claim link");
    expect(html).toContain("Dewi Nusantara");
    expect(html).toContain("data-operator-slug=\"dewi-nusantara\"");
  });
});
