# BluePass

BluePass is a WhatsApp-first booking marketplace for travel and tour operators. Travellers interact with Kai in WhatsApp, operators respond in WhatsApp Business, and the backend coordinates booking state, PMS holds, payment readiness, and conservation transfers.

## Install

```bash
npm install
npx prisma generate
```

Fill in local values in `.env` before running database-backed flows.

## Development

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default.

## Kai chat channels

Kai now has a multi-channel backend foundation. WhatsApp messages enter through
the Meta webhook, and website chat messages can POST to `/api/kai/web-chat`.
Both channels are intended to use the same future Kai conversation and
orchestration layer for LLM reasoning, trip search, booking state, operator PMS
adapters, and WhatsApp handoff.

Website Kai MVP session model:

- The browser keeps an anonymous `sessionId` in localStorage.
- `/api/kai/web-chat` stores messages server-side as `KaiMessage` rows.
- `/api/kai/web-chat/history?sessionId=...` returns recent web-channel messages
  for that anonymous session.
- Full login/auth is deferred until quote, booking, or cross-device history is
  needed.
- Kai currently uses deterministic, rule-based Indonesia-focused travel slot
  extraction. This prepares the system for future LLM and tool-calling while
  keeping MVP behavior safe and testable.
- Kai LLM v1 is optional and only used for natural response generation. The
  deterministic extractor remains the structured state layer, and PMS, payment,
  booking confirmation, and tool-calling are not enabled yet.

Optional Kai LLM env for OpenAI:

```bash
KAI_LLM_ENABLED=true
KAI_LLM_PROVIDER=openai
KAI_LLM_MODEL=gpt-4o-mini
OPENAI_API_KEY=your-openai-api-key
```

Optional Kai LLM env for Groq:

```bash
KAI_LLM_ENABLED=true
KAI_LLM_PROVIDER=groq
KAI_LLM_MODEL=llama-3.3-70b-versatile
GROQ_API_KEY=your-groq-api-key
```

The Groq provider uses the OpenAI-compatible Chat Completions response shape and
reads replies from `choices[0].message.content`. The OpenAI provider uses the
Responses API parsing path.

Deterministic-only mode:

```bash
KAI_LLM_ENABLED=false
```

Website chat request:

```json
{
  "sessionId": "optional-existing-session-id",
  "message": "I want to dive in Komodo"
}
```

Website chat response:

```json
{
  "sessionId": "kai_generated_or_existing_id",
  "reply": "Thanks - I can help you find the right marine trip. Where are you hoping to go, and what kind of experience are you looking for?"
}
```

## Quality

```bash
npm test
npm run lint
npm run build
```

## WhatsApp number setup for MVP

BluePass currently supports one-number MVP mode. Set `WHATSAPP_PHONE_ID_KAI`
to the Meta `phone_number_id` for the Kai/OpenKai WhatsApp Business number.
Set `WHATSAPP_PHONE_ID_OPS` to the same value, or leave it empty so operator
messages fall back to `WHATSAPP_PHONE_ID_KAI`.

In one-number mode, Kai and operator notifications come from the same WhatsApp
number. Later, BluePass can split Kai and Ops by setting different values for
`WHATSAPP_PHONE_ID_KAI` and `WHATSAPP_PHONE_ID_OPS`. Backend routing in
one-number mode should rely on sender identity and booking/session context, not
the destination phone number.

For local or staging send tests, set:

```bash
META_GRAPH_VERSION=v20.0
WHATSAPP_ACCESS_TOKEN=your_meta_system_user_token
WHATSAPP_PHONE_ID_KAI=1115079071692326
WHATSAPP_PHONE_ID_OPS=1115079071692326
INTERNAL_SERVICE_TOKEN=local-only-shared-secret
```

Send the approved production `bluepass_test_message` utility template to a test recipient:

```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Authorization: Bearer local-only-shared-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+628213143342",
    "role": "kai",
    "templateName": "bluepass_test_message",
    "languageCode": "en_US"
  }'
```

Build and send the future operator booking inquiry template payload:

```bash
curl -X POST http://localhost:3000/api/whatsapp/send \
  -H "Authorization: Bearer local-only-shared-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+628213143342",
    "role": "ops",
    "templateName": "booking_inquiry_operator",
    "languageCode": "en",
    "bookingId": "booking_123",
    "inquiryTitle": "New Komodo inquiry",
    "travellerName": "Ari",
    "travellerPhone": "+628213143342",
    "dateRange": "June 10-14",
    "guests": "2",
    "quote": "$1000",
    "tripTitle": "Komodo Liveaboard",
    "notes": "AOW divers"
  }'
```

## Current Phase

Phase 1 is the production foundation. It includes:

- Next.js App Router with TypeScript and Tailwind.
- Minimal public pages for BluePass, operators, conservation, creators, about, and the future app workspace.
- Booking economics constants and `splitBooking()`.
- Booking state machine with unit tests.
- Prisma schema for operators, trips, travellers, bookings, booking events, Kai sessions, conservation transfers, and encrypted operator integrations.
- Booking orchestrator skeleton that updates status and writes `BookingEvent` rows inside a Prisma transaction.
- WhatsApp webhook verification skeleton with Meta HMAC-SHA256 signature validation.
- Safe Meta WhatsApp Cloud API template sending behind `INTERNAL_SERVICE_TOKEN`.
- Typed WhatsApp template parameter builders.
- PMS adapter interfaces and stubs for Rezdy, FareHarbor, and native inventory.
- Kai slot, matching, and quote skeletons.

## Intentionally Stubbed

These are not implemented in Phase 1:

- Rezdy and FareHarbor API calls.
- Stripe payment links and webhook processing.
- LLM-backed Kai logic.
- Production migrations.
- Conservation transfer execution.

Important rules already represented in the foundation:

- Travellers are not moved to payment until after operator acceptance and PMS hold placement.
- Operators can be wired to Accept, Decline, or Counter from WhatsApp in v1.
- Booking status changes should go through the orchestrator so every transition writes a `BookingEvent`.
- PMS credentials are modeled as encrypted credentials only.
- Inbound WhatsApp webhooks require signature verification.
