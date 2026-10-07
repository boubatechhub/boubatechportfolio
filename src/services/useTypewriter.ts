import { useEffect, useRef, useState } from "react";

/**
 * Returns the full text on first render (good for LCP), then cycles through
 * a delete → retype loop.  The first full-text display is instant so search
 * engines and Lighthouse see real content immediately.
 */
export const useTypewriter = (
  text: string,
  speed: number = 100,
  delayBetweenLoops: number = 3000,
): string => {
  const [displayedText, setDisplayedText] = useState(text);
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (hasPlayed.current) return;
    hasPlayed.current = true;

    let timeout: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const deleteText = (index: number) => {
      if (cancelled) return;
      if (index >= 0) {
        setDisplayedText(text.slice(0, index));
        timeout = setTimeout(() => deleteText(index - 1), speed);
      } else {
        timeout = setTimeout(() => typeText(0), delayBetweenLoops);
      }
    };

    const typeText = (index: number) => {
      if (cancelled) return;
      if (index <= text.length) {
        setDisplayedText(text.slice(0, index));
        timeout = setTimeout(() => typeText(index + 1), speed);
      } else {
        timeout = setTimeout(() => deleteText(text.length), delayBetweenLoops);
      }
    };

    timeout = setTimeout(() => deleteText(text.length), delayBetweenLoops);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [text, speed, delayBetweenLoops]);

  return displayedText;
};