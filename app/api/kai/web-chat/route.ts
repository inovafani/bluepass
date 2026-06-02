import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { kaiConversationService } from "@/lib/services/kai/conversation-service";

const webChatRequestSchema = z.object({
  sessionId: z.string().trim().min(1).optional(),
  message: z.string().trim().min(1),
  recentMessages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string().trim().min(1),
      }),
    )
    .max(12)
    .optional(),
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

  const sessionId = normalizeSessionId(parsed.data.sessionId);

  try {
    const result = await kaiConversationService.handleUserMessage({
      channel: "web",
      sessionId,
      message: parsed.data.message,
      recentMessages: parsed.data.recentMessages,
    });

    return NextResponse.json({
      sessionId: result.sessionId,
      reply: result.reply,
      intent: result.intent,
      ...(result.matches ? { matches: result.matches } : {}),
      ...(result.planner ? { planner: result.planner } : {}),
    });
  } catch (error) {
    console.warn("kai.web_chat.route_failed", {
      stage: "route.POST",
      sessionId: maskSessionId(sessionId),
      errorName: error instanceof Error ? error.name : "UnknownError",
      message: error instanceof Error ? error.message : "Unable to process chat message",
      prismaCode: getPrismaErrorCode(error),
    });
    return NextResponse.json({ error: "Unable to process chat message." }, { status: 500 });
  }
}

function normalizeSessionId(sessionId?: string) {
  if (!sessionId) {
    return undefined;
  }

  return sessionIdSchema.safeParse(sessionId).success ? sessionId : undefined;
}

function maskSessionId(sessionId?: string) {
  if (!sessionId) {
    return undefined;
  }

  return `${sessionId.slice(0, 8)}...${sessionId.slice(-4)}`;
}

function getPrismaErrorCode(error: unknown) {
  if (error && typeof error === "object" && "code" in error) {
    const code = (error as { code?: unknown }).code;

    return typeof code === "string" ? code : undefined;
  }

  return undefined;
}
