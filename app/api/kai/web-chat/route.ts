import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { kaiConversationService } from "@/lib/services/kai/conversation-service";

const webChatRequestSchema = z.object({
  sessionId: z.string().trim().min(1).optional(),
  message: z.string().trim().min(1),
});

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = webChatRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  try {
    const result = await kaiConversationService.handleUserMessage({
      channel: "web",
      sessionId: parsed.data.sessionId,
      message: parsed.data.message,
    });

    return NextResponse.json({
      sessionId: result.sessionId,
      reply: result.reply,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process chat message." }, { status: 500 });
  }
}
