import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  type Variants,
} from "motion/react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

/** Courbe commune à toutes les entrées : démarrage vif, arrivée douce. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

const VIEWPORT = { once: true, margin: "0px 0px -12% 0px" } as const;

/**
 * Texte qui monte depuis un masque (effet « rideau »).
 * Idéal pour les titres : le texte glisse depuis sous sa ligne de base.
 */
export function MaskReveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  // On observe le cadre (visible) et non le texte, masqué tant qu'il n'est pas sorti.
  const frameRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(frameRef, VIEWPORT);
  if (reduceMotion) return <span className={className}>{children}</span>;
  return (
    <span ref={frameRef} className={`block overflow-hidden pb-[0.08em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : { y: "105%" }}
        transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/** Trait qui se dessine de gauche à droite. */
export function DrawLine({
  className = "",
  delay = 0,
  origin = "left",
}: {
  className?: string;
  delay?: number;
  origin?: "left" | "right";
}) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`block ${className}`}
      style={{ transformOrigin: origin }}
      initial={reduceMotion ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay, ease: EASE_OUT }}
    />
  );
}

const staggerParent: Variants = {
  hidden: {},
  shown: (gap: number = 0.07) => ({ transition: { staggerChildren: gap } }),
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE_OUT } },
};

/** Conteneur dont les enfants <StaggerItem> apparaissent en cascade. */
export function Stagger({
  children,
  className = "",
  gap = 0.07,
  as = "div",
  edge = false,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  as?: "div" | "ul" | "ol";
  /** Pour un bloc collé au bas de la page : se déclenche dès qu'il est visible. */
  edge?: boolean;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const Comp = as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  return (
    <Comp
      className={className}
      variants={staggerParent}
      custom={gap}
      initial={reduceMotion ? false : "hidden"}
      whileInView="shown"
      viewport={edge ? { once: true, amount: 0.2 } : VIEWPORT}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
}) {
  const Comp =
    as === "li" ? motion.li : as === "article" ? motion.article : motion.div;
  return (
    <Comp className={className} variants={staggerChild}>
      {children}
    </Comp>
  );
}

/**
 * Nombre qui compte jusqu'à sa valeur à l'entrée dans l'écran.
 * Conserve le préfixe / suffixe (« 15+ », « 100% »).
 */
export function CountUp({ value, className = "" }: { value: string; className?: string }) {
  const reduceMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const match = value.match(/^(\D*)(\d+)(.*)$/);
  const target = match ? Number(match[2]) : 0;
  const [shown, setShown] = useState(reduceMotion || !match ? target : 0);

  useEffect(() => {
    if (!inView || reduceMotion || !match) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduceMotion, target]);

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={value}>
      <span aria-hidden>
        {match[1]}
        {shown}
        {match[3]}
      </span>
    </span>
  );
}

/** Bloc qui se découvre de bas en haut (clip-path), pour images et cartes. */
export function ClipReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { clipPath: "inset(100% 0% 0% 0% round 1.25rem)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.25rem)" }}
      viewport={VIEWPORT}
      transition={{ duration: 1, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
