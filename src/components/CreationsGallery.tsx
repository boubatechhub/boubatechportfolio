import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { ContentWork } from "../types";
import { getDirectImageUrl } from "../utils";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

type CreationsGalleryProps = {
  works: ContentWork[];
  onWorkSelect: (work: ContentWork) => void;
};

function coverSrc(imageUrl: string): string {
  const raw = getDirectImageUrl(imageUrl);
  if (!raw || raw.includes("picsum.photos") || raw.includes("giphy.com")) {
    return "";
  }
  return raw;
}

function CreationTile({
  work,
  index,
  onSelect,
}: {
  work: ContentWork;
  index: number;
  onSelect: () => void;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const [imgError, setImgError] = useState(false);
  const cover = coverSrc(work.imageUrl);

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.35,
        delay: reduceMotion ? 0 : Math.min(index * 0.04, 0.2),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="portfolio-card group relative overflow-hidden rounded-xl border border-white/15 bg-white/[0.03] transition-[transform,border-color,background-color] duration-250 hover:-translate-y-0.5 hover:border-white/35"
    >
      <button
        type="button"
        onClick={onSelect}
        className="relative block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-orange"
        aria-label={`Ouvrir le design ${work.title}`}
      >
        <div className="aspect-[4/5] overflow-hidden bg-black/35 sm:aspect-[3/4]">
          {cover && !imgError ? (
            <img
              src={cover}
              alt={`Design UI/UX : ${work.title}`}
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.04]"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-mono text-2xs uppercase tracking-widest text-white/30">
              Visuel
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90" />

        <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
          <p className="font-mono text-2xs uppercase tracking-[0.16em] text-white/45">
            {work.category || "UI/UX"}
          </p>
          <h3 className="mt-0.5 font-display text-sm font-semibold leading-snug text-white sm:text-base">
            {work.title}
          </h3>
          {work.description ? (
            <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-white/50 transition-opacity duration-250 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
              {work.description}
            </p>
          ) : null}
          <span className="mt-1.5 inline-flex items-center gap-1 font-mono text-2xs uppercase tracking-[0.14em] text-brand-orange/90">
            Voir
            <ArrowUpRight size={11} aria-hidden />
          </span>
        </div>
      </button>
    </motion.article>
  );
}

export function CreationsGallery({
  works,
  onWorkSelect,
}: CreationsGalleryProps) {
  if (works.length === 0) {
    return (
      <p className="font-mono text-sm text-white/40">
        Aucune création à afficher.
      </p>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-4"
      role="list"
      aria-label="Créations UI/UX"
    >
      {works.map((work, index) => (
        <div key={work.id} role="listitem">
          <CreationTile
            work={work}
            index={index}
            onSelect={() => onWorkSelect(work)}
          />
        </div>
      ))}
    </div>
  );
}
