import { motion } from "motion/react";
import {
  BookOpen,
  Brain,
  Check,
  Code2,
  Layers,
  Rocket,
  Sparkles,
  Target,
  Users,
  Zap,
  GraduationCap,
  TrendingUp,
} from "lucide-react";
import type { Settings } from "../types";
import { Section } from "./UI";
import {
  CountUp,
  DrawLine,
  MaskReveal,
  Stagger,
  StaggerItem,
} from "./Reveal";

const CARD_SURFACE =
  "portfolio-card rounded-2xl border border-white/20 bg-white/[0.04] transition-[border-color,background-color,transform] duration-300";

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-48px" as const },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

const VALUE_POINTS = [
  "Compréhension des besoins métier",
  "Développement Full Stack moderne",
  "Interfaces orientées UX",
  "Intégration de l'IA lorsqu'elle apporte une vraie valeur",
  "Code propre, évolutif et maintenable",
] as const;

const STATS = [
  {
    value: "3+",
    label: "Années d'études",
    icon: GraduationCap,
  },
  {
    value: "15+",
    label: "Projets réalisés",
    icon: Rocket,
  },
  {
    value: "8+",
    label: "Technologies maîtrisées",
    icon: Layers,
  },
  {
    value: "100%",
    label: "Apprentissage continu",
    icon: TrendingUp,
  },
] as const;

const DIFFERENTIATORS = [
  {
    icon: Code2,
    title: "Développement Full Stack",
    description: "Du prototype au déploiement, une vision technique complète.",
  },
  {
    icon: Target,
    title: "Vision produit",
    description: "Chaque fonctionnalité sert un objectif utilisateur clair.",
  },
  {
    icon: Users,
    title: "Approche centrée utilisateur",
    description: "Des parcours fluides, pensés pour la clarté et l'efficacité.",
  },
  {
    icon: Brain,
    title: "Intégration de l'IA",
    description: "L'IA au service du produit, jamais comme simple effet de mode.",
  },
  {
    icon: BookOpen,
    title: "Veille permanente",
    description: "Toujours à jour sur les outils et pratiques qui comptent.",
  },
  {
    icon: Sparkles,
    title: "Apprentissage rapide",
    description: "Capacité à monter en compétence sur de nouveaux enjeux.",
  },
] as const;

type AboutProps = {
  settings: Settings;
};

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 flex items-center gap-3 font-mono text-caption-sm uppercase tracking-[0.18em] text-white/50 md:mb-6">
      <span className="section-index tabular-nums" aria-hidden />
      <DrawLine className="h-px w-8 bg-white/20" />
      {children}
    </p>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp}
      transition={{ ...fadeUp.transition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function About({ settings }: AboutProps) {
  return (
    <Section id="à-propos" className="relative overflow-hidden">
      <div className="relative z-10 space-y-16 md:space-y-20 xl:space-y-24">
        <Reveal>
          <SectionBadge>À propos</SectionBadge>
          <h2 className="max-w-4xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-white md:text-5xl lg:text-6xl xl:text-[4.25rem]">
            <MaskReveal delay={0.08}>
              Un profil hybride,{" "}
              <span className="font-serif-accent text-brand-orange">
                une vision produit.
              </span>
            </MaskReveal>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <Reveal>
            <div className="max-w-xl space-y-5 text-base leading-relaxed text-white/65 md:text-lg md:leading-8">
              <p>
                Je suis{" "}
                <span className="text-white/90">
                  {settings.name?.replace(".", "") || "Boubacar Traoré"}
                </span>
                , développeur web & mobile et designer UI/UX. Ce qui me
                passionne, c&apos;est transformer une idée floue en produit
                concret — rapide, élégant et réellement utile pour celui qui
                l&apos;utilise.
              </p>
              <p>
                Ma vision du développement : allier rigueur technique, sens du
                produit et attention portée à l&apos;expérience. Je ne code pas
                pour cocher des cases — je construis des outils qui résolvent de
                vrais problèmes.
              </p>
              <p>
                {settings.bio ||
                  "Je fais ce métier par passion et par envie de créer. Chaque projet est une occasion d'apprendre, d'itérer et de livrer quelque chose dont on peut être fier."}
              </p>
              <p className="text-white/50">
                Aujourd&apos;hui, je suis à la recherche d&apos;une{" "}
                <span className="text-lg font-semibold text-brand-orange">
                  alternance
                </span>{" "}
                où je pourrai contribuer à des produits ambitieux, continuer à
                progresser et avoir un impact mesurable.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <article
              className={`${CARD_SURFACE} flex h-full flex-col gap-6 rounded-[1.5rem] p-6 sm:p-9`}
            >
              <div className="space-y-3">
                <h3 className="font-display text-2xl font-medium tracking-[-0.025em] text-white md:text-3xl">
                  Ma valeur ajoutée
                </h3>
                <p className="max-w-md text-sm leading-relaxed text-white/55 md:text-base">
                  Je transforme une idée en un produit performant, intuitif et
                  centré utilisateur.
                </p>
              </div>

              <Stagger
                as="ul"
                gap={0.08}
                className="divide-y divide-white/[0.07] border-t border-white/[0.07]"
              >
                {VALUE_POINTS.map((item) => (
                  <StaggerItem
                    as="li"
                    key={item}
                    className="flex items-start gap-3 py-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-orange/15 text-brand-orange">
                      <Check size={12} strokeWidth={3} aria-hidden />
                    </span>
                    <span className="text-sm leading-relaxed text-white/80 md:text-body-md">
                      {item}
                    </span>
                  </StaggerItem>
                ))}
              </Stagger>
            </article>
          </Reveal>
        </div>

        <Reveal>
          <Stagger
            gap={0.1}
            className="grid grid-cols-2 gap-x-6 gap-y-10 border-y border-white/10 py-10 lg:grid-cols-4 lg:gap-8 lg:divide-x lg:divide-white/10 [&>*]:lg:pl-8 [&>*:first-child]:lg:pl-0"
          >
            {STATS.map((stat) => (
              <StaggerItem key={stat.label} className="flex flex-col gap-3">
                <div>
                  <p className="font-display text-5xl font-medium tabular-nums tracking-[-0.045em] text-white md:text-6xl">
                    <CountUp value={stat.value} />
                  </p>
                  <p className="mt-1 font-mono text-2xs uppercase tracking-widest text-white/45 md:text-caption-sm">
                    {stat.label}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <h3 className="font-display text-3xl font-medium tracking-[-0.03em] text-white md:text-4xl lg:col-span-4">
              Pourquoi{" "}
              <span className="font-serif-accent text-brand-orange">
                travailler avec moi
              </span>
            </h3>
            <Stagger
              as="ol"
              gap={0.08}
              className="grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:col-span-8"
            >
              {DIFFERENTIATORS.map((item, i) => (
                <StaggerItem
                  as="li"
                  key={item.title}
                  className="group flex gap-5 border-t border-white/10 py-6"
                >
                  <span className="pt-1 font-mono text-xs tabular-nums text-brand-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h4 className="font-display text-lg font-medium tracking-[-0.015em] text-white">
                      {item.title}
                    </h4>
                    <p className="mt-1.5 max-w-sm text-[0.95rem] leading-relaxed text-white/55">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
