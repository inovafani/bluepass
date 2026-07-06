import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";
import {
  approveKaiCoreBluePassQuote,
  getKaiCoreBluePassQuote,
  type KaiCoreBluePassQuote,
} from "@/lib/services/kai-core/client";
import { formatQuoteOperationalStep, type QuoteOperationalStep } from "./quote-flow";

export const metadata = {
  title: "BluePass Quote",
};

type QuotePageProps = {
  params: Promise<{ quoteId: string }>;
};

export default async function BluePassQuotePage({ params }: QuotePageProps) {
  const { quoteId } = await params;
  const quote = await getKaiCoreBluePassQuote({ quoteId });

  if (!quote) {
    notFound();
  }

  const operationalStep = formatQuoteOperationalStep(quote);

  return (
    <section className="cinematic-page relative min-h-svh overflow-hidden bg-[#020b11] text-white">
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-105 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2200&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.84),rgba(0,15,21,0.54)_52%,rgba(0,8,14,0.72)),linear-gradient(180deg,rgba(0,0,0,0.22),rgba(0,0,0,0.72))]" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-[var(--cinematic-screen-x)] pb-14 pt-32">
        <div className="grid gap-5 rounded-2xl border border-white/16 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150 sm:p-6 md:p-8">
          <div className="flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
                BluePass verified quote
              </p>
              <h1 className="bp-page-title mt-3 text-4xl leading-none text-white md:text-5xl">
                {quote.selectedYachtName ?? "Your ocean trip"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/66">
                Operator response converted into a BluePass quote. Booking is not confirmed until payment and final operator confirmation are complete.
              </p>
            </div>
            <QuoteStatusBadge step={operationalStep} />
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <QuoteMetric label="Destination" value={quote.destination ?? "Pending"} />
            <QuoteMetric label="Dates" value={quote.dateWindow ?? "Pending"} />
            <QuoteMetric label="Guests" value={quote.guests ? String(quote.guests) : "Pending"} />
          </div>

          <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-3 rounded-xl border border-white/12 bg-[#02131f]/70 p-4">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#9fe8df]">
                Trip terms
              </h2>
              <QuoteText label="Includes" value={quote.inclusions} fallback="BluePass is confirming inclusions with the operator." />
              <QuoteText label="Excludes" value={quote.exclusions} fallback="BluePass is confirming exclusions with the operator." />
              <QuoteText label="Conditions" value={quote.terms} fallback="Deposit and balance terms are being confirmed." />
            </div>

            <div className="grid gap-3 rounded-xl border border-white/12 bg-[#02131f]/70 p-4">
              <h2 className="text-sm font-black uppercase tracking-[0.14em] text-[#9fe8df]">
                Price signal
              </h2>
              <QuoteMetric
                label="Quoted price"
                value={formatMoney(quote.grossPriceCents, quote.currency) ?? "Final price pending"}
              />
              <QuoteMetric
                label="Reef contribution"
                value={formatMoney(quote.conservationContributionCents, quote.currency) ?? "Calculated after final price"}
              />
              <QuoteAction quote={quote} step={operationalStep} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteStatusBadge({ step }: { step: QuoteOperationalStep }) {
  return (
    <span className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] ${getQuoteStepToneClass(step.tone)}`}>
      {step.label}
    </span>
  );
}

function QuoteMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/12 bg-[#02131f]/70 p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/44">{label}</p>
      <p className="mt-2 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function QuoteText({ label, value, fallback }: { label: string; value: string | null; fallback: string }) {
  return (
    <div>
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-white/44">{label}</p>
      <p className="mt-1 text-sm leading-6 text-white/78">{value ?? fallback}</p>
    </div>
  );
}

function QuoteAction({ quote, step }: { quote: KaiCoreBluePassQuote; step: QuoteOperationalStep }) {
  if (quote.operationalStatus === "BOOKING_CONFIRMED" || quote.operationalStatus === "PAYMENT_READY" || quote.status === "TRAVELLER_APPROVED") {
    return (
      <div className={`rounded-xl border p-3 text-sm font-semibold leading-6 ${getQuoteStepPanelClass(step.tone)}`}>
        <p className="text-[10px] font-black uppercase tracking-[0.14em] opacity-70">{step.label}</p>
        <p className="mt-1">{step.body}</p>
      </div>
    );
  }

  if (quote.status !== "READY_FOR_TRAVELLER") {
    return (
      <p className="rounded-xl border border-amber-300/24 bg-amber-300/12 p-3 text-sm font-semibold text-amber-50">
        BluePass is preparing the final price before this quote can be approved.
      </p>
    );
  }

  return (
    <form action={approveQuoteAction}>
      <input type="hidden" name="quoteId" value={quote.id} />
      <button
        type="submit"
        className="bp-focus-ring inline-flex h-11 w-full items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#071827] transition-colors hover:bg-[#9fe8df]"
      >
        Approve quote
      </button>
    </form>
  );
}

function getQuoteStepToneClass(tone: QuoteOperationalStep["tone"]) {
  switch (tone) {
    case "done":
      return "border-emerald-200/30 bg-emerald-300/12 text-emerald-100";
    case "ready":
      return "border-[#9fe8df]/24 bg-[#9fe8df]/12 text-[#d9fffa]";
    case "blocked":
      return "border-amber-300/24 bg-amber-300/12 text-amber-50";
    case "waiting":
    default:
      return "border-sky-200/30 bg-sky-300/12 text-sky-100";
  }
}

function getQuoteStepPanelClass(tone: QuoteOperationalStep["tone"]) {
  switch (tone) {
    case "done":
      return "border-emerald-300/24 bg-emerald-300/12 text-emerald-50";
    case "ready":
      return "border-sky-300/24 bg-sky-300/12 text-sky-50";
    case "blocked":
      return "border-amber-300/24 bg-amber-300/12 text-amber-50";
    case "waiting":
    default:
      return "border-white/14 bg-white/[0.08] text-white/76";
  }
}

async function approveQuoteAction(formData: FormData) {
  "use server";

  const quoteId = String(formData.get("quoteId") ?? "");
  if (!quoteId) return;

  await approveKaiCoreBluePassQuote({ quoteId });
  revalidatePath(`/quotes/${quoteId}`);
}

function formatMoney(cents: number | null, currency: string) {
  if (cents === null) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
