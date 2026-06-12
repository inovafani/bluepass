# AGENTS.md

Guidance for Codex and other AI coding assistants working in this repository.

## Project Overview

BluePass is a WhatsApp-first booking marketplace for travel and tour operators.
Travellers interact with Kai in WhatsApp, operators respond in WhatsApp Business,
and the backend coordinates booking state, PMS holds, payment readiness, and
conservation transfers.

Current foundation:

- Next.js App Router, React, TypeScript, and Tailwind CSS.
- Prisma/PostgreSQL data model for operators, trips, travellers, bookings,
  booking events, Kai sessions, conservation transfers, encrypted PMS
  integrations, and signup leads.
- WhatsApp webhook verification, payload parsing, operator quick-reply handling,
  and typed message builders.
- Booking state machine and orchestrator.
- PMS adapter interfaces for Rezdy, FareHarbor, and native inventory.
- Vitest coverage for booking state, unit economics, WhatsApp payloads, webhook
  handling, and dispatch builders.

## Commands

Use these before handing off meaningful changes:

```bash
npm test
npm run lint
npm run build
```

Development:

```bash
npm install
npx prisma generate
npm run dev
```

## Project Structure

- `app/` - Next.js App Router pages, layouts, API routes, and shared app
  components.
- `app/(marketing)/` - public marketing pages.
- `app/api/` - server API routes.
- `lib/db/prisma.ts` - shared Prisma client.
- `lib/services/booking/` - booking state machine, orchestrator, economics, and
  PMS adapter contracts.
- `lib/services/whatsapp/` - WhatsApp client helpers, payload parsing, dispatch
  builders, and webhook handling.
- `lib/services/kai/` - Kai session, matching, quote, and counter-offer
  skeletons.
- `lib/constants/` - business constants.
- `prisma/` - schema and migrations.
- `tests/` - Vitest tests.
- `public/` - local image assets for marketing pages.

## Do

- Follow the existing TypeScript style: explicit small types, named exports, and
  simple pure functions where possible.
- Use `@/` imports for app-local modules.
- Validate external input with `zod` in API routes and service boundaries.
- Keep booking status changes behind `lib/services/booking/orchestrator.ts` so
  transitions are validated and `BookingEvent` rows are written.
- Update `lib/services/booking/state-machine.ts` and its tests together when
  adding or changing booking statuses.
- Keep financial rules in `lib/constants/economics.ts` and
  `lib/services/booking/unit-economics.ts`; add tests for any math change.
- Preserve the rule that travellers do not move to payment until after operator
  acceptance and PMS hold placement.
- Keep PMS integrations behind adapter interfaces in
  `lib/services/booking/adapters/`.
- Store PMS credentials only as encrypted credential payloads. Never add raw
  credential fields to Prisma models.
- Verify inbound WhatsApp webhooks with Meta HMAC-SHA256 signatures before
  handling the body.
- In one-number WhatsApp MVP mode, route inbound messages by sender identity,
  booking/session context, or operator action payloads, not by destination phone
  number alone.
- Keep WhatsApp template/button payload formats stable unless tests and handler
  parsing are updated together.
- Add or update Vitest tests for service logic, state transitions, webhook
  parsing, payload formats, and economics.
- Use Prisma migrations for schema changes. Do not hand-edit generated Prisma
  client output.

## Don't

- Do not bypass the booking orchestrator with direct `booking.update({ status })`
  calls in business flows.
- Do not allow payment before a PMS hold is placed.
- Do not treat terminal booking states such as `CANCELLED`, `EXPIRED`,
  `REFUNDED`, `OPERATOR_DECLINED`, or `AUTO_DECLINED` as resumable unless the
  state machine explicitly changes.
- Do not log secrets, access tokens, webhook signatures, app secrets, database
  URLs, or raw encrypted PMS credentials.
- Do not commit `.env` values or add real secrets to docs, tests, or seed data.
- Do not make real Meta, Stripe, Rezdy, FareHarbor, or conservation-transfer API
  calls from tests. Use mocks/fakes.
- Do not replace established service boundaries with logic embedded directly in
  pages or API routes.
- Do not introduce broad dependencies for small utilities already handled by the
  platform, TypeScript, Prisma, Zod, or existing code.

## Frontend Conventions

- Match the current cinematic BluePass visual language: full-bleed travel media,
  restrained glass surfaces, strong whitespace, white/dark ocean contrast, and
  the BluePass wordmark style.
- Reuse shared components such as `SiteHeader`, `BluePassFooter`, and
  `CinematicMarketingPage` when they fit.
- Prefer Tailwind classes plus the design tokens in `app/globals.css` and
  `tailwind.config.ts`.
- Keep pages responsive from mobile through wide desktop. Check fixed heights,
  overlays, and navigation behavior carefully.
- Keep marketing pages visually immersive; avoid generic SaaS card grids when a
  cinematic page pattern is already established.
- Use accessible links, buttons, labels, focus states, and `aria-current` where
  navigation state matters.
- Avoid adding large global CSS unless it is genuinely shared design system
  behavior.

## Backend Conventions

- API routes should stay thin: parse/validate input, call services, return a
  clear JSON response.
- Service functions should be testable without a live network call.
- Use transactions when a workflow updates booking state and writes related
  audit/event data.
- Treat WhatsApp payloads as untrusted input. Parse defensively and ignore
  unknown shapes unless the product flow requires an error.
- Prefer typed payload builders for outbound WhatsApp messages.
- Keep actor payloads JSON-safe and compact.

## Data Model Rules

- `BookingEvent` is the audit trail for booking status changes.
- `OperatorIntegration.encryptedCredentials` is the only PMS credential storage
  shape currently allowed.
- `SignupLead.roles` supports `OPERATOR` and `CREATOR`.
- Use cents for stored booking/payment amounts in Prisma models unless the
  existing field explicitly uses USD decimal math in service tests.

## Testing Guidance

- Unit tests live in `tests/` and use Vitest.
- Add tests next to the behavior being changed by domain, not by implementation
  detail.
- For booking workflows, test allowed and rejected transitions.
- For WhatsApp workflows, test payload extraction, parsing, and button actions.
- For economics, test rounded outputs, commission caps, conservation amount,
  creator share, and payment processor estimate.

## Current Stubs

The following are intentionally not production implementations yet:

- Rezdy and FareHarbor API calls.
- Stripe payment links and webhook processing.
- Actual Meta WhatsApp send API calls.
- LLM-backed Kai logic.
- Conservation transfer execution.

When extending these areas, keep interfaces stable and add tests around the new
contract before wiring real network behavior.

## Environment

Important environment values include:

- `DATABASE_URL`
- `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_PHONE_ID_KAI`
- `WHATSAPP_PHONE_ID_OPS`

For one-number MVP mode, `WHATSAPP_PHONE_ID_OPS` may be the same as
`WHATSAPP_PHONE_ID_KAI` or empty so operator messages fall back to Kai's phone
ID.

