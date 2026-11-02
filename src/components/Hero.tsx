import { useMemo } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { CrashText } from "./CrashText";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { CONTACT_DETAILS } from "../constants";
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

  const [firstName, ...rest] = displayName.split(" ");
  const lastName = rest.join(" ");

  const scrollTo = (id: string) =>
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });

  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, transform: "translateY(16px)" },
          animate: { opacity: 1, transform: "translateY(0px)" },
          transition: { duration: 0.7, delay, ease: [0.23, 1, 0.32, 1] as const },
        };

  return (
    <section
      id="accueil"
      className="portfolio-section portfolio-section--hero relative flex min-h-[100dvh] flex-col justify-end overflow-hidden pb-10 pt-32 md:pb-14 md:pt-40"
    >
      <div className={`relative z-10 ${PAGE_CONTAINER_CLASS} w-full`}>
        <motion.p
          {...fade(0)}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-[#fffefb]/70 py-1.5 pl-2.5 pr-4 text-sm text-white/70 backdrop-blur-sm md:mb-10"
        >
          <span className="relative flex h-2 w-2" aria-hidden>
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/50 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
          </span>
          Disponible pour une alternance
        </motion.p>

        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <motion.h1
              {...fade(0.08)}
              className="font-display text-[clamp(3.5rem,16vw,9.5rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white"
            >
              {firstName}
              {lastName ? (
                <>
                  <br />
                  <span className="font-serif-accent text-[1.08em] tracking-[-0.03em] text-brand-orange">
                    {lastName}
                  </span>
                </>
              ) : null}
            </motion.h1>

            <motion.div
              {...fade(0.18)}
              className="relative mt-8 max-w-2xl text-xl leading-snug tracking-[-0.015em] text-white/70 md:mt-10 md:text-2xl"
            >
              <span
                className="pointer-events-none block select-none opacity-0"
                aria-hidden="true"
              >
                {HERO_HEADLINE_RESERVE}
              </span>
              <span className="absolute inset-0">
                <CrashText texts={HERO_HEADLINES} interval={4500} />
              </span>
            </motion.div>

            <motion.div
              {...fade(0.26)}
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <Button
                onClick={() => scrollTo("projets")}
                className="w-full sm:w-auto"
              >
                Voir mes projets <ArrowRight size={18} aria-hidden />
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollTo("contact")}
                className="w-full sm:w-auto"
              >
                Me contacter
              </Button>
            </motion.div>
          </div>

          <motion.dl
            {...fade(0.34)}
            className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 text-sm lg:col-span-4 lg:grid-cols-1 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
          >
            {[
              ["Rôle", "Développeur Web / Mobile & UI/UX"],
              ["Basé à", CONTACT_DETAILS.location],
              ["Recherche", "Alternance — développement full stack"],
            ].map(([term, value]) => (
              <div key={term} className="last:col-span-2 lg:last:col-span-1">
                <dt className="font-mono text-2xs uppercase tracking-[0.18em] text-white/45">
                  {term}
                </dt>
                <dd className="mt-1.5 font-medium leading-snug text-white/85">
                  {value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.div {...fade(0.42)} className="mt-14 md:mt-20">
          <div className="marquee border-y border-white/10 py-4">
            <div className="marquee-track" aria-label="Technologies utilisées">
              {[...marqueeItems, ...marqueeItems].map((label, i) => (
                <span
                  key={`${label}-${i}`}
                  className="mx-5 inline-flex items-center gap-5 font-mono text-xs uppercase tracking-[0.14em] text-white/55"
                  aria-hidden={i >= marqueeItems.length}
                >
                  {label}
                  <span className="h-1 w-1 rounded-full bg-brand-orange/60" aria-hidden />
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
