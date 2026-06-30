import { useRef, type CSSProperties, type ReactNode, type MouseEvent } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  glowColor?: string;
  as?: "div" | "article" | "section";
}

/**
 * Glass card wrapper with a cursor-tracked radial spotlight.
 * Uses CSS custom properties updated via a rAF-throttled handler.
 */
export function SpotlightCard({
  children,
  className = "",
  style,
  glowColor = "20, 255, 236",
  as = "div",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef(0);
  const Tag = as as "div";

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (raf.current) return;
    raf.current = requestAnimationFrame(() => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
      raf.current = 0;
    });
  };

  return (
    <Tag
      ref={ref as never}
      onMouseMove={onMove}
      className={`spotlight-card group relative ${className}`}
      style={{ ...style, ["--spot-color" as string]: glowColor } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
