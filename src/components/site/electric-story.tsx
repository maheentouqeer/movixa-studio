import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Wrench, Zap } from "lucide-react";
import logoAsset from "@/assets/karigar-logo.jpg.asset.json";

// Beat windows along the scroll progress [0..1]
const BEATS = [
  { key: "normal", label: "Normal", start: 0.0, end: 0.22 },
  { key: "fault", label: "Fault", start: 0.25, end: 0.5 },
  { key: "arrival", label: "Karigar arrives", start: 0.52, end: 0.75 },
  { key: "resolved", label: "Resolved", start: 0.78, end: 1.0 },
] as const;

const CAPTIONS: Record<
  (typeof BEATS)[number]["key"],
  { eyebrow: string; title: string; body: string; tone: string }
> = {
  normal: {
    eyebrow: "11:42 PM • Gulberg, Lahore",
    title: "Ek aam raat.",
    body: "Roshni hai, ghar pursukoon hai. Sab kuch theek chal raha hai.",
    tone: "var(--gold)",
  },
  fault: {
    eyebrow: "11:43 PM • Short circuit",
    title: "Phir achanak — andhera.",
    body: "Wire mein fault. Roshni gayab. Ammi ghabra rahi hain, electrician ka number kahin nahi mil raha.",
    tone: "var(--danger)",
  },
  arrival: {
    eyebrow: "11:43 PM • One voice command",
    title: "Karigar AI sun raha hai.",
    body: "Ek awaaz: \u201CMera bulb kharab hai, abhi koi bhej do.\u201D 14 agents activate. Nearest verified electrician dispatched in 9 seconds.",
    tone: "var(--primary-lite)",
  },
  resolved: {
    eyebrow: "11:51 PM • Fixed",
    title: "Roshni wapas.",
    body: "8 minute. Pre-negotiated price. Trust score +1. Yehi hai Karigar AI ka wada \u2014 har ghar, har waqt.",
    tone: "var(--success)",
  },
};

function useBeatOpacity(
  progress: MotionValue<number>,
  start: number,
  end: number,
) {
  const fade = 0.04;
  return useTransform(
    progress,
    [
      Math.max(0, start - fade),
      start,
      end,
      Math.min(1, end + fade),
    ],
    [0, 1, 1, 0],
  );
}

export function ElectricStorySection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Bulb brightness across the timeline
  const bulbGlow = useTransform(
    scrollYProgress,
    [0, 0.22, 0.27, 0.32, 0.37, 0.5, 0.78, 0.9, 1],
    [1, 1, 0.15, 0.55, 0.05, 0.05, 0.05, 1, 1],
  );
  const bulbColor = useTransform(
    scrollYProgress,
    [0, 0.22, 0.5, 0.78, 1],
    [
      "rgba(245,197,66,1)",
      "rgba(245,197,66,1)",
      "rgba(120,120,130,0.6)",
      "rgba(120,120,130,0.6)",
      "rgba(245,197,66,1)",
    ],
  );

  // Crack on the wire (stroke dash)
  const crackOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.3, 0.78, 0.85],
    [0, 1, 1, 0],
  );
  const crackDash = useTransform(
    scrollYProgress,
    [0.22, 0.34],
    [60, 0],
  );

  // Spark intensity (only visible during fault)
  const sparkOpacity = useTransform(
    scrollYProgress,
    [0.22, 0.3, 0.5, 0.55],
    [0, 1, 1, 0],
  );

  // Mascot enters during arrival
  const mascotX = useTransform(
    scrollYProgress,
    [0.45, 0.62, 0.78, 1],
    ["120%", "0%", "0%", "-8%"],
  );
  const mascotOpacity = useTransform(
    scrollYProgress,
    [0.45, 0.55, 1],
    [0, 1, 1],
  );
  const wrenchRotate = useTransform(
    scrollYProgress,
    [0.55, 0.78],
    [0, 540],
  );

  // Fixed badge appears at the end
  const badgeOpacity = useTransform(
    scrollYProgress,
    [0.78, 0.88],
    [0, 1],
  );
  const badgeY = useTransform(
    scrollYProgress,
    [0.78, 0.88],
    [16, 0],
  );

  // Timeline progress bar
  const timelineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={ref}
      aria-label="From fault to fixed in 8 minutes"
      className="relative w-full"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        {/* Ambient backdrop */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 35%, rgba(13,115,119,0.18) 0%, transparent 70%), linear-gradient(180deg, var(--bg-deep) 0%, #04060d 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(20,255,236,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(20,255,236,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          }}
        />

        {/* Eyebrow + timeline */}
        <div className="relative z-10 mx-auto mt-6 w-full max-w-6xl px-6 md:mt-10">
          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-glow)] bg-[var(--bg-card)]/60 px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[var(--primary-lite)]">
              <Zap className="h-3 w-3" /> A night in Lahore
            </span>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-[color:var(--text-muted)] md:inline">
              scroll to play
            </span>
          </div>
          <div className="relative mt-4 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full origin-left"
              style={{
                scaleX: timelineScale,
                background:
                  "linear-gradient(90deg, var(--primary), var(--primary-lite))",
              }}
            />
            <div className="pointer-events-none absolute inset-0 flex justify-between">
              {BEATS.map((b) => (
                <span
                  key={b.key}
                  className="-translate-y-1/2 self-center h-2 w-2 rounded-full bg-white/20"
                />
              ))}
            </div>
          </div>
          <div className="mt-2 hidden justify-between text-[10px] uppercase tracking-[0.2em] text-[color:var(--text-muted)] md:flex">
            {BEATS.map((b) => (
              <span key={b.key}>{b.label}</span>
            ))}
          </div>
        </div>

        {/* Scene */}
        <div className="relative z-10 flex flex-1 items-center justify-center px-6">
          <div className="relative h-[58vh] w-full max-w-5xl">
            {/* Switchboard */}
            <div className="absolute left-[6%] top-1/2 -translate-y-1/2">
              <Switchboard />
              {/* Sparks */}
              <motion.div
                aria-hidden
                style={{ opacity: sparkOpacity }}
                className="pointer-events-none absolute -right-3 top-6"
              >
                <Sparks reduce={!!reduceMotion} />
              </motion.div>
            </div>

            {/* Wire + crack (SVG spans switchboard -> bulb) */}
            <svg
              aria-hidden
              viewBox="0 0 1000 400"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              <defs>
                <linearGradient id="wireGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="rgba(20,255,236,0.5)" />
                  <stop offset="100%" stopColor="rgba(245,197,66,0.6)" />
                </linearGradient>
              </defs>
              <path
                d="M 140 200 C 320 120, 520 300, 820 200"
                stroke="url(#wireGrad)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              {/* Crack overlay */}
              <motion.path
                d="M 470 215 l 14 -22 l -10 -6 l 22 -18 l -8 -10 l 18 -8"
                stroke="var(--danger)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                style={{
                  opacity: crackOpacity,
                  strokeDasharray: 60,
                  strokeDashoffset: crackDash,
                  filter:
                    "drop-shadow(0 0 6px rgba(231,76,60,0.7))",
                }}
              />
            </svg>

            {/* Bulb */}
            <div className="absolute right-[8%] top-1/2 -translate-y-1/2">
              <Bulb glow={bulbGlow} color={bulbColor} reduce={!!reduceMotion} />

              {/* Fixed badge */}
              <motion.div
                style={{ opacity: badgeOpacity, y: badgeY }}
                className="absolute left-1/2 top-full mt-6 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--border-glow)] bg-[var(--bg-card)]/80 px-4 py-2 text-sm font-bold text-white shadow-[0_0_30px_rgba(46,204,113,0.35)] backdrop-blur"
              >
                <span
                  className="mr-2 inline-block h-2 w-2 rounded-full"
                  style={{ background: "var(--success)" }}
                />
                Fixed in <span className="text-[var(--success)]">8 minutes</span>
                <span className="mx-2 text-white/30">•</span>
                Trust score <span className="text-[var(--primary-lite)]">+1</span>
              </motion.div>
            </div>

            {/* Mascot */}
            <motion.div
              style={{ x: mascotX, opacity: mascotOpacity }}
              className="absolute right-[26%] top-1/2 -translate-y-1/2"
            >
              <motion.div
                animate={
                  reduceMotion
                    ? undefined
                    : { y: [0, -8, 0] }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }
                }
                className="relative"
              >
                <div
                  className="relative h-28 w-28 overflow-hidden rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-card)] md:h-36 md:w-36"
                  style={{
                    boxShadow:
                      "0 0 40px rgba(20,255,236,0.35), 0 0 80px rgba(13,115,119,0.25)",
                  }}
                >
                  <img
                    src={logoAsset.url}
                    alt="Karigar AI mascot arriving on the scene"
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <motion.div
                  style={{ rotate: wrenchRotate }}
                  className="absolute -right-3 -bottom-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-glow)] bg-[var(--bg-deep)] text-[var(--primary-lite)] shadow-[0_0_20px_rgba(20,255,236,0.4)]"
                >
                  <Wrench className="h-5 w-5" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Captions */}
        <div className="relative z-10 mx-auto mb-10 w-full max-w-3xl px-6 md:mb-16">
          <div className="relative h-[150px] md:h-[140px]">
            {BEATS.map((b) => (
              <Caption
                key={b.key}
                progress={scrollYProgress}
                start={b.start}
                end={b.end}
                data={CAPTIONS[b.key]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Caption({
  progress,
  start,
  end,
  data,
}: {
  progress: MotionValue<number>;
  start: number;
  end: number;
  data: { eyebrow: string; title: string; body: string; tone: string };
}) {
  const opacity = useBeatOpacity(progress, start, end);
  const y = useTransform(progress, [start - 0.05, start, end, end + 0.05], [12, 0, 0, -12]);
  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 text-center"
    >
      <div
        className="mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
        style={{
          borderColor: "var(--border-glow)",
          color: data.tone,
          background: "rgba(15,23,42,0.55)",
        }}
      >
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: data.tone, boxShadow: `0 0 10px ${data.tone}` }}
        />
        {data.eyebrow}
      </div>
      <h3 className="font-display text-2xl font-black tracking-tight text-white md:text-4xl">
        {data.title}
      </h3>
      <p className="mx-auto mt-2 max-w-2xl text-sm text-[color:var(--text-sub)] md:text-base">
        {data.body}
      </p>
    </motion.div>
  );
}

function Switchboard() {
  return (
    <div
      className="relative h-32 w-24 rounded-md border md:h-40 md:w-28"
      style={{
        background:
          "linear-gradient(180deg, #1a2236 0%, #0d1322 100%)",
        borderColor: "var(--border-glow)",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.06), 0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div className="absolute inset-2 grid grid-cols-2 gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-sm border border-white/10 bg-black/40"
            style={{ height: "100%" }}
          >
            <div
              className="mx-auto mt-1 h-3 w-1.5 rounded-sm"
              style={{
                background: i % 2 ? "var(--primary-lite)" : "var(--gold)",
                boxShadow: `0 0 8px ${i % 2 ? "var(--primary-lite)" : "var(--gold)"}`,
              }}
            />
          </div>
        ))}
      </div>
      <div
        className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
        style={{ background: "var(--primary-lite)", boxShadow: "0 0 10px var(--primary-lite)" }}
      />
    </div>
  );
}

function Sparks({ reduce }: { reduce: boolean }) {
  const dots = [0, 1, 2, 3, 4];
  return (
    <div className="relative h-12 w-12">
      {dots.map((i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const r = 14;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
            style={{
              background: "var(--gold)",
              boxShadow: "0 0 8px var(--gold)",
              x,
              y,
            }}
            animate={
              reduce
                ? undefined
                : { scale: [0.4, 1.2, 0.4], opacity: [0.4, 1, 0.4] }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 0.9,
                    delay: i * 0.12,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
            }
          />
        );
      })}
    </div>
  );
}

function Bulb({
  glow,
  color,
  reduce,
}: {
  glow: MotionValue<number>;
  color: MotionValue<string>;
  reduce: boolean;
}) {
  const shadow = useTransform(
    glow,
    (g) => `0 0 ${20 + g * 80}px rgba(245,197,66,${0.2 + g * 0.7}), 0 0 ${10 + g * 40}px rgba(245,197,66,${0.15 + g * 0.5})`,
  );
  return (
    <div className="relative">
      {/* Hanging wire */}
      <div
        className="absolute left-1/2 -top-24 h-24 w-px -translate-x-1/2"
        style={{ background: "rgba(255,255,255,0.18)" }}
      />
      <motion.div
        className="relative h-20 w-20 rounded-full md:h-24 md:w-24"
        style={{
          background: color,
          opacity: glow,
          boxShadow: shadow,
        }}
        animate={
          reduce ? undefined : { scale: [1, 1.015, 1] }
        }
        transition={
          reduce
            ? undefined
            : { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
      />
      <div
        className="mx-auto -mt-1 h-4 w-6 rounded-b-md"
        style={{ background: "#3b4254" }}
      />
    </div>
  );
}
