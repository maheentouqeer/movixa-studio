import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode, type MouseEvent } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "ghost";
}

export function MagneticButton({ children, className = "", onClick, href, variant = "primary" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });
  const tx = useTransform(sx, (v) => v * 0.35);
  const ty = useTransform(sy, (v) => v * 0.35);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set(e.clientX - rect.left - rect.width / 2);
    y.set(e.clientY - rect.top - rect.height / 2);
  };
  const reset = () => { x.set(0); y.set(0); };

  const base = variant === "primary"
    ? "bg-foreground text-background hover:opacity-90"
    : "glass text-foreground hover:bg-white/10";

  const inner = (
    <motion.div
      style={{ x: tx, y: ty }}
      className={`inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium transition ${base} ${className}`}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div ref={ref} onMouseMove={handleMove} onMouseLeave={reset} onClick={onClick} className="inline-block cursor-pointer">
      {href ? <a href={href}>{inner}</a> : inner}
    </motion.div>
  );
}
