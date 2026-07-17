"use client";

import { useActionState } from "react";

export type ListingActionState = { error: string | null };

export function ListingReviewActions({
  listingId,
  status,
  archiveAction,
  reactivateAction,
}: {
  listingId: string;
  status: "LIVE" | "ARCHIVED";
  archiveAction: (prevState: ListingActionState, formData: FormData) => Promise<ListingActionState>;
  reactivateAction: (
    prevState: ListingActionState,
    formData: FormData,
  ) => Promise<ListingActionState>;
}) {
  const [archiveState, archiveFormAction, archivePending] = useActionState(archiveAction, {
    error: null,
  });
  const [reactivateState, reactivateFormAction, reactivatePending] = useActionState(
    reactivateAction,
    { error: null },
  );

  return (
    <div className="mt-4 grid gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {status === "LIVE" ? (
          <form action={archiveFormAction} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={listingId} />
            <input
              name="reason"
              placeholder="Reason for taking this down"
              required
              className="h-10 rounded-full border border-white/16 bg-black/20 px-3 text-xs text-white placeholder:text-white/34 focus:border-white/30 focus:outline-none"
            />
            <button
              type="submit"
              disabled={archivePending}
              className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full border border-white/16 bg-white/[0.06] px-4 text-xs font-bold text-white transition-colors hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {archivePending ? "Deactivating..." : "Deactivate"}
            </button>
          </form>
        ) : (
          <form action={reactivateFormAction}>
            <input type="hidden" name="id" value={listingId} />
            <button
              type="submit"
              disabled={reactivatePending}
              className="bp-focus-ring inline-flex h-10 items-center justify-center rounded-full bg-white px-4 text-xs font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {reactivatePending ? "Reactivating..." : "Reactivate"}
            </button>
          </form>
        )}
      </div>
      {(archiveState.error || reactivateState.error) && (
        <p className="text-[11px] font-semibold text-[#f1a3a3]">
          {archiveState.error ?? reactivateState.error}
        </p>
      )}
    </div>
  );
}
