import { NextRequest, NextResponse } from "next/server";
import { verifyMetaSignature } from "@/lib/services/whatsapp/client";
import { handleWhatsAppWebhook } from "@/lib/services/whatsapp/webhook-handler";

export const runtime = "nodejs";

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (
    mode === "subscribe" &&
    token &&
    token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN &&
    challenge
  ) {
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({ error: "Webhook verification failed." }, { status: 403 });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("x-hub-signature-256");
  const appSecret = process.env.WHATSAPP_APP_SECRET ?? "";

  const validSignature = verifyMetaSignature({
    appSecret,
    rawBody,
    signatureHeader,
  });

  if (!validSignature) {
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  }

  void handleWhatsAppWebhook(rawBody);

  return NextResponse.json({ ok: true });
}
