"use client";

import { useActionState } from "react";

export type CreateListingState = { error: string | null };
export type PublishListingState = { error: string | null };

const listingInputClass =
  "h-10 rounded-xl border border-white/14 bg-black/20 px-3 text-sm text-white placeholder:text-white/34 focus:border-white/30 focus:outline-none";

const LISTING_CATEGORY_OPTIONS = [
  "Reef diving",
  "Snorkeling tour",
  "Liveaboard charter",
  "Day trip charter",
  "Sailing charter",
  "Whale watching",
  "Island hopping",
  "Fishing charter",
  "Conservation / eco tour",
  "Other",
];

export function NewListingForm({
  action,
}: {
  action: (prevState: CreateListingState, formData: FormData) => Promise<CreateListingState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="mt-5 grid gap-4 border-t border-white/10 pt-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">
        New listing
      </p>

      <ListingField label="Trip title" required>
        <input
          name="title"
          placeholder="e.g. Full-day reef dive for small groups"
          required
          className={listingInputClass}
        />
      </ListingField>

      <div className="grid gap-4 sm:grid-cols-2">
        <ListingField label="Category" required>
          <select name="category" required defaultValue="" className={listingInputClass}>
            <option value="" disabled>
              Choose a category
            </option>
            {LISTING_CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </ListingField>
        <ListingField label="Region" required hint="Any destination works, not just Indonesia.">
          <input
            name="region"
            placeholder="e.g. Great Barrier Reef"
            required
            className={listingInputClass}
          />
        </ListingField>
      </div>

      <ListingField label="Description" required hint="At least 10 characters.">
        <textarea
          name="description"
          placeholder="What travellers will do, see, and need to know before booking."
          required
          rows={3}
          minLength={10}
          className={listingInputClass}
        />
      </ListingField>

      <ListingField label="Hero image" hint="One good photo, up to 5MB. Optional.">
        <input
          name="heroImageFile"
          type="file"
          accept="image/*"
          className={`${listingInputClass} h-auto py-2 file:mr-3 file:h-8 file:cursor-pointer file:rounded-full file:border-0 file:bg-white file:px-3 file:text-xs file:font-bold file:text-[#071827]`}
        />
      </ListingField>

      <div className="grid gap-4 sm:grid-cols-2">
        <ListingField label="Max guests">
          <input
            name="maxGuests"
            type="number"
            min={1}
            placeholder="e.g. 12"
            className={listingInputClass}
          />
        </ListingField>
        <ListingField label="Price" hint="Shown to travellers as-is.">
          <input
            name="priceSignal"
            placeholder="e.g. from AUD 150pp"
            className={listingInputClass}
          />
        </ListingField>
      </div>

      {state.error && (
        <p className="rounded-xl border border-[#f1a3a3]/30 bg-[#f1a3a3]/10 px-3 py-2 text-xs font-semibold text-[#f1a3a3]">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bp-focus-ring mt-1 inline-flex h-11 items-center justify-center rounded-full border border-white/20 bg-white/[0.08] px-4 text-xs font-bold text-white transition-colors hover:bg-white hover:text-[#071827] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving..." : "Save as draft"}
      </button>
    </form>
  );
}

export function PublishListingButton({
  listingId,
  action,
}: {
  listingId: string;
  action: (prevState: PublishListingState, formData: FormData) => Promise<PublishListingState>;
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });

  return (
    <form action={formAction} className="mt-3">
      <input type="hidden" name="listingId" value={listingId} />
      <button
        type="submit"
        disabled={pending}
        className="bp-focus-ring inline-flex h-8 items-center justify-center rounded-full bg-white px-3 text-[11px] font-black text-[#071827] transition-colors hover:bg-white/88 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Publishing..." : "Publish"}
      </button>
      {state.error && (
        <p className="mt-2 text-[11px] font-semibold text-[#f1a3a3]">{state.error}</p>
      )}
    </form>
  );
}

function ListingField({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[11px] font-bold text-white/56">
        {label}
        {required ? <span className="text-[#9fe8df]"> *</span> : null}
      </span>
      {children}
      {hint && <span className="text-[11px] text-white/34">{hint}</span>}
    </label>
  );
}
