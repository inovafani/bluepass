import Link from "next/link";
import { notFound } from "next/navigation";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import { prisma } from "@/lib/db/prisma";
import { getCurrentTraveller } from "@/lib/services/auth/session";
import {
  getClaimableOperator,
  getClaimableOperatorBackHref,
} from "@/lib/services/operators/claimable-operators";
import { ClaimEmailLinkForm } from "./ClaimEmailLinkForm";
import { ClaimStartForm } from "./ClaimStartForm";

export const metadata = {
  title: "Claim your business | BluePass",
};

export default async function OperatorClaimStartPage({
  params,
}: {
  params: Promise<{ operatorSlug: string }>;
}) {
  const { operatorSlug } = await params;
  const operator = await getClaimableOperator(operatorSlug);

  if (!operator) {
    notFound();
  }

  const traveller = await getCurrentTraveller();
  const existingClaim = traveller?.accountId
    ? await prisma.operatorClaim.findFirst({
        where: {
          accountId: traveller.accountId,
          operatorSlug: operator.slug,
        },
        orderBy: { createdAt: "desc" },
      })
    : null;
  const representativeHref = getClaimableOperatorBackHref(operator);

  return (
    <>
      <main className="cinematic-page min-h-screen bg-[#020b11] text-white">
        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-[var(--cinematic-screen-x)] py-24">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(92,200,190,0.22),transparent_34%),linear-gradient(180deg,#041a22,#020b11_58%,#01070b)]"
          />
          <div className="bp-film-grain absolute inset-0" />

          <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
            <Link
              href="/"
              className="bp-page-title text-2xl leading-none text-white"
            >
              BluePass
            </Link>
            <p className="mt-12 text-xs font-semibold uppercase tracking-[0.42em] text-[#9fe8df]">
              Claim your business
            </p>
            <h1 className="bp-page-title mt-6 text-[clamp(2.6rem,7vw,4.6rem)] leading-[0.95] text-white">
              {operator.name}
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-7 text-white/72">
              We built this page from public information to help travellers
              discover conservation-first trips. Claim it to correct your story,
              add real trips and availability, connect your booking system, and
              start receiving Kai leads.
            </p>
            <p className="mx-auto mt-5 max-w-lg text-sm leading-6 text-white/46">
              BluePass reviews each claim before marking a listing as claimed.
              Approved operators can activate referral links, PMS setup, and
              operator dashboard tools.
            </p>

            {existingClaim?.status === "APPROVED" ? (
              <StatusPanel
                title={`${operator.name} is already claimed`}
                body="This claim has been approved. Your dashboard is the next stop for setup and referral links."
                actionHref="/dashboard"
                actionLabel="Go to dashboard"
              />
            ) : existingClaim?.status === "PENDING_REVIEW" ? (
              <StatusPanel
                title="Claim in review"
                body="We have your claim request. BluePass will review the business proof before this page is marked claimed."
                actionHref={representativeHref}
                actionLabel="Back to the page"
              />
            ) : traveller ? (
              <ClaimStartForm
                operatorSlug={operator.slug}
                operatorName={operator.name}
                defaultName={traveller.name}
                defaultEmail={traveller.email}
                defaultPhone={traveller.phone}
              />
            ) : (
              <ClaimEmailLinkForm
                operatorSlug={operator.slug}
                operatorName={operator.name}
              />
            )}

            <Link
              href={representativeHref}
              className="mt-10 inline-flex text-sm text-white/48 transition-colors hover:text-white"
            >
              &lt;- Back to the page
            </Link>
          </div>
        </section>
      </main>
      <BluePassFooter />
    </>
  );
}

function StatusPanel({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="mt-10 rounded-2xl border border-white/14 bg-white/[0.08] p-5 backdrop-blur-md">
      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/58">
        {body}
      </p>
      <Link
        href={actionHref}
        className="bp-focus-ring mt-5 inline-flex h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#071827] transition-colors hover:bg-white/88"
      >
        {actionLabel}
      </Link>
    </div>
  );
}
