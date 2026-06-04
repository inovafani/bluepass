"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

type GalleryImage = { src: string; alt: string };

export function GalleryLightbox({
  images,
  heroFallback,
  name,
}: {
  images: GalleryImage[];
  heroFallback: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const total = Math.min(images.length, 5);
  const displayed = images.slice(0, total);

  const prev = useCallback(() =>
    setActive((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() =>
    setActive((i) => (i + 1) % total), [total]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  function openAt(i: number) {
    setActive(i);
    setOpen(true);
  }

  const [first, ...rest] = displayed;

  return (
    <>
      {/* ── Gallery grid ── */}
      <div className="mt-4 grid grid-cols-2 grid-rows-2 gap-2 md:grid-cols-[1.2fr_1fr_1fr]">
        {/* Large first image — spans 2 rows */}
        <button
          type="button"
          onClick={() => openAt(0)}
          className="group relative row-span-2 min-h-[240px] cursor-zoom-in overflow-hidden rounded-lg"
          aria-label={`Open gallery — ${first?.alt || name}`}
        >
          <Image
            src={first?.src ?? heroFallback}
            alt={first?.alt ?? name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1024px) 28vw, 50vw"
          />
        </button>

        {/* Four smaller images */}
        {rest.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => openAt(i + 1)}
            className="group relative aspect-[4/3] cursor-zoom-in overflow-hidden rounded-lg"
            aria-label={`Open gallery — ${img.alt || name}`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(min-width: 1024px) 14vw, 25vw"
            />
          </button>
        ))}
      </div>

      {/* ── Lightbox ── */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Image container */}
          <div
            className="relative mx-4 flex max-h-[90svh] max-w-5xl flex-1 items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-2xl md:aspect-[16/10]">
              <Image
                src={displayed[active]?.src ?? heroFallback}
                alt={displayed[active]?.alt ?? name}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>

            {/* Prev */}
            <button
              type="button"
              onClick={prev}
              className="absolute -left-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 md:-left-14"
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={next}
              className="absolute -right-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80 md:-right-14"
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>

            {/* Counter */}
            <p
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.18em] text-white/44"
              style={{ fontFamily: "var(--bp-font-mono)" }}
            >
              {active + 1} / {total}
            </p>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-black/80"
            aria-label="Close gallery"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
