import { z } from "zod";

const webhookPayloadSchema = z.object({
  object: z.string().optional(),
  entry: z.array(z.unknown()).optional(),
});

export type WhatsAppWebhookPayload = z.infer<typeof webhookPayloadSchema>;

export async function handleWhatsAppWebhook(rawBody: string): Promise<void> {
  const parsedJson: unknown = JSON.parse(rawBody);
  const payload = webhookPayloadSchema.parse(parsedJson);

  void payload;
}
