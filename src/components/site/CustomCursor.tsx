import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      const interactive = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]',
      );
      setHovering(interactive);
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ x: sx, y: sy }}
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
      >
        <motion.div
          animate={{
            width: hovering ? 44 : 10,
            height: hovering ? 44 : 10,
            opacity: hovering ? 0.9 : 1,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        />
      </motion.div>
      <motion.div
        aria-hidden
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[9998]"
      >
        <motion.div
          animate={{
            width: hovering ? 60 : 32,
            height: hovering ? 60 : 32,
            opacity: hovering ? 0.6 : 0.35,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-[oklch(0.78_0.17_55)]/70 blur-[0.5px]"
        />
      </motion.div>
      <style>{`@media (pointer: fine) { html, body, a, button { cursor: none !important; } }`}</style>
    </>
  );
}
