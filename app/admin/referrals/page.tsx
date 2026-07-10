import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireCurrentAdmin } from "@/lib/services/auth/admin";
import { AdminNav } from "@/app/admin/admin-nav";
import { buildReferralShareUrl } from "@/lib/services/referrals/application-approval";
import { creatorCommissionLedgerKind } from "@/lib/services/referrals/commission-ledger";

export const metadata = {
  title: "Referrals | BluePass Admin",
};

export default async function AdminReferralsPage() {
  const admin = await requireCurrentAdmin();

  if (!admin) {
    redirect("/login?next=/admin/referrals");
  }

  const [partners, ledgerRows] = await Promise.all([
    prisma.referralPartner.findMany({
      orderBy: [{ role: "asc" }, { createdAt: "desc" }],
      include: {
        links: {
          orderBy: { createdAt: "asc" },
          include: {
            _count: { select: { clicks: true, bookingInquiries: true } },
          },
        },
        bookingInquiries: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            travellerName: true,
            destination: true,
            status: true,
            budget: true,
            createdAt: true,
          },
          take: 5,
        },
        _count: {
          select: { clicks: true, bookingInquiries: true },
        },
      },
    }),
    prisma.commissionLedgerEntry.groupBy({
      by: ["referralPartnerId", "kind", "status"],
      where: { referralPartnerId: { not: null } },
      _sum: { amountCents: true },
    }),
  ]);

  const ledgerByPartner = buildLedgerSummaryByPartner(ledgerRows);

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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.78),rgba(0,15,21,0.45)_45%,rgba(0,8,14,0.68)),linear-gradient(180deg,rgba(0,0,0,0.34),rgba(0,0,0,0.12)_38%,rgba(0,0,0,0.72))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-[var(--cinematic-screen-x)] pb-14 pt-32">
        <div className="overflow-hidden rounded-2xl border border-white/16 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150 sm:p-6 md:p-8">
          <AdminNav active="referrals" email={admin.email} />
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
              BluePass admin
            </p>
            <h1 className="bp-page-title mt-3 text-4xl leading-none text-white md:text-5xl">
              Referral ledger
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/66">
              Track referral partners, share links, attributed inquiries, and
              pending commission estimates from Kai inquiries.
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            {partners.length ? (
              partners.map((partner) => {
                const ledger = ledgerByPartner.get(partner.id) ?? emptyLedgerSummary();

                return (
                  <article
                    key={partner.id}
                    className="rounded-2xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur-md"
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-bold text-white">{partner.name}</h2>
                          <span className="rounded-full border border-[#9fe8df]/20 bg-[#9fe8df]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9fffa]">
                            {partner.role.toLowerCase()}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-white/52">
                          {partner.handle ?? partner.email ?? "No public handle"}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <AdminMetric label="Clicks" value={String(partner._count.clicks)} />
                        <AdminMetric
                          label="Inquiries"
                          value={String(partner._count.bookingInquiries)}
                        />
                        <AdminMetric
                          label="Partner est."
                          value={formatMoney(ledger.creatorCommissionCents)}
                        />
                        <AdminMetric label="Payout" value={ledger.statusSummary} />
                      </div>
                    </div>

                    <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
                      <div className="rounded-xl border border-white/10 bg-black/15 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                          Referral links
                        </p>
                        <div className="mt-3 grid gap-2">
                          {partner.links.length ? (
                            partner.links.map((link) => (
                              <div
                                key={link.id}
                                className="rounded-lg border border-white/8 bg-white/[0.04] p-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="font-mono text-xs text-white/84">
                                    {link.code}
                                  </p>
                                  <p className="text-[11px] text-white/45">
                                    {link._count.clicks} clicks ·{" "}
                                    {link._count.bookingInquiries} inquiries
                                  </p>
                                </div>
                                <p className="mt-1 break-all text-xs text-[#9fe8df]">
                                  {buildReferralShareUrl(link.code, link.targetPath)}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-white/46">No links yet.</p>
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-white/10 bg-black/15 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
                          Latest referred inquiries
                        </p>
                        <div className="mt-3 grid gap-2">
                          {partner.bookingInquiries.length ? (
                            partner.bookingInquiries.map((inquiry) => (
                              <div
                                key={inquiry.id}
                                className="rounded-lg border border-white/8 bg-white/[0.04] p-3"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <p className="text-sm font-semibold text-white">
                                    {inquiry.destination ?? "Unknown destination"}
                                  </p>
                                  <span className="text-[11px] uppercase tracking-[0.1em] text-white/45">
                                    {inquiry.status.toLowerCase()}
                                  </span>
                                </div>
                                <p className="mt-1 text-xs text-white/52">
                                  {inquiry.travellerName ?? "Traveller"} ·{" "}
                                  {inquiry.budget ?? "No budget"} ·{" "}
                                  {formatDate(inquiry.createdAt)}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-white/46">
                              No attributed inquiries yet.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 sm:grid-cols-3">
                      <AdminMetric
                        label="BluePass est."
                        value={formatMoney(ledger.bluepassCommissionCents)}
                      />
                      <AdminMetric
                        label="Reef allocation"
                        value={formatMoney(ledger.conservationCents)}
                      />
                      <AdminMetric
                        label="Operator placeholder"
                        value={formatMoney(ledger.operatorPayoutCents)}
                      />
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm text-white/48">
                No referral partners yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/15 p-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
        {label}
      </p>
      <p className="mt-2 text-sm font-black text-white">{value}</p>
    </div>
  );
}

type LedgerGroupRow = {
  referralPartnerId: string | null;
  kind: string;
  status: string;
  _sum: { amountCents: number | null };
};

type LedgerSummary = {
  creatorCommissionCents: number;
  bluepassCommissionCents: number;
  conservationCents: number;
  operatorPayoutCents: number;
  statuses: Set<string>;
  statusSummary: string;
};

function buildLedgerSummaryByPartner(rows: LedgerGroupRow[]) {
  const summaries = new Map<string, LedgerSummary>();

  for (const row of rows) {
    if (!row.referralPartnerId) {
      continue;
    }

    const summary = summaries.get(row.referralPartnerId) ?? emptyLedgerSummary();
    const amount = row._sum.amountCents ?? 0;

    if (row.kind === creatorCommissionLedgerKind()) {
      summary.creatorCommissionCents += amount;
    } else if (row.kind === "BLUEPASS_PLATFORM_COMMISSION") {
      summary.bluepassCommissionCents += amount;
    } else if (row.kind === "CONSERVATION_ALLOCATION") {
      summary.conservationCents += amount;
    } else if (row.kind === "OPERATOR_PAYOUT_PLACEHOLDER") {
      summary.operatorPayoutCents += amount;
    }

    summary.statuses.add(row.status);
    summary.statusSummary = formatStatusSummary(summary.statuses);
    summaries.set(row.referralPartnerId, summary);
  }

  return summaries;
}

function emptyLedgerSummary(): LedgerSummary {
  return {
    creatorCommissionCents: 0,
    bluepassCommissionCents: 0,
    conservationCents: 0,
    operatorPayoutCents: 0,
    statuses: new Set<string>(),
    statusSummary: "none",
  };
}

function formatStatusSummary(statuses: Set<string>) {
  if (!statuses.size) {
    return "none";
  }

  return Array.from(statuses)
    .sort()
    .map((status) => status.toLowerCase())
    .join(", ");
}

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
