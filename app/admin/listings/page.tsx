import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireCurrentAdmin } from "@/lib/services/auth/admin";
import { AdminNav } from "@/app/admin/admin-nav";
import {
  archiveListing,
  reactivateListing,
} from "@/lib/services/operators/operator-listing-service";
import { ListingReviewActions, type ListingActionState } from "./ListingReviewActions";

export const metadata = {
  title: "Listings | BluePass Admin",
};

export default async function AdminListingsPage() {
  const admin = await requireCurrentAdmin();

  if (!admin) {
    redirect("/login?next=/admin/listings");
  }

  const listings = await prisma.operatorListing.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      operatorProfile: {
        select: {
          companyName: true,
          account: { select: { email: true } },
        },
      },
    },
  });

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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.76),rgba(0,15,21,0.42)_45%,rgba(0,8,14,0.62)),linear-gradient(180deg,rgba(0,0,0,0.32),rgba(0,0,0,0.1)_38%,rgba(0,0,0,0.68))]" />
      <div className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color" />
      <div className="bp-film-grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-6xl flex-col justify-center px-[var(--cinematic-screen-x)] pb-14 pt-32">
        <div className="overflow-hidden rounded-2xl border border-white/16 bg-white/[0.10] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.30),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[34px] backdrop-saturate-150 sm:p-6 md:p-8">
          <AdminNav active="listings" email={admin.email} />
          <div className="mt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9fe8df]">
              BluePass admin
            </p>
            <h1 className="bp-page-title mt-3 text-4xl leading-none text-white md:text-5xl">
              Listings
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/66">
              Operators publish trips themselves - no review needed before they
              go live. Deactivate a listing here if something needs to come
              down; the operator sees the reason on their dashboard.
            </p>
          </div>

          <div className="mt-6 grid gap-3">
            {listings.length ? (
              listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.id}
                  title={listing.title}
                  slug={listing.slug}
                  category={listing.category}
                  region={listing.region}
                  description={listing.description}
                  heroImageUrl={listing.heroImageUrl}
                  maxGuests={listing.maxGuests}
                  priceSignal={listing.priceSignal}
                  currency={listing.currency}
                  status={listing.status}
                  archivedReason={listing.archivedReason}
                  operatorName={listing.operatorProfile.companyName}
                  operatorEmail={listing.operatorProfile.account.email}
                />
              ))
            ) : (
              <EmptyState label="No operator listings yet." />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ListingCard({
  id,
  title,
  slug,
  category,
  region,
  description,
  heroImageUrl,
  maxGuests,
  priceSignal,
  currency,
  status,
  archivedReason,
  operatorName,
  operatorEmail,
}: {
  id: string;
  title: string;
  slug: string;
  category: string;
  region: string;
  description: string;
  heroImageUrl: string | null;
  maxGuests: number | null;
  priceSignal: string | null;
  currency: string;
  status: string;
  archivedReason: string | null;
  operatorName: string | null;
  operatorEmail: string;
}) {
  return (
    <article className="rounded-2xl border border-white/14 bg-white/[0.08] p-4 backdrop-blur-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white">{title}</p>
          <p className="mt-1 truncate text-xs text-white/54">/{slug}</p>
          <p className="mt-1 text-xs text-white/44">
            {operatorName ?? "Operator"} · {operatorEmail}
          </p>
        </div>
        <span className="rounded-full border border-[#9fe8df]/20 bg-[#9fe8df]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9fffa]">
          {formatStatus(status)}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/15 p-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
          {category} / {region}
        </p>
        <p className="mt-2 text-sm leading-6 text-white/64">{description}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/48">
          {heroImageUrl && (
            <a
              href={heroImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9fe8df] hover:text-white"
            >
              Hero image
            </a>
          )}
          {maxGuests && <span>Up to {maxGuests} guests</span>}
          {priceSignal && (
            <span>
              {priceSignal} ({currency})
            </span>
          )}
        </div>
      </div>

      {status === "ARCHIVED" && archivedReason && (
        <p className="mt-3 text-xs text-[#f1a3a3]">
          Deactivated: {archivedReason}
        </p>
      )}

      {status === "DRAFT" && (
        <p className="mt-4 text-xs text-white/38">
          Still a draft - nothing for admin to do until the operator publishes it.
        </p>
      )}

      {(status === "LIVE" || status === "ARCHIVED") && (
        <ListingReviewActions
          listingId={id}
          status={status as "LIVE" | "ARCHIVED"}
          archiveAction={archiveListingAction}
          reactivateAction={reactivateListingAction}
        />
      )}
    </article>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm text-white/48">
      {label}
    </div>
  );
}

function formatStatus(status: string) {
  return status.toLowerCase();
}

async function archiveListingAction(
  _prevState: ListingActionState,
  formData: FormData,
): Promise<ListingActionState> {
  "use server";

  const admin = await requireCurrentAdmin();
  if (!admin) redirect("/login?next=/admin/listings");

  try {
    await archiveListing({
      listingId: String(formData.get("id") ?? ""),
      archivedBy: admin.email,
      reason: String(formData.get("reason") ?? ""),
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to deactivate this listing right now.",
    };
  }

  revalidatePath("/admin/listings");
  revalidatePath("/discover");
  return { error: null };
}

async function reactivateListingAction(
  _prevState: ListingActionState,
  formData: FormData,
): Promise<ListingActionState> {
  "use server";

  const admin = await requireCurrentAdmin();
  if (!admin) redirect("/login?next=/admin/listings");

  try {
    await reactivateListing({
      listingId: String(formData.get("id") ?? ""),
    });
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Unable to reactivate this listing right now.",
    };
  }

  revalidatePath("/admin/listings");
  revalidatePath("/discover");
  return { error: null };
}
