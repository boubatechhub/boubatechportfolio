import { useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import type { Education } from "../types";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { getLastYearFromPeriod } from "../utils/portfolio";

type JourneyRoadProps = {
  education: Education[];
};

type Layout = {
  width: number;
  height: number;
  /** Centre vertical de chaque étape, relatif au conteneur. */
  stops: number[];
  mobile: boolean;
};

/** Construit la route : une courbe qui serpente d'une étape à l'autre. */
function buildPath({ width: W, height: H, stops, mobile }: Layout): string {
  if (stops.length === 0 || W === 0) return "";
  // Desktop : la route passe dans la moitié vide, à l'opposé du texte.
  // Mobile : elle ondule doucement dans la marge de gauche.
  const xFor = (i: number) =>
    mobile ? (i % 2 === 0 ? 14 : 30) : i % 2 === 0 ? W * 0.7 : W * 0.3;

  const pts = stops.map((y, i) => ({ x: xFor(i), y }));
  const start = { x: mobile ? 22 : W * 0.5, y: 0 };
  const end = { x: mobile ? 22 : W * 0.5, y: H };
  const all = [start, ...pts, end];

  let d = `M ${all[0].x} ${all[0].y}`;
  for (let i = 1; i < all.length; i++) {
    const a = all[i - 1];
    const b = all[i];
    const dy = (b.y - a.y) * 0.55;
    d += ` C ${a.x} ${a.y + dy}, ${b.x} ${b.y - dy}, ${b.x} ${b.y}`;
  }
  return d;
}

function JourneyStop({
  education,
  index,
  side,
  stopY,
  dotY,
  registerRef,
  reduceMotion,
}: {
  education: Education;
  index: number;
  side: "left" | "right";
  stopY: number | undefined;
  dotY: MotionValue<number>;
  registerRef: (el: HTMLLIElement | null) => void;
  reduceMotion: boolean;
}) {
  // 0 = pas encore atteinte, 1 = le point est passé dessus.
  const reached = useTransform(dotY, (y) => {
    if (reduceMotion || stopY === undefined) return 1;
    const t = (y - (stopY - 160)) / 160;
    return Math.min(1, Math.max(0, t));
  });
  const opacity = useTransform(reached, [0, 1], [0.28, 1]);
  const lift = useTransform(reached, [0, 1], [18, 0]);

  const details = [
    ...(education.skills || []),
    ...(education.technologies || []),
  ].slice(0, 5);

  return (
    <li
      ref={registerRef}
      className={`relative flex min-h-[42vh] items-center py-10 pl-14 md:min-h-[48vh] md:pl-0 ${
        side === "left" ? "md:justify-start" : "md:justify-end"
      }`}
    >
      <motion.div
        style={{ opacity, y: lift }}
        className={`max-w-xl md:w-[46%] ${side === "left" ? "md:text-left" : "md:text-right"}`}
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-brand-orange">
          <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span>
          <span className="mx-2 text-[#1a1814]/30">—</span>
          {education.period}
        </p>
        <h3 className="mt-3 font-display text-3xl font-semibold leading-[0.98] tracking-[-0.04em] text-[#1a1814] md:text-5xl xl:text-6xl">
          {education.title}
        </h3>
        <p className="mt-3 font-serif-accent text-xl text-brand-orange md:text-2xl">
          {education.institution}
        </p>
        {details.length > 0 ? (
          <p className="mt-4 text-[0.95rem] leading-relaxed text-[#1a1814]/60">
            {details.join(" · ")}
          </p>
        ) : null}
      </motion.div>
    </li>
  );
}

/**
 * Parcours en forme de route : la route se dessine au fil du scroll,
 * un point la suit et chaque étape s'allume quand il l'atteint.
 * Les étapes sont présentées dans l'ordre chronologique.
 */
export function JourneyRoad({ education }: JourneyRoadProps) {
  const reduceMotion = usePrefersReducedMotion();
  const steps = useMemo(
    () =>
      [...education].sort(
        (a, b) => getLastYearFromPeriod(a.period) - getLastYearFromPeriod(b.period),
      ),
    [education],
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLLIElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [layout, setLayout] = useState<Layout>({
    width: 0,
    height: 0,
    stops: [],
    mobile: false,
  });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect();
      setLayout({
        width: box.width,
        height: box.height,
        mobile: window.innerWidth < 768,
        stops: stopRefs.current
          .slice(0, steps.length)
          .map((li) => {
            if (!li) return 0;
            const r = li.getBoundingClientRect();
            return r.top - box.top + r.height / 2;
          }),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [steps.length]);

  const d = useMemo(() => buildPath(layout), [layout]);

  // Le point est au milieu de l'écran : la route avance au rythme du scroll.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 55%", "end 55%"],
  });
  const progress = useTransform(scrollYProgress, (v) =>
    reduceMotion ? 1 : Math.min(1, Math.max(0, v)),
  );

  const dotX = useMotionValue(0);
  const dotY = useMotionValue(0);
  const drawn = useMotionValue(0);
  const placeDot = (p: number) => {
    const path = pathRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    if (!len) return;
    // Cherche la longueur dont la hauteur correspond à la progression (route monotone en y).
    const targetY = p * layout.height;
    let lo = 0;
    let hi = len;
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      if (path.getPointAtLength(mid).y < targetY) lo = mid;
      else hi = mid;
    }
    const pt = path.getPointAtLength(lo);
    dotX.set(pt.x);
    dotY.set(pt.y);
    drawn.set(len ? lo / len : 0);
  };
  useMotionValueEvent(progress, "change", placeDot);
  useLayoutEffect(() => {
    placeDot(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d]);

  return (
    <div ref={containerRef} className="relative">
      {d ? (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          width={layout.width}
          height={layout.height}
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          aria-hidden
        >
          {/* Route à venir, en pâle */}
          <path
            d={d}
            fill="none"
            stroke="rgb(226 105 31 / 16%)"
            strokeWidth={layout.mobile ? 4 : 7}
            strokeLinecap="round"
          />
          {/* Route déjà parcourue */}
          <motion.path
            ref={pathRef}
            d={d}
            fill="none"
            stroke="#e2691f"
            strokeWidth={layout.mobile ? 4 : 7}
            strokeLinecap="round"
            style={{ pathLength: drawn }}
          />
          {/* Le point qui suit la route */}
          <motion.g style={{ x: dotX, y: dotY }}>
            <circle r={layout.mobile ? 13 : 20} fill="rgb(226 105 31 / 22%)" />
            <circle
              r={layout.mobile ? 7 : 11}
              fill="#e2691f"
              stroke="#1a1814"
              strokeWidth={layout.mobile ? 2.5 : 3.5}
            />
          </motion.g>
        </svg>
      ) : null}

      <ol className="relative">
        {steps.map((edu, i) => (
          <JourneyStop
            key={edu.id}
            education={edu}
            index={i}
            side={i % 2 === 0 ? "left" : "right"}
            stopY={layout.stops[i]}
            dotY={dotY}
            reduceMotion={reduceMotion}
            registerRef={(el) => {
              stopRefs.current[i] = el;
            }}
          />
        ))}
      </ol>
    </div>
  );
}
