# Claim My Business MVP Design

## Context

BluePass now has curated operator pages for newly added public-info listings:

- Mermaid Liveaboards: Mermaid I, Mermaid II
- Scuba Republic: Bajak, Capoeng, Jaya, Epica

The pitch deck positions "Operators claim their profile" as a go-to-market motion, not just a UI detail. The MVP should turn unclaimed public listings into a verified operator onboarding path that supports BluePass' broader supply flywheel: operators claim pages, receive Kai leads, connect inventory/PMS later, and enter the referral mesh.

## Product Goal

Let a legitimate business owner claim an unclaimed BluePass listing while keeping the public product transparent and trustworthy.

The first version should:

- Clearly disclose that an unclaimed listing was built by BluePass from public information.
- Route claim clicks into an account-bound claim start page.
- Create an admin-reviewable claim request.
- After approval, attach the claim to the existing operator profile/account system.
- Set up the operator to later receive Kai inquiries, connect PMS, and participate in referrals.

## Recommended Scope

Ship the verified claim pipeline MVP.

This is intentionally smaller than a full operator CRM, but stronger than a static "email me" page.

Included:

- Unclaimed listing metadata for selected yacht/operator groups.
- Banner on unclaimed yacht pages.
- Claim start page per operator group.
- Claim request form.
- Server-side claim request creation and validation.
- Admin review surface.
- Approved claims update the account's operator profile and link claimed yacht slugs.

Not included yet:

- Automated domain email verification.
- Magic-link email sending.
- PMS sync onboarding wizard.
- Listing edit workflow.
- Operator self-serve inventory editing.
- Multi-user business team management.

## Operator Grouping

Claiming should happen at the business/operator level, not per vessel.

Initial groups:

- `mermaid-liveaboards`
  - Display name: Mermaid Liveaboards
  - Yacht slugs: `mermaid-i`, `mermaid-ii`
  - Claim URL: `/operator/claim/start/mermaid-liveaboards`

- `scuba-republic`
  - Display name: Scuba Republic
  - Yacht slugs: `bajak`, `capoeng`, `jaya`, `epica`
  - Claim URL: `/operator/claim/start/scuba-republic`

Reasoning: one business may manage multiple vessels, and the dashboard should eventually expose all vessels under the same operator relationship.

## Public Listing UX

On unclaimed yacht pages, show a slim top banner above the hero:

> Unclaimed - this page was built by BluePass from public info. Is this your business?

CTA:

> Claim Mermaid Liveaboards ->

or:

> Claim Scuba Republic ->

The hero eyebrow should also reflect status:

> BluePass - Unclaimed Listing - Raja Ampat

Instead of verified badge, show an "Unclaimed" badge with muted gold styling. This avoids implying partnership before approval.

For already-claimed or internally partnered operators, keep the current verified treatment.

## Claim Start Page UX

Route shape:

`/operator/claim/start/[operatorSlug]`

Page content:

- BluePass wordmark
- Eyebrow: Claim your business
- Operator group name
- Short explanation:
  - BluePass created the page from public information to help travellers discover conservation-first trips.
  - Claiming lets the owner correct listing info, add real trips and availability, connect booking systems, receive Kai leads, and participate in the BluePass referral mesh.
  - The claim will be reviewed before the page is marked claimed.
- Primary CTA/form for signed-in users.
- Account gate for signed-out users:
  - Create account
  - Sign in
  - return to the claim URL after auth
- Back link to one representative yacht page.

## Claim Form

For signed-in users, collect:

- Full name
- Business email
- WhatsApp/phone
- Role at business
- Company website
- Optional proof URL or notes
- Checkbox: "I am authorized to claim this business listing."

The form should prefill account email/name/phone where available.

Submitting creates a claim request with `PENDING_REVIEW` status and ensures the account has an operator profile in `PENDING_REVIEW`.

## Data Model

Add a new claim-specific model instead of overloading `SignupLead`.

Suggested Prisma model:

```prisma
model OperatorClaim {
  id              String                  @id @default(cuid())
  operatorSlug    String
  operatorName    String
  yachtSlugs      String[]
  accountId       String
  status          OperatorClaimStatus     @default(PENDING_REVIEW)
  claimantName    String
  claimantEmail   String
  claimantPhone   String?
  claimantRole    String?
  websiteUrl      String?
  proofUrl        String?
  notes           String?
  reviewedAt      DateTime?
  reviewedBy      String?
  createdAt       DateTime                @default(now())
  updatedAt       DateTime                @updatedAt
  account         BluePassAccount         @relation(fields: [accountId], references: [id], onDelete: Cascade)

  @@index([operatorSlug])
  @@index([accountId])
  @@index([status])
}

enum OperatorClaimStatus {
  PENDING_REVIEW
  APPROVED
  DECLINED
}
```

If `String[]` causes portability concerns, store `yachtSlugs` as `Json` with a narrow TypeScript parser. The existing project already uses Prisma/Postgres, so `String[]` is acceptable.

Also extend `OperatorProfile` with:

```prisma
claimedOperatorSlug String?
claimedYachtSlugs   String[]
claimedAt           DateTime?
```

These fields make the dashboard and yacht pages able to know whether the operator is claimed.

## Static Claim Metadata

Create a small source-of-truth module:

`lib/data/operator-claims.ts`

Shape:

```ts
type ClaimableOperator = {
  slug: string;
  name: string;
  yachtSlugs: string[];
  websiteUrl?: string;
  representativeYachtSlug: string;
  sourceLabel: string;
};
```

This keeps marketing/data-only yacht pages from needing database access for static rendering.

## Server Routes

Add:

- `GET /operator/claim/start/[operatorSlug]`
  - Renders claim page.

- `POST /api/operator-claims`
  - Requires signed-in account.
  - Validates operator slug exists in static claim metadata.
  - Validates claimant fields with Zod.
  - Creates or updates a pending `OperatorClaim`.
  - Upserts `OperatorProfile` as `PENDING_REVIEW`.

- Admin action routes or server actions for:
  - approve claim
  - decline claim

Approval should:

- Mark `OperatorClaim.status = APPROVED`.
- Mark account's `OperatorProfile.status = APPROVED`.
- Set claimed operator/yacht fields.
- Create or reuse a `ReferralPartner` role `OPERATOR`.
- Create a referral link targeting the representative yacht or `/discover`.

Decline should:

- Mark claim `DECLINED`.
- Leave the page unclaimed.
- Keep the operator profile pending or declined depending on whether this is the account's only operator application.

## Admin Review

Add claim review into an existing admin area before creating a new public menu.

Recommended path:

`/admin/applications`

or a dedicated tab/section:

`Operator claims`

Each row should show:

- Operator name
- Yacht slugs
- claimant name/email/phone
- claimed website/proof URL
- account email
- created date
- approve/decline actions

The first MVP does not need rich CRM notes.

## Dashboard After Approval

Once approved, the existing dashboard operator card should change from generic copy to:

- Label: `Operator / approved`
- Title: `Mermaid Liveaboards is claimed`
- Body: summarize claimed vessels and next setup actions.
- CTAs:
  - View claimed page
  - Connect PMS
  - View referral link

This keeps claim status connected to the current account/referral architecture.

## Referral Mesh Fit

On approval, operator claims should create an operator referral partner. This supports the pitch deck's "referral mesh" by letting operators share their own BluePass listing and earn/track attributed inquiries.

For MVP:

- Operator referral link target should be the representative yacht page.
- Later, each vessel can get its own link.
- Booking inquiry attribution already supports `referralPartnerId`, `referralCode`, and `referralRole`, so this slots into the existing commission ledger direction.

## Error Handling

- Unknown `operatorSlug`: show 404.
- Already approved by current account: show claimed success state and dashboard CTA.
- Pending claim by current account: show pending review state.
- Pending claim by another account: still allow submission, but admin must resolve duplicates.
- Signed out: route to login/register with `next` back to claim URL.
- Invalid form: inline validation message.

## Tests

Add focused coverage:

- Claim metadata includes Mermaid and Scuba Republic groups.
- Yacht pages for unclaimed slugs render claim banner and unclaimed status.
- Claim start page 404s unknown operator slug.
- `POST /api/operator-claims` rejects signed-out users.
- `POST /api/operator-claims` creates pending claim and operator profile for signed-in user.
- Approval marks claim/profile approved and creates operator referral partner/link.

Full existing commands before handoff:

```bash
npm test
npm run lint
npm run build
```

## Open Decisions

No blocking product decisions remain for MVP.

Assumptions:

- Scuba Republic is claimed as one operator group for all four vessels.
- Mermaid Liveaboards is claimed as one operator group for both vessels.
- The public banner only appears on explicit claimable unclaimed operators, not every public-info page.
- Admin approval remains manual for launch.
