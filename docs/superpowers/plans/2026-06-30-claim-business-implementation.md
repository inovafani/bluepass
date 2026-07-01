# Claim Business MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the verified "Claim my business" MVP for curated unclaimed operator pages.

**Architecture:** Keep public yacht pages statically renderable by adding static claim metadata in `lib/data/operator-claims.ts`. Store submitted claims in a new Prisma `OperatorClaim` model and approve them through the existing admin applications surface. Approval reuses the existing operator profile and referral partner infrastructure.

**Tech Stack:** Next.js App Router, React Server Components, TypeScript, Tailwind CSS, Prisma/PostgreSQL, Zod, Vitest.

---

### Task 1: Static Claim Metadata

**Files:**
- Create: `lib/data/operator-claims.ts`
- Test: `tests/operator-claims-data.test.ts`

- [x] **Step 1: Write failing metadata tests**

Create `tests/operator-claims-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  claimableOperatorBySlug,
  claimableOperatorByYachtSlug,
} from "@/lib/data/operator-claims";

describe("claimable operator metadata", () => {
  it("groups Mermaid vessels under Mermaid Liveaboards", () => {
    expect(claimableOperatorBySlug["mermaid-liveaboards"]).toEqual(
      expect.objectContaining({
        slug: "mermaid-liveaboards",
        name: "Mermaid Liveaboards",
        representativeYachtSlug: "mermaid-i",
        yachtSlugs: ["mermaid-i", "mermaid-ii"],
      }),
    );
    expect(claimableOperatorByYachtSlug["mermaid-i"]?.slug).toBe(
      "mermaid-liveaboards",
    );
    expect(claimableOperatorByYachtSlug["mermaid-ii"]?.slug).toBe(
      "mermaid-liveaboards",
    );
  });

  it("groups Scuba Republic vessels under Scuba Republic", () => {
    expect(claimableOperatorBySlug["scuba-republic"]).toEqual(
      expect.objectContaining({
        slug: "scuba-republic",
        name: "Scuba Republic",
        representativeYachtSlug: "bajak",
        yachtSlugs: ["bajak", "capoeng", "jaya", "epica"],
      }),
    );
    for (const slug of ["bajak", "capoeng", "jaya", "epica"]) {
      expect(claimableOperatorByYachtSlug[slug]?.slug).toBe("scuba-republic");
    }
  });
});
```

- [x] **Step 2: Run red test**

Run: `npm test -- tests/operator-claims-data.test.ts`

Expected: fail because `@/lib/data/operator-claims` does not exist.

- [x] **Step 3: Implement metadata**

Create `lib/data/operator-claims.ts`:

```ts
export type ClaimableOperator = {
  slug: string;
  name: string;
  yachtSlugs: string[];
  representativeYachtSlug: string;
  websiteUrl: string;
  sourceLabel: string;
};

export const claimableOperators: ClaimableOperator[] = [
  {
    slug: "mermaid-liveaboards",
    name: "Mermaid Liveaboards",
    yachtSlugs: ["mermaid-i", "mermaid-ii"],
    representativeYachtSlug: "mermaid-i",
    websiteUrl: "https://www.mermaid-liveaboards.com",
    sourceLabel: "Mermaid Liveaboards public website",
  },
  {
    slug: "scuba-republic",
    name: "Scuba Republic",
    yachtSlugs: ["bajak", "capoeng", "jaya", "epica"],
    representativeYachtSlug: "bajak",
    websiteUrl: "https://scuba-republic.com",
    sourceLabel: "Scuba Republic public website",
  },
];

export const claimableOperatorBySlug = Object.fromEntries(
  claimableOperators.map((operator) => [operator.slug, operator]),
);

export const claimableOperatorByYachtSlug = Object.fromEntries(
  claimableOperators.flatMap((operator) =>
    operator.yachtSlugs.map((yachtSlug) => [yachtSlug, operator]),
  ),
);
```

- [x] **Step 4: Run green test**

Run: `npm test -- tests/operator-claims-data.test.ts`

Expected: pass.

### Task 2: Public Yacht Unclaimed Banner

**Files:**
- Modify: `app/yachts/[slug]/page.tsx`
- Test: `tests/yacht-claim-banner.test.ts`

- [x] **Step 1: Write failing render tests**

Create `tests/yacht-claim-banner.test.ts`:

```ts
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  buildYachtClaimDisplay,
  UnclaimedOperatorBanner,
} from "@/app/yachts/[slug]/page";
import { yachtBySlug } from "@/lib/data/yachts";

describe("yacht unclaimed claim banner", () => {
  it("builds Mermaid claim display from yacht slug", () => {
    const display = buildYachtClaimDisplay("mermaid-i", yachtBySlug["mermaid-i"]);

    expect(display).toEqual(
      expect.objectContaining({
        operatorName: "Mermaid Liveaboards",
        claimHref: "/operator/claim/start/mermaid-liveaboards",
        eyebrow: "BluePass - Unclaimed Listing - Komodo",
      }),
    );
  });

  it("renders a transparent unclaimed banner", () => {
    const html = renderToStaticMarkup(
      <UnclaimedOperatorBanner
        operatorName="Scuba Republic"
        claimHref="/operator/claim/start/scuba-republic"
      />,
    );

    expect(html).toContain("Unclaimed - this page was built by BluePass");
    expect(html).toContain("/operator/claim/start/scuba-republic");
    expect(html).toContain("Claim Scuba Republic");
  });
});
```

- [x] **Step 2: Run red test**

Run: `npm test -- tests/yacht-claim-banner.test.ts`

Expected: fail because exported helpers do not exist.

- [x] **Step 3: Implement banner helpers and UI**

Modify `app/yachts/[slug]/page.tsx`:

- Import `claimableOperatorByYachtSlug`.
- Export `buildYachtClaimDisplay(slug, yacht)`.
- Export `UnclaimedOperatorBanner`.
- In `YachtPage`, compute `claimDisplay`.
- Render banner before hero if present.
- Replace verified badge with an unclaimed badge for claimable unclaimed pages.
- Change eyebrow to `claimDisplay.eyebrow` when present.

- [x] **Step 4: Run green test**

Run: `npm test -- tests/yacht-claim-banner.test.ts`

Expected: pass.

### Task 3: Prisma Claim Model

**Files:**
- Modify: `prisma/schema.prisma`
- Create: `prisma/migrations/<timestamp>_operator_claims/migration.sql`

- [x] **Step 1: Add schema**

Add enum `OperatorClaimStatus`, `OperatorClaim` model, `BluePassAccount.operatorClaims`, and claimed fields on `OperatorProfile`.

- [x] **Step 2: Generate migration**

Run: `npx prisma migrate dev --name operator_claims --create-only`

Expected: migration SQL created.

- [x] **Step 3: Generate client**

Run: `npx prisma generate`

Expected: Prisma Client generated.

### Task 4: Claim Submission Service And API

**Files:**
- Create: `lib/services/operators/operator-claim-service.ts`
- Create: `app/api/operator-claims/route.ts`
- Test: `tests/operator-claim-service.test.ts`

- [x] **Step 1: Write failing service tests**

Create tests that mock `@/lib/db/prisma` and verify:

- `createOperatorClaimForAccount` creates a pending claim and upserts operator profile.
- `approveOperatorClaim` approves claim, approves profile, and creates/reuses referral partner link.

- [x] **Step 2: Run red test**

Run: `npm test -- tests/operator-claim-service.test.ts`

Expected: fail because service does not exist.

- [x] **Step 3: Implement service**

Implement named exports:

- `operatorClaimSchema`
- `createOperatorClaimForAccount(input)`
- `approveOperatorClaim({ claimId, reviewerEmail })`
- `declineOperatorClaim({ claimId, reviewerEmail })`

Use `claimableOperatorBySlug`, Prisma, and existing referral-code normalization/share helpers.

- [x] **Step 4: Implement API route**

`POST /api/operator-claims`:

- parse JSON with Zod
- require `getCurrentTraveller().accountId`
- create claim through service
- return `{ ok: true, claim }`

- [x] **Step 5: Run green tests**

Run: `npm test -- tests/operator-claim-service.test.ts`

Expected: pass.

### Task 5: Claim Start Page

**Files:**
- Create: `app/operator/claim/start/[operatorSlug]/ClaimStartForm.tsx`
- Create: `app/operator/claim/start/[operatorSlug]/page.tsx`

- [x] **Step 1: Implement server page**

Render operator metadata, signed-out account gate, pending/approved states for current account, and signed-in form.

- [x] **Step 2: Implement client form**

Submit to `/api/operator-claims`, show success/error messages, and prefill account fields.

### Task 6: Admin Review Integration

**Files:**
- Modify: `app/admin/applications/page.tsx`

- [x] **Step 1: Load claims**

Fetch `prisma.operatorClaim.findMany` with account included.

- [x] **Step 2: Render Operator claims column/section**

Show operator name, slugs, claimant, proof links, status, approve/decline actions.

- [x] **Step 3: Wire server actions**

Add `approveClaim` and `declineClaim` server actions using claim service.

### Task 7: Dashboard Claimed Operator Card

**Files:**
- Modify: `app/dashboard/page.tsx`

- [x] **Step 1: Load claimed fields and referral link**

Extend operator profile selection with claimed operator slug/yacht slugs/referral partner links.

- [x] **Step 2: Render claimed card**

For approved claimed operators, show claimed vessel count, representative yacht page, PMS connect, and referral link.

### Task 8: Verification

**Files:**
- No new files

- [ ] **Step 1: Run focused tests**

Run:

```bash
npm test -- tests/operator-claims-data.test.ts tests/yacht-claim-banner.test.ts tests/operator-claim-service.test.ts
```

- [ ] **Step 2: Run full checks**

Run:

```bash
npm run lint
npm test
npm run build
```

- [ ] **Step 3: Start dev server and smoke-test routes**

Run dev server at `http://localhost:3000`.

Check:

- `/yachts/mermaid-i` shows unclaimed banner.
- `/operator/claim/start/mermaid-liveaboards` renders.
- `/operator/claim/start/scuba-republic` renders.
