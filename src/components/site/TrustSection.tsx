import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

const STATS = [
  { value: 120, suffix: "+", label: "Projects delivered" },
  { value: 40, suffix: "+", label: "Global brands" },
  { value: 28, suffix: "", label: "Countries served" },
  { value: 12500, suffix: "+", label: "Hours rendered" },
  { value: 4.9, suffix: "/5", label: "Client satisfaction", decimals: 1 },
  { value: 24, suffix: "h", label: "Avg. response time" },
];

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, to, { duration: 2, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, mv, to]);

  return (
    <span ref={ref} className="text-display text-5xl md:text-6xl gradient-text tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export function TrustSection() {
  return (
    <section className="relative py-32 border-y border-border">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" /> By the numbers
          </div>
          <h2 className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl">
            Measured in frames,<br />
            <span className="gradient-text">felt worldwide.</span>
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-14">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="text-center"
            >
              <Counter to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
