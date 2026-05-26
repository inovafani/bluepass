import { afterEach, describe, expect, it } from "vitest";
import { resolveWhatsAppPhoneId } from "@/lib/services/whatsapp/client";

const originalKaiPhoneId = process.env.WHATSAPP_PHONE_ID_KAI;
const originalOpsPhoneId = process.env.WHATSAPP_PHONE_ID_OPS;

function setPhoneIds({
  kai,
  ops,
}: {
  kai?: string;
  ops?: string;
}) {
  if (kai === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_KAI;
  } else {
    process.env.WHATSAPP_PHONE_ID_KAI = kai;
  }

  if (ops === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_OPS;
  } else {
    process.env.WHATSAPP_PHONE_ID_OPS = ops;
  }
}

afterEach(() => {
  if (originalKaiPhoneId === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_KAI;
  } else {
    process.env.WHATSAPP_PHONE_ID_KAI = originalKaiPhoneId;
  }

  if (originalOpsPhoneId === undefined) {
    delete process.env.WHATSAPP_PHONE_ID_OPS;
  } else {
    process.env.WHATSAPP_PHONE_ID_OPS = originalOpsPhoneId;
  }
});

describe("resolveWhatsAppPhoneId", () => {
  it("returns WHATSAPP_PHONE_ID_KAI for the kai role", () => {
    setPhoneIds({ kai: "kai_phone_id", ops: "ops_phone_id" });

    expect(resolveWhatsAppPhoneId("kai")).toBe("kai_phone_id");
  });

  it("returns WHATSAPP_PHONE_ID_OPS for the ops role when available", () => {
    setPhoneIds({ kai: "kai_phone_id", ops: "ops_phone_id" });

    expect(resolveWhatsAppPhoneId("ops")).toBe("ops_phone_id");
  });

  it("falls back to WHATSAPP_PHONE_ID_KAI for the ops role when OPS is missing", () => {
    setPhoneIds({ kai: "kai_phone_id" });

    expect(resolveWhatsAppPhoneId("ops")).toBe("kai_phone_id");
  });

  it("throws a clear error when WHATSAPP_PHONE_ID_KAI is missing for kai", () => {
    setPhoneIds({ ops: "ops_phone_id" });

    expect(() => resolveWhatsAppPhoneId("kai")).toThrow(
      "WHATSAPP_PHONE_ID_KAI is required for Kai WhatsApp sends.",
    );
  });

  it("throws a clear error when both OPS and KAI are missing for ops", () => {
    setPhoneIds({});

    expect(() => resolveWhatsAppPhoneId("ops")).toThrow(
      "WHATSAPP_PHONE_ID_OPS is not set and WHATSAPP_PHONE_ID_KAI fallback is unavailable for Ops WhatsApp sends.",
    );
  });
});
