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
- `lib/data/yachts.ts` remains the static BluePass preview yacht catalog and is
  still the source of truth for explore pages, operator fleet browsing, yacht
  detail pages, and Kai preview-fleet suggestions.
- Once Kai knows a useful core intent such as destination, trip type, and guest
  count, it can return top static yacht matches in `/api/kai/web-chat` as
  `matches`. These are shortlist suggestions from the preview catalog only, not
  live availability, final pricing, operator acceptance, or confirmed booking
  state.
- Kai LLM v1 is optional and only used for natural response generation. The
  deterministic extractor remains the structured state layer, and PMS, payment,
  booking confirmation, and tool-calling are not enabled yet.
- Operator WhatsApp inquiry dispatch is intentionally not wired to the static
  yacht catalog. The next backend step is: traveller selects or approves a yacht
  match, BluePass creates a `BookingInquiry`, and the backend dispatches that
  inquiry to the operator through WhatsApp. Operator contact details must come
  from a database mapping, explicit endpoint input, or an environment variable
  such as `BLUEPASS_TEST_OPERATOR_PHONE`, not invented from `yachts.ts`.

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
  "reply": "Based on the current BluePass preview fleet, I'd shortlist...",
  "intent": {
    "destination": "Raja Ampat",
    "tripType": "liveaboard",
    "guests": 3
  },
  "matches": [
    {
      "slug": "aliikai",
      "name": "Aliikai",
      "region": "Raja Ampat",
      "tier": "Premium",
      "cabinBookable": true,
      "matchingReasons": ["Raja Ampat route", "fits 3 guests", "cabin bookable"]
    }
  ]
}
```

Create a website Kai inquiry after the traveller explicitly confirms a selected
match:

```bash
curl -X POST http://localhost:3000/api/kai/web-chat/inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "kai_generated_or_existing_id",
    "selectedYachtSlug": "aliikai",
    "confirm": true
  }'
```

This creates or reuses an active `BookingInquiry` only when the persisted Kai
session has enough intent for dispatch readiness: destination, trip type,
guests, travel dates, budget, contact details, and either a selected yacht or
notes. Certification level is stored when volunteered, but is not required for
liveaboard dispatch. This endpoint does not send WhatsApp automatically.

Dispatch a ready inquiry to an operator WhatsApp number for MVP testing:

```bash
curl -X POST http://localhost:3000/api/kai/web-chat/inquiry/dispatch \
  -H "Authorization: Bearer local-only-shared-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "inquiryId": "inq_...",
    "operatorPhone": "+628213143342"
  }'
```

The dispatch endpoint requires `INTERNAL_SERVICE_TOKEN`. If `operatorPhone` is
omitted it uses `BLUEPASS_TEST_OPERATOR_PHONE`; if neither is set the request is
rejected. Operator contact details are not stored in `yachts.ts`. The operator
receives the `booking_inquiry_operator` WhatsApp template from the configured
BluePass/OpenKai WhatsApp Business number. The outbound WhatsApp context is
stored so future operator button replies can be resolved safely.

## Bokun operator catalog sync

BluePass treats Bokun as one operator PMS/inventory provider. The safe v1 flow is:

1. Create or identify an `Operator` row in the database.
2. Connect that operator's Bokun credentials through `/for-operators/connect` or
   `POST /api/operator-integrations`.
3. The integration endpoint validates Bokun credentials and syncs Bokun products
   into local `Trip` rows using `Trip.externalId`.
4. Kai matches traveller intent against synced `Trip` rows and can present those
   packages as candidate matches.

Kai does not yet place Bokun holds, confirm bookings, collect payment, or claim
live availability from chat. Matched packages are synced catalog candidates only.

Example Bokun operator integration request:

```json
{
  "operatorId": "operator_...",
  "platform": "BOKUN",
  "credentials": {
    "apiBase": "https://api.bokun.io/octo/v1",
    "accessToken": "bokun-octo-access-token",
    "supplierId": "optional-supplier-id",
    "publicProductUrlTemplate": "https://your-operator.bokun.io/book/{productId}",
    "restApiBase": "https://api.bokun.io",
    "restAccessKey": "optional-bokun-rest-access-key",
    "restSecretKey": "optional-bokun-rest-secret-key"
  }
}
```

Each Bokun operator stores its own public booking URL in encrypted integration
credentials. Use `publicProductUrlTemplate` when the operator's booking page can
be addressed by product id, or `publicBookingBaseUrl` when BluePass should append
the synced `Trip.externalId`. If neither is configured, Kai can still show the
synced package card and routes travellers to a WhatsApp booking inquiry fallback.

Bokun product thumbnails are synced from the REST v2 Experience Components API
when `restAccessKey` and `restSecretKey` are configured for the operator. The
OCTO `/products` response does not expose back-office product photos; photos are
retrieved from `PHOTOS` components and stored as `Trip.imageUrl`.

The same sync can be refreshed later with:

```bash
curl -X POST http://localhost:3000/api/cron/bokun-sync \
  -H "Authorization: Bearer local-cron-secret"
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
