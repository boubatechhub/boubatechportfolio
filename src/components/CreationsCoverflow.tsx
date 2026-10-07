import { useCallback, useEffect, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { ContentWork } from '../types';
import { getDirectImageUrl } from '../utils';

type CreationsCoverflowProps = {
  works: ContentWork[];
  onWorkSelect: (work: ContentWork) => void;
};

/** Offset circulaire le plus court entre un index et l'index actif */
function getCircularOffset(index: number, active: number, length: number): number {
  let diff = index - active;
  if (length <= 1) return 0;
  if (diff > length / 2) diff -= length;
  if (diff < -length / 2) diff += length;
  return diff;
}

function isPlaceholderImage(src: string): boolean {
  return src.includes('picsum.photos') || src.includes('giphy.com');
}

type CardTransform = {
  x: number;
  z: number;
  rotateY: number;
  scale: number;
  opacity: number;
  zIndex: number;
};

function getCardTransform(offset: number, reducedMotion: boolean): CardTransform {
  if (reducedMotion) {
    return {
      x: offset * 110,
      z: 0,
      rotateY: 0,
      scale: offset === 0 ? 1 : 0.92,
      opacity: offset === 0 ? 1 : 0.5,
      zIndex: 10 - Math.abs(offset),
    };
  }

  const presets: Record<number, CardTransform> = {
    0: { x: 0, z: 0, rotateY: 0, scale: 1, opacity: 1, zIndex: 10 },
    [-1]: { x: -58, z: -120, rotateY: 28, scale: 0.88, opacity: 0.85, zIndex: 8 },
    [1]: { x: 58, z: -120, rotateY: -28, scale: 0.88, opacity: 0.85, zIndex: 8 },
    [-2]: { x: -105, z: -220, rotateY: 38, scale: 0.72, opacity: 0.55, zIndex: 6 },
    [2]: { x: 105, z: -220, rotateY: -38, scale: 0.72, opacity: 0.55, zIndex: 6 },
  };

  const clamped =
    offset > 2 ? 2 : offset < -2 ? -2 : offset;
  return presets[clamped] ?? presets[2]!;
}

function useVisibleRange(): number {
  const [range, setRange] = useState(2);

  useEffect(() => {
    const update = () => {
      if (window.matchMedia('(max-width: 639px)').matches) setRange(1);
      else setRange(2);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return range;
}

function CoverflowCard({
  work,
  offset,
  isActive,
  reducedMotion,
  onActivate,
  onOpen,
}: {
  work: ContentWork;
  offset: number;
  isActive: boolean;
  reducedMotion: boolean;
  onActivate: () => void;
  onOpen: () => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const t = getCardTransform(offset, reducedMotion);
  const imageSrcRaw = getDirectImageUrl(work.imageUrl);
  const imageSrc =
    imageSrcRaw && !isPlaceholderImage(imageSrcRaw) ? imageSrcRaw : '';

  useEffect(() => setImageFailed(false), [work.imageUrl]);

  const handleClick = () => {
    if (isActive) onOpen();
    else onActivate();
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.button
      type="button"
      layout
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={
        isActive
          ? `Ouvrir ${work.title}`
          : `Afficher ${work.title} au centre`
      }
      aria-current={isActive ? 'true' : undefined}
      className="absolute left-1/2 top-1/2 w-[min(72vw,260px)] sm:w-[280px] md:w-[300px] lg:w-[320px] -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark rounded-2xl"
      initial={false}
      animate={{
        x: `${t.x}%`,
        z: t.z,
        rotateY: t.rotateY,
        scale: t.scale,
        opacity: t.opacity,
      }}
      transition={
        reducedMotion
          ? { duration: 0.01 }
          : { type: 'spring', stiffness: 260, damping: 28, mass: 0.8 }
      }
      style={{
        zIndex: t.zIndex,
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className={`relative aspect-[3/4] h-[min(68vw,380px)] sm:h-[400px] md:h-[420px] w-full overflow-hidden rounded-2xl border bg-black/30 shadow-2xl transition-shadow duration-300 ${
          isActive
            ? 'border-brand-orange/40 shadow-brand-orange/20'
            : 'border-white/10 shadow-black/40'
        }`}
      >
        {imageSrc && !imageFailed ? (
          <img
            src={imageSrc}
            alt={`Création : ${work.title} — ${work.category}`}
            className="h-full w-full object-cover"
            loading={isActive ? 'eager' : 'lazy'}
            decoding="async"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-white/5 via-black/40 to-black/60" />
        )}
      </div>
    </motion.button>
  );
}

export function CreationsCoverflow({ works, onWorkSelect }: CreationsCoverflowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const reducedMotion = Boolean(useReducedMotion());
  const visibleRange = useVisibleRange();
  const count = works.length;

  const goTo = useCallback(
    (index: number) => {
      if (count === 0) return;
      setActiveIndex(((index % count) + count) % count);
    },
    [count],
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  useEffect(() => {
    if (activeIndex >= count && count > 0) setActiveIndex(0);
  }, [activeIndex, count]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }
      const section = document.getElementById('créations');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [goNext, goPrev]);

  if (count === 0) {
    return (
      <p className="text-center font-mono text-sm text-white/40">
        Aucune création à afficher.
      </p>
    );
  }

  const navBtnClass =
    'z-20 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-white/70 transition-colors hover:border-brand-orange/40 hover:bg-brand-orange/10 hover:text-brand-orange focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange sm:h-12 sm:w-12';

  return (
    <div
      className="relative mx-auto w-full max-w-6xl"
      role="region"
      aria-roledescription="carousel"
      aria-label="Galerie de créations"
    >
      <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
        {count > 1 ? (
          <button
            type="button"
            onClick={goPrev}
            aria-label="Création précédente"
            className={navBtnClass}
          >
            <ChevronLeft size={22} aria-hidden />
          </button>
        ) : (
          <div className="w-11 shrink-0 sm:w-12" aria-hidden />
        )}

        <div
          className="relative min-w-0 flex-1 h-[min(72vw,420px)] sm:h-[440px] md:h-[460px] [perspective:1200px] [perspective-origin:50%_50%]"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {works.map((work, index) => {
            const offset = getCircularOffset(index, activeIndex, count);
            if (Math.abs(offset) > visibleRange) return null;

            return (
              <CoverflowCard
                key={work.id}
                work={work}
                offset={offset}
                isActive={offset === 0}
                reducedMotion={reducedMotion}
                onActivate={() => goTo(index)}
                onOpen={() => onWorkSelect(work)}
              />
            );
          })}
        </div>

        {count > 1 ? (
          <button
            type="button"
            onClick={goNext}
            aria-label="Création suivante"
            className={navBtnClass}
          >
            <ChevronRight size={22} aria-hidden />
          </button>
        ) : (
          <div className="w-11 shrink-0 sm:w-12" aria-hidden />
        )}
      </div>

      <div className="mt-6 text-center sm:mt-8">
        <p className="font-mono text-caption uppercase tracking-[0.2em] text-brand-orange/90">
          {works[activeIndex]?.category}
        </p>
        <p className="mt-2 font-display text-xl font-medium text-white md:text-2xl">
          {works[activeIndex]?.title}
        </p>
        {works[activeIndex]?.description ? (
          <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-white/50">
            {works[activeIndex].description}
          </p>
        ) : null}
        {count > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2" role="tablist" aria-label="Pagination créations">
            {works.map((w, i) => (
              <button
                key={w.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Aller à ${w.title}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange ${
                  i === activeIndex
                    ? "w-6 bg-brand-orange"
                    : "w-1.5 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        ) : null}
        <p className="mt-4 font-mono text-2xs uppercase tracking-[0.18em] text-white/30">
          Cliquez la carte centrale pour ouvrir le case study
        </p>
      </div>
    </div>
  );
}
