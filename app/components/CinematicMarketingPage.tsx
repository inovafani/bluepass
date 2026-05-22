import Link from "next/link";
import { BluePassFooter } from "@/app/components/BluePassFooter";

type Feature = {
  title: string;
  body: string;
};

type CinematicMarketingPageProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  features?: Feature[];
  backgroundImage?: string;
  titleClassName?: string;
};

export function CinematicMarketingPage({
  eyebrow,
  title,
  body,
  primaryHref = "https://wa.me/628213143342",
  primaryLabel = "Start with Kai",
  secondaryHref = "/",
  secondaryLabel = "Explore",
  features = [],
  backgroundImage = "https://assets.mixkit.co/videos/9774/9774-thumb-720-0.jpg",
  titleClassName = "text-[clamp(2.25rem,5vw,4rem)]",
}: CinematicMarketingPageProps) {
  return (
    <>
      <section className="cinematic-page relative min-h-svh overflow-hidden bg-[#020b11] text-white">
        <div
          aria-hidden="true"
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage: `url('${backgroundImage}')`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,7,12,0.88),rgba(0,15,21,0.5)_48%,rgba(0,8,14,0.7)),linear-gradient(180deg,rgba(0,0,0,0.44),rgba(0,0,0,0.08)_38%,rgba(0,0,0,0.72))]" />
        <div className="absolute inset-0 bg-[#0c3b3a]/18 mix-blend-color" />
        <div className="bp-film-grain absolute inset-0" />

        <div className="cinematic-hero-stage">
          <section className="max-w-[640px] border border-white/16 bg-[#03111d]/58 p-6 shadow-[0_28px_100px_rgba(0,0,0,0.44)] backdrop-blur-2xl md:p-10">
            <p className="mb-6 text-[10px] font-black text-white/60">
              {eyebrow}
            </p>
            <h1
              className={`bp-page-title ${titleClassName} leading-[0.96] text-white`}
            >
              {title}
            </h1>
            <div className="mt-7 grid grid-cols-[2px_1fr] gap-5">
              <span className="mt-1 h-20 w-px bg-white/70" aria-hidden="true" />
              <p className="max-w-[29rem] text-sm leading-[1.75] text-white/78 md:text-[15px]">
                {body}
              </p>
            </div>
            <div className="mt-9 flex flex-wrap gap-3 md:gap-5">
              <Link
                href={primaryHref}
                className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center bg-white px-6 text-[11px] font-black text-[#071827] transition-colors hover:bg-white/88 active:scale-[0.98]"
              >
                {primaryLabel}
              </Link>
              <Link
                href={secondaryHref}
                className="bp-focus-ring inline-flex h-11 min-w-[166px] items-center justify-center border border-white/54 bg-transparent px-6 text-[11px] font-black text-white transition-colors hover:bg-white/10 active:scale-[0.98]"
              >
                {secondaryLabel}
              </Link>
            </div>
          </section>

          {features.length > 0 ? (
            <div className="grid max-w-5xl gap-3 md:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="border border-white/12 bg-black/20 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                >
                  <h2 className="text-[11px] font-black text-white/82">
                    {feature.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/64">
                    {feature.body}
                  </p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
      <BluePassFooter />
    </>
  );
}
