import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useMounted } from "@/hooks/use-mounted";

const HeroScene = lazy(() =>
  import("./scene/hero-scene").then((m) => ({ default: m.HeroScene })),
);

const phrases = [
  "14 AI Agents. One Request.",
  "Pakistan ka Pehla Agentic Marketplace.",
  "Book Any Karigar in 10 Seconds.",
];

function useTypewriter(words: string[], typeSpeed = 55, pause = 1600) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);

  useEffect(() => {
    const cur = words[i % words.length];
    if (!del && text === cur) {
      const t = setTimeout(() => setDel(true), pause);
      return () => clearTimeout(t);
    }
    if (del && text === "") {
      setDel(false);
      setI((v) => v + 1);
      return;
    }
    const t = setTimeout(
      () => {
        setText(del ? cur.slice(0, text.length - 1) : cur.slice(0, text.length + 1));
      },
      del ? typeSpeed / 2 : typeSpeed,
    );
    return () => clearTimeout(t);
  }, [text, del, i, words, typeSpeed, pause]);

  return text;
}

function Counter({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        const start = performance.now();
        const step = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          setV(Math.round(to * eased));
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, duration]);
  return <span ref={ref}>{v.toLocaleString()}{suffix}</span>;
}

export function Hero() {
  const text = useTypewriter(phrases);
  const isMobile = useIsMobile();
  const mounted = useMounted();
  const showScene = mounted && !isMobile;

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 80, damping: 14 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 80, damping: 14 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section id="home" className="relative isolate min-h-screen overflow-hidden pt-32 pb-20 hero-grid-bg">
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(13,115,119,0.35),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[var(--bg-deep)]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        {/* Left */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-[var(--gold)]/5 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] text-[var(--gold)]"
          >
            <Sparkles className="h-3.5 w-3.5" />
            4th Nationally · AISeekho 2026 · 7,000+ Teams
          </motion.div>

          <h1 className="mt-6 font-display text-[clamp(3rem,7vw,6.5rem)] font-black leading-[0.95] tracking-[-0.035em]">
            <span className="block min-h-[1em]">
              <span className="text-gradient-teal">{text}</span>
              <span className="ml-1 inline-block h-[0.85em] w-[3px] -translate-y-1 animate-pulse bg-[var(--primary-lite)] align-middle" />
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--text-sub)] md:text-xl">
            <span className="font-bold text-white">Urdu. Roman Urdu. English.</span> Voice or type.
            14 AI agents understand, negotiate, book, and track — all autonomously.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(20,255,236,0.3)] transition hover:scale-[1.03] hover:bg-[var(--primary-dark)] hover:shadow-[0_0_40px_rgba(20,255,236,0.55)]"
            >
              Download App
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white transition hover:scale-[1.03] hover:border-[var(--primary-lite)]/40 hover:bg-white/10"
            >
              <Play className="h-4 w-4 fill-current" />
              Watch Demo
            </a>
          </div>

          <div className="mt-12 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { v: 14, l: "AI Agents", s: "" },
              { v: 21, l: "M Workers", s: "M+" },
              { v: 16, l: "Categories", s: "" },
              { v: 2.4, l: "Trillion Rs", s: "T", dec: true },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-2xl font-black text-gradient-teal md:text-3xl">
                  {s.dec ? `${s.v}${s.s}` : (
                    <><Counter to={s.v} />{s.s}</>
                  )}
                </div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — 3D scene + floating glass cards */}
        <div
          onMouseMove={onMove}
          onMouseLeave={() => { mx.set(0); my.set(0); }}
          className="relative mx-auto h-[520px] w-full max-w-md"
          style={{ perspective: 1200 }}
        >
          {/* R3F scene */}
          <div className="absolute inset-0">
            {showScene ? (
              <Suspense fallback={null}>
                <HeroScene />
              </Suspense>
            ) : (
              <div className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 animate-pulse-glow rounded-full bg-[radial-gradient(circle,rgba(13,115,119,0.55),transparent_70%)] blur-2xl" />
            )}
          </div>

          {/* Floating glass cards on top */}
          <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="pointer-events-none relative h-full w-full">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ transform: "translateZ(60px)" }}
              className="pointer-events-auto absolute left-0 top-16 glass-card flex items-center gap-3 px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--success)]/20 text-[var(--success)]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">AC repair booked</div>
                <div className="text-[var(--text-sub)]">G-13 · Rs 650</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              style={{ transform: "translateZ(80px)" }}
              className="pointer-events-auto absolute right-0 top-36 glass-card flex items-center gap-3 px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary-lite)]/20 text-[var(--primary-lite)]">
                <Zap className="h-4 w-4" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">Recovery: New provider</div>
                <div className="text-[var(--text-sub)]">in 8s · Rs 50 credit</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              style={{ transform: "translateZ(40px)" }}
              className="pointer-events-auto absolute bottom-4 left-1/2 -translate-x-1/2 glass-card flex items-center gap-3 px-4 py-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/20 text-purple-300">
                🔒
              </div>
              <div className="text-xs">
                <div className="font-bold text-white">PII Redacted</div>
                <div className="text-[var(--text-sub)]">Privacy Active</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
