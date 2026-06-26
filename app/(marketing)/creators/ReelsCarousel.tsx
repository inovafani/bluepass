"use client";

import {
  CSSProperties,
  PointerEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type Reel = {
  creator: string;
  handle: string;
  title: string;
  views: string;
  reelHref: string;
  thumbnail?: string;
  videoSrc?: string;
};

export function ReelsCarousel({
  reels,
  spacing = "default",
}: {
  reels: Reel[];
  spacing?: "default" | "wide";
}) {
  const initialIndex = Math.floor(reels.length / 2);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dragStartX = useRef<number | null>(null);

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenIndex(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [openIndex]);

  function moveBy(amount: number) {
    setActiveIndex((current) => wrapIndex(current + amount, reels.length));
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    dragStartX.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragStartX.current === null) {
      return;
    }

    const distance = event.clientX - dragStartX.current;
    dragStartX.current = null;

    if (Math.abs(distance) < 42) {
      return;
    }

    moveBy(distance < 0 ? 1 : -1);
  }

  const openReel = openIndex === null ? null : reels[openIndex];

  return (
    <>
      <div className="mt-9">
        <div className="relative mx-auto max-w-[88rem] px-14 md:px-16">
          <div
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              dragStartX.current = null;
            }}
            className="relative min-h-[min(76vh,38rem)] overflow-hidden py-7 md:min-h-[39rem]"
          >
            <div className="relative mx-auto h-[min(72vh,36rem)] max-h-[36rem] min-h-[30rem] w-full md:h-[36rem]">
              {reels.map((reel, index) => {
                const offset = getLoopOffset(index, activeIndex, reels.length);

                return (
                  <ReelCard
                    key={getReelKey(reel, index)}
                    active={offset === 0}
                    index={index}
                    offset={offset}
                    reelCount={reels.length}
                    spacing={spacing}
                    reel={reel}
                    onClick={() => {
                      if (offset === 0) {
                        setOpenIndex(index);
                        return;
                      }

                      moveBy(offset);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <button
            type="button"
            aria-label="Previous reel"
            onClick={() => moveBy(-1)}
            className="bp-focus-ring absolute left-0 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white text-[#071827] shadow-[0_18px_55px_rgba(0,0,0,0.34)] transition-all duration-300 hover:scale-105 hover:bg-[#f4d891]"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Next reel"
            onClick={() => moveBy(1)}
            className="bp-focus-ring absolute right-0 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white text-[#071827] shadow-[0_18px_55px_rgba(0,0,0,0.34)] transition-all duration-300 hover:scale-105 hover:bg-[#f4d891]"
          >
            <ChevronRightIcon />
          </button>
        </div>

        <div className="mt-1 flex items-center justify-center gap-2">
          {reels.map((reel, index) => (
            <button
              key={`${getReelKey(reel, index)}-dot`}
              type="button"
              aria-label={`Show ${reel.creator} reel`}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeIndex
                  ? "w-9 bg-[#B89A5D]"
                  : "w-3 bg-white/20 hover:bg-white/42"
              }`}
            />
          ))}
        </div>
      </div>

      {openReel ? (
        <div
          className="fixed inset-0 z-[120] grid place-items-center bg-black/80 px-4 py-6 backdrop-blur-xl"
          role="dialog"
          aria-modal="true"
          aria-label={`${openReel.creator} Instagram reel`}
          onClick={() => setOpenIndex(null)}
        >
          <div
            className="relative w-full max-w-[320px] sm:max-w-[360px]"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(null)}
              className="bp-focus-ring absolute -right-2 -top-12 grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-white/10 text-white backdrop-blur-xl transition-colors hover:bg-white/18"
              aria-label="Close reel"
            >
              <CloseIcon />
            </button>
            <div className="aspect-[9/16] max-h-[76vh] overflow-hidden rounded-[1.35rem] border border-white/16 bg-[#071827] shadow-[0_38px_120px_rgba(0,0,0,0.58)]">
              <ReelPlayer reel={openReel} />
            </div>
            {openReel.reelHref ? (
              <a
                href={openReel.reelHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 flex items-center justify-center gap-2 text-[11px] font-light text-white/36 transition-colors hover:text-white/66"
              >
                <InstagramIcon />
                Open on Instagram
              </a>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function getReelKey(reel: Reel, index: number) {
  return `${reel.creator}-${reel.reelHref || reel.title}-${index}`;
}

function wrapIndex(index: number, length: number) {
  return ((index % length) + length) % length;
}

function getLoopOffset(index: number, activeIndex: number, length: number) {
  const forward = wrapIndex(index - activeIndex, length);
  const backward = forward - length;

  return Math.abs(forward) <= Math.abs(backward) ? forward : backward;
}

function ReelCard({
  active,
  index,
  offset,
  reelCount,
  spacing,
  reel,
  onClick,
}: {
  active: boolean;
  index: number;
  offset: number;
  reelCount: number;
  spacing: "default" | "wide";
  reel: Reel;
  onClick: () => void;
}) {
  const position = getPosition(offset, reelCount, spacing);

  return (
    <button
      type="button"
      onClick={onClick}
      style={position.style}
      className={`group absolute left-1/2 top-1/2 block h-full w-[min(62vw,20.25rem)] text-left transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform md:w-[20.25rem] ${position.className}`}
      aria-label={
        active
          ? `Open ${reel.creator} reel`
          : `Move ${reel.creator} reel to center`
      }
    >
      <div
        className={`relative aspect-[9/16] overflow-hidden rounded-[1.35rem] border bg-[#071827] shadow-[0_28px_90px_rgba(0,0,0,0.38)] transition-colors ${
          active ? "border-white/42" : "border-white/12"
        }`}
      >
        {active && reel.reelHref ? (
          <>
            <InstagramMediaFrame
              reel={reel}
              className="h-full w-full"
              autoplay
            />
            <span className="absolute inset-0 z-20 cursor-pointer" />
          </>
        ) : (
          <ReelThumbnail
            index={index}
            reel={reel}
            visible={Math.abs(offset) <= 2}
          />
        )}

        <div className="pointer-events-none absolute left-4 top-4 z-30 flex items-center gap-2 rounded-full bg-black/30 px-3 py-2 text-[11px] font-light text-white/86 backdrop-blur-xl">
          <InstagramIcon />
          <span>{reel.handle}</span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-gradient-to-t from-black/88 via-black/38 to-transparent p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-light text-white/56">
              0{index + 1}
            </span>
          </div>
          <p className="bp-page-title text-xl leading-none text-white/92">
            {reel.creator}
          </p>
          <p className="mt-2 text-sm font-light leading-5 text-white/68">
            {reel.title}
          </p>
        </div>
      </div>
    </button>
  );
}

function ReelPlayer({ reel }: { reel: Reel }) {
  if (reel.videoSrc) {
    return (
      <video
        src={reel.videoSrc}
        poster={reel.thumbnail || getInstagramMediaUrl(reel.reelHref)}
        className="h-full w-full object-cover"
        controls
        autoPlay
        playsInline
      />
    );
  }

  // No containNavigation: the popup is a modal overlay, let Instagram behave natively.
  // cropped=true (default) oversizes the iframe and clips the Instagram header/footer
  // so only the video area is visible inside the rounded popup card.
  return (
    <InstagramMediaFrame
      reel={reel}
      className="h-full w-full"
      autoplay
      interactive
    />
  );
}

function getPosition(
  offset: number,
  reelCount: number,
  spacing: "default" | "wide",
): {
  className: string;
  style: CSSProperties;
} {
  const near = spacing === "wide" ? "21rem" : "18rem";
  const far = spacing === "wide" ? "35rem" : "30rem";
  const hidden = spacing === "wide" ? "35rem" : "30rem";

  if (reelCount <= 4 && Math.abs(offset) > 1) {
    return {
      className: "pointer-events-none z-0 opacity-0",
      style: getTransform(offset < 0 ? `-${hidden}` : hidden, 0.76),
    };
  }

  if (offset < -2) {
    return {
      className: "pointer-events-none z-0 opacity-0",
      style: getTransform(`-${hidden}`, 0.76),
    };
  }

  if (offset > 2) {
    return {
      className: "pointer-events-none z-0 opacity-0",
      style: getTransform(hidden, 0.76),
    };
  }

  const positions = {
    "-2": {
      className: "z-0 opacity-[0.52] blur-[0.4px] hover:opacity-70",
      style: getTransform(`-${far}`, 0.76),
    },
    "-1": {
      className: "z-10 opacity-[0.84] hover:opacity-95",
      style: getTransform(`-${near}`, 0.86),
    },
    "0": {
      className: "z-30 opacity-100",
      style: getTransform("0rem", 1),
    },
    "1": {
      className: "z-10 opacity-[0.84] hover:opacity-95",
      style: getTransform(near, 0.86),
    },
    "2": {
      className: "z-0 opacity-[0.52] blur-[0.4px] hover:opacity-70",
      style: getTransform(far, 0.76),
    },
  } as const;

  return positions[String(offset) as keyof typeof positions];
}

function getTransform(x: string, scale: number): CSSProperties {
  return {
    transform: `translate(calc(-50% + ${x}), -50%) scale(${scale})`,
  };
}

function InstagramMediaFrame({
  reel,
  className,
  autoplay = false,
  interactive = false,
  containNavigation = false,
  cropped = true,
}: {
  reel: Reel;
  className: string;
  autoplay?: boolean;
  interactive?: boolean;
  containNavigation?: boolean;
  cropped?: boolean;
}) {
  const embedUrl = useMemo(
    () => getInstagramEmbedUrl(reel.reelHref, autoplay),
    [autoplay, reel],
  );

  if (!embedUrl) {
    return <ReelPoster index={0} reel={reel} />;
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <iframe
        src={embedUrl}
        title={`${reel.creator} Instagram reel`}
        className={
          cropped
            ? `absolute left-1/2 top-1/2 h-[120%] w-[178%] -translate-x-1/2 -translate-y-[51%] border-0 ${
                interactive ? "" : "pointer-events-none"
              }`
            : `absolute inset-0 h-full w-full border-0 ${
                interactive ? "" : "pointer-events-none"
              }`
        }
        loading={autoplay ? "lazy" : "eager"}
        tabIndex={-1}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        sandbox={
          containNavigation
            ? "allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
            : undefined
        }
      />
    </div>
  );
}

function getInstagramEmbedUrl(href: string, autoplay = false) {
  if (!href) {
    return "";
  }

  try {
    const url = new URL(href);
    const shortcode = url.pathname
      .split("/")
      .filter(Boolean)
      .find((part, index, parts) => parts[index - 1] === "reel");

    if (!shortcode) {
      return "";
    }

    const params = autoplay ? "?autoplay=1&mute=1" : "";

    return `https://www.instagram.com/reel/${shortcode}/embed/${params}`;
  } catch {
    return "";
  }
}

function getInstagramMediaUrl(href: string) {
  if (!href) {
    return "";
  }

  try {
    return `/api/instagram/reel-thumbnail?url=${encodeURIComponent(href)}`;
  } catch {
    return "";
  }
}

function ReelThumbnail({
  index,
  reel,
  visible,
}: {
  index: number;
  reel: Reel;
  visible: boolean;
}) {
  if (!visible) {
    return <ReelPoster index={index} reel={reel} />;
  }

  const thumbnailSrc = reel.thumbnail || getInstagramMediaUrl(reel.reelHref);

  return (
    <>
      {thumbnailSrc ? (
        <ReelThumbnailImage
          src={thumbnailSrc}
          alt={`${reel.creator} reel thumbnail`}
          fallback={<ReelPoster index={index} reel={reel} />}
        />
      ) : (
        <ReelPoster index={index} reel={reel} />
      )}
      <div className="absolute inset-0 bg-[#03111d]/20" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#071827]/86 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#071827]/92 to-transparent"
      />
      <span className="sr-only">
        Reel {index + 1}: {reel.title}
      </span>
    </>
  );
}

function ReelThumbnailImage({
  src,
  alt,
  fallback,
}: {
  src: string;
  alt: string;
  fallback: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return fallback;
  }

  return (
    // Instagram's dynamic media endpoint is intentionally used here because
    // these thumbnails are user-provided reel URLs, not configured static assets.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="absolute inset-0 h-full w-full object-cover"
      loading="eager"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  );
}

function ReelPoster({ index, reel }: { index: number; reel: Reel }) {
  return (
    <>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(145deg,rgba(3,17,29,0.1),rgba(184,154,93,0.22)),radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.32),transparent_24%),radial-gradient(circle_at_70%_74%,rgba(14,165,164,0.28),transparent_32%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/42 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/88 via-black/36 to-transparent"
      />
      <div className="absolute inset-0 grid place-items-center">
        <span className="grid h-16 w-16 place-items-center rounded-full border border-white/32 bg-white/14 text-white shadow-[0_16px_50px_rgba(0,0,0,0.36)] backdrop-blur-xl transition-transform duration-200 group-hover:scale-105">
          <PlayIcon />
        </span>
      </div>
      <span className="sr-only">
        Reel {index + 1}: {reel.title}
      </span>
    </>
  );
}

function ChevronLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37Z" />
      <path d="M17.5 6.5h.01" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="ml-1 h-6 w-6"
      aria-hidden="true"
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11.76-6.86a1 1 0 0 0 0-1.72L9.5 4.28A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
