import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { kaiConversationService } from "@/lib/services/kai/conversation-service";

const webChatRequestSchema = z.object({
  sessionId: z.string().trim().min(1).optional(),
  message: z.string().trim().min(1),
});
const sessionIdSchema = z.string().regex(/^kai_[A-Za-z0-9_-]+$/);

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
      sessionId: normalizeSessionId(parsed.data.sessionId),
      message: parsed.data.message,
    });

    return NextResponse.json({
      sessionId: result.sessionId,
      reply: result.reply,
      intent: result.intent,
    });
  } catch {
    return NextResponse.json({ error: "Unable to process chat message." }, { status: 500 });
  }
}

function normalizeSessionId(sessionId?: string) {
  if (!sessionId) {
    return undefined;
  }

  return sessionIdSchema.safeParse(sessionId).success ? sessionId : undefined;
}
