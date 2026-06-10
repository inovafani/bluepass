import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getCurrentTraveller } from "@/lib/services/auth/session";

export const metadata = {
  title: "Dashboard | BluePass",
};

const roleCopy: Record<string, string> = {
  TRAVELLER: "Kai profile",
  CREATOR: "Creator mesh",
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
  const creatorLink = account?.creatorProfile?.referralPartner?.links[0];
  const creatorShareUrl = creatorLink
    ? buildReferralShareUrl(creatorLink.code, creatorLink.targetPath)
    : undefined;

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
                  One account for Kai, creator referrals, and operator booking
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

              {hasCreator ? (
                account?.creatorProfile?.status === "APPROVED" && creatorStats ? (
                  <CreatorDashboardPanel
                    shareUrl={creatorShareUrl}
                    referralCode={creatorLink?.code}
                    clicks={creatorStats.clicks}
                    inquiries={creatorStats.inquiries.length}
                    estimatedCommissionCents={creatorStats.estimatedCommissionCents}
                    latestInquiries={creatorStats.inquiries}
                  />
                ) : (
                  <DashboardPanel
                    label={`Creator ${formatStatus(account?.creatorProfile?.status)}`}
                    title="Application in review"
                    body="Your creator application is saved. Once approved, this panel will show referral links, clicks, inquiries, and estimated commission."
                    actionHref="/creators"
                    actionLabel="View creator story"
                  />
                )
              ) : (
                <DashboardPanel
                  label="Creator"
                  title="Apply to share trips"
                  body="Creators will get trackable links, attribution, and commission reporting when their audience books through Kai."
                  actionHref="/signup#join"
                  actionLabel="Apply as creator"
                />
              )}

              {hasOperator ? (
                <DashboardPanel
                  label={`Operator ${formatStatus(account?.operatorProfile?.status)}`}
                  title="Inquiry command center"
                  body="Incoming Kai inquiries, WhatsApp accept/decline/counter actions, PMS holds, payments, and operator net payout reporting will land here."
                  actionHref="/operators"
                  actionLabel="View operators"
                />
              ) : (
                <DashboardPanel
                  label="Operator"
                  title="Apply to receive Kai leads"
                  body="Operators will manage incoming inquiries, availability, PMS connection status, booking pipeline, and payout records."
                  actionHref="/signup#join"
                  actionLabel="Apply as operator"
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </section>
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
        Creator mesh
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
  const [clicks, inquiries] = await Promise.all([
    prisma.referralClick.count({
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
  ]);

  return {
    clicks,
    inquiries,
    estimatedCommissionCents: inquiries.reduce(
      (total, inquiry) => total + estimateCreatorCommissionCents(inquiry.budget),
      0,
    ),
  };
}

function estimateCreatorCommissionCents(budget?: string | null) {
  const usd = parseBudgetUsd(budget);
  return Math.round(usd * 0.03 * 100);
}

function parseBudgetUsd(value?: string | null) {
  if (!value) {
    return 0;
  }

  const match = value
    .replace(/,/g, "")
    .match(/(?:\$|usd\s*)?\s*(\d{2,7})(?:\s*(?:usd|dollars?))?/i);

  return match ? Number(match[1]) : 0;
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
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
