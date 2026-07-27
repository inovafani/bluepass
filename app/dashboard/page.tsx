import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentTraveller } from "@/lib/services/auth/session";
import { createKaiCoreOperatorStripeConnectAccount } from "@/lib/services/kai-core/client";
import { buildOperatorDashboardClaimView } from "@/lib/services/operators/operator-dashboard-view";
import {
  createDraftListing,
  listOperatorListingsForAccount,
  operatorListingInputSchema,
  publishListing,
} from "@/lib/services/operators/operator-listing-service";
import { creatorCommissionLedgerKind } from "@/lib/services/referrals/commission-ledger";
import { uploadListingHeroImage } from "@/lib/services/storage/listing-images";
import {
  NewListingForm,
  PublishListingButton,
  type CreateListingState,
  type PublishListingState,
} from "./NewListingForm";

export const metadata = {
  title: "Dashboard | BluePass",
};

const roleCopy: Record<string, string> = {
  TRAVELLER: "Kai profile",
  CREATOR: "Partner mesh",
  OPERATOR: "Operator desk",
  ADMIN: "Admin",
};

export default async function DashboardPage() {
  const traveller = await getCurrentTraveller();

  if (!traveller) {
    redirect("/login?next=/dashboard");
  }

  const account = await prisma.bluePassAccount.findUnique({
    where: { id: traveller.accountId },
    select: {
      displayName: true,
      email: true,
      phone: true,
      roles: true,
      creatorProfile: {
        select: {
          id: true,
          status: true,
          handle: true,
          referralPartnerId: true,
          referralPartner: {
            select: {
              links: {
                select: {
                  code: true,
                  targetPath: true,
                  active: true,
                },
                orderBy: { createdAt: "asc" },
                take: 1,
              },
            },
          },
        },
      },
      operatorProfile: {
        select: {
          status: true,
          companyName: true,
          whatsappE164: true,
          websiteUrl: true,
          claimedOperatorSlug: true,
          claimedYachtSlugs: true,
          claimedAt: true,
          stripeConnectAccountId: true,
          stripeChargesEnabled: true,
          stripePayoutsEnabled: true,
          referralPartner: {
            select: {
              links: {
                select: {
                  code: true,
                  targetPath: true,
                  active: true,
                },
                orderBy: { createdAt: "asc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });

  const roles = account?.roles.length ? account.roles : ["TRAVELLER"];
  const hasCreator = roles.includes("CREATOR");
  const hasOperator = roles.includes("OPERATOR");
  const creatorStats =
    account?.creatorProfile?.referralPartnerId
      ? await getCreatorStats(account.creatorProfile.referralPartnerId)
      : undefined;
  const travellerInquiries = await getTravellerInquiries({
    email: account?.email ?? traveller.email,
    phone: account?.phone ?? traveller.phone,
  });
  const creatorLink = account?.creatorProfile?.referralPartner?.links[0];
  const creatorShareUrl = creatorLink
    ? buildReferralShareUrl(creatorLink.code, creatorLink.targetPath)
    : undefined;
  const operatorLink = account?.operatorProfile?.referralPartner?.links[0];
  const operatorShareUrl = operatorLink
    ? buildReferralShareUrl(operatorLink.code, operatorLink.targetPath)
    : undefined;
  const operatorProfile = account?.operatorProfile ?? null;
  const operatorClaimView = buildOperatorDashboardClaimView(operatorProfile);
  const operatorApproved = operatorProfile?.status === "APPROVED";
  const operatorListings = operatorApproved
    ? await listOperatorListingsForAccount(traveller.accountId)
    : [];

  return (
    <section className="cinematic-page home-hero relative min-h-svh overflow-hidden bg-[#020b11] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://assets.mixkit.co/videos/36621/36621-thumb-720-0.jpg')",
        }}
      />
      <video
        className="absolute inset-0 h-full w-full object-cover"
        poster="https://assets.mixkit.co/videos/36621/36621-thumb-720-0.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source
          src="https://assets.mixkit.co/videos/36621/36621-1080.mp4"
          type="video/mp4"
        />
      </video>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.72),rgba(0,15,21,0.34)_45%,rgba(0,8,14,0.52)),linear-gradient(180deg,rgba(0,0,0,0.28),rgba(0,0,0,0.06)_38%,rgba(0,0,0,0.62))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-[var(--cinematic-screen-x)] pb-14 pt-32">
        <div className="overflow-hidden rounded-2xl border border-white/16 bg-white/[0.10] shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150">
          <div className="grid gap-8 p-5 sm:p-6 md:p-8 lg:grid-cols-[0.92fr_1.08fr]">
            <section className="flex flex-col justify-between gap-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
                  BluePass account
                </p>
                <h1 className="bp-page-title mt-3 text-4xl leading-none text-white md:text-5xl">
                  {account?.displayName ?? traveller.name ?? "Your dashboard"}
                </h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-white/66">
                  One account for Kai, partner referrals, and operator booking
                  operations.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {roles.map((role) => (
                    <span key={role} className="bp-dashboard-role">
                      {roleCopy[role] ?? role}
                      {role === "CREATOR" && account?.creatorProfile?.status
                        ? ` / ${formatStatus(account.creatorProfile.status)}`
                        : ""}
                      {role === "OPERATOR" && account?.operatorProfile?.status
                        ? ` / ${formatStatus(account.operatorProfile.status)}`
                        : ""}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 text-sm text-white/68">
                <ProfileLine label="Email" value={account?.email ?? traveller.email} />
                <ProfileLine label="WhatsApp" value={account?.phone ?? traveller.phone} />
              </div>
            </section>

            <section className="grid gap-4">
              <DashboardPanel
                label="Traveller"
                title="Kai remembers the basics"
                body="Your saved name, email, and WhatsApp can be reused for future inquiries, with a quick confirmation instead of repeated questions."
                actionHref="/"
                actionLabel="Start with Kai"
              />

              <TravellerInquiryPanel inquiries={travellerInquiries} />

              {hasCreator ? (
                account?.creatorProfile?.status === "APPROVED" && creatorStats ? (
                  <CreatorDashboardPanel
                    shareUrl={creatorShareUrl}
                    referralCode={creatorLink?.code}
                    clicks={creatorStats.clicks}
                    inquiries={creatorStats.inquiryCount}
                    estimatedCommissionCents={creatorStats.estimatedCommissionCents}
                    latestInquiries={creatorStats.inquiries}
                  />
                ) : (
                  <DashboardPanel
                    label={`Partner ${formatStatus(account?.creatorProfile?.status)}`}
                    title="Application in review"
                    body="Your partner application is saved. Once approved, this panel will show referral links, clicks, inquiries, and estimated commission."
                    actionHref="/partners"
                    actionLabel="View partner story"
                  />
                )
              ) : (
                <DashboardPanel
                  label="Partner"
                  title="Apply to share trips"
                  body="Partners will get trackable links, attribution, and commission reporting when their audience books through Kai."
                  actionHref="/signup#join"
                  actionLabel="Apply as partner"
                />
              )}

              {hasOperator ? (
                operatorClaimView ? (
                  <ClaimedOperatorDashboardPanel
                    companyName={operatorClaimView.companyName}
                    websiteUrl={operatorProfile?.websiteUrl}
                    claimedYachtSlugs={operatorClaimView.claimedYachtSlugs}
                    inventoryLabel={operatorClaimView.inventoryLabel}
                    primaryHref={operatorClaimView.primaryHref}
                    referralCode={operatorLink?.code}
                    shareUrl={operatorShareUrl}
                    stripePayoutsReady={Boolean(
                      operatorProfile?.stripeChargesEnabled && operatorProfile?.stripePayoutsEnabled,
                    )}
                    stripeOnboardingStarted={Boolean(operatorProfile?.stripeConnectAccountId)}
                  />
                ) : (
                  <DashboardPanel
                    label={`Operator ${formatStatus(account?.operatorProfile?.status)}`}
                    title="Application in review"
                    body="Your operator workspace is saved. Once approved, this panel will show claimed vessels, PMS setup, referral links, and incoming Kai inquiries."
                    actionHref="/operators"
                    actionLabel="View operators"
                  />
                )
              ) : (
                <DashboardPanel
                  label="Operator"
                  title="Apply to receive Kai leads"
                  body="Operators will manage incoming inquiries, availability, PMS connection status, booking pipeline, and payout records."
                  actionHref="/signup#join"
                  actionLabel="Apply as operator"
                />
              )}

              {hasOperator && operatorApproved && (
                <OperatorListingsPanel listings={operatorListings} />
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClaimedOperatorDashboardPanel({
  companyName,
  websiteUrl,
  claimedYachtSlugs,
  inventoryLabel,
  primaryHref,
  referralCode,
  shareUrl,
  stripePayoutsReady,
  stripeOnboardingStarted,
}: {
  companyName: string;
  websiteUrl?: string | null;
  claimedYachtSlugs: string[];
  inventoryLabel: string;
  primaryHref: string;
  referralCode?: string;
  shareUrl?: string;
  stripePayoutsReady: boolean;
  stripeOnboardingStarted: boolean;
}) {
  return (
    <article className="rounded-2xl border border-[#B89A5D]/22 bg-[#B89A5D]/10 p-5 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f1d58a]">
        Claimed operator
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold leading-tight text-white">
            {companyName}
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            {inventoryLabel}
          </p>
        </div>
        {referralCode && (
          <span className="rounded-full border border-[#B89A5D]/24 bg-[#B89A5D]/12 px-3 py-1.5 font-mono text-[11px] font-bold text-[#ffe7a3]">
            {referralCode}
          </span>
        )}
      </div>

      {claimedYachtSlugs.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {claimedYachtSlugs.map((slug) => (
            <Link
              key={slug}
              href={`/yachts/${slug}`}
              className="bp-focus-ring inline-flex h-8 items-center rounded-full border border-white/12 bg-black/14 px-3 text-[11px] font-bold text-white/72 transition-colors hover:bg-white hover:text-[#071827]"
            >
              /yachts/{slug}
            </Link>
          ))}
        </div>
      )}

      {shareUrl && (
        <a
          href={shareUrl}
          className="mt-4 block break-all rounded-xl border border-white/12 bg-black/20 p-3 text-xs font-semibold text-[#9fe8df] transition-colors hover:text-white"
        >
          {shareUrl}
        </a>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href={primaryHref}
          className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-[#071827] transition-colors hover:bg-white/88"
        >
          View claimed page
        </Link>
        <Link
          href="/for-operators/connect"
          className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] px-4 text-xs font-bold text-white transition-colors hover:bg-white/12"
        >
          Connect PMS
        </Link>
        {stripePayoutsReady ? (
          <span className="inline-flex h-10 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 text-xs font-bold text-emerald-200">
            Payouts connected
          </span>
        ) : (
          <form action={connectStripePayoutsAction}>
            <button
              type="submit"
              className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] px-4 text-xs font-bold text-white transition-colors hover:bg-white/12"
            >
              {stripeOnboardingStarted ? "Finish payout setup" : "Connect payouts"}
            </button>
          </form>
        )}
        {websiteUrl && (
          <a
            href={websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] px-4 text-xs font-bold text-white transition-colors hover:bg-white/12"
          >
            Website
          </a>
        )}
      </div>
    </article>
  );
}

function OperatorListingsPanel({
  listings,
}: {
  listings: Array<{
    id: string;
    title: string;
    category: string;
    region: string;
    status: string;
    archivedReason: string | null;
  }>;
}) {
  return (
    <article className="rounded-2xl border border-white/14 bg-white/[0.08] p-5 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9fe8df]">
        My listings
      </p>
      <h2 className="mt-3 text-xl font-semibold leading-tight text-white">
        Trips you list yourself
      </h2>
      <p className="mt-2 text-sm leading-6 text-white/60">
        Save a draft, then publish it - it goes live on Discover right away, no review wait.
      </p>

      <div className="mt-4 grid gap-2">
        {listings.length ? (
          listings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-xl border border-white/10 bg-black/14 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-bold text-white/84">
                  {listing.title}
                </p>
                <span className="shrink-0 rounded-full border border-white/14 bg-white/[0.08] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/62">
                  {formatStatus(listing.status)}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/48">
                {listing.category} / {listing.region}
              </p>
              {listing.status === "ARCHIVED" && listing.archivedReason && (
                <p className="mt-2 text-xs text-[#f1a3a3]">
                  Taken down by BluePass: {listing.archivedReason}
                </p>
              )}
              {listing.status === "DRAFT" && (
                <PublishListingButton listingId={listing.id} action={publishListingAction} />
              )}
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-white/10 bg-black/14 p-3 text-sm text-white/46">
            No listings yet. Add your first trip below.
          </p>
        )}
      </div>

      <NewListingForm action={createListingAction} />
    </article>
  );
}

function ProfileLine({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
      <span className="text-xs uppercase tracking-[0.16em] text-white/38">
        {label}
      </span>
      <span className="max-w-[14rem] truncate font-semibold text-white/84">
        {value ?? "Not set"}
      </span>
    </div>
  );
}

function DashboardPanel({
  label,
  title,
  body,
  actionHref,
  actionLabel,
}: {
  label: string;
  title: string;
  body: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <article className="rounded-2xl border border-white/14 bg-white/[0.08] p-5 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9fe8df]">
        {label}
      </p>
      <h2 className="mt-3 text-xl font-semibold leading-tight text-white">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-6 text-white/60">{body}</p>
      <Link
        href={actionHref}
        className="bp-focus-ring mt-5 inline-flex h-10 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-4 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#071827]"
      >
        {actionLabel}
      </Link>
    </article>
  );
}

function TravellerInquiryPanel({
  inquiries,
}: {
  inquiries: Array<{
    id: string;
    selectedYachtName: string | null;
    destination: string | null;
    dateWindow: string | null;
    status: string;
  }>;
}) {
  return (
    <article className="rounded-2xl border border-white/14 bg-white/[0.08] p-5 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9fe8df]">
        Traveller inquiries
      </p>
      <h2 className="mt-3 text-xl font-semibold leading-tight text-white">
        Operator responses
      </h2>
      <div className="mt-4 grid gap-2">
        {inquiries.length ? (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="rounded-xl border border-white/10 bg-black/14 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-bold text-white/84">
                  {inquiry.selectedYachtName ?? inquiry.destination ?? "BluePass inquiry"}
                </p>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-white/38">
                  {inquiry.status.toLowerCase()}
                </span>
              </div>
              <p className="mt-1 text-xs text-white/48">
                Travel date: {inquiry.dateWindow ?? "Dates pending"}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-white/10 bg-black/14 p-3 text-sm text-white/46">
            No Kai inquiries yet.
          </p>
        )}
      </div>
    </article>
  );
}

function CreatorDashboardPanel({
  shareUrl,
  referralCode,
  clicks,
  inquiries,
  estimatedCommissionCents,
  latestInquiries,
}: {
  shareUrl?: string;
  referralCode?: string;
  clicks: number;
  inquiries: number;
  estimatedCommissionCents: number;
  latestInquiries: Array<{
    id: string;
    travellerName: string | null;
    destination: string | null;
    tripType: string | null;
    budget: string | null;
    status: string;
    createdAt: Date;
  }>;
}) {
  const conversion = clicks > 0 ? Math.round((inquiries / clicks) * 100) : 0;

  return (
    <article className="rounded-2xl border border-white/14 bg-white/[0.08] p-5 backdrop-blur-md">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9fe8df]">
        Partner mesh
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold leading-tight text-white">
            Referral workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-white/60">
            Share this link. Kai will attach your attribution to every inquiry
            created from it.
          </p>
        </div>
        {referralCode && (
          <span className="rounded-full border border-[#9fe8df]/20 bg-[#9fe8df]/10 px-3 py-1.5 font-mono text-[11px] font-bold text-[#d9fffa]">
            {referralCode}
          </span>
        )}
      </div>

      {shareUrl && (
        <a
          href={shareUrl}
          className="mt-4 block break-all rounded-xl border border-white/12 bg-black/20 p-3 text-xs font-semibold text-[#9fe8df] transition-colors hover:text-white"
        >
          {shareUrl}
        </a>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <CreatorMetric label="Clicks" value={String(clicks)} />
        <CreatorMetric label="Inquiries" value={String(inquiries)} />
        <CreatorMetric label="Conversion" value={`${conversion}%`} />
        <CreatorMetric
          label="Est. commission"
          value={formatMoney(estimatedCommissionCents)}
        />
      </div>

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/42">
          Latest inquiries
        </p>
        <div className="mt-3 grid gap-2">
          {latestInquiries.length ? (
            latestInquiries.slice(0, 3).map((inquiry) => (
              <div
                key={inquiry.id}
                className="rounded-xl border border-white/10 bg-black/14 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-bold text-white/84">
                    {inquiry.destination ?? "Unknown destination"} /{" "}
                    {inquiry.tripType ?? "trip"}
                  </p>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-white/38">
                    {inquiry.status.toLowerCase()}
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/48">
                  {inquiry.travellerName ?? "Traveller"} ·{" "}
                  {inquiry.budget ?? "No budget"}
                </p>
              </div>
            ))
          ) : (
            <p className="rounded-xl border border-white/10 bg-black/14 p-3 text-sm text-white/46">
              No attributed inquiries yet.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

function CreatorMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
        {label}
      </p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function formatStatus(status?: string | null) {
  if (!status) return "not started";
  if (status === "PENDING_REVIEW") return "pending review";
  return status.toLowerCase();
}

async function getCreatorStats(referralPartnerId: string) {
  const [clicks, inquiryCount, inquiries, commissionAggregate] = await Promise.all([
    prisma.referralClick.count({
      where: { referralPartnerId },
    }),
    prisma.bookingInquiry.count({
      where: { referralPartnerId },
    }),
    prisma.bookingInquiry.findMany({
      where: { referralPartnerId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        travellerName: true,
        destination: true,
        tripType: true,
        budget: true,
        status: true,
        createdAt: true,
      },
      take: 12,
    }),
    prisma.commissionLedgerEntry.aggregate({
      where: {
        referralPartnerId,
        kind: creatorCommissionLedgerKind(),
      },
      _sum: { amountCents: true },
    }),
  ]);

  return {
    clicks,
    inquiryCount,
    inquiries,
    estimatedCommissionCents: commissionAggregate._sum.amountCents ?? 0,
  };
}

async function getTravellerInquiries(input: {
  email?: string | null;
  phone?: string | null;
}) {
  const filters = [
    input.email ? { travellerEmail: input.email } : undefined,
    input.phone ? { travellerPhone: input.phone } : undefined,
  ].filter((filter): filter is { travellerEmail: string } | { travellerPhone: string } =>
    Boolean(filter),
  );

  if (!filters.length) {
    return [];
  }

  return prisma.bookingInquiry.findMany({
    where: { OR: filters },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      selectedYachtName: true,
      destination: true,
      dateWindow: true,
      status: true,
    },
    take: 5,
  });
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

const LISTING_FIELD_LABELS: Record<string, string> = {
  title: "Trip title",
  category: "Category",
  region: "Region",
  description: "Description",
  heroImageUrl: "Hero image URL",
  maxGuests: "Max guests",
  priceSignal: "Price",
};

async function createListingAction(
  _prevState: CreateListingState,
  formData: FormData,
): Promise<CreateListingState> {
  "use server";

  const traveller = await getCurrentTraveller();
  if (!traveller) redirect("/login?next=/dashboard");

  const maxGuestsRaw = String(formData.get("maxGuests") ?? "").trim();
  const priceSignalRaw = String(formData.get("priceSignal") ?? "").trim();
  const heroImageFile = formData.get("heroImageFile");

  let heroImageUrl: string | undefined;

  try {
    if (heroImageFile instanceof File && heroImageFile.size > 0) {
      heroImageUrl = await uploadListingHeroImage(heroImageFile, traveller.accountId);
    }
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to upload the hero image right now.",
    };
  }

  const parsed = operatorListingInputSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? ""),
    region: String(formData.get("region") ?? ""),
    description: String(formData.get("description") ?? ""),
    heroImageUrl,
    maxGuests: maxGuestsRaw || undefined,
    priceSignal: priceSignalRaw || undefined,
  });

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const fieldLabel = issue ? LISTING_FIELD_LABELS[String(issue.path[0])] : undefined;
    return {
      error: fieldLabel
        ? `${fieldLabel}: ${issue.message}`
        : "Please check the form fields and try again.",
    };
  }

  try {
    await createDraftListing({ ...parsed.data, accountId: traveller.accountId });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to save this listing right now.",
    };
  }

  revalidatePath("/dashboard");
  return { error: null };
}

async function publishListingAction(
  _prevState: PublishListingState,
  formData: FormData,
): Promise<PublishListingState> {
  "use server";

  const traveller = await getCurrentTraveller();
  if (!traveller) redirect("/login?next=/dashboard");

  try {
    await publishListing({
      listingId: String(formData.get("listingId") ?? ""),
      accountId: traveller.accountId,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Unable to publish this listing right now.",
    };
  }

  revalidatePath("/dashboard");
  revalidatePath("/discover");
  return { error: null };
}

async function connectStripePayoutsAction(): Promise<void> {
  "use server";

  const traveller = await getCurrentTraveller();
  if (!traveller) redirect("/login?next=/dashboard");

  const profile = await prisma.operatorProfile.findUnique({
    where: { accountId: traveller.accountId },
    select: { stripeConnectAccountId: true },
  });

  let onboardingUrl: string | null = null;
  try {
    const result = await createKaiCoreOperatorStripeConnectAccount({
      existingStripeAccountId: profile?.stripeConnectAccountId ?? null,
    });
    onboardingUrl = result.onboardingUrl;

    if (!profile?.stripeConnectAccountId) {
      await prisma.operatorProfile.update({
        where: { accountId: traveller.accountId },
        data: { stripeConnectAccountId: result.stripeAccountId },
      });
    }
  } catch {
    // No inline error UI here (this is a plain redirect-only button, not a useActionState form) -
    // send the operator back to the dashboard; the Connect status badge just won't have changed.
    redirect("/dashboard?stripeConnectError=1");
  }

  redirect(onboardingUrl);
}

function buildReferralShareUrl(code: string, targetPath?: string | null) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.BLUEPASS_APP_URL?.trim() ||
    "http://localhost:3000";
  const url = new URL(targetPath?.startsWith("/") ? targetPath : "/", baseUrl);
  url.searchParams.set("ref", code);

  return url.toString();
}
