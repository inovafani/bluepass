# BluePass

BluePass is a WhatsApp-first booking marketplace for travel and tour operators. Travellers interact with Kai in WhatsApp, operators respond in WhatsApp Business, and the backend coordinates booking state, PMS holds, payment readiness, and conservation transfers.

## Install

```bash
npm install
npx prisma generate
```

Copy `.env.example` to `.env` and fill in local values before running database-backed flows.

## Development

```bash
npm run dev
```

The app runs at `http://localhost:3000` by default.

## Quality

```bash
npm test
npm run lint
npm run build
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
- Typed WhatsApp template parameter builders.
- PMS adapter interfaces and stubs for Rezdy, FareHarbor, and native inventory.
- Kai slot, matching, and quote skeletons.

## Intentionally Stubbed

These are not implemented in Phase 1:

- Rezdy and FareHarbor API calls.
- Stripe payment links and webhook processing.
- Actual Meta WhatsApp send API calls.
- LLM-backed Kai logic.
- Production migrations.
- Conservation transfer execution.

Important rules already represented in the foundation:

- Travellers are not moved to payment until after operator acceptance and PMS hold placement.
- Operators can be wired to Accept, Decline, or Counter from WhatsApp in v1.
- Booking status changes should go through the orchestrator so every transition writes a `BookingEvent`.
- PMS credentials are modeled as encrypted credentials only.
- Inbound WhatsApp webhooks require signature verification.
