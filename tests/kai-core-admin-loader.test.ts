import { describe, expect, it, vi } from "vitest";
import { loadKaiCoreAdminInquiries } from "@/app/admin/inquiries/kai-core-admin";

describe("loadKaiCoreAdminInquiries", () => {
  it("returns an empty result when Kai Core is disabled", async () => {
    const fetchMock = vi.fn();

    const result = await loadKaiCoreAdminInquiries(
      {
        KAI_CORE_ENABLED: "false",
      },
      fetchMock,
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result).toEqual({ inquiries: [], error: null });
  });

  it("returns Kai Core inquiries when enabled", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(
      Response.json({
        inquiries: [
          {
            id: "inq_1",
            status: "OPERATOR_ACCEPTED",
            travellerName: "Inov",
            travellerEmail: "inov@example.com",
            travellerPhone: "6285156246329",
            destination: "Komodo",
            dateWindow: "6 July 2026",
            guests: 4,
            budget: "Quote requested",
            selectedYachtName: "Calico Jack",
            operatorName: "Calico Jack",
            createdAt: "2026-07-01T05:00:00.000Z",
            events: [],
            dispatches: [],
          },
        ],
      }),
    );

    const result = await loadKaiCoreAdminInquiries(
      {
        KAI_CORE_ENABLED: "true",
        KAI_CORE_BASE_URL: "https://kai-core.example.com",
        KAI_CORE_ORIGIN: "https://bluepass.co",
        KAI_CORE_ADMIN_TOKEN: "admin_secret",
      },
      fetchMock,
    );

    expect(result.error).toBeNull();
    expect(result.inquiries).toEqual([
      expect.objectContaining({
        id: "inq_1",
        source: "kai-core",
        selectedYachtName: "Calico Jack",
      }),
    ]);
  });

  it("keeps the admin page usable when Kai Core fetch fails", async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(Response.json({ error: "nope" }, { status: 401 }));
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const result = await loadKaiCoreAdminInquiries(
      {
        KAI_CORE_ENABLED: "true",
        KAI_CORE_BASE_URL: "https://kai-core.example.com",
        KAI_CORE_ORIGIN: "https://bluepass.co",
        KAI_CORE_ADMIN_TOKEN: "wrong_secret",
      },
      fetchMock,
    );

    expect(result).toEqual({
      inquiries: [],
      error: "Kai Core pipeline is unavailable.",
    });

    warnSpy.mockRestore();
  });
});
