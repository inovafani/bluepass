"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-reveal engine — zero dependencies, zero ongoing cost.
 *
 * Strategy (prevents blank pages):
 * 1. Query every .bp-reveal element that hasn't animated yet.
 * 2. Pre-mark above-the-fold elements as .in-view BEFORE we add the
 *    "js-reveal" class to <html>. This way those elements are never hidden.
 * 3. Add "js-reveal" to <html> — only below-fold elements become opacity:0.
 * 4. IntersectionObserver watches the below-fold elements and adds .in-view
 *    as they enter the viewport, triggering the CSS fade-up transition.
 * 5. unobserve() fires immediately after — no ongoing observer cost.
 *
 * usePathname dependency means this re-runs on every client-side navigation,
 * so new page content is always handled correctly.
 */
export function ScrollRevealInit() {
  const pathname = usePathname();

  useEffect(() => {
    const allElements = document.querySelectorAll<HTMLElement>(
      ".bp-reveal:not(.in-view)",
    );

    // Always ensure js-reveal is set (needed after first mount).
    // If there's nothing to animate just set the class and bail.
    if (!allElements.length) {
      document.documentElement.classList.add("js-reveal");
      return;
    }

    // ── Step 1: pre-mark above-the-fold elements ──────────────────────────
    // We do this BEFORE adding js-reveal so those elements are never hidden.
    const belowFold: HTMLElement[] = [];
    const vh = window.innerHeight;

    allElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      // Include a 120px buffer so elements near the fold look instant.
      if (rect.top < vh + 120) {
        el.classList.add("in-view");
      } else {
        belowFold.push(el);
      }
    });

    // ── Step 2: enable the reveal CSS ────────────────────────────────────
    // Above-fold elements already have .in-view so they won't flash invisible.
    document.documentElement.classList.add("js-reveal");

    if (!belowFold.length) return;

    // ── Step 3: watch below-fold elements ────────────────────────────────
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        }
      },
      // threshold:0 = trigger the moment any pixel enters the viewport.
      // rootMargin bottom offset triggers slightly before fully visible.
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );

    belowFold.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
