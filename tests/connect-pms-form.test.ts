import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ConnectPmsForm } from "@/app/(marketing)/for-operators/connect/ConnectPmsForm";

describe("connect PMS form", () => {
  it("does not ask claimed operators for an internal operator id", () => {
    const html = renderToStaticMarkup(createElement(ConnectPmsForm));

    expect(html).not.toContain("Operator ID");
    expect(html).toContain("Contact email");
    expect(html).toContain("Booking system");
    expect(html).toContain("PMS notes");
  });
});
