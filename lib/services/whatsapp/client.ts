import crypto from "node:crypto";

export type WhatsAppTextMessage = {
  to: string;
  body: string;
};

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

export async function sendWhatsAppText(_message: WhatsAppTextMessage): Promise<void> {
  void _message;

  throw new Error("Not implemented yet");
}
