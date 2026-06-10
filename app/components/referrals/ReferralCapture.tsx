"use client";

import { useEffect } from "react";

export function ReferralCapture() {
  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("ref")?.trim();

    if (!code) {
      return;
    }

    void fetch("/api/referrals/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        landingPath: `${url.pathname}${url.search}`,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }, []);

  return null;
}
