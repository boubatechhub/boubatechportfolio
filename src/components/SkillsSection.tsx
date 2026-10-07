import { motion } from 'motion/react';
import { Section } from './UI';
import type { SkillGroup } from '../types';
import { getDirectImageUrl } from '../utils';

type Skill = SkillGroup['skills'][number];

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  Développement:
    'Langages, frameworks et stacks pour concevoir des applications web et mobile.',
  'Design & Audio-visuel':
    'Maquettes UI/UX, identité visuelle et contenus multimédias.',
  'Outils & Méthodes':
    'Versioning, tests API, cloud, déploiement, automatisation et méthodes agiles.',
};

function SkillChip({ skill, compact }: { skill: Skill; compact?: boolean }) {
  return (
    <span
      className={`inline-flex w-fit max-w-full items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] text-white/85 ${
        compact ? 'px-2.5 py-1.5 text-xs' : 'px-2.5 py-1.5 text-body-sm'
      }`}
    >
      {skill.icon ? (
        <img
          src={getDirectImageUrl(skill.icon)}
          alt={`Icône ${skill.name}`}
          className={`shrink-0 object-contain ${compact ? 'size-7' : 'size-5'}`}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          width={28}
          height={28}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : null}
      <span className="whitespace-nowrap">{skill.name}</span>
    </span>
  );
}

function IconGrid({ skills }: { skills: Skill[] }) {
  return (
    <ul
      className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3 md:gap-3.5 xl:grid-cols-5 xl:gap-4 2xl:grid-cols-6 2xl:gap-4"
      role="list"
    >
      {skills.map((skill) => (
        <li
          key={skill.name}
          className="portfolio-card flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.03] p-3.5 transition-colors hover:border-white/15 sm:p-4"
          title={skill.name}
        >
          {skill.icon ? (
            <img
              src={getDirectImageUrl(skill.icon)}
              alt={`Icône ${skill.name}`}
              className="size-10 object-contain sm:size-11 xl:size-12 2xl:size-14"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              width={48}
              height={48}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-caption text-white/30 sm:size-11">
              ?
            </span>
          )}
          <span className="max-w-full truncate text-center text-caption-sm leading-tight text-white/50">
            {skill.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

type BentoCardProps = {
  title: string;
  description?: string;
  skills: Skill[];
  variant: 'featured' | 'compact';
  index: number;
  className?: string;
};

function BentoCard({
  title,
  description,
  skills,
  variant,
  index,
  className = '',
}: BentoCardProps) {
  const desc =
    description || DEFAULT_DESCRIPTIONS[title] || 'Technologies maîtrisées.';

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-32px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className={`portfolio-card flex h-full min-w-0 flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-lg shadow-black/10 sm:p-6 xl:p-7 2xl:p-8 ${className}`}
    >
      <header className="mb-2 shrink-0 sm:mb-3">
        <h3 className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
          {title}
        </h3>
        <p className="mt-1 max-w-md text-sm leading-snug text-white/45">
          {desc}
        </p>
      </header>

      {variant === 'featured' ? (
        <IconGrid skills={skills} />
      ) : (
        <ul className="flex flex-wrap gap-2" role="list" aria-label={title}>
          {skills.map((skill) => (
            <li key={skill.name} className="list-none">
              <SkillChip skill={skill} compact />
            </li>
          ))}
        </ul>
      )}
    </motion.article>
  );
}

type SkillsSectionProps = {
  groups: SkillGroup[];
};

export function SkillsSection({ groups }: SkillsSectionProps) {
  const visible = groups.filter((g) => g.skills?.length > 0);

  if (visible.length === 0) {
    return (
      <Section
        id="compétences"
        subtitle="Expertise"
        title="Compétences & Technologies"
      >
        <p className="font-mono text-sm text-white/40">
          Aucune compétence à afficher.
        </p>
      </Section>
    );
  }

  const dev = visible[0];
  const design = visible[1];
  const tools = visible[2];

  return (
    <Section
      id="compétences"
      subtitle="Expertise"
      title="Compétences & Technologies"
    >
      <div className="grid grid-cols-1 items-stretch gap-4 lg:grid-cols-2 lg:gap-5 xl:gap-6 2xl:gap-8">
        <div className="flex flex-col gap-4">
          {dev ? (
            <BentoCard
              title={dev.title}
              description={dev.description}
              skills={dev.skills}
              variant="featured"
              index={0}
            />
          ) : null}

          {design ? (
            <BentoCard
              title={design.title}
              description={design.description}
              skills={design.skills}
              variant="featured"
              index={1}
            />
          ) : null}
        </div>

        {tools ? (
          <BentoCard
            title={tools.title}
            description={tools.description}
            skills={tools.skills}
            variant="featured"
            index={2}
          />
        ) : null}
      </div>

      {visible.length < 3 && visible.length > 0 ? (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {visible.slice(1).map((group, i) => (
            <BentoCard
              key={group.title}
              title={group.title}
              description={group.description}
              skills={group.skills}
              variant="compact"
              index={i + 1}
            />
          ))}
        </div>
      ) : null}
    </Section>
  );
}
