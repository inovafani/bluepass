import type {
  KaiChannel,
  KaiConversationMessage,
  KaiMissingSlot,
  KaiTravelIntent,
} from "@/lib/services/kai/types";

const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = "gpt-4.1-mini";

export type GenerateKaiReplyInput = {
  messages: KaiConversationMessage[];
  intent: KaiTravelIntent;
  missingSlots?: KaiMissingSlot[];
  channel: KaiChannel;
  deterministicReply: string;
};

type OpenAIResponse = {
  output_text?: string;
  output?: Array<{
    content?: Array<{
      text?: string;
      type?: string;
    }>;
  }>;
};

export async function generateKaiReply(input: GenerateKaiReplyInput): Promise<string> {
  if (!isKaiLlmEnabled()) {
    return input.deterministicReply;
  }

  if (resolveKaiLlmProvider() !== "openai") {
    console.warn("Kai LLM provider is unsupported; using deterministic fallback.");
    return input.deterministicReply;
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return input.deterministicReply;
  }

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: resolveKaiLlmModel(),
        instructions: buildKaiSystemInstructions(),
        input: buildOpenAIInput(input),
        max_output_tokens: 220,
      }),
    });

    if (!response.ok) {
      console.warn(`Kai LLM request failed with status ${response.status}; using fallback.`);
      return input.deterministicReply;
    }

    const body = (await response.json()) as OpenAIResponse;
    const reply = extractOpenAIText(body);

    return reply || input.deterministicReply;
  } catch (error) {
    console.warn("Kai LLM request failed; using deterministic fallback.", {
      error: error instanceof Error ? error.message : "unknown error",
    });
    return input.deterministicReply;
  }
}

export function isKaiLlmEnabled() {
  return process.env.KAI_LLM_ENABLED === "true";
}

function resolveKaiLlmProvider() {
  return process.env.KAI_LLM_PROVIDER ?? "openai";
}

function resolveKaiLlmModel() {
  return process.env.KAI_LLM_MODEL ?? DEFAULT_OPENAI_MODEL;
}

function buildKaiSystemInstructions() {
  return [
    "You are Kai, the BluePass marine travel concierge.",
    "BluePass is currently focused on Indonesia marine and coastal trips only.",
    "Supported destination examples include Komodo, Raja Ampat, Bali, Nusa Penida, Nusa Lembongan, Lombok, Gili Islands, Alor, Wakatobi, Banda Sea, Ambon, Derawan, Bunaken, Lembeh, Flores, Sumba, Mentawai, and Cenderawasih Bay.",
    "Kai can help discover suitable trips, but cannot yet confirm live availability, make bookings, place PMS holds, contact operators, collect payment, or confirm reservations.",
    "Use the extracted intent as structured context. Do not invent facts, prices, availability, operators, booking status, or payment links.",
    "If the user asks for a non-Indonesian destination, explain BluePass is currently Indonesia-focused and offer Indonesian alternatives.",
    "Ask one or two useful follow-up questions at a time, based on missing travel details.",
    "Keep replies calm, premium, concise, helpful, and short enough for a website chat UI.",
  ].join("\n");
}

function buildOpenAIInput(input: GenerateKaiReplyInput) {
  const context = {
    channel: input.channel,
    intent: input.intent,
    missingSlots: input.missingSlots ?? input.intent.missingSlots ?? [],
    deterministicFallbackReply: input.deterministicReply,
  };
  const recentMessages = input.messages.slice(-8).map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: message.content,
  }));

  return [
    {
      role: "user",
      content: `Structured Kai context:\n${JSON.stringify(context, null, 2)}`,
    },
    ...recentMessages,
  ];
}

function extractOpenAIText(response: OpenAIResponse) {
  if (typeof response.output_text === "string") {
    return response.output_text.trim();
  }

  const text = response.output
    ?.flatMap((item) => item.content ?? [])
    .map((content) => content.text)
    .filter((value): value is string => typeof value === "string")
    .join("\n")
    .trim();

  return text;
}
