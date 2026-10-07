import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const isFineMouse = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  window.innerWidth >= 1024;

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const active = useRef(isFineMouse());

  useEffect(() => {
    if (!active.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("button, a, input, textarea"));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  if (!active.current) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        animate={{
          x: position.x - 18,
          y: position.y - 18,
          scale: isHovering ? 1.35 : 1,
          borderColor: isHovering
            ? "rgba(242, 125, 38, 0.75)"
            : "rgba(255, 255, 255, 0.25)",
          opacity: isHovering ? 0.95 : 0.7,
        }}
        transition={{ type: "spring", damping: 22, stiffness: 380, mass: 0.45 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-9 w-9 rounded-full border pointer-fine:lg:block"
      />

      {/* Inner dot */}
      <motion.div
        animate={{
          x: position.x - 3,
          y: position.y - 3,
          scale: isHovering ? 1.1 : 1,
          backgroundColor: isHovering
            ? "rgba(242, 125, 38, 0.95)"
            : "rgba(255, 255, 255, 0.65)",
          boxShadow: isHovering
            ? "0 0 18px rgba(242, 125, 38, 0.35)"
            : "0 0 12px rgba(255, 255, 255, 0.12)",
        }}
        transition={{ type: "spring", damping: 30, stiffness: 650, mass: 0.35 }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 rounded-full pointer-fine:lg:block"
      />
    </>
  );
}
