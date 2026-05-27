"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal engine. Runs once. MutationObserver handles everything else.
 *
 * Why MutationObserver instead of usePathname:
 *   usePathname fires when navigation STARTS — before the new page's DOM exists.
 *   querySelectorAll at that moment finds nothing, so new-page elements stay
 *   opacity:0 forever. MutationObserver fires after each DOM insertion, so it
 *   catches new .bp-reveal nodes the moment Next.js places them in the tree.
 *
 * Flash-of-invisible-content prevention:
 *   1. Pre-mark every .bp-reveal already in the viewport as .in-view
 *      BEFORE we add the "js-reveal" class that hides elements.
 *   2. Only then add js-reveal — above-fold elements are already visible.
 *   3. MutationObserver does the same check for each newly added node,
 *      running synchronously before the browser paints.
 */

function processEl(el: HTMLElement, io: IntersectionObserver) {
  if (el.classList.contains("in-view")) return;
  // 80px buffer so elements just below the fold appear instantly
  if (el.getBoundingClientRect().top < window.innerHeight + 80) {
    el.classList.add("in-view");
  } else {
    io.observe(el);
  }
}

export function ScrollRevealInit() {
  useEffect(() => {
    // ── Intersection observer (scroll-triggered reveals) ───────────────────
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -20px 0px" },
    );

    // ── Step 1: process elements already in the DOM ────────────────────────
    document
      .querySelectorAll<HTMLElement>(".bp-reveal")
      .forEach((el) => processEl(el, io));

    // ── Step 2: enable hiding CSS — above-fold already have .in-view ───────
    document.documentElement.classList.add("js-reveal");

    // ── Step 3: watch for elements added later (navigation / streaming) ────
    const mo = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          // The node itself might be a reveal target
          if (node.classList?.contains("bp-reveal")) processEl(node, io);
          // Or it might contain reveal targets (e.g. a whole page section)
          node
            .querySelectorAll<HTMLElement>(".bp-reveal")
            .forEach((el) => processEl(el, io));
        }
      }
    });

    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []); // Empty deps — runs once, MutationObserver handles the rest

  return null;
}
