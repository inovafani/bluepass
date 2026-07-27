import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireCurrentAdmin } from "@/lib/services/auth/admin";
import { AdminNav } from "@/app/admin/admin-nav";
import {
  listKaiCoreBluePassLedger,
  markKaiCoreBluePassLedgerEntryPaid,
  releaseKaiCoreBluePassLedgerEntryPayoutViaStripe,
  type KaiCoreBluePassLedgerEntry,
} from "@/lib/services/kai-core/client";

const TENANT_SLUG = "bluepass";

export const metadata = {
  title: "Commission payouts | BluePass Admin",
};

export default async function AdminBluePassLedgerPage() {
  const admin = await requireCurrentAdmin();
  if (!admin) {
    redirect("/login?next=/admin/bluepass-ledger");
  }

  let entries: KaiCoreBluePassLedgerEntry[] = [];
  let loadError: string | null = null;

  try {
    entries = await listKaiCoreBluePassLedger({ tenantSlug: TENANT_SLUG, status: "FINALIZED" });
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Failed to load the BluePass commission ledger.";
  }

  const totalOwedCents = entries
    .filter((entry) => !entry.paidOutAt)
    .reduce((sum, entry) => sum + entry.amountCents, 0);

  return (
    <div className="relative min-h-svh bg-[#020b11] text-white">
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-14">
        <AdminNav active="bluepass-ledger" email={admin.email} />

        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">BluePass admin</p>
          <h1 className="mt-3 text-4xl font-black leading-none text-white md:text-5xl">Commission payouts</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/66">
            Finalized commission ledger entries for confirmed BluePass bookings - the real, computed 18%
            split (5% conservation / 5% partner / 3% payments / 5% platform), not a budget-text estimate.
            Mark an entry paid once the operator has actually been sent their share.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur-md sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">Total unpaid</p>
          <p className="mt-2 text-2xl font-black text-white">{formatMoney(totalOwedCents)}</p>
        </div>

        <div className="mt-6 grid gap-3">
          {loadError ? (
            <EmptyState label={`Could not load the ledger: ${loadError}`} />
          ) : entries.length ? (
            entries.map((entry) => <LedgerRow key={entry.id} entry={entry} />)
          ) : (
            <EmptyState label="No finalized commission entries yet." />
          )}
        </div>
      </div>
    </div>
  );
}

function LedgerRow({ entry }: { entry: KaiCoreBluePassLedgerEntry }) {
  const isPaid = Boolean(entry.paidOutAt);

  return (
    <article className="rounded-2xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur-md sm:p-5">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-white">{formatKind(entry.kind)}</h2>
            <span
              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                isPaid
                  ? "border-[#9fe8df]/20 bg-[#9fe8df]/10 text-[#d9fffa]"
                  : "border-white/20 bg-white/10 text-white/80"
              }`}
            >
              {isPaid ? "Paid" : "Owed"}
            </span>
          </div>
          <p className="mt-1 text-xs text-white/52">
            {entry.inquiry?.selectedYachtName ?? "Unknown yacht"} · {entry.inquiry?.operatorName ?? "Unknown operator"} ·{" "}
            {entry.inquiry?.destination ?? "Unknown destination"}
          </p>
        </div>
        <p className="text-xl font-black text-white">{formatMoney(entry.amountCents, entry.currency)}</p>
      </div>

      {isPaid ? (
        <p className="mt-4 text-xs text-white/52">
          Paid via <span className="font-mono text-white/76">{entry.paidOutReference}</span> by {entry.paidOutBy} on{" "}
          {formatDate(entry.paidOutAt!)}
        </p>
      ) : (
        <div className="mt-4 grid gap-2">
          <form action={markLedgerEntryPaid} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="entryId" value={entry.id} />
            <input
              type="text"
              name="paidOutReference"
              required
              placeholder="Bank transfer reference"
              className="h-10 min-w-[220px] flex-1 rounded-full border border-white/16 bg-white/[0.06] px-4 text-xs text-white placeholder:text-white/40"
            />
            <button
              type="submit"
              className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-[#071827] transition-colors hover:bg-white/88"
            >
              Mark paid manually
            </button>
          </form>
          {entry.kind === "OPERATOR_PAYOUT_PLACEHOLDER" && (
            <form action={releaseLedgerEntryViaStripe} className="flex flex-wrap items-center gap-2">
              <input type="hidden" name="entryId" value={entry.id} />
              <input
                type="text"
                name="stripeConnectAccountId"
                required
                placeholder="Operator's Stripe Connect account ID (acct_...)"
                className="h-10 min-w-[280px] flex-1 rounded-full border border-white/16 bg-white/[0.06] px-4 text-xs text-white placeholder:text-white/40"
              />
              <button
                type="submit"
                className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-[#9fe8df]/30 bg-[#9fe8df]/10 px-4 text-xs font-black text-[#d9fffa] transition-colors hover:bg-[#9fe8df]/20"
              >
                Release via Stripe
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm text-white/48">{label}</div>
  );
}

function formatKind(kind: string) {
  return kind
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

async function markLedgerEntryPaid(formData: FormData) {
  "use server";

  const admin = await requireCurrentAdmin();
  if (!admin) redirect("/login?next=/admin/bluepass-ledger");

  const entryId = String(formData.get("entryId") ?? "");
  const paidOutReference = String(formData.get("paidOutReference") ?? "").trim();

  if (!entryId || !paidOutReference) {
    return;
  }

  await markKaiCoreBluePassLedgerEntryPaid({
    tenantSlug: TENANT_SLUG,
    entryId,
    paidOutReference,
    reviewerEmail: admin.email,
  });

  revalidatePath("/admin/bluepass-ledger");
}

async function releaseLedgerEntryViaStripe(formData: FormData) {
  "use server";

  const admin = await requireCurrentAdmin();
  if (!admin) redirect("/login?next=/admin/bluepass-ledger");

  const entryId = String(formData.get("entryId") ?? "");
  const stripeConnectAccountId = String(formData.get("stripeConnectAccountId") ?? "").trim();

  if (!entryId || !stripeConnectAccountId) {
    return;
  }

  await releaseKaiCoreBluePassLedgerEntryPayoutViaStripe({
    tenantSlug: TENANT_SLUG,
    entryId,
    stripeConnectAccountId,
    reviewerEmail: admin.email,
  });

  revalidatePath("/admin/bluepass-ledger");
}
