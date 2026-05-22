import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsAppText } from "@/lib/services/whatsapp/client";

const sendRequestSchema = z.object({
  to: z.string().min(5),
  body: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const serviceToken = request.headers.get("authorization")?.replace("Bearer ", "");

  if (!process.env.INTERNAL_SERVICE_TOKEN || serviceToken !== process.env.INTERNAL_SERVICE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const payload = sendRequestSchema.parse(await request.json());
  await sendWhatsAppText(payload);

  return NextResponse.json({ queued: true });
}
