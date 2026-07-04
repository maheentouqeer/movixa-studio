import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Sparkles, Film, Building2, Package, PenTool, Cpu, Store, Car, Shirt, Heart, GraduationCap, Rocket, ChefHat, Home as HomeIcon, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { MagneticButton } from "@/components/site/MagneticButton";
import { Particles } from "@/components/site/Particles";
import { TiltCard } from "@/components/site/TiltCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Hero3D = lazy(() => import("@/components/site/Hero3D").then(m => ({ default: m.Hero3D })));

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Movixa — Cinematic AI Creative Studio" },
      { name: "description", content: "AI commercials, CGI product ads, architectural transformations, logo animations, and cinematic AI films. Built for brands that refuse the ordinary." },
      { property: "og:title", content: "Movixa — Cinematic AI Creative Studio" },
      { property: "og:description", content: "AI commercials, CGI product ads, and cinematic films for world-class brands." },
    ],
  }),
});

function Home() {
  return (
    <>
      <LoadingCurtain />
      <Hero />
      <Marquee />
      <Portfolio />
      <Services />
      <Industries />
      <Process />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
}

function LoadingCurtain() {
  const [gone, setGone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1400);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          exit={{ y: "-100%", transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="text-display text-6xl md:text-8xl gradient-text"
            >
              movixa
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "120px" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="mx-auto mt-6 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)] to-transparent"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.72_0.19_45)]/20 blur-[120px] animate-float" />
      <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.68_0.22_25)]/20 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />
      <Particles count={40} />

      <motion.div style={{ y, opacity }} className="relative mx-auto max-w-7xl px-6 pt-40 pb-24 md:pt-48 md:pb-32 grid md:grid-cols-2 gap-12 items-center min-h-screen">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs text-muted-foreground"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inset-0 rounded-full bg-[oklch(0.78_0.17_55)] animate-ping" />
              <span className="relative rounded-full bg-[oklch(0.78_0.17_55)] h-1.5 w-1.5" />
            </span>
            Cinematic AI Creative Studio
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            We create<br />
            <span className="gradient-text animate-gradient">cinematic AI</span><br />
            experiences.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed"
          >
            AI commercials, CGI product ads, architectural transformations, logo animations, and cinematic films — crafted with obsessive detail for brands that refuse the ordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <MagneticButton href="/contact">Start your project <ArrowRight className="h-4 w-4" /></MagneticButton>
            <MagneticButton href="#work" variant="ghost"><Play className="h-4 w-4" /> View portfolio</MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.6 }}
            className="mt-14 flex items-center gap-8 text-xs text-muted-foreground"
          >
            <div><div className="text-2xl text-foreground text-display">120+</div>Projects delivered</div>
            <div className="h-8 w-px bg-border" />
            <div><div className="text-2xl text-foreground text-display">40+</div>Global brands</div>
            <div className="h-8 w-px bg-border" />
            <div><div className="text-2xl text-foreground text-display">4.9</div>Client rating</div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1.8 }}
          className="relative h-[400px] md:h-[560px]"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <Suspense fallback={<div className="h-full w-full bg-gradient-to-br from-[oklch(0.72_0.19_45)]/30 to-[oklch(0.68_0.22_25)]/30 rounded-3xl" />}>
              <Hero3D />
            </Suspense>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

const MARQUEE = ["Cinematic", "AI Commercials", "CGI", "Product Ads", "Architectural", "Logo Motion", "Miniatures", "AI Films"];

function Marquee() {
  return (
    <section className="relative py-12 border-y border-border overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex gap-16 whitespace-nowrap text-display text-4xl md:text-6xl text-muted-foreground/40"
      >
        {[...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
          <span key={i} className="flex items-center gap-16">
            {w}
            <span className="text-[oklch(0.78_0.17_55)]">✦</span>
          </span>
        ))}
      </motion.div>
    </section>
  );
}

const PROJECTS = [
  { title: "Aether Perfume", category: "CGI Product Ads", gradient: "from-amber-500/40 to-rose-500/40" },
  { title: "Meridian Tower", category: "Architectural Transformation", gradient: "from-slate-400/40 to-indigo-500/40" },
  { title: "Halo Motors EV", category: "AI Commercials", gradient: "from-orange-500/40 to-red-500/40" },
  { title: "Nordic Bakery", category: "Cinematic AI Films", gradient: "from-yellow-500/40 to-orange-500/40" },
  { title: "Volt Logo Reveal", category: "Logo Animations", gradient: "from-cyan-500/40 to-blue-500/40" },
  { title: "Micro Worlds Vol. 3", category: "Miniature AI Videos", gradient: "from-emerald-500/40 to-teal-500/40" },
];

function Portfolio() {
  return (
    <section id="work" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Featured Work</SectionLabel>
        <SectionHeading>Selected scenes from<br />the last year.</SectionHeading>

        <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard>
                <div className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-70 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="absolute inset-0 grid-bg opacity-30" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"
                  />
                  <div className="absolute top-6 left-6">
                    <span className="rounded-full glass px-3 py-1 text-xs">{p.category}</span>
                  </div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-end justify-between">
                      <h3 className="text-display text-3xl">{p.title}</h3>
                      <motion.div className="rounded-full bg-foreground text-background p-3 opacity-0 group-hover:opacity-100 transition" whileHover={{ rotate: 45 }}>
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="rounded-full bg-background/80 backdrop-blur p-5">
                      <Play className="h-6 w-6 fill-foreground" />
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SERVICES_LIST = [
  { icon: Film, title: "AI Commercials", desc: "Broadcast-grade spots powered by generative pipelines." },
  { icon: Package, title: "Product Advertising", desc: "Hero product frames indistinguishable from real photography." },
  { icon: Sparkles, title: "CGI Transformations", desc: "Turn a photograph into a full cinematic sequence." },
  { icon: Home, title: "Real Estate Visualization", desc: "Buildings, interiors, and lifestyles brought to life." },
  { icon: PenTool, title: "Logo Animation", desc: "Signature reveals engineered around your brand DNA." },
  { icon: Play, title: "AI Short Films", desc: "Story-first cinematic worlds from concept to color." },
  { icon: Rocket, title: "Social Media Ads", desc: "Scroll-stopping vertical assets tuned per platform." },
  { icon: Cpu, title: "Custom AI Projects", desc: "Bespoke pipelines for brands with unusual ambitions." },
];

function Services() {
  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Capabilities</SectionLabel>
        <SectionHeading>Every service, engineered<br />like a film production.</SectionHeading>

        <div className="mt-20 grid gap-px bg-border rounded-3xl overflow-hidden md:grid-cols-2 lg:grid-cols-4">
          {SERVICES_LIST.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="group relative bg-background p-8 hover:bg-card transition-colors duration-500"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <s.icon className="h-6 w-6 text-[oklch(0.78_0.17_55)]" />
              <h3 className="mt-6 text-display text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <ArrowRight className="mt-6 h-4 w-4 text-muted-foreground group-hover:translate-x-1 group-hover:text-foreground transition" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const INDUSTRIES = [
  { icon: Building2, label: "Construction" }, { icon: Home, label: "Real Estate" },
  { icon: ChefHat, label: "Restaurants" }, { icon: Sparkles, label: "Luxury Brands" },
  { icon: Car, label: "Automotive" }, { icon: Shirt, label: "Fashion" },
  { icon: Heart, label: "Healthcare" }, { icon: GraduationCap, label: "Education" },
  { icon: Cpu, label: "Technology" }, { icon: Rocket, label: "Startups" },
  { icon: Store, label: "Retail" }, { icon: Film, label: "Entertainment" },
];

function Industries() {
  return (
    <section className="relative py-32 border-y border-border">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionLabel>Industries</SectionLabel>
        <SectionHeading>Trusted by teams<br />across every sector.</SectionHeading>

        <div className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {INDUSTRIES.map((ind, i) => (
            <motion.div
              key={ind.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-[oklch(0.78_0.17_55)]/40 transition"
            >
              <ind.icon className="h-6 w-6 text-[oklch(0.78_0.17_55)]" />
              <span className="text-sm">{ind.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Discovery", desc: "We unpack the story, audience, and constraints." },
  { n: "02", title: "Concept", desc: "Moodboards, direction, and treatment locked before render." },
  { n: "03", title: "Production", desc: "Generative pipelines, CGI polish, sound design in parallel." },
  { n: "04", title: "Review", desc: "Frame-accurate revisions with a single point of contact." },
  { n: "05", title: "Delivery", desc: "Master files, cutdowns, and platform-tuned exports shipped." },
];

function Process() {
  return (
    <section id="process" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Our Process</SectionLabel>
        <SectionHeading>Five acts. One<br />unforgettable delivery.</SectionHeading>

        <div className="mt-20 relative">
          <div className="absolute left-6 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-[oklch(0.78_0.17_55)]/40 to-transparent md:hidden" />
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)]/40 to-transparent" />
          <div className="grid gap-8 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative pl-16 md:pl-0"
              >
                <div className="absolute md:relative left-0 md:left-auto flex h-12 w-12 items-center justify-center rounded-full glass text-xs text-[oklch(0.78_0.17_55)] font-mono">
                  {s.n}
                </div>
                <h3 className="md:mt-6 text-display text-2xl">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const TESTIMONIALS = [
  { quote: "Movixa delivered a spot that felt like a $2M film for a fraction of the budget. Our launch broke every benchmark.", author: "Amelia Sato", role: "CMO, Halo Motors" },
  { quote: "The team turned three static renders into a cinematic 60-second story in under two weeks. Nothing short of magic.", author: "Ravi Menon", role: "Founder, Meridian Estates" },
  { quote: "We've worked with agencies in New York and London. Movixa is in another league — pixel-perfect and stress-free.", author: "Élise Laurent", role: "Creative Director, Aether Paris" },
];

function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Testimonials</SectionLabel>
        <SectionHeading>What our<br />clients say.</SectionHeading>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass rounded-3xl p-8"
            >
              <div className="text-[oklch(0.78_0.17_55)] text-4xl text-display leading-none">"</div>
              <p className="mt-2 text-lg leading-relaxed">{t.quote}</p>
              <footer className="mt-8 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[oklch(0.72_0.19_45)] to-[oklch(0.68_0.22_25)]" />
                <div>
                  <div className="text-sm">{t.author}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}

const FAQS = [
  { q: "How long does a typical project take?", a: "Most projects deliver in 2–4 weeks. Simple logo animations can be a week; larger commercials or films run 4–8 weeks depending on scope." },
  { q: "How is pricing structured?", a: "Every engagement is scoped individually based on runtime, complexity, deliverables, and usage rights. Expect a detailed quote within 24 hours of your brief." },
  { q: "How many revisions are included?", a: "Two structured revision rounds are included at concept and post-production. Additional rounds are billed transparently." },
  { q: "Who owns the final files?", a: "You do. Full commercial ownership of the final deliverables transfers on final payment, with clear usage rights defined upfront." },
  { q: "What do you deliver?", a: "Master files in your specified resolution, platform-tuned cutdowns, and (on request) editable project files for future updates." },
  { q: "Do you sign NDAs?", a: "Always. We work under mutual NDA by default for every client engagement." },
];

function FAQ() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionLabel>FAQ</SectionLabel>
        <SectionHeading>Answers, before<br />you ask.</SectionHeading>

        <Accordion type="single" collapsible className="mt-16">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-lg py-6 hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] glass p-12 md:p-20 text-center">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[600px] rounded-full bg-[oklch(0.72_0.19_45)]/30 blur-[100px]" />
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative">
            <SectionLabel>Ready when you are</SectionLabel>
            <h2 className="mt-6 text-display text-5xl md:text-7xl">
              Let's build<br />
              <span className="gradient-text">something legendary.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto">
              Tell us about your project. We reply within one business day with a clear next step.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <MagneticButton href="/contact">Start your project <ArrowRight className="h-4 w-4" /></MagneticButton>
              <div className="inline-flex items-center gap-2 text-xs text-muted-foreground ml-2">
                <Check className="h-3 w-3 text-[oklch(0.78_0.17_55)]" /> Reply within 24h
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
      <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" />
      {children}
    </motion.div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl"
    >
      {children}
    </motion.h2>
  );
}
