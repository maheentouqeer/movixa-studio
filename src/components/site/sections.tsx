import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  AlertTriangle, Clock, PhoneOff, X, Mic, ArrowRight, MapPin,
  ShieldCheck, Zap, Lock, Sparkles, CheckCircle2, Bot, Globe2,
  HandshakeIcon, Cpu, Star, TrendingUp, Wallet, Building2, Trophy,
  Users, Rocket, Mail, Phone, Linkedin, Github, Twitter, Send,
  ChevronLeft, ChevronRight, MessageSquare, Wrench,
} from "lucide-react";
import { SectionHeading, Reveal } from "./section-heading";

/* ============================================================
   Reusable counter
============================================================ */
function AnimCount({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1800,
}: {
  to: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(to * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, to, duration]);
  return (
    <span ref={ref}>
      {prefix}
      {v.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/* ============================================================
   SECTION 2 — Problem
============================================================ */
export function ProblemSection() {
  const pains = [
    { i: "💸", t: "No Price Standard", d: "Same AC repair: Rs 500 one day, Rs 1,400 the next. Pure chaos." },
    { i: "⏰", t: "Hours Wasted", d: "Calling, waiting, calling again. No confirmation provider will show up." },
    { i: "📵", t: "Zero Booking System", d: "No slot confirmation. No tracking. No protection. WhatsApp is not a marketplace." },
    { i: "❌", t: "Zero Recourse", d: "Overcharged? No-show? Damaged property? Tough luck. No refund channel." },
  ];
  return (
    <section className="relative py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(231,76,60,0.08),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Problem"
          title={
            <>
              Pakistan's Informal Economy is <span className="text-gradient-teal">Broken</span>
            </>
          }
          subtitle="21 million workers. Zero digital infrastructure. 90 million urban Pakistanis suffering daily."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {pains.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.08}>
                <div className="relative h-full overflow-hidden rounded-2xl border-l-4 border-[var(--danger)] bg-[var(--bg-card)]/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-[var(--bg-card)]/80">
                  <div className="mb-3 text-3xl">{p.i}</div>
                  <h3 className="mb-2 font-display text-lg font-bold">{p.t}</h3>
                  <p className="text-sm leading-relaxed text-[var(--text-sub)]">{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="glass-card flex h-full flex-col justify-center gap-8 p-10">
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  Total Addressable Pain
                </div>
                <div className="mt-2 font-display text-5xl font-black text-gradient-teal md:text-6xl">
                  Rs <AnimCount to={67} />T
                </div>
                <div className="mt-1 text-sm text-[var(--text-sub)]">Informal economy size</div>
              </div>
              <div className="h-px bg-[var(--border-glow)]" />
              <div>
                <div className="font-display text-5xl font-black text-white md:text-6xl">
                  <AnimCount to={21} />M
                </div>
                <div className="mt-1 text-sm text-[var(--text-sub)]">Workers with zero digital presence</div>
              </div>
              <div className="h-px bg-[var(--border-glow)]" />
              <div>
                <div className="font-display text-5xl font-black text-[var(--gold)] md:text-6xl">
                  <AnimCount to={90} />M
                </div>
                <div className="mt-1 text-sm text-[var(--text-sub)]">Urban Pakistanis affected</div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 3 — How it works
============================================================ */
export function HowItWorks() {
  const steps = [
    {
      n: "01",
      icon: <Mic className="h-5 w-5" />,
      title: "Speak or Type",
      body: "Urdu, Roman Urdu or English. AI parses intent, entity, urgency and budget in real-time.",
      example: "AC bilkul thand nahi, G-13, budget 500",
      chips: ["AC Repair", "G-13", "Urgency 5/5", "Rs 500", "100% Confidence"],
      note: "🔒 PII stripped before Gemini call",
    },
    {
      n: "02",
      icon: <HandshakeIcon className="h-5 w-5" />,
      title: "Agents Negotiate",
      body: "8 customer agents + 6 provider agents communicate via A2A protocol. Live price negotiation in Urdu.",
      example: "Scout → Ranker → Tactician → Closer",
      chips: ["Bid Rs 800", "Counter Rs 600", "Settled Rs 650"],
      note: "⚡ 8 agents · 4.2 seconds · Best price",
    },
    {
      n: "03",
      icon: <MapPin className="h-5 w-5" />,
      title: "Book, Track, Protected",
      body: "Confirmed booking, live tracking pin, bilateral dispute resolution, 10-second auto-recovery.",
      example: "Hassan Plumbing arriving in 12 min",
      chips: ["Recovery ⚡", "Dispute 🛡️", "Privacy 🔒"],
      note: "✅ Money-back guarantee active",
    },
  ];
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="How It Works"
          title={
            <>
              One Voice Request. <span className="text-gradient-teal">14 Agents Handle the Rest.</span>
            </>
          }
          subtitle="From spoken request to confirmed booking in under 5 seconds."
        />

        <div className="relative grid gap-8 md:grid-cols-3">
          {/* connecting line */}
          <svg
            className="pointer-events-none absolute left-0 right-0 top-1/2 hidden h-px w-full md:block"
            viewBox="0 0 1000 2"
            preserveAspectRatio="none"
          >
            <line
              x1="0"
              y1="1"
              x2="1000"
              y2="1"
              stroke="rgba(20,255,236,0.3)"
              strokeWidth="1"
              strokeDasharray="6 6"
            />
          </svg>

          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1}>
              <div className="glass-card group relative h-full overflow-hidden p-7 transition hover:-translate-y-2 hover:border-[var(--primary-lite)]/30">
                <div className="absolute right-6 top-6 font-display text-5xl font-black text-white/5">
                  {s.n}
                </div>
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/20 text-[var(--primary-lite)] ring-1 ring-[var(--primary-lite)]/30">
                  {s.icon}
                </div>
                <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--text-sub)]">{s.body}</p>

                <div className="mt-5 rounded-xl border border-[var(--border-glow)] bg-[var(--bg-deep)]/60 p-4">
                  <div className="font-mono text-xs text-[var(--primary-lite)]">{s.example}</div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-md bg-[var(--primary)]/20 px-2 py-0.5 text-[10px] font-bold text-[var(--primary-lite)]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  {s.note}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 4 — Agents orbit
============================================================ */
const customerAgents = [
  { name: "Concierge", role: "Voice/Chat NLU + intent routing", model: "Gemini 2.5 Flash" },
  { name: "Scout", role: "Provider discovery across 16 categories", model: "Gemini 2.5 Flash" },
  { name: "Ranker", role: "8-factor trust score evaluation", model: "Gemini 2.5 Flash" },
  { name: "Tactician", role: "Live A2A price negotiation in Urdu", model: "Gemini 2.5 Pro", star: true },
  { name: "Closer", role: "Booking confirmation + slot lock", model: "Gemini 2.5 Flash" },
  { name: "Dispute", role: "Bilateral evidence review", model: "Gemini 2.5 Pro" },
  { name: "Recovery", role: "10-second provider swap on cancel", model: "Gemini 2.5 Flash" },
  { name: "Logger", role: "Audit trail + telemetry", model: "Gemini 2.5 Flash" },
];

const providerAgents = [
  { name: "Business Manager", role: "Onboarding + KYC orchestration" },
  { name: "Price Negotiator", role: "Real-time counter-offers" },
  { name: "Scheduler", role: "Auto-slot optimization" },
  { name: "Trust Analyst", role: "Reputation scoring" },
  { name: "Dispute Handler", role: "Provider-side defense" },
  { name: "Earnings Agent", role: "Income forecasts + payouts" },
];

function Orbit({
  nodes,
  centerLabel,
  color,
  size = 360,
}: {
  nodes: { name: string }[];
  centerLabel: string;
  color: string;
  size?: number;
}) {
  const r = size / 2 - 40;
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute inset-6 rounded-full border border-dashed border-white/10" />
      <div className="absolute inset-16 rounded-full border border-dashed border-white/5" />
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 40, ease: "linear", repeat: Infinity }}
      >
        {nodes.map((n, i) => {
          const angle = (i / nodes.length) * Math.PI * 2;
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          return (
            <motion.div
              key={n.name}
              className="group absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ x, y }}
              whileHover={{ scale: 1.15 }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 40, ease: "linear", repeat: Infinity }}
                className="flex flex-col items-center"
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl border text-xs font-bold transition"
                  style={{
                    background: `${color}20`,
                    borderColor: `${color}66`,
                    color,
                    boxShadow: `0 0 20px ${color}33`,
                  }}
                >
                  <Bot className="h-5 w-5" />
                </div>
                <div className="mt-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-wider text-white/70">
                  {n.name}
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full text-center font-display text-sm font-black text-white animate-pulse-glow"
          style={{ background: `${color}30`, border: `1px solid ${color}` }}
        >
          {centerLabel}
        </div>
      </div>
    </div>
  );
}

export function AgentsSection() {
  return (
    <section id="agents" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(13,115,119,0.12),transparent_70%)] blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Swarm"
          title={
            <>
              14 AI Agents. <span className="text-gradient-teal">Two Swarms.</span> One Platform.
            </>
          }
          subtitle="Real-time Agent-to-Agent protocol. The only Pakistani platform with live AI negotiation."
        />

        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
          <Reveal>
            <div>
              <div className="mb-6 text-center">
                <div className="inline-block rounded-full border border-[var(--primary-lite)]/30 bg-[var(--primary)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-lite)]">
                  Customer Swarm · 8 Agents
                </div>
              </div>
              <Orbit nodes={customerAgents} centerLabel="CUSTOMER" color="#14FFEC" />
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="rounded-full border border-[var(--border-glow)] bg-[var(--bg-card)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-lite)]">
                A2A Protocol
              </div>
              <div className="flex h-32 flex-col items-center justify-center gap-1">
                <motion.div
                  animate={{ x: [-10, 10, -10] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[var(--primary-lite)]"
                >
                  ⇄
                </motion.div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">JSON · Streaming</div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.3}>
            <div>
              <div className="mb-6 text-center">
                <div className="inline-block rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">
                  Provider Hub · 6 Agents
                </div>
              </div>
              <Orbit nodes={providerAgents} centerLabel="PROVIDER" color="#F5C542" size={320} />
            </div>
          </Reveal>
        </div>

        {/* Agent cards grid */}
        <div className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {customerAgents.map((a, i) => (
            <Reveal key={a.name} delay={i * 0.04}>
              <div
                className={`group h-full rounded-2xl border p-5 backdrop-blur-xl transition hover:-translate-y-1 ${
                  a.star
                    ? "border-[var(--gold)]/40 bg-[var(--gold)]/5 hover:border-[var(--gold)]"
                    : "border-[var(--border-glow)] bg-[var(--bg-card)]/50 hover:border-[var(--primary-lite)]/40"
                }`}
              >
                {a.star && (
                  <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-[var(--gold)]/20 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[var(--gold)]">
                    <Star className="h-3 w-3 fill-current" /> Unique Feature
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Bot className={`h-4 w-4 ${a.star ? "text-[var(--gold)]" : "text-[var(--primary-lite)]"}`} />
                  <h4 className="font-display font-bold">{a.name}</h4>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-sub)]">{a.role}</p>
                <div className="mt-3 inline-flex items-center gap-1 rounded-md bg-white/5 px-2 py-0.5 text-[9px] font-mono text-[var(--text-muted)]">
                  <Cpu className="h-3 w-3" />
                  {a.model}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 5 — Demo / phone showcase
============================================================ */
const screens = [
  {
    title: "Voice & Chat",
    body: (
      <>
        <div className="mb-3 rounded-xl bg-white/5 p-3 text-xs">
          <div className="text-[10px] font-bold uppercase text-[var(--text-muted)]">You · 14:22</div>
          <div className="mt-1 text-white">"AC bilkul thand nahi G-13"</div>
        </div>
        <div className="rounded-xl border border-[var(--primary-lite)]/30 bg-[var(--primary)]/10 p-3 text-xs">
          <div className="text-[10px] font-bold uppercase text-[var(--primary-lite)]">Concierge · NLU</div>
          <div className="mt-1 text-white">3 providers found near G-13. Tactician negotiating...</div>
          <div className="mt-2 flex flex-wrap gap-1">
            {["AC Repair", "G-13", "Urgency 5/5", "Budget Rs 500"].map((c) => (
              <span key={c} className="rounded bg-[var(--primary)]/30 px-1.5 py-0.5 text-[9px] font-bold text-[var(--primary-lite)]">{c}</span>
            ))}
          </div>
        </div>
      </>
    ),
  },
  {
    title: "Agent Swarm Live",
    body: (
      <div className="space-y-2 text-[11px]">
        {[
          { f: "Scout", t: "Ranker", m: "3 providers in 800m", c: "#14FFEC" },
          { f: "Ranker", t: "Tactician", m: "Top pick: Hassan (4.8★)", c: "#14FFEC" },
          { f: "Tactician", t: "Provider", m: "Counter Rs 650?", c: "#F5C542" },
          { f: "Provider", t: "Tactician", m: "Accepted Rs 650 ✓", c: "#2ECC71" },
          { f: "Closer", t: "Customer", m: "BOOKED · 18 min ETA", c: "#14FFEC" },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}
            className="rounded-lg border border-white/5 bg-white/[0.03] p-2"
          >
            <div className="font-mono text-[9px]" style={{ color: m.c }}>
              {m.f} → {m.t}
            </div>
            <div className="text-white">{m.m}</div>
          </motion.div>
        ))}
        <div className="mt-2 rounded-md bg-[var(--success)]/20 px-2 py-1 text-center text-[10px] font-black uppercase text-[var(--success)]">
          ✓ BOOKED · 4.2s total
        </div>
      </div>
    ),
  },
  {
    title: "Provider List",
    body: (
      <div className="space-y-2">
        {[
          { n: "Hassan Plumbing", s: 4.8, p: 650, top: true },
          { n: "Ali AC Services", s: 4.6, p: 720 },
          { n: "Karachi Cool", s: 4.4, p: 800 },
        ].map((p) => (
          <div
            key={p.n}
            className={`rounded-xl border p-3 ${p.top ? "border-[var(--gold)] bg-[var(--gold)]/5" : "border-white/10 bg-white/5"}`}
          >
            {p.top && (
              <div className="mb-1 inline-block rounded bg-[var(--gold)]/30 px-1.5 py-0.5 text-[9px] font-black uppercase text-[var(--gold)]">
                AI Top Pick
              </div>
            )}
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{p.n}</span>
              <span className="font-mono text-[var(--primary-lite)]">Rs {p.p}</span>
            </div>
            <div className="mt-1 flex items-center gap-1 text-[10px] text-[var(--text-sub)]">
              <Star className="h-3 w-3 fill-[var(--gold)] text-[var(--gold)]" />
              {p.s} · Trust 92/100
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    title: "Provider Home",
    body: (
      <div>
        <div className="mb-3 text-center text-[10px] font-bold uppercase text-[var(--text-muted)]">New Job · Auto-expire 30s</div>
        <div className="rounded-xl border border-[var(--primary-lite)]/40 bg-[var(--primary)]/10 p-4 text-xs">
          <div className="font-bold text-white">AC repair · G-13</div>
          <div className="mt-1 text-[var(--text-sub)]">Customer trust: 94/100</div>
          <div className="mt-2 flex items-center justify-between">
            <div className="font-mono text-lg text-[var(--primary-lite)]">Rs 650</div>
            <div className="text-[10px] text-[var(--text-muted)]">⏱ 23s left</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 rounded-lg bg-[var(--success)] py-1.5 text-[10px] font-black text-white">ACCEPT</button>
            <button className="rounded-lg border border-white/20 px-3 py-1.5 text-[10px] font-bold text-white">SKIP</button>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          {[
            { l: "Today", v: "Rs 3,450" },
            { l: "Trust", v: "97" },
            { l: "Jobs", v: "12" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg bg-white/5 p-2">
              <div className="text-[9px] uppercase text-[var(--text-muted)]">{s.l}</div>
              <div className="font-mono text-xs text-[var(--primary-lite)]">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function DemoSection() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % screens.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="demo" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Live Demo"
          title={
            <>
              See It <span className="text-gradient-teal">In Action</span>
            </>
          }
          subtitle="Four screens. Real product. Already demoed to national judges."
        />

        <Reveal>
          <div className="relative mx-auto flex max-w-md flex-col items-center">
            {/* Phone frame */}
            <div className="relative w-[320px] rounded-[44px] border border-white/10 bg-[var(--bg-card)] p-3 shadow-[0_0_60px_rgba(20,255,236,0.15)]">
              <div className="absolute left-1/2 top-3 h-5 w-28 -translate-x-1/2 rounded-full bg-black" />
              <div className="relative h-[560px] overflow-hidden rounded-[34px] bg-[var(--bg-deep)] p-4 pt-10">
                <motion.div
                  key={i}
                  initial={{ opacity: 0, rotateY: -90 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-lite)]">
                      Karigar AI
                    </div>
                    <div className="text-[10px] font-bold text-white/60">{screens[i].title}</div>
                  </div>
                  {screens[i].body}
                </motion.div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-6 flex items-center gap-3">
              <button
                onClick={() => setI((v) => (v - 1 + screens.length) % screens.length)}
                className="rounded-full border border-white/10 p-2 transition hover:border-[var(--primary-lite)]/50"
                aria-label="Previous screen"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-1.5">
                {screens.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setI(idx)}
                    className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-[var(--primary-lite)]" : "w-1.5 bg-white/20"}`}
                    aria-label={`Go to screen ${idx + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={() => setI((v) => (v + 1) % screens.length)}
                className="rounded-full border border-white/10 p-2 transition hover:border-[var(--primary-lite)]/50"
                aria-label="Next screen"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a href="#contact" className="rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-black uppercase tracking-wider text-white glow-teal hover:bg-[var(--primary-dark)]">
                Download for Android
              </a>
              <span className="rounded-xl border border-white/15 px-5 py-2.5 text-sm font-bold text-white/60">
                iOS · Q4 2026
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 6 — Features bento
============================================================ */
export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Differentiators"
          title={<>5 Things <span className="text-gradient-teal">No Competitor Has</span></>}
          subtitle="Not features. Moats."
        />

        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[220px]">
          {/* Card 1 — full width */}
          <Reveal className="md:col-span-3">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border-glow)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-deep)] to-[var(--bg-card)] p-8 transition hover:border-[var(--primary-lite)]/40">
              <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 shimmer-bg" />
              <div className="relative">
                <div className="flex items-center gap-3">
                  <Globe2 className="h-6 w-6 text-[var(--primary-lite)]" />
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-lite)]">
                    Differentiator #1
                  </div>
                </div>
                <h3 className="mt-3 font-display text-3xl font-black md:text-4xl">
                  Multilingual <span className="text-gradient-teal">Agentic AI</span>
                </h3>
                <p className="mt-3 max-w-2xl text-[var(--text-sub)]">
                  Urdu. Roman Urdu. English. Voice or text. NLU confidence tested at 100% on natural Pakistani language.
                </p>
              </div>
              <div className="relative mt-4 flex flex-wrap gap-2">
                {["اردو", "Roman Urdu", "English", "Voice", "Text", "100% NLU"].map((t) => (
                  <span key={t} className="rounded-lg border border-[var(--primary-lite)]/20 bg-[var(--primary)]/10 px-3 py-1 text-xs font-bold text-[var(--primary-lite)]">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Card 2 */}
          <Reveal delay={0.05} className="md:col-span-2">
            <div className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border border-[var(--border-glow)] bg-[var(--bg-card)]/60 p-8 transition hover:border-[var(--primary-lite)]/40">
              <div>
                <Zap className="h-6 w-6 text-[var(--gold)]" />
                <h3 className="mt-3 font-display text-2xl font-black">Live AI Price Negotiation</h3>
                <p className="mt-2 text-sm text-[var(--text-sub)]">
                  Gemini 2.5 Pro mediates in real time. Transparent fairness breakdown.
                </p>
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-[var(--bg-deep)]/60 p-3">
                <span className="font-mono text-sm text-white/40 line-through">Rs 800</span>
                <ArrowRight className="h-4 w-4 text-[var(--primary-lite)]" />
                <span className="font-mono text-xl font-black text-gradient-teal">Rs 650</span>
                <span className="ml-auto rounded-md bg-[var(--success)]/20 px-2 py-0.5 text-[10px] font-black uppercase text-[var(--success)]">
                  Fair · 91%
                </span>
              </div>
            </div>
          </Reveal>

          {/* Card 3 */}
          <Reveal delay={0.1}>
            <div className="group flex h-full flex-col justify-between rounded-3xl border border-[var(--border-glow)] bg-[var(--bg-card)]/60 p-6 transition hover:border-[var(--primary-lite)]/40">
              <div>
                <Wrench className="h-6 w-6 text-[var(--primary-lite)]" />
                <h3 className="mt-3 font-display text-xl font-black">10-Second Auto Recovery</h3>
                <p className="mt-2 text-xs text-[var(--text-sub)]">
                  Provider cancels? New one found & confirmed automatically. Rs 50 credit.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="font-mono text-[var(--primary-lite)]">10 → 9 → 8 → ✓</span>
                <span className="text-[var(--success)]">RECOVERED</span>
              </div>
            </div>
          </Reveal>

          {/* Card 4 */}
          <Reveal delay={0.15}>
            <div className="group flex h-full flex-col justify-between rounded-3xl border border-[var(--border-glow)] bg-[var(--bg-card)]/60 p-6 transition hover:border-[var(--primary-lite)]/40">
              <ShieldCheck className="h-6 w-6 text-purple-400" />
              <div>
                <h3 className="mt-3 font-display text-xl font-black">Bilateral Dispute AI</h3>
                <p className="mt-2 text-xs text-[var(--text-sub)]">AI reviews BOTH sides. Not one-sided. Not manual.</p>
              </div>
            </div>
          </Reveal>

          {/* Card 5 */}
          <Reveal delay={0.2} className="md:col-span-2">
            <div className="group flex h-full flex-col justify-between rounded-3xl border border-[var(--border-glow)] bg-gradient-to-tr from-[var(--bg-card)] to-[var(--primary-dark)]/20 p-8 transition hover:border-[var(--gold)]/40">
              <div className="flex items-center gap-3">
                <Trophy className="h-6 w-6 text-[var(--gold)]" />
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)]">Differentiator #5</div>
              </div>
              <div>
                <h3 className="font-display text-2xl font-black">Provider-First Design</h3>
                <p className="mt-2 text-sm text-[var(--text-sub)]">
                  First digital identity. Trust score. Earnings dashboard. Scheduling agent. Karigars are the heroes.
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[
                  { l: "Identity", v: "✓" },
                  { l: "Trust", v: "97" },
                  { l: "Income", v: "Rs 84k" },
                  { l: "Agent", v: "🤖" },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-white/5 p-2">
                    <div className="text-[9px] uppercase text-[var(--text-muted)]">{s.l}</div>
                    <div className="font-mono text-sm text-[var(--primary-lite)]">{s.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 7 — Social proof
============================================================ */
export function TractionSection() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Validation"
          title={<>Backed by <span className="text-gradient-gold">Google, Telenor</span> & Pakistan's Top Tech Community</>}
        />

        <div className="grid gap-4 md:grid-cols-4">
          {[
            { i: <Trophy className="text-[var(--gold)]" />, v: "4th", l: "Nationally · AISeekho 2026" },
            { i: <Star className="text-[var(--gold)] fill-[var(--gold)]" />, v: "2nd", l: "Karachi Regional Finals" },
            { i: <Users className="text-[var(--primary-lite)]" />, v: "7,000+", l: "Competitors Eliminated" },
            { i: <Rocket className="text-[var(--primary-lite)]" />, v: "3 wks", l: "Built Solo · Google ADK" },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <div className="glass-card flex h-full flex-col items-start gap-3 p-6 transition hover:-translate-y-1">
                <div className="rounded-xl bg-white/5 p-2">{s.i}</div>
                <div className="font-display text-3xl font-black">{s.v}</div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-sub)]">{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 grid grid-cols-2 gap-4 rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-card)]/40 p-8 md:grid-cols-5">
            {["Google for Developers", "Telenor Pakistan", "InnoVista", "MoIT&T", "NIC Karachi"].map((p) => (
              <div key={p} className="text-center font-display text-sm font-bold uppercase tracking-wider text-white/60">
                {p}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <blockquote className="mx-auto mt-12 max-w-3xl text-center">
            <div className="font-display text-2xl font-bold leading-tight md:text-3xl">
              <span className="text-[var(--primary-lite)]">"</span>
              Demonstrated live to national judges — working product, live agents, live demo.
              <span className="text-[var(--primary-lite)]">"</span>
            </div>
            <div className="mt-4 text-sm font-bold uppercase tracking-wider text-[var(--text-muted)]">
              — AISeekho 2026 National Finals · Islamabad
            </div>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 8 — Market
============================================================ */
export function MarketSection() {
  const tiers = [
    { label: "TAM", value: "Rs 2.4T", desc: "All informal services in Pakistan — 15 categories", size: 220, color: "var(--primary-lite)" },
    { label: "SAM", value: "Rs 480B", desc: "Urban Pakistan with smartphones — 40M adults", size: 170, color: "var(--primary)" },
    { label: "SOM", value: "Rs 96M", desc: "Karachi pilot · Year 1 · 10k bookings/mo", size: 120, color: "var(--gold)" },
  ];
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Market Size"
          title={<>The Market. The Opportunity. <span className="text-gradient-teal">The Timing.</span></>}
        />

        <div className="flex flex-col items-center justify-center gap-6 md:flex-row md:gap-12">
          {tiers.map((t, i) => (
            <Reveal key={t.label} delay={i * 0.12}>
              <div className="flex flex-col items-center gap-4 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, delay: i * 0.12 }}
                  className="flex items-center justify-center rounded-full font-display font-black"
                  style={{
                    width: t.size,
                    height: t.size,
                    background: `radial-gradient(circle, ${t.color}33, transparent 70%)`,
                    border: `2px solid ${t.color}`,
                    boxShadow: `0 0 60px ${t.color}33`,
                  }}
                >
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: t.color }}>{t.label}</div>
                    <div className="text-2xl md:text-3xl">{t.value}</div>
                  </div>
                </motion.div>
                <p className="max-w-[200px] text-xs text-[var(--text-sub)]">{t.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Revenue ramp */}
        <Reveal delay={0.3}>
          <div className="glass-card mx-auto mt-16 max-w-4xl p-8">
            <div className="mb-6 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[var(--primary-lite)]">
              Revenue Projection
            </div>
            <div className="flex items-end justify-around gap-4">
              {[
                { l: "Beta", v: "Rs 0", h: 20 },
                { l: "Launch", v: "Rs 1.2M", h: 35 },
                { l: "Growth", v: "Rs 14M", h: 70 },
                { l: "Scale", v: "Rs 86M", h: 100 },
              ].map((b, i) => (
                <div key={b.l} className="flex flex-1 flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: `${b.h * 1.8}px` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                    className="w-full rounded-t-lg bg-gradient-to-t from-[var(--primary-dark)] to-[var(--primary-lite)]"
                    style={{ boxShadow: "0 0 20px rgba(20,255,236,0.3)" }}
                  />
                  <div className="font-mono text-xs text-[var(--primary-lite)]">{b.v}</div>
                  <div className="text-[10px] font-bold uppercase text-[var(--text-muted)]">{b.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 9 — Pricing
============================================================ */
export function PricingSection() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="Pricing"
          title={<>Zero Cost to Customers. <span className="text-gradient-gold">Fair Pay for Karigars.</span></>}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--primary-lite)]/30 bg-gradient-to-br from-[var(--bg-card)] to-[var(--primary-dark)]/20 p-8 transition hover:border-[var(--primary-lite)]/60 hover:-translate-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-lite)]">For Customers</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-6xl font-black text-gradient-teal">Rs 0</span>
                <span className="text-sm text-[var(--text-sub)]">/forever</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Free discovery, negotiation & booking",
                  "Push notifications + live tracking",
                  "Dispute protection + money-back guarantee",
                  "Voice in Urdu / Roman / English",
                  "10-second auto-recovery on cancellations",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary-lite)]" />
                    <span className="text-[var(--text-sub)]">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="mt-8 block w-full rounded-xl bg-[var(--primary)] py-3 text-center text-sm font-black uppercase tracking-wider text-white glow-teal hover:bg-[var(--primary-dark)]">
                Download Free App →
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-[var(--gold)]/30 bg-gradient-to-br from-[var(--bg-card)] to-[var(--gold)]/10 p-8 transition hover:border-[var(--gold)]/60 hover:-translate-y-1">
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)]">For Providers</div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-6xl font-black text-gradient-gold">Rs 999</span>
                <span className="text-sm text-[var(--text-sub)]">/month</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm">
                {[
                  "Verified badge + priority ranking",
                  "18% commission on completed bookings only",
                  "Trust score analytics + reputation engine",
                  "Earnings dashboard + payout forecasts",
                  "AI Scheduling Agent — auto slot optimization",
                ].map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--gold)]" />
                    <span className="text-[var(--text-sub)]">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="mt-8 block w-full rounded-xl bg-[var(--gold)] py-3 text-center text-sm font-black uppercase tracking-wider text-[var(--bg-deep)] glow-gold hover:brightness-110">
                Join as Provider →
              </a>
            </div>
          </Reveal>
        </div>

        {/* Unit econ */}
        <Reveal delay={0.2}>
          <div className="glass-card mx-auto mt-12 max-w-3xl p-6">
            <div className="mb-4 text-center text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
              Unit Economics · Per Booking
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="font-display text-2xl font-black text-white">Rs 144</div>
                <div className="text-xs text-[var(--text-sub)]">Revenue</div>
              </div>
              <div>
                <div className="font-display text-2xl font-black text-[var(--danger)]">Rs 8</div>
                <div className="text-xs text-[var(--text-sub)]">AI cost</div>
              </div>
              <div>
                <div className="font-display text-2xl font-black text-[var(--success)]">94%</div>
                <div className="text-xs text-[var(--text-sub)]">Gross margin</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 10 — Investors
============================================================ */
export function InvestorsSection() {
  const splits = [
    { l: "Provider Onboarding", v: 40, c: "#0D7377" },
    { l: "Infrastructure & APIs", v: 25, c: "#14FFEC" },
    { l: "Marketing", v: 20, c: "#F39C12" },
    { l: "Legal", v: 10, c: "#9b59b6" },
    { l: "Working Capital", v: 5, c: "#7f8c8d" },
  ];
  let acc = 0;
  return (
    <section id="investors" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,197,66,0.06),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="For Investors"
          title={<>We Are <span className="text-gradient-gold">Raising</span></>}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="glass-card p-10 text-center">
              <div className="text-[10px] font-black uppercase tracking-widest text-[var(--gold)]">Seed Round</div>
              <div className="mt-3 font-display text-6xl font-black text-gradient-gold md:text-7xl">Rs 50 Lakh</div>
              <div className="mt-2 text-sm text-[var(--text-sub)]">~ $18,000 USD · 10–15% Equity</div>

              {/* Donut */}
              <div className="mt-8 flex flex-col items-center gap-6 md:flex-row md:justify-around">
                <svg viewBox="0 0 100 100" className="h-48 w-48 -rotate-90">
                  {splits.map((s) => {
                    const start = acc;
                    acc += s.v;
                    const r = 40;
                    const c = 2 * Math.PI * r;
                    const off = (start / 100) * c;
                    const len = (s.v / 100) * c;
                    return (
                      <circle
                        key={s.l}
                        cx="50"
                        cy="50"
                        r={r}
                        fill="none"
                        stroke={s.c}
                        strokeWidth="14"
                        strokeDasharray={`${len} ${c - len}`}
                        strokeDashoffset={-off}
                      />
                    );
                  })}
                </svg>
                <div className="space-y-2 text-left">
                  {splits.map((s) => (
                    <div key={s.l} className="flex items-center gap-2 text-xs">
                      <div className="h-3 w-3 rounded-sm" style={{ background: s.c }} />
                      <span className="font-bold text-white">{s.v}%</span>
                      <span className="text-[var(--text-sub)]">{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="space-y-6">
              <div className="glass-card p-6">
                <div className="mb-4 text-[10px] font-black uppercase tracking-widest text-[var(--primary-lite)]">12-Month Milestones</div>
                <ol className="relative space-y-4 border-l border-[var(--border-glow)] pl-6">
                  {[
                    ["M3", "100 verified providers live in Karachi"],
                    ["M6", "500 real bookings · first revenue"],
                    ["M9", "JazzCash + EasyPaisa integration live"],
                    ["M12", "Play Store launch · Series A ready"],
                  ].map(([m, t]) => (
                    <li key={m} className="relative">
                      <span className="absolute -left-[33px] flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-black text-white">
                        {m}
                      </span>
                      <span className="text-sm text-white">{t}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="glass-card overflow-hidden p-0">
                <div className="border-b border-[var(--border-glow)] px-6 py-3 text-[10px] font-black uppercase tracking-widest text-[var(--gold)]">
                  Projected P&L
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] uppercase text-[var(--text-muted)]">
                      <th className="px-6 py-2 text-left font-bold">Phase</th>
                      <th className="px-2 py-2 text-right font-bold">GMV</th>
                      <th className="px-6 py-2 text-right font-bold">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Beta", "Rs 0", "Rs 0", "danger"],
                      ["Launch", "Rs 12M", "Rs 1.2M", "warning"],
                      ["Growth", "Rs 140M", "Rs 14M", "primary"],
                      ["Scale", "Rs 860M", "Rs 86M", "success"],
                    ].map(([p, g, r, c]) => (
                      <tr key={p as string} className="border-t border-white/5">
                        <td className="px-6 py-3 font-bold">{p}</td>
                        <td className="px-2 py-3 text-right font-mono">{g}</td>
                        <td className="px-6 py-3 text-right font-mono" style={{ color: `var(--${c})` }}>{r}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <a
                href="mailto:maheentouqeer76@gmail.com?subject=Karigar%20AI%20Investor%20Deck%20Request"
                className="block w-full rounded-2xl bg-[var(--gold)] py-4 text-center font-black uppercase tracking-wider text-[var(--bg-deep)] glow-gold transition hover:scale-[1.02]"
              >
                Request Investor Deck →
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 11 — Founder / About
============================================================ */
export function FounderSection() {
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <SectionHeading
          eyebrow="The Founder"
          title={<>Built by One Person. <span className="text-gradient-teal">Solving for 21 Million.</span></>}
        />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <div className="glass-card p-8 text-center">
              <div className="relative mx-auto h-40 w-40">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-lite)] blur-lg opacity-40" />
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary-dark)] to-[var(--primary)] font-display text-5xl font-black text-white ring-2 ring-[var(--primary-lite)]/40">
                  MT
                </div>
              </div>
              <h3 className="mt-6 font-display text-2xl font-black">Maheen Touqeer</h3>
              <div className="text-sm text-[var(--text-sub)]">Founder & CEO</div>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["BS AI", "DUET Karachi", "2nd Year", "Solo Developer"].map((b) => (
                  <span key={b} className="rounded-full border border-[var(--border-glow)] bg-[var(--primary)]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--primary-lite)]">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div>
              <p className="text-lg leading-relaxed text-[var(--text-sub)]">
                <span className="text-white">Karigar AI was built solo in 3 weeks</span> using Google Antigravity.
                Not because it was easy — because Pakistan's 21 million informal workers deserved a solution,
                and waiting wasn't an option.
              </p>

              <div className="mt-6 space-y-2">
                {[
                  "4th Nationally — AISeekho 2026 (7,000+ participants)",
                  "2nd Place — Karachi Regional Finals",
                  "14 Google ADK agents built and deployed",
                  "NIC Karachi Cohort 16 applicant",
                  "Real-time A2A protocol implemented as a 2nd-year student",
                ].map((a) => (
                  <div key={a} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success)]" />
                    <span className="text-sm text-[var(--text-sub)]">{a}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { t: "Co-Founder · Operations", d: "Karachi-based. Equity + salary. Build the supply side." },
                  { t: "Senior Developer", d: "React Native / Python. Help us scale to 10k bookings/month." },
                ].map((j) => (
                  <div key={j.t} className="group rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-card)]/50 p-5 transition hover:border-[var(--gold)]/40">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[var(--gold)]">We're Hiring</div>
                    <div className="mt-1 font-display text-base font-bold">{j.t}</div>
                    <div className="mt-1 text-xs text-[var(--text-sub)]">{j.d}</div>
                    <a href="#contact" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--primary-lite)]">
                      Apply <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   SECTION 12 — Contact
============================================================ */
export function ContactSection() {
  const [sent, setSent] = useState(false);
  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-96 bg-[radial-gradient(ellipse_at_bottom,rgba(13,115,119,0.4),transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl font-black leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            Pakistan ka Karigar.
            <br />
            <span className="text-gradient-teal">Aapka Karigar.</span>
          </motion.h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-[var(--text-sub)]">
            Ready to transform home services in Pakistan? Let's talk.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-4">
              {[
                { i: Mail, l: "Email", v: "maheentouqeer76@gmail.com", h: "mailto:maheentouqeer76@gmail.com" },
                { i: Phone, l: "Phone", v: "+92 315 8959200", h: "tel:+923158959200" },
                { i: Linkedin, l: "LinkedIn", v: "linkedin.com/in/maheen-touqeer-3b5b03289", h: "https://linkedin.com/in/maheen-touqeer-3b5b03289" },
                { i: MapPin, l: "Based in", v: "Karachi, Pakistan 🇵🇰", h: "#" },
              ].map(({ i: Icon, l, v, h }) => (
                <a key={l} href={h} className="group flex items-center gap-4 rounded-2xl border border-[var(--border-glow)] bg-[var(--bg-card)]/50 p-5 transition hover:-translate-y-0.5 hover:border-[var(--primary-lite)]/40">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/20 text-[var(--primary-lite)] ring-1 ring-[var(--primary-lite)]/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">{l}</div>
                    <div className="truncate text-sm font-bold text-white">{v}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={(e) => { e.preventDefault(); setSent(true); }}
              className="glass-card space-y-4 p-8"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  required
                  placeholder="Your name"
                  className="rounded-xl border border-[var(--border-glow)] bg-[var(--bg-deep)]/60 px-4 py-3 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--primary-lite)]/60 focus:outline-none"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="rounded-xl border border-[var(--border-glow)] bg-[var(--bg-deep)]/60 px-4 py-3 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--primary-lite)]/60 focus:outline-none"
                />
              </div>
              <select
                className="w-full rounded-xl border border-[var(--border-glow)] bg-[var(--bg-deep)]/60 px-4 py-3 text-sm text-white focus:border-[var(--primary-lite)]/60 focus:outline-none"
              >
                <option>Investor inquiry</option>
                <option>Partnership</option>
                <option>Media / Press</option>
                <option>Join the team</option>
                <option>General</option>
              </select>
              <textarea
                required
                placeholder="Your message..."
                rows={5}
                className="w-full rounded-xl border border-[var(--border-glow)] bg-[var(--bg-deep)]/60 px-4 py-3 text-sm placeholder:text-[var(--text-muted)] focus:border-[var(--primary-lite)]/60 focus:outline-none"
              />
              <button
                type="submit"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] py-3.5 text-sm font-black uppercase tracking-wider text-white glow-teal transition hover:bg-[var(--primary-dark)]"
              >
                {sent ? (
                  <>✓ Message Sent</>
                ) : (
                  <>Send Message <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" /></>
                )}
              </button>

              <div className="border-t border-[var(--border-glow)] pt-4">
                <div className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-lite)]">Newsletter</div>
                <p className="mt-1 text-xs text-[var(--text-sub)]">Stay updated on Karigar AI's launch.</p>
                <div className="mt-3 flex gap-2">
                  <input placeholder="you@email.com" className="flex-1 rounded-lg border border-[var(--border-glow)] bg-[var(--bg-deep)]/60 px-3 py-2 text-xs focus:border-[var(--primary-lite)]/60 focus:outline-none" />
                  <button type="button" className="rounded-lg bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white/15">Subscribe</button>
                </div>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
