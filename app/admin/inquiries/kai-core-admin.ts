import {
  listKaiCoreBluePassInquiries,
  shouldUseKaiCore,
  type KaiCoreBluePassInquiry,
  type KaiCoreClientEnv,
} from "@/lib/services/kai-core/client";

type FetchLike = typeof fetch;

export async function loadKaiCoreAdminInquiries(
  env: KaiCoreClientEnv = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<{ inquiries: KaiCoreBluePassInquiry[]; error: string | null }> {
  if (!shouldUseKaiCore(env)) {
    return { inquiries: [], error: null };
  }

  try {
    const inquiries = await listKaiCoreBluePassInquiries({ tenantSlug: "bluepass", take: 40 }, env, fetchImpl);
    return { inquiries, error: null };
  } catch (error) {
    console.warn("bluepass.admin.kai_core_inquiries_unavailable", {
      error: error instanceof Error ? error.message : "Unknown Kai Core error",
    });

    return {
      inquiries: [],
      error: "Kai Core pipeline is unavailable.",
    };
  }
}
