import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../types";
import { getDirectImageUrl } from "../utils";

type ProjectsStackProps = {
  projects: Project[];
  onOpen: (project: Project) => void;
};

/** Inclinaison de repos de chaque carte dans la pile (en degrés). */
const TILTS = [-2.5, 3, -1.5, 2.2, -3, 1.6];
/** Nombre de cartes visibles sous la carte du dessus. */
const VISIBLE_DEPTH = 3;
/** Hauteur de scroll consacrée à chaque transition de carte. */
const STEP_VH = 85;

function coverSrc(project: Project): string {
  const candidates = [project.imageUrl, ...(project.images || [])];
  for (const url of candidates) {
    const raw = getDirectImageUrl(url);
    if (raw && !raw.includes("picsum.photos") && !raw.includes("giphy.com")) {
      return raw;
    }
  }
  return "";
}

function StackCard({
  project,
  index,
  total,
  progress,
  onOpen,
}: {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
  onOpen: (project: Project) => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = coverSrc(project);
  const tilt = TILTS[index % TILTS.length];

  // p = position dans la séquence (0 → total-1).
  // depth > 0 : carte encore sous la pile ; 0 ≤ t ≤ 1 : carte qui s'envole.
  const y = useTransform(progress, (p) => {
    const depth = index - p;
    if (depth >= 0) return `${Math.min(depth, VISIBLE_DEPTH) * 2.2}%`;
    return `${Math.max(depth, -1) * 125}vh`;
  });
  const scale = useTransform(progress, (p) => {
    const depth = index - p;
    if (depth <= 0) return 1;
    return 1 - Math.min(depth, VISIBLE_DEPTH) * 0.07;
  });
  const rotate = useTransform(progress, (p) => {
    const depth = index - p;
    if (depth >= 0) {
      // Plus la carte remonte vers le dessus, plus elle se redresse.
      return tilt * (0.35 + 0.65 * Math.min(depth, 1));
    }
    // En s'envolant, la carte pivote légèrement (jusqu'à -6°).
    return tilt * 0.35 + Math.max(depth, -1) * 6;
  });
  const opacity = useTransform(progress, (p) => {
    const depth = index - p;
    if (depth > VISIBLE_DEPTH) return 0;
    if (depth > VISIBLE_DEPTH - 1) return VISIBLE_DEPTH - depth;
    return 1;
  });
  const shade = useTransform(progress, (p) => {
    const depth = Math.max(0, index - p);
    return Math.min(depth, VISIBLE_DEPTH) * 0.14;
  });

  return (
    <motion.button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Ouvrir le projet ${project.title}`}
      style={{ y, scale, rotate, opacity, zIndex: total - index }}
      className="group absolute inset-0 overflow-hidden rounded-[1.25rem] bg-[#e9e3d9] shadow-[0_30px_80px_-30px_rgb(60_35_15/55%)] outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 focus-visible:ring-offset-[#f7f5f1] md:rounded-[1.75rem]"
    >
      {src && !imgFailed ? (
        <img
          src={src}
          alt={`Aperçu du projet ${project.title}`}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          onError={() => setImgFailed(true)}
          referrerPolicy="no-referrer"
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
          draggable={false}
        />
      ) : (
        <div className="flex h-full w-full flex-col justify-between bg-[radial-gradient(120%_90%_at_20%_10%,#f6d9bf_0%,#ecdcc8_45%,#e2d6c6_100%)] p-6 text-left md:p-10">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#1a1814]/55">
            {project.category}
          </span>
          <div>
            <p className="max-w-xl font-display text-3xl font-medium leading-[1.02] tracking-[-0.035em] text-[#1a1814] md:text-5xl">
              {project.title}
            </p>
            {project.stack?.length ? (
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.14em] text-[#1a1814]/55">
                {project.stack.slice(0, 4).join(" · ")}
              </p>
            ) : null}
          </div>
        </div>
      )}

      {/* Assombrit légèrement les cartes du dessous pour donner de la profondeur */}
      <motion.span
        aria-hidden
        style={{ opacity: shade }}
        className="pointer-events-none absolute inset-0 bg-[#1a1814]"
      />
      <span className="absolute left-4 top-4 rounded-full bg-[#fffefb]/85 px-2.5 py-1 font-mono text-[0.65rem] tabular-nums tracking-[0.12em] text-[#1a1814] backdrop-blur-sm md:left-6 md:top-6">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </motion.button>
  );
}

/**
 * Pile de projets « épinglée » : la section reste en place pendant le scroll,
 * la carte du dessus s'envole vers le haut et la suivante avance en zoom.
 * En remontant, les cartes reviennent à leur place.
 */
export function ProjectsStack({ projects, onOpen }: ProjectsStackProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const total = projects.length;
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, (v) => v * Math.max(total - 1, 0));
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const next = Math.min(total - 1, Math.max(0, Math.round(p)));
    setActive((prev) => (prev === next ? prev : next));
  });

  const current = projects[active];
  const marqueeText = "Projets web — Mobile — UI/UX — ";

  return (
    <div
      ref={trackRef}
      className="relative left-1/2 w-screen -translate-x-1/2"
      style={{ height: `calc(100dvh + ${Math.max(total - 1, 0) * STEP_VH}vh)` }}
    >
      <div className="sticky top-0 flex h-[100dvh] flex-col items-center justify-center overflow-hidden pt-16 md:pt-24">
        {/* Grand texte qui défile derrière la pile */}
        <motion.div
          aria-hidden
          style={{ x: marqueeX }}
          className="pointer-events-none absolute left-0 top-1/2 z-0 -translate-y-1/2 whitespace-nowrap font-display text-[clamp(5rem,17vw,15rem)] font-semibold leading-none tracking-[-0.06em] text-[#1a1814]"
        >
          {marqueeText.repeat(4)}
        </motion.div>

        <div className="relative z-10 aspect-[4/3] w-[min(86vw,50rem,calc((100dvh-19rem)*1.6))] sm:aspect-[16/10]">
          {projects.map((project, index) => (
            <StackCard
              key={project.id}
              project={project}
              index={index}
              total={total}
              progress={progress}
              onOpen={onOpen}
            />
          ))}
        </div>

        <div className="relative z-20 mt-7 flex min-h-[7.5rem] w-full flex-col items-center px-6 text-center md:mt-10">
          <AnimatePresence mode="wait" initial={false}>
            {current ? (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                className="flex flex-col items-center"
              >
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/50">
                  {current.category}
                </p>
                <h3 className="mt-2 max-w-2xl font-display text-xl font-medium tracking-[-0.025em] text-white md:text-3xl">
                  {current.title}
                </h3>
                <button
                  type="button"
                  onClick={() => onOpen(current)}
                  className="site-button mt-5 inline-flex items-center gap-2.5 rounded-xl border border-[#1a1814] bg-[#1a1814] px-5 py-3 text-[0.95rem] font-medium text-[#fffefb]"
                >
                  <span className="h-2.5 w-2.5 rounded-full bg-brand-orange" aria-hidden />
                  Voir le projet
                  <ArrowUpRight size={16} aria-hidden />
                </button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
