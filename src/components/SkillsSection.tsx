import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { Section } from './UI';
import type { SkillGroup } from '../types';
import { getDirectImageUrl } from '../utils';

type Skill = SkillGroup['skills'][number];

type SkillsSectionProps = {
  groups: SkillGroup[];
};

type Row =
  | { kind: 'group'; title: string; count: number; groupIndex: number }
  | { kind: 'skill'; skill: Skill; groupIndex: number };

/** Hauteur de scroll (en vh) consacrée au passage d'une ligne à la suivante. */
const ROW_SCROLL_VH = 30;

/**
 * Avance « cran par cran » : chaque compétence reste centrée pendant une partie
 * du scroll (palier), puis la liste glisse doucement vers la suivante.
 */
function stepped(raw: number): number {
  const base = Math.floor(raw);
  const f = raw - base;
  const HOLD = 0.3; // part du scroll où la ligne reste immobile, de chaque côté
  const t = Math.min(1, Math.max(0, (f - HOLD) / (1 - 2 * HOLD)));
  return base + t * t * (3 - 2 * t);
}

function SkillIcon({ skill, className }: { skill: Skill; className: string }) {
  const [failed, setFailed] = useState(false);
  if (!skill.icon || failed) {
    return (
      <span
        className={`${className} flex items-center justify-center rounded-[22%] bg-[#ebe5dc] font-mono text-[0.32em] font-medium uppercase tracking-normal text-[#1a1814]/60`}
        aria-hidden
      >
        {skill.name.slice(0, 2)}
      </span>
    );
  }
  return (
    <img
      src={getDirectImageUrl(skill.icon)}
      alt=""
      aria-hidden
      className={`${className} object-contain`}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      width={64}
      height={64}
      onError={() => setFailed(true)}
    />
  );
}

function ScrollRow({
  row,
  index,
  progress,
}: {
  row: Row;
  index: number;
  progress: MotionValue<number>;
}) {
  // Distance à la ligne active : 0 = au centre, en foncé.
  const opacity = useTransform(progress, (p) => {
    const d = Math.abs(index - p);
    if (d < 0.5) return 1;
    return Math.max(0.16, 0.62 - (d - 0.5) * 0.14);
  });

  if (row.kind === 'group') {
    return (
      <motion.li
        style={{ opacity }}
        className="flex h-[var(--skill-row)] items-center"
      >
        <span className="flex items-center gap-3 font-mono text-[clamp(0.7rem,1.1vw,0.85rem)] uppercase tracking-[0.18em] text-brand-orange">
          <span className="tabular-nums">
            {String(row.groupIndex + 1).padStart(2, '0')}
          </span>
          <span className="h-px w-8 bg-brand-orange/50" aria-hidden />
          <span>{row.title}</span>
          <span className="text-[#1a1814]/40">({row.count})</span>
        </span>
      </motion.li>
    );
  }

  return (
    <motion.li
      style={{ opacity }}
      className="flex h-[var(--skill-row)] items-center gap-[0.35em] font-display text-[length:var(--skill-font)] font-semibold leading-none tracking-[-0.04em] text-[#1a1814]"
    >
      <SkillIcon skill={row.skill} className="size-[0.85em] shrink-0" />
      <span className="truncate">{row.skill.name}</span>
    </motion.li>
  );
}

function SkillsScroller({ groups }: { groups: SkillGroup[] }) {
  const rows = useMemo<Row[]>(() => {
    const out: Row[] = [];
    groups.forEach((g, gi) => {
      out.push({ kind: 'group', title: g.title, count: g.skills.length, groupIndex: gi });
      g.skills.forEach((skill) => out.push({ kind: 'skill', skill, groupIndex: gi }));
    });
    return out;
  }, [groups]);

  const trackRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowH, setRowH] = useState(72);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => setRowH(el.getBoundingClientRect().height || 72);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });
  // On démarre sur la première compétence (ligne 1), pas sur le titre du catalogue.
  const progress = useTransform(scrollYProgress, (v) =>
    stepped(1 + v * (rows.length - 2)),
  );
  const listY = useTransform(progress, (p) => -p * rowH);

  const [active, setActive] = useState(1);
  useMotionValueEvent(progress, 'change', (p) => {
    const next = Math.min(rows.length - 1, Math.max(0, Math.round(p)));
    setActive((prev) => (prev === next ? prev : next));
  });
  const activeRow = rows[active];
  const activeGroup = groups[activeRow?.groupIndex ?? 0];
  const skillPos = activeRow?.kind === 'skill'
    ? activeGroup.skills.indexOf(activeRow.skill) + 1
    : 0;

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `calc(100dvh + ${Math.max(rows.length - 2, 0) * ROW_SCROLL_VH}vh)` }}
    >
      <div
        className="sticky top-0 grid h-[100dvh] grid-rows-[auto_1fr] items-center gap-6 overflow-hidden pt-20 [--skill-font:clamp(2rem,7.5vw,5rem)] [--skill-row:calc(var(--skill-font)*1.18)] md:grid-cols-12 md:grid-rows-1 md:gap-8 md:pt-0"
      >
        {/* Libellé fixe à gauche */}
        <div className="md:col-span-4 lg:col-span-3">
          <p className="flex items-center gap-4 font-display text-xl font-medium tracking-[-0.02em] text-[#1a1814] md:text-2xl">
            <span className="section-index font-mono text-xs tabular-nums" aria-hidden />
            Compétences
            <span className="h-[2px] w-16 bg-brand-orange md:w-24" aria-hidden />
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={activeGroup?.title}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
              className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-[#1a1814]/50 md:mt-4"
            >
              {activeGroup?.title}
              {skillPos ? (
                <span className="tabular-nums">
                  {' '}· {String(skillPos).padStart(2, '0')} / {String(activeGroup.skills.length).padStart(2, '0')}
                </span>
              ) : null}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Liste qui défile, ligne active centrée verticalement */}
        <div className="relative h-full min-w-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_22%,black_78%,transparent)] md:col-span-8 lg:col-span-9">
          <div ref={rowRef} className="invisible absolute h-[var(--skill-row)]" aria-hidden />
          <motion.ul
            style={{ y: listY }}
            className="absolute inset-x-0 top-[calc(50%-var(--skill-row)/2)] will-change-transform"
            aria-label="Compétences par catalogue"
          >
            {rows.map((row, i) => (
              <ScrollRow
                key={row.kind === 'group' ? `g-${row.title}` : `s-${row.groupIndex}-${row.skill.name}`}
                row={row}
                index={i}
                progress={progress}
              />
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}

/** Version statique (animations réduites) : catalogues listés simplement. */
function SkillsStatic({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
      <p className="flex items-center gap-4 font-display text-2xl font-medium text-[#1a1814] md:col-span-3">
        <span className="section-index font-mono text-xs tabular-nums" aria-hidden />
        Compétences
        <span className="h-[2px] w-16 bg-brand-orange" aria-hidden />
      </p>
      <div className="space-y-12 md:col-span-9">
        {groups.map((g, gi) => (
          <div key={g.title}>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-brand-orange">
              {String(gi + 1).padStart(2, '0')} — {g.title}
            </p>
            <ul className="space-y-2">
              {g.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="flex items-center gap-3 font-display text-3xl font-semibold tracking-[-0.03em] text-[#1a1814] md:text-5xl"
                >
                  <SkillIcon skill={skill} className="size-[0.85em] shrink-0" />
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection({ groups }: SkillsSectionProps) {
  const reduceMotion = usePrefersReducedMotion();
  const visible = groups.filter((g) => g.skills?.length > 0);

  if (visible.length === 0) {
    return (
      <Section
        id="compétences"
        subtitle="Compétences"
        title="Compétences & technologies"
      >
        <p className="font-mono text-sm text-white/40">
          Aucune compétence à afficher.
        </p>
      </Section>
    );
  }

  return (
    <Section id="compétences" className={reduceMotion ? '' : '!py-0'}>
      {reduceMotion ? (
        <SkillsStatic groups={visible} />
      ) : (
        <SkillsScroller groups={visible} />
      )}
    </Section>
  );
}
