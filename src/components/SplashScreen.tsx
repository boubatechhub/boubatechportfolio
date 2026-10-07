import { useEffect, useRef, useState } from "react";
import {
  SPLASH_FOCUS_AREAS,
  SPLASH_PROGRESS_DURATION_MS,
  SPLASH_PROGRESS_MESSAGES,
  SPLASH_PROGRESS_START_MS,
} from "../config/splash";
import "./SplashScreen.css";

type SplashScreenProps = {
  onComplete: () => void;
};

const EXIT_MS = 550;

/**
 * Splash screen premium affiché une seule fois au premier chargement.
 * À 100 %, un bouton « Click me » ouvre le portfolio.
 */
export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [exiting, setExiting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);
  const completedRef = useRef(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (completedRef.current) return;

    const progressStart = reducedMotion ? 0 : SPLASH_PROGRESS_START_MS;
    const progressDuration = reducedMotion ? 0 : SPLASH_PROGRESS_DURATION_MS;

    let rafId = 0;
    let statusTimer: ReturnType<typeof setInterval> | undefined;
    let progressTimer: ReturnType<typeof setTimeout> | undefined;

    if (reducedMotion) {
      setProgress(100);
      setStatusIndex(SPLASH_PROGRESS_MESSAGES.length - 1);
      setReady(true);
      return;
    }

    statusTimer = setInterval(
      () => {
        setStatusIndex((prev) =>
          prev < SPLASH_PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev,
        );
      },
      progressDuration / (SPLASH_PROGRESS_MESSAGES.length - 1),
    );

    const startProgress = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / progressDuration, 1);
        setProgress(Math.round(t * 100));
        if (t < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          if (statusTimer) clearInterval(statusTimer);
          setStatusIndex(SPLASH_PROGRESS_MESSAGES.length - 1);
          setReady(true);
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    progressTimer = setTimeout(startProgress, progressStart);

    return () => {
      if (progressTimer) clearTimeout(progressTimer);
      if (statusTimer) clearInterval(statusTimer);
      cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  const handleEnter = () => {
    if (completedRef.current || !ready || exiting) return;
    setExiting(true);
    window.setTimeout(
      () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onComplete();
      },
      reducedMotion ? 200 : EXIT_MS,
    );
  };

  return (
    <div
      className={`splash-screen ${exiting ? "splash-screen--exit" : ""} ${
        reducedMotion ? "splash-screen--reduced" : ""
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction du portfolio"
    >
      <div className="splash-screen__grid" aria-hidden />
      <div className="splash-screen__light" aria-hidden />
      <div className="splash-screen__ambient" aria-hidden />

      <div className="splash-screen__content">
        <div className="splash-screen__divider" aria-hidden />

        <p className="splash-screen__headline">
          À la recherche d’une alternance
        </p>

        <div className="splash-screen__tags">
          {SPLASH_FOCUS_AREAS.map((tag, index) => (
            <span
              key={tag}
              className={`splash-screen__tag splash-screen__tag--${index + 1}`}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="splash-screen__progress-wrap">
          <div className="splash-screen__progress-meta">
            <span>
              {ready ? "Prêt." : SPLASH_PROGRESS_MESSAGES[statusIndex]}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="splash-screen__progress-track" aria-hidden>
            <div
              className="splash-screen__progress-fill"
              style={
                reducedMotion
                  ? { width: "100%" }
                  : { width: `${progress}%`, animation: "none" }
              }
            />
          </div>

          {ready ? (
            <button
              type="button"
              className="splash-screen__enter"
              onClick={handleEnter}
              autoFocus
            >
              Click me
            </button>
          ) : (
            <div className="splash-screen__enter-slot" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}
