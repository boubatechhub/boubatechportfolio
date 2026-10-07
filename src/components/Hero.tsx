import { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { CrashText } from "./CrashText";
//import DotGrid from "./DotGrid";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { PAGE_CONTAINER_CLASS } from "../layout";
import type { Settings } from "../types";
import { Button } from "./UI";

const HERO_FULL_NAME = "Boubacar Traoré";

const HERO_HEADLINES = [
  "Concevoir, développer et optimiser des produits web rapides et immersifs.",
  "À la recherche d'une alternance dans le cadre de ma formation de développeur full stack.",
] as const;

const HERO_HEADLINE_RESERVE = HERO_HEADLINES.reduce((longest, line) =>
  line.length > longest.length ? line : longest,
);

export type HeroProps = {
  settings: Settings;
  stacks?: string[];
};

export function Hero({
  settings,
  stacks = [],
}: {
  settings: Settings;
  stacks?: string[];
}) {
  const displayName =
    settings.name && settings.name !== "BT." ? settings.name : HERO_FULL_NAME;

  const reduceMotion = usePrefersReducedMotion();
  const subline = useMemo(() => "", []);

  const marqueeItems = useMemo(() => {
    const cleaned = stacks
      .map((s) => String(s || "").trim())
      .filter(Boolean)
      .slice(0, 60);

    if (cleaned.length === 0) {
      return ["React", "Vite", "TypeScript", "Tailwind", "Supabase"];
    }
    return cleaned;
  }, [stacks]);

  return (
    <motion.section
      id="accueil"
      className="portfolio-section portfolio-section--hero relative mx-3 my-3 flex min-h-screen flex-col items-center justify-center overflow-hidden rounded-[10px] border border-black/[0.06] bg-black pt-28 sm:mx-4 sm:my-4 xl:mx-6"
      initial={
        reduceMotion
          ? false
          : { opacity: 0, transform: "translateY(14px)" }
      }
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true }}
      transition={{
        duration: reduceMotion ? 0.18 : 0.6,
        ease: [0.23, 1, 0.32, 1],
      }}
    >
      <div className="absolute inset-0 z-0 bg-black">
        {/* <DotGrid
          dotSize={8}
          gap={60}
          baseColor="#0c0c0b"
          activeColor="#A97319"
          proximity={100}
          shockRadius={200}
          shockStrength={9}
          resistance={950}
          returnDuration={3.5}
        /> */}
      </div>

      <div
        className={`relative z-10 ${PAGE_CONTAINER_CLASS} flex w-full flex-col items-center`}
      >
        <div className="w-full max-w-5xl text-center">
          <p className="mb-4 font-mono text-caption-sm uppercase tracking-[0.22em] text-white/55">
            {displayName} · Développeur Web / Mobile & UI/UX
          </p>

          <h1 className="relative mx-auto mb-0 mt-0 w-full max-w-5xl px-4 py-0 font-display text-3xl font-semibold leading-[1.08] tracking-tight text-white sm:px-6 sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl">
            <span
              className="pointer-events-none block select-none opacity-0"
              aria-hidden="true"
            >
              {HERO_HEADLINE_RESERVE}
            </span>
            <span className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
              <CrashText
                texts={HERO_HEADLINES}
                interval={4000}
                className="block w-full text-center"
              />
            </span>
          </h1>

          {subline ? (
            <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-white/60 sm:text-lg xl:text-xl">
              {subline}
            </p>
          ) : null}

          <div className="mx-auto mt-10 flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <Button
              onClick={() =>
                document
                  .getElementById("projets")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full justify-center sm:w-auto"
            >
              Voir mes projets <ArrowRight size={18} />
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="w-full justify-center sm:w-auto"
            >
              Me contacter
            </Button>
          </div>

          <div className="mx-auto mt-10 w-full max-w-5xl">
            <div className="marquee rounded-2xl border border-white/10 bg-white/[0.03] py-3 shadow-2xl shadow-black/30">
              <div className="marquee-track" aria-label="Technologies">
                {[...marqueeItems, ...marqueeItems].map((label, i) => (
                  <span
                    key={`${label}-${i}`}
                    className="mx-1.5 inline-flex items-center rounded-full border border-white/10 bg-black/20 px-3 py-1 font-mono text-caption-sm uppercase tracking-wider text-white/60"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-2xs uppercase tracking-[0.22em] text-white/35">
              Stack & outils utilisés sur mes projets
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
