import crypto from "node:crypto";

export type WhatsAppSenderRole = "kai" | "ops";

export type WhatsAppTextMessage = {
  to: string;
  body: string;
  role?: WhatsAppSenderRole;
};

function presentEnvValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function resolveWhatsAppPhoneId(role: WhatsAppSenderRole): string {
  const kaiPhoneId = presentEnvValue(process.env.WHATSAPP_PHONE_ID_KAI);

  if (role === "kai") {
    if (!kaiPhoneId) {
      throw new Error("WHATSAPP_PHONE_ID_KAI is required for Kai WhatsApp sends.");
    }

    return kaiPhoneId;
  }

  const opsPhoneId = presentEnvValue(process.env.WHATSAPP_PHONE_ID_OPS);
  if (opsPhoneId) {
    return opsPhoneId;
  }

  if (kaiPhoneId) {
    return kaiPhoneId;
  }

  throw new Error(
    "WHATSAPP_PHONE_ID_OPS is not set and WHATSAPP_PHONE_ID_KAI fallback is unavailable for Ops WhatsApp sends.",
  );
}

export function verifyMetaSignature({
  appSecret,
  rawBody,
  signatureHeader,
}: {
  appSecret: string;
  rawBody: string;
  signatureHeader: string | null;
}): boolean {
  if (!appSecret || !signatureHeader?.startsWith("sha256=")) {
    return false;
  }

  const expected = `sha256=${crypto
    .createHmac("sha256", appSecret)
    .update(rawBody, "utf8")
    .digest("hex")}`;

  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(signatureHeader, "utf8");

  return (
    expectedBuffer.length === receivedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
  );
}

export async function sendWhatsAppText(message: WhatsAppTextMessage): Promise<void> {
  const phoneId = resolveWhatsAppPhoneId(message.role ?? "kai");
  void phoneId;
  void message;

  throw new Error("Not implemented yet");
}
