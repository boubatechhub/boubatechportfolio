import { useEffect, useRef, useState } from "react";

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";

type CrashTextProps = {
  texts: readonly string[];
  /** Durée d'affichage de chaque texte (ms) */
  interval?: number;
  /** Durée de l'animation scramble (ms) */
  scrambleDuration?: number;
  className?: string;
};

export function CrashText({
  texts,
  interval = 4000,
  scrambleDuration = 700,
  className = "",
}: CrashTextProps) {
  const [output, setOutput] = useState(texts[0] ?? "");
  const indexRef = useRef(0);
  const outputRef = useRef(texts[0] ?? "");

  useEffect(() => {
    if (texts.length <= 1) return;

    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let rafId = 0;
    let cancelled = false;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scrambleTo = (target: string, onDone: () => void) => {
      if (prefersReduced) {
        outputRef.current = target;
        setOutput(target);
        onDone();
        return;
      }

      const startTime = performance.now();

      const tick = (now: number) => {
        if (cancelled) return;

        const progress = Math.min((now - startTime) / scrambleDuration, 1);
        const scrambled = target
          .split("")
          .map((char, i) => {
            if (char === " " || char === "'" || char === "’") return char;
            const threshold = i / Math.max(target.length, 1);
            if (progress > threshold + 0.08) return char;
            return CHARSET[Math.floor(Math.random() * CHARSET.length)];
          })
          .join("");

        outputRef.current = scrambled;
        setOutput(scrambled);

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          outputRef.current = target;
          setOutput(target);
          onDone();
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    const scheduleNext = () => {
      holdTimer = setTimeout(() => {
        if (cancelled) return;

        const nextIndex = (indexRef.current + 1) % texts.length;
        const target = texts[nextIndex];

        scrambleTo(target, () => {
          indexRef.current = nextIndex;
          scheduleNext();
        });
      }, interval);
    };

    scheduleNext();

    return () => {
      cancelled = true;
      if (holdTimer) clearTimeout(holdTimer);
      cancelAnimationFrame(rafId);
    };
  }, [texts, interval, scrambleDuration]);

  return (
    <span className={className} aria-live="polite">
      {output}
    </span>
  );
}
