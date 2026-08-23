import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";

const WORLDS = [
  {
    n: "01",
    title: "DIGITAL EXPERIENCES",
    line: "Websites, 3D interfaces, scroll-driven storytelling.",
  },
  {
    n: "02",
    title: "AI FILM + CGI",
    line: "AI commercials, CGI product ads, cinematic transformations.",
  },
  {
    n: "03",
    title: "BRAND VISUALS",
    line: "Identity systems, campaign design, logo motion.",
  },
];

/**
 * Scroll-driven cinematic transition: a single core object dissolves into
 * particles, the particles drift sideways and resolve into three worlds.
 */
export function PillarSequence() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const coreScale = useTransform(scrollYProgress, [0, 0.35], [1, 0.3]);
  const coreOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const coreRotate = useTransform(scrollYProgress, [0, 0.4], [0, 220]);
  const shardSpread = useTransform(scrollYProgress, [0.15, 0.55], [0, 1]);
  const worldsOpacity = useTransform(scrollYProgress, [0.45, 0.65], [0, 1]);
  const worldsY = useTransform(scrollYProgress, [0.45, 0.7], [60, 0]);
  const hazeOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.25, 0.6, 0.2]);

  if (reduced) {
    return (
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 grid gap-6 md:grid-cols-3">
          {WORLDS.map((w) => (
            <div key={w.n} className="glass rounded-2xl p-8">
              <span className="font-mono text-xs text-[oklch(0.78_0.17_55)]">{w.n}</span>
              <h3 className="mt-4 text-display text-2xl">{w.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{w.line}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} aria-label="Our three creative pillars" className="relative h-[320vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ opacity: hazeOpacity }}
          className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.72_0.19_45)]/20 blur-[140px]"
        />

        {/* core object */}
        <motion.div
          style={{ scale: coreScale, opacity: coreOpacity, rotate: coreRotate }}
          className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="h-full w-full rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-xl" />
          <div className="absolute inset-6 rounded-full border border-[oklch(0.78_0.17_55)]/40" />
          <div className="absolute inset-16 rounded-full bg-[oklch(0.78_0.17_55)]/30 blur-xl" />
        </motion.div>

        {/* particles */}
        {Array.from({ length: 42 }).map((_, i) => {
          const angle = (i / 42) * Math.PI * 2;
          const lane = i % 3;
          const targetX = (lane - 1) * 30;
          const targetY = ((i % 7) - 3) * 3.2;
          return (
            <Shard
              key={i}
              progress={shardSpread}
              from={{ x: Math.cos(angle) * 8, y: Math.sin(angle) * 8 }}
              to={{ x: targetX, y: targetY }}
            />
          );
        })}

        {/* worlds */}
        <motion.div
          style={{ opacity: worldsOpacity, y: worldsY }}
          className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6"
        >
          <div className="grid w-full gap-8 md:grid-cols-3">
            {WORLDS.map((w) => (
              <div key={w.n} className="border-t border-white/15 pt-6">
                <span className="font-mono text-xs tracking-widest text-[oklch(0.78_0.17_55)]">
                  {w.n}
                </span>
                <h3 className="mt-4 text-display text-3xl md:text-4xl leading-tight">{w.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground">{w.line}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Shard({
  progress,
  from,
  to,
}: {
  progress: ReturnType<typeof useTransform<number, number>>;
  from: { x: number; y: number };
  to: { x: number; y: number };
}) {
  const x = useTransform(progress, [0, 1], [`${from.x}vw`, `${to.x}vw`]);
  const y = useTransform(progress, [0, 1], [`${from.y}vh`, `${to.y}vh`]);
  const opacity = useTransform(progress, [0, 0.25, 0.8, 1], [0, 0.9, 0.7, 0]);
  return (
    <motion.span
      aria-hidden
      style={{ x, y, opacity }}
      className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-[oklch(0.86_0.12_70)] shadow-[0_0_12px_oklch(0.78_0.17_55)]"
    />
  );
}
