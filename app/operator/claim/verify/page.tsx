import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";
import { resolveOperatorClaimToken } from "@/lib/services/operators/operator-claim-tokens";

export const metadata = {
  title: "Verify operator claim | BluePass",
};

export default async function OperatorClaimVerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await resolveOperatorClaimToken(token) : null;

  if (!result?.ok) {
    return (
      <ClaimVerifyShell
        title="Claim link unavailable"
        body={
          result?.error ??
          "This claim link is missing or invalid. Please request a new one from the operator claim page."
        }
        actionHref="/operators"
        actionLabel="Browse operators"
      />
    );
  }

  const claimPath = `/operator/claim/start/${result.operatorLead.slug}`;

  return (
    <ClaimVerifyShell
      title={`Claim ${result.operatorLead.name}`}
      body="Your business email link is valid. Sign in or create a BluePass account, then submit the business proof so BluePass can approve the listing."
      actionHref={`/register?next=${encodeURIComponent(claimPath)}`}
      actionLabel="Continue claim"
      secondaryHref={`/login?next=${encodeURIComponent(claimPath)}`}
      secondaryLabel="Sign in instead"
    />
  );
}

function ClaimVerifyShell({
  title,
  body,
  actionHref,
  actionLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  body: string;
  actionHref: string;
  actionLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
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
              Operator claim
            </p>
            <h1 className="bp-page-title mt-6 text-[clamp(2.4rem,7vw,4.4rem)] leading-[0.95] text-white">
              {title}
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-[15px] leading-7 text-white/72">
              {body}
            </p>
            <div className="mx-auto mt-8 grid max-w-md gap-3 sm:grid-cols-2">
              <Link
                href={actionHref}
                className="bp-focus-ring inline-flex h-12 items-center justify-center rounded-full bg-white px-5 text-sm font-black text-[#071827] transition-colors hover:bg-white/88"
              >
                {actionLabel}
              </Link>
              {secondaryHref && secondaryLabel ? (
                <Link
                  href={secondaryHref}
                  className="bp-focus-ring inline-flex h-12 items-center justify-center rounded-full border border-white/24 bg-white/[0.07] px-5 text-sm font-black text-white transition-colors hover:bg-white/[0.14]"
                >
                  {secondaryLabel}
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </main>
      <BluePassFooter />
    </>
  );
}
