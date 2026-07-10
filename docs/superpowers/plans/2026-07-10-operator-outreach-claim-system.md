# Operator Outreach Claim System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn Tony's 524-operator CSV into a scalable BluePass outreach, claim, review, Kai-routing, and PMS-readiness pipeline.

**Architecture:** Import public operator leads into database-backed `OperatorLead` records, render `/operator/claim/start/[slug]` from those records, issue secure claim tokens by email/business identity, convert verified claims into the existing `OperatorClaim` and `OperatorProfile` flow, track outreach events, and capture PMS readiness from approved operator accounts. Existing static `claimableOperators` remains as fallback so the current claim and Kai flows stay safe.

**Tech Stack:** Next.js App Router, Prisma/PostgreSQL, Vitest, existing BluePass auth/session services, existing operator claim service, existing Kai operator directory bridge.

## Global Constraints

- Do not start local servers unless explicitly requested.
- Do not push, commit, or create branches unless explicitly requested.
- Existing inquiry dispatch, traveller notification, operator claim approval, and Kai directory flows must keep working.
- Slug-only claim pages are public marketing/start pages; secure claim ownership requires account/session or token verification.
- Live PMS integrations cannot be fully completed without real operator credentials; M6 is complete when BluePass can capture, store, and show PMS readiness and existing Bokun integration remains intact.

---

### Task 1: OperatorLead Data Model and Importer

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260710000000_operator_leads/migration.sql`
- Create: `lib/services/operators/operator-leads.ts`
- Create: `scripts/import-operator-leads.mjs`
- Test: `tests/operator-leads.test.ts`

**Produces:**
- `OperatorLead` model with outreach status.
- `parseOperatorLeadCsv(csv: string): OperatorLeadImportRow[]`
- `upsertOperatorLeads(rows): Promise<{ imported: number }>`

**Done when:**
- CSV rows can be parsed/upserted without hardcoding 524 operators.
- Duplicate slugs update existing records.
- Missing phone/email stays nullable instead of blocking import.

### Task 2: Dynamic Claim Page Source

**Files:**
- Modify: `lib/data/operator-claims.ts`
- Create/Modify: `lib/services/operators/claimable-operators.ts`
- Modify: `app/operator/claim/start/[operatorSlug]/page.tsx`
- Test: `tests/operator-claims-data.test.ts`

**Produces:**
- `getClaimableOperator(operatorSlug)` that checks static fallback and DB `OperatorLead`.
- `getClaimableOperatorForYacht(yachtSlug)` keeps current static yacht behavior.

**Done when:**
- `/operator/claim/start/dewi-nusantara` can render from DB after import.
- Existing `/operator/claim/start/calico-jack` still works.

### Task 3: Secure Claim Request Token

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260710000100_operator_claim_tokens/migration.sql`
- Create: `lib/services/operators/operator-claim-token-service.ts`
- Create: `app/api/operator-claim-tokens/route.ts`
- Create: `app/operator/claim/verify/[token]/page.tsx`
- Test: `tests/operator-claim-token-service.test.ts`
- Test: `tests/operator-claim-token-route.test.ts`

**Produces:**
- `OperatorClaimToken` with hashed token, lead slug, email, expiry, used timestamp.
- `requestOperatorClaimToken(slug)` sends or records secure claim token for the business email on file.
- Verify page preloads operator lead context and asks operator to sign in/register before final claim submit.

**Done when:**
- Public page cannot claim ownership by slug alone.
- Token is sent only to the seeded business email; missing email routes to manual review copy.

### Task 4: Claim Approval Sync

**Files:**
- Modify: `lib/services/operators/operator-claim-service.ts`
- Modify: `app/admin/applications/page.tsx`
- Modify: `app/(marketing)/discover/page.tsx`
- Modify: `app/yachts/[slug]/page.tsx`
- Test: `tests/operator-claim-service.test.ts`
- Test: `tests/operator-claim-status.test.ts`
- Test: `tests/yacht-claim-banner.test.ts`

**Produces:**
- Approval updates `OperatorLead.status`, `OperatorClaim`, `OperatorProfile`, referral partner, and claimed yacht status consistently.

**Done when:**
- Approved operators stop showing unclaimed labels/banners.
- Kai directory sees approved/live operator phone and yacht slugs.

### Task 5: Outreach Event Tracking

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260710000200_operator_outreach_events/migration.sql`
- Create: `lib/services/operators/operator-outreach-events.ts`
- Modify: `app/admin/applications/page.tsx`
- Test: `tests/operator-outreach-events.test.ts`

**Produces:**
- `OperatorOutreachEvent` records import, claim link requested, token created, claim submitted, approved, declined, and PMS readiness.
- Admin can see basic lead pipeline counts.

**Done when:**
- Tony can answer: imported, contacted, clicked/requested, submitted, approved, live.

### Task 6: PMS Readiness Capture

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/20260710000300_operator_pms_readiness/migration.sql`
- Modify: `app/(marketing)/for-operators/connect/page.tsx`
- Modify: `app/(marketing)/for-operators/connect/ConnectPmsForm.tsx`
- Modify: `app/api/operator-integrations/route.ts`
- Modify: `app/dashboard/page.tsx`
- Test: `tests/operator-integrations-readiness.test.ts`

**Produces:**
- Approved operator can submit booking system platform, PMS readiness notes, contact email/WhatsApp, and credentials when available.
- Existing Bokun credential path remains supported.

**Done when:**
- Claimed operator can move from claim approval to PMS readiness without knowing raw internal `operatorId`.
- BluePass can distinguish "needs credentials", "credentials submitted", and "connected/synced".

### Task 7: Verification and Manual QA

**Files:**
- No production files unless tests expose a regression.

**Commands:**
- `npm test -- tests/operator-leads.test.ts`
- `npm test -- tests/operator-claims-data.test.ts tests/operator-claim-service.test.ts tests/operator-claim-status.test.ts`
- `npm test -- tests/operator-claim-token-service.test.ts tests/operator-claim-token-route.test.ts`
- `npm test -- tests/operator-outreach-events.test.ts tests/operator-integrations-readiness.test.ts`
- `npm run build`

**Manual QA:**
- Import CSV.
- Visit `/operator/claim/start/dewi-nusantara`.
- Request claim link.
- Submit claim.
- Approve claim.
- Confirm Discover/yacht page no longer says unclaimed.
- Confirm Kai directory includes the operator when `whatsappE164` is set.
- Open dashboard as approved operator and submit PMS readiness.
