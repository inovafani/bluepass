import { afterEach, describe, expect, it, vi } from "vitest";
import {
  archiveListing,
  createDraftListing,
  operatorListingInputSchema,
  publishListing,
  reactivateListing,
  updateDraftListing,
} from "@/lib/services/operators/operator-listing-service";

const prismaMocks = vi.hoisted(() => ({
  operatorProfile: {
    findUnique: vi.fn(),
  },
  operatorListing: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: prismaMocks,
}));

afterEach(() => {
  prismaMocks.operatorProfile.findUnique.mockReset();
  prismaMocks.operatorListing.create.mockReset();
  prismaMocks.operatorListing.findUnique.mockReset();
  prismaMocks.operatorListing.update.mockReset();
});

const baseInput = {
  title: "Reef Dive Day Trip",
  category: "reef_dive",
  region: "Great Barrier Reef",
  description: "A full-day guided reef dive for small groups.",
};

describe("operator listing service", () => {
  it("creates a draft listing under the caller's own operator profile", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValue({ id: "op_profile_1" });
    prismaMocks.operatorListing.findUnique.mockResolvedValue(null);
    prismaMocks.operatorListing.create.mockResolvedValue({
      id: "listing_1",
      status: "DRAFT",
      ...baseInput,
    });

    await expect(
      createDraftListing({ ...baseInput, accountId: "acct_1" }),
    ).resolves.toEqual(
      expect.objectContaining({ id: "listing_1", status: "DRAFT" }),
    );

    expect(prismaMocks.operatorProfile.findUnique).toHaveBeenCalledWith({
      where: { accountId: "acct_1" },
      select: { id: true },
    });
    expect(prismaMocks.operatorListing.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          operatorProfileId: "op_profile_1",
          slug: "reef-dive-day-trip",
          status: "DRAFT",
          title: "Reef Dive Day Trip",
          region: "Great Barrier Reef",
          currency: "AUD",
        }),
      }),
    );
  });

  it("accepts a hero image URL with no scheme and normalizes it to https://", async () => {
    // Regression: the schema used to require z.string().url(), which threw on exactly the kind
    // of bare-domain input a real operator pasted into the dashboard form ("Invalid URL").
    expect(() =>
      operatorListingInputSchema.parse({ ...baseInput, heroImageUrl: "example.com/photo.jpg" }),
    ).not.toThrow();

    prismaMocks.operatorProfile.findUnique.mockResolvedValue({ id: "op_profile_1" });
    prismaMocks.operatorListing.findUnique.mockResolvedValue(null);
    prismaMocks.operatorListing.create.mockResolvedValue({ id: "listing_1", status: "DRAFT" });

    await createDraftListing({
      ...baseInput,
      heroImageUrl: "example.com/photo.jpg",
      accountId: "acct_1",
    });

    expect(prismaMocks.operatorListing.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          heroImageUrl: "https://example.com/photo.jpg",
        }),
      }),
    );
  });

  it("throws when the account has no operator profile yet", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValue(null);

    await expect(
      createDraftListing({ ...baseInput, accountId: "acct_missing" }),
    ).rejects.toThrow("Operator profile was not found");

    expect(prismaMocks.operatorListing.create).not.toHaveBeenCalled();
  });

  it("publishes a draft listing directly, with no admin review step", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValue({ id: "op_profile_1" });
    prismaMocks.operatorListing.findUnique.mockResolvedValue({
      id: "listing_1",
      operatorProfileId: "op_profile_1",
      status: "DRAFT",
    });
    prismaMocks.operatorListing.update.mockResolvedValue({
      id: "listing_1",
      status: "LIVE",
    });

    await expect(
      publishListing({ listingId: "listing_1", accountId: "acct_1" }),
    ).resolves.toEqual(expect.objectContaining({ status: "LIVE" }));

    expect(prismaMocks.operatorListing.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "listing_1" },
        data: expect.objectContaining({ status: "LIVE" }),
      }),
    );
  });

  it("lets an admin deactivate a live listing with a reason, then reactivate it", async () => {
    prismaMocks.operatorListing.findUnique.mockResolvedValue({
      id: "listing_2",
      status: "LIVE",
    });
    prismaMocks.operatorListing.update.mockResolvedValueOnce({
      id: "listing_2",
      status: "ARCHIVED",
      archivedReason: "Missing valid safety certification.",
    });

    await expect(
      archiveListing({
        listingId: "listing_2",
        archivedBy: "admin@bluepass.co",
        reason: "Missing valid safety certification.",
      }),
    ).resolves.toEqual(
      expect.objectContaining({
        status: "ARCHIVED",
        archivedReason: "Missing valid safety certification.",
      }),
    );

    expect(prismaMocks.operatorListing.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { id: "listing_2" },
        data: expect.objectContaining({
          status: "ARCHIVED",
          archivedBy: "admin@bluepass.co",
          archivedReason: "Missing valid safety certification.",
        }),
      }),
    );

    prismaMocks.operatorListing.findUnique.mockResolvedValue({
      id: "listing_2",
      status: "ARCHIVED",
    });
    prismaMocks.operatorListing.update.mockResolvedValueOnce({
      id: "listing_2",
      status: "LIVE",
    });

    await expect(
      reactivateListing({ listingId: "listing_2" }),
    ).resolves.toEqual(expect.objectContaining({ status: "LIVE" }));

    expect(prismaMocks.operatorListing.update).toHaveBeenLastCalledWith(
      expect.objectContaining({
        where: { id: "listing_2" },
        data: expect.objectContaining({
          status: "LIVE",
          archivedAt: null,
          archivedBy: null,
          archivedReason: null,
        }),
      }),
    );
  });

  it("refuses to edit or publish a listing owned by a different operator profile", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValue({ id: "op_profile_1" });
    prismaMocks.operatorListing.findUnique.mockResolvedValue({
      id: "listing_3",
      operatorProfileId: "someone_elses_profile",
      status: "DRAFT",
    });

    await expect(
      publishListing({ listingId: "listing_3", accountId: "acct_1" }),
    ).rejects.toThrow("does not belong to the acting operator account");

    await expect(
      updateDraftListing({ ...baseInput, listingId: "listing_3", accountId: "acct_1" }),
    ).rejects.toThrow("does not belong to the acting operator account");

    expect(prismaMocks.operatorListing.update).not.toHaveBeenCalled();
  });

  it("refuses to publish a listing that is already live", async () => {
    prismaMocks.operatorProfile.findUnique.mockResolvedValue({ id: "op_profile_1" });
    prismaMocks.operatorListing.findUnique.mockResolvedValue({
      id: "listing_4",
      operatorProfileId: "op_profile_1",
      status: "LIVE",
    });

    await expect(
      publishListing({ listingId: "listing_4", accountId: "acct_1" }),
    ).rejects.toThrow("Only draft listings can be published.");

    expect(prismaMocks.operatorListing.update).not.toHaveBeenCalled();
  });

  it("refuses to deactivate a listing that isn't live, and refuses to reactivate one that isn't archived", async () => {
    prismaMocks.operatorListing.findUnique.mockResolvedValue({
      id: "listing_5",
      status: "DRAFT",
    });

    await expect(
      archiveListing({ listingId: "listing_5", archivedBy: "admin@bluepass.co", reason: "x" }),
    ).rejects.toThrow("Only live listings can be deactivated.");

    await expect(
      reactivateListing({ listingId: "listing_5" }),
    ).rejects.toThrow("Only archived listings can be reactivated.");

    expect(prismaMocks.operatorListing.update).not.toHaveBeenCalled();
  });
});
