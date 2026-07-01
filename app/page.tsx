import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ReelsCarousel } from "@/app/(marketing)/creators/ReelsCarousel";
import { HomeSectionRail } from "@/app/components/home/HomeSectionRail";
import { OpenKaiButton } from "@/app/components/kai/OpenKaiButton";
import { yachtBySlug } from "@/lib/data/yachts";

const WHATSAPP_LINK = "https://wa.me/628213143343";

const backgrounds = {
  promise:
    "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=2400&q=80",
  why: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=2400&q=80",
  explore:
    "https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=2400&q=80",
  conservation:
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=2400&q=80",
  partners:
    "https://images.unsplash.com/photo-1586500036706-41963de24d8b?auto=format&fit=crop&w=2400&q=80",
  book: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=80",
};

const heroBackgroundVideo = {
  webm: "/video/hero-video-optimized.webm",
  mp4: "/video/hero-video-optimized.mp4",
  poster: "/video/hero-video-poster.jpg",
};

const featuredYachts = [
  {
    slug: "alexa",
    priceHero: "from $6,499 / night",
    priceSupporting: "Couples-only - 1 cabin yacht",
  },
  {
    slug: "aliikai",
    priceHero: "from $690 / cabin - night",
    priceSupporting: "or charter $9,900 / night - whole yacht",
  },
  {
    slug: "alila-purnama",
    priceHero: "from $3,000 / cabin - night",
    priceSupporting: "or charter $15,000 / night - whole yacht",
  },
  {
    slug: "amandira",
    priceHero: "from $3,180 / cabin - night",
    priceSupporting: "or charter $15,900 / night - whole yacht",
  },
  {
    slug: "anne-bonny",
    priceHero: "from $1,483 / cabin - night",
    priceSupporting: "or charter $4,450 / night - whole yacht",
  },
].map((item) => ({ ...item, yacht: yachtBySlug[item.slug] }));

const creatorReels = [
  {
    creator: "Story of Sage",
    handle: "@storyofsage",
    title: "Island light, reef days, quiet blue moments",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/DE0a2Z7xSQL/",
  },
  {
    creator: "Josiah William Gordon",
    handle: "@josiahwg",
    title: "Cinematic coastlines through a fine-art lens",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/CPBJDTmjKS_/",
  },
  {
    creator: "Cam Vaughne",
    handle: "@camvaughne",
    title: "Remote Indonesia by sail, film, and sea",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/Ck8BkRDhLhy/",
  },
  {
    creator: "Cam Vaughne",
    handle: "@camvaughne",
    title: "Remote Indonesia by sail, film, and sea",
    views: "Most viewed",
    reelHref: "https://www.instagram.com/reel/DBvwGTlPQsA/",
  },
];

const railItems = [
  { id: "promise", label: "The promise" },
  { id: "why-bluepass", label: "Why BluePass" },
  { id: "explore", label: "Explore" },
  { id: "conservation", label: "Conservation" },
  { id: "creators", label: "Partners" },
  { id: "book", label: "Book" },
];

export default function HomePage() {
  return (
    <div className="cinematic-page bp-home-page relative h-[100svh] overflow-hidden bg-[#020b11] text-white">
      <div
        data-home-scroll
        className="h-[100svh] snap-y snap-mandatory overflow-y-auto overflow-x-hidden scroll-smooth [scrollbar-width:none]"
      >
        <HomePanel
          id="promise"
          backgroundImage={backgrounds.promise}
          backgroundVideo={heroBackgroundVideo}
          overlay="bg-[linear-gradient(180deg,rgba(3,12,20,0.60)_0%,rgba(3,12,20,0.34)_45%,rgba(3,12,20,0.85)_100%)]"
        >
          <div className="mx-auto max-w-4xl">
            <p className="bp-home-fade-up text-xs uppercase tracking-[0.32em] text-[#9fe8df]/90 md:text-sm">
              Surf - Sail - Dive
            </p>
            <h1 className="bp-home-fade-up-2 bp-page-title mt-5 text-balance text-[clamp(2.8rem,8vw,6.5rem)] leading-[0.97] text-white">
              Book the ocean.
              <br />
              Leave it better.
            </h1>
            <p className="bp-home-fade-up-3 mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
              Vetted operators for surf, sail and dive - at the same price as
              booking direct.
            </p>
            <p className="sr-only">
              Every trip protects reefs, cleans the ocean, and lifts
              communities.
            </p>
            <div className="bp-home-fade-up-4 mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/discover" className={primaryCtaClass}>
                Explore trips
              </Link>
              <OpenKaiButton
                className={secondaryCtaClass}
                query="Help me find a BluePass ocean trip"
              >
                Ask Kai <span aria-hidden="true">-&gt;</span>
              </OpenKaiButton>
            </div>
            <p className="mt-6 text-[13px] text-white/55">
              Live now in Komodo &amp; Raja Ampat -{" "}
              <a
                href={WHATSAPP_LINK}
                className="underline-offset-2 hover:text-white/80 hover:underline"
              >
                continue on WhatsApp
              </a>
            </p>
          </div>
        </HomePanel>

        <HomePanel
          id="why-bluepass"
          backgroundImage={backgrounds.why}
          overlay="bg-[linear-gradient(180deg,rgba(3,14,24,0.80)_0%,rgba(4,20,34,0.68)_100%)]"
        >
          <div className="bp-reveal mx-auto w-full max-w-5xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9fe8df]/85">
              Why BluePass
            </p>
            <h2 className="bp-page-title mx-auto mt-4 max-w-3xl text-[clamp(2rem,5.2vw,3.7rem)] leading-[1.02]">
              Better for you. Fairer for them. Best for the ocean.
            </h2>
            <div className="mt-10 grid gap-4 text-left md:grid-cols-3">
              <ValueCard
                icon="tag"
                title="Never a markup"
                body="You never pay more than booking the operator direct. Our fee funds the reef - it isn't a markup on you."
              />
              <ValueCard
                icon="wave"
                title="5% gives back"
                body="A fixed 5% of every fare protects reefs, funds ocean clean-ups, and lifts coastal communities. Most booking platforms route nothing at all."
              />
              <ValueCard
                icon="anchor"
                title="Fairer for operators"
                body="Operators keep 100% of their rate. Conservation and partners are paid from our fee - never their margin."
              />
            </div>
          </div>
        </HomePanel>

        <HomePanel
          id="explore"
          backgroundImage={backgrounds.explore}
          overlay="bg-[linear-gradient(180deg,rgba(3,16,26,0.72)_0%,rgba(3,16,26,0.88)_100%)]"
        >
          <div className="bp-reveal mx-auto w-full max-w-6xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9fe8df]/85">
              Explore
            </p>
            <h2 className="bp-page-title mt-4 text-[clamp(2rem,5.5vw,3.8rem)] leading-[1.02]">
              Real boats. Real reefs. Live availability.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
              A small network of vetted ocean operators - booked at the price
              you see.
            </p>
            <div className="mx-auto mt-8 grid max-w-[76rem] gap-4 text-left sm:grid-cols-2 lg:grid-cols-5">
              {featuredYachts.map(({ yacht, priceHero, priceSupporting }) => (
                <Link
                  key={yacht.slug}
                  href={`/yachts/${yacht.slug}`}
                  className="group relative block h-[260px] min-w-0 overflow-hidden rounded-[var(--bp-radius-md)]"
                >
                  <Image
                    src={yacht.images.card}
                    alt=""
                    fill
                    sizes="230px"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_30%,rgba(6,25,35,0.9))]" />
                  <div className="absolute left-2.5 top-2.5 rounded-full bg-black/40 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.13em] text-white/95 backdrop-blur">
                    {yacht.region}
                  </div>
                  <div className="absolute inset-x-3 bottom-3">
                    <div className="bp-page-title text-[17px] leading-tight text-white">
                      {yacht.name}
                    </div>
                    <div className="mt-0.5 text-[11.5px] text-white/75">
                      Up to {yacht.maxGuests} guests
                    </div>
                    <div className="mt-1 text-[12.5px] font-semibold leading-snug text-white">
                      {priceHero}
                    </div>
                    <div className="text-[10.5px] leading-snug text-white/60">
                      {priceSupporting}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex items-center justify-center">
              <Link href="/discover" className={compactPrimaryCtaClass}>
                Explore all trips
              </Link>
            </div>
          </div>
        </HomePanel>

        <HomePanel
          id="conservation"
          backgroundImage={backgrounds.conservation}
          overlay="bg-[linear-gradient(180deg,rgba(4,32,30,0.70)_0%,rgba(3,22,26,0.88)_100%)]"
        >
          <div className="bp-reveal mx-auto w-full max-w-5xl">
            <p className="text-xs uppercase tracking-[0.32em] text-emerald-200/85">
              Built in - never an add-on
            </p>
            <h2 className="bp-page-title mt-4 text-[clamp(2rem,6vw,4rem)] leading-[1.0]">
              Every trip leaves it better.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg">
              A fixed 5% of every fare goes to work in the waters you travel -
              protecting reefs, cleaning the ocean, and lifting the communities
              who live by it. Part of the price you see, never an add-on. Most
              platforms route nothing.
            </p>
            <div className="mt-9 grid items-center gap-6 text-left md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
              <div className="rounded-[var(--bp-radius-md)] border border-white/12 bg-white/[0.06] p-5 text-left backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/45">
                    Example fare
                  </span>
                  <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-200">
                    5% built in
                  </span>
                </div>
                <div className="bp-page-title mt-3 text-[17px] text-white">
                  Komodo liveaboard - 5 nights
                </div>
                <div className="mt-4 space-y-2 text-[13px]">
                  <div className="flex items-center justify-between text-white/75">
                    <span>Your fare</span>
                    <span className="tabular-nums">$3,450</span>
                  </div>
                  <div className="h-px bg-white/10" />
                  <div className="flex items-center justify-between text-emerald-200">
                    <span>Gives back (5%)</span>
                    <span className="font-semibold tabular-nums">$172</span>
                  </div>
                  <div className="text-[12px] text-white/55">
                    - reefs - clean-ups - communities
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-200/70">
                  Three ways, every trip
                </p>
                <ul className="mt-3 space-y-2.5">
                  <ImpactRow
                    title="Protect"
                    label="Reef & marine conservation"
                    body="Misool - Manta Trust - Coral Triangle Center"
                  />
                  <ImpactRow
                    title="Restore"
                    label="Ocean & beach clean-ups"
                    body="Ghost-gear & plastic removal, mangroves"
                  />
                  <ImpactRow
                    title="Uplift"
                    label="Coastal communities"
                    body="Local jobs, training & social impact"
                  />
                </ul>
                <Link
                  href="/conservation"
                  className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-emerald-200 hover:text-white"
                >
                  See exactly where it goes{" "}
                  <span aria-hidden="true">-&gt;</span>
                </Link>
              </div>
            </div>
          </div>
        </HomePanel>

        <HomePanel
          id="creators"
          backgroundImage={backgrounds.partners}
          overlay="bg-[linear-gradient(180deg,rgba(3,14,24,0.74)_0%,rgba(6,26,40,0.86)_100%)]"
        >
          <div className="bp-reveal mx-auto w-full max-w-6xl">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9fe8df]/85">
              From the network
            </p>
            <h2 className="bp-page-title mt-4 text-[clamp(2rem,5.5vw,3.8rem)] leading-[1.02]">
              Filmed by people who actually go.
            </h2>
            <div className="bp-home-reels">
              <ReelsCarousel reels={creatorReels} spacing="wide" />
            </div>
          </div>
        </HomePanel>

        <HomePanel
          id="book"
          backgroundImage={backgrounds.book}
          overlay="bg-[linear-gradient(180deg,rgba(3,12,20,0.52)_0%,rgba(3,12,20,0.42)_38%,rgba(3,12,20,0.90)_100%)]"
          className="pb-0"
          contentClassName="absolute inset-0 flex flex-col justify-center px-6 pt-24"
        >
          <div className="bp-reveal mx-auto flex max-w-4xl flex-1 flex-col items-center justify-center pb-16">
            <h2 className="bp-page-title text-[clamp(2.6rem,8vw,6rem)] leading-[0.98]">
              Book the ocean.
              <br />
              Leave it better.
            </h2>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/discover" className={primaryCtaClass}>
                Explore trips
              </Link>
              <OpenKaiButton
                className={secondaryCtaClass}
                query="I want to book an ocean trip with BluePass"
              >
                Ask Kai <span aria-hidden="true">-&gt;</span>
              </OpenKaiButton>
            </div>
            <a
              href={WHATSAPP_LINK}
              className="mt-4 inline-block text-[13px] text-white/55 underline-offset-2 hover:text-white/80 hover:underline"
            >
              or continue on WhatsApp
            </a>
          </div>
          <footer className="absolute inset-x-0 bottom-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5 text-xs text-white/50">
            <Link className="hover:text-white/80" href="/discover">
              Discover
            </Link>
            <Link className="hover:text-white/80" href="/conservation">
              Conservation
            </Link>
            <Link className="hover:text-white/80" href="/creators">
              Partners
            </Link>
            <Link className="hover:text-white/80" href="/for-operators">
              For operators
            </Link>
            <span className="text-white/30">(c) 2026 BluePass</span>
          </footer>
        </HomePanel>
      </div>

      <HomeSectionRail items={railItems} />
    </div>
  );
}

const primaryCtaClass =
  "bp-home-cta bp-focus-ring inline-flex w-full items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-[#071827] shadow-xl shadow-black/30 transition hover:scale-[1.02] hover:bg-white/90 active:scale-100 sm:w-auto";

const secondaryCtaClass =
  "bp-home-cta bp-focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-8 py-4 text-base font-medium text-white backdrop-blur transition hover:bg-white/15 active:scale-100 sm:w-auto";

const compactPrimaryCtaClass =
  "bp-home-cta bp-focus-ring inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[#071827] transition hover:scale-[1.02] hover:bg-white/90";

type HomePanelBackgroundVideo = {
  webm?: string;
  mp4: string;
  poster: string;
};

function HomePanel({
  id,
  backgroundImage,
  backgroundVideo,
  overlay,
  children,
  className = "",
  contentClassName = "relative w-full",
}: {
  id: string;
  backgroundImage: string;
  backgroundVideo?: HomePanelBackgroundVideo;
  overlay: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      id={id}
      data-home-panel
      className={`relative flex min-h-[100svh] snap-start items-center justify-center overflow-hidden px-6 py-20 text-center ${className}`}
    >
      {backgroundVideo ? (
        <video
          aria-hidden="true"
          className="bp-home-bg absolute inset-0 h-full w-full scale-105 object-cover"
          poster={backgroundVideo.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
        >
          {backgroundVideo.webm ? (
            <source src={backgroundVideo.webm} type="video/webm" />
          ) : null}
          <source src={backgroundVideo.mp4} type="video/mp4" />
        </video>
      ) : (
        <div
          aria-hidden="true"
          className="bp-home-bg absolute inset-0 h-full w-full scale-105 bg-cover bg-center"
          style={{ backgroundImage: `url('${backgroundImage}')` }}
        />
      )}
      <div aria-hidden="true" className={`absolute inset-0 ${overlay}`} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[#0c3b3a]/10 mix-blend-color"
      />
      <div aria-hidden="true" className="bp-film-grain absolute inset-0" />
      <div className={`z-10 ${contentClassName}`}>{children}</div>
    </section>
  );
}

function ValueCard({
  icon,
  title,
  body,
}: {
  icon: "tag" | "wave" | "anchor";
  title: string;
  body: string;
}) {
  return (
    <article className="rounded-[var(--bp-radius-md)] border border-white/12 bg-white/[0.06] p-6 backdrop-blur-md">
      <div
        className={
          icon === "tag"
            ? "text-[#ff7d68]"
            : icon === "wave"
              ? "text-emerald-300"
              : "text-[#9fe8df]"
        }
      >
        <ValueIcon icon={icon} />
      </div>
      <h3 className="bp-page-title mt-4 text-xl leading-snug text-white">
        {title}
      </h3>
      <p className="mt-2 text-[14px] leading-relaxed text-white/70">{body}</p>
    </article>
  );
}

function ImpactRow({
  title,
  label,
  body,
}: {
  title: string;
  label: string;
  body: string;
}) {
  return (
    <li className="rounded-[var(--bp-radius-md)] border border-white/10 bg-white/[0.05] px-4 py-3 backdrop-blur-sm">
      <div className="flex items-baseline justify-between gap-3">
        <span className="bp-page-title text-[16px] text-white">{title}</span>
        <span className="text-right text-[12px] text-white/70">{label}</span>
      </div>
      <div className="mt-1 text-[11px] leading-snug text-emerald-200/70">
        {body}
      </div>
    </li>
  );
}

function ValueIcon({ icon }: { icon: "tag" | "wave" | "anchor" }) {
  if (icon === "tag") {
    return (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L3 13V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z" />
        <circle cx="7.5" cy="7.5" r="1.3" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "wave") {
    return (
      <svg
        width="26"
        height="26"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 16c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
        <path d="M3 20c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2" />
        <path d="M12 12c0-3 2-5 2-8-3 1-4 3-4 5" />
      </svg>
    );
  }

  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="2.2" />
      <path d="M12 22V7" />
      <path d="M5 12a7 7 0 0 0 14 0" />
      <path d="M5 12H3M21 12h-2" />
    </svg>
  );
}
