import { createFileRoute } from "@tanstack/react-router";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Play,
  Sparkles,
  Film,
  Building2,
  Cpu,
  Store,
  Car,
  Shirt,
  Heart,
  GraduationCap,
  Rocket,
  ChefHat,
  Home as HomeIcon,
  Check,
} from "lucide-react";
import { MagneticButton } from "@/components/site/MagneticButton";
import { Particles } from "@/components/site/Particles";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TrustSection } from "@/components/site/TrustSection";
import { Showreel } from "@/components/site/Showreel";
import { PillarSequence } from "@/components/site/PillarSequence";
import { useSectionMedia, SectionVideoFrame } from "@/components/site/SectionMedia";
import {
  ThreeWays,
  Capabilities,
  IdeaToFrame,
  DigitalExperiences,
  AIFilmSection,
  BrandVisualsSection,
  MovixaLab,
  WhyMovixa,
  FollowTheWork,
} from "@/components/site/sections";


const HERO_STATS = [
  { value: 3, suffix: "", label: "Creative disciplines" },
  { value: 24, suffix: "H", label: "Project response" },
  { value: 1, suffix: "", label: "Integrated studio" },
];

const ROTATING_PHRASES = ["Websites.", "AI Films.", "CGI Advertising.", "Brand Visuals."];

function CountUpNumber({
  value,
  suffix = "",
  className = "",
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, value, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [count, inView, value]);

  return (
    <span ref={ref} className={className}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

function RotatingPhrase() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % ROTATING_PHRASES.length);
    }, 1800);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span className="relative inline-block min-w-[8.5ch] overflow-hidden align-bottom text-[oklch(0.78_0.17_55)]">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_PHRASES[index]}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {ROTATING_PHRASES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Movixa — Cinematic AI Creative Studio" },
      {
        name: "description",
        content:
          "AI commercials, CGI product ads, architectural transformations, logo animations, and cinematic AI films. Built for brands that refuse the ordinary.",
      },
      { property: "og:title", content: "Movixa — Cinematic AI Creative Studio" },
      {
        property: "og:description",
        content: "AI commercials, CGI product ads, and cinematic films for world-class brands.",
      },
    ],
  }),
});

function Home() {
  return (
    <>
      <LoadingCurtain />
      <Hero />
      <Marquee />
      <PillarSequence />
      <ThreeWays />
      <Showreel />
      <FilmReel />
      <AIFilmSection />
      <FrameSequenceSection />
      <BrandVisualsSection />
      <DigitalExperiences />
      <IdeaToFrame />
      <Capabilities />
      <MovixaLab />
      <Industries />
      <TrustSection />
      <WhyMovixa />
      <Testimonials />
      <FAQ />
      <FollowTheWork />
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
    <section id="top" ref={ref} className="relative min-h-screen overflow-hidden grid-bg">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="pointer-events-none absolute right-[8%] top-[18%] h-40 w-40 rounded-full bg-[oklch(0.82_0.16_70)]/18 blur-2xl" />
      <div className="pointer-events-none absolute right-[20%] top-[20%] h-px w-72 rotate-[-18deg] bg-gradient-to-r from-transparent via-[oklch(0.82_0.16_70)]/60 to-transparent" />
      <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[oklch(0.72_0.19_45)]/20 blur-[120px] animate-float" />
      <div
        className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.68_0.22_25)]/20 blur-[120px] animate-float"
        style={{ animationDelay: "2s" }}
      />
      <Particles count={40} />

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto max-w-7xl px-6 pt-40 pb-24 md:pt-48 md:pb-32 grid md:grid-cols-2 gap-12 items-center min-h-screen"
      >
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
            MOVIXA / CREATIVE TECHNOLOGY STUDIO
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 text-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            WE CREATE
            <br />
            <span className="gradient-text animate-gradient">DIGITAL WORLDS.</span>
            <br />
            <RotatingPhrase />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            className="mt-8 max-w-lg text-lg text-muted-foreground leading-relaxed"
          >
            AI commercials, CGI product ads, architectural transformations, logo animations, and
            cinematic films — crafted with obsessive detail for brands that refuse the ordinary.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="mt-10 flex flex-wrap gap-3"
          >
            <MagneticButton href="/contact">
              START A PROJECT <ArrowRight className="h-4 w-4" />
            </MagneticButton>
            <MagneticButton href="#work" variant="ghost">
              <Play className="h-4 w-4" /> EXPLORE THE WORK
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.6 }}
            className="mt-14 flex items-center gap-8 text-xs text-muted-foreground"
          >
            {HERO_STATS.map((stat, index) => (
              <div key={stat.label} className="contents">
                {index > 0 && <div className="h-8 w-px bg-border" />}
                <div>
                  <CountUpNumber
                    value={stat.value}
                    suffix={stat.suffix}
                    className="block text-2xl text-foreground text-display tabular-nums"
                  />
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative h-[320px] md:h-[520px]"
        >
          <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,oklch(0.78_0.17_55_/_0.35),transparent_58%),linear-gradient(150deg,oklch(0.18_0.012_260),black)]" />
            <div className="absolute inset-0 grid-bg opacity-25" />
            <motion.div
              aria-hidden
              animate={{ y: [0, -18, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/15 bg-gradient-to-br from-white/15 to-transparent backdrop-blur-xl shadow-[0_40px_120px_-40px_oklch(0.78_0.17_55_/_0.8)] md:h-56 md:w-56"
            />
            <div className="pointer-events-none absolute inset-x-10 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-[oklch(0.86_0.12_70)]/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Movixa Studio
            </div>
          </div>
        </motion.div>

      </motion.div>
    </section>
  );
}

const MARQUEE = [
  "Websites",
  "Social Media Branding",
  "AI Ads",
  "CGI",
  "Product Ads",
  "Architectural",
  "Logo Motion",
  "Brand Visuals",
];


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

function FilmReel() {
  const { label, title, description, videoUrl } = useSectionMedia("film_reel", {
    label: "Film Reel",
    title: "Built to be watched.",
    description:
      "A cinematic reel of our latest AI ads, CGI product films and brand motion work.",
  });

  return (
    <section id="work" className="relative border-y border-border py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel>{label}</SectionLabel>
        <SectionHeading>{title}</SectionHeading>
        {description && (
          <p className="mt-6 max-w-xl text-muted-foreground">{description}</p>
        )}
        <div className="mt-12">
          <SectionVideoFrame src={videoUrl} />
        </div>
      </div>
    </section>
  );
}

function FrameSequenceSection() {
  const { label, title, description, videoUrl } = useSectionMedia("frame_sequence", {
    label: "Frame Sequence",
    title: "Scroll becomes direction.",
    description:
      "Every frame is directed — camera language, light and rhythm decided before a single render.",
  });

  return (
    <section className="relative py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 md:grid-cols-2">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mt-6 text-display text-4xl leading-[0.95] md:text-6xl">{title}</h2>
          {description && <p className="mt-6 text-muted-foreground">{description}</p>}
        </div>
        <SectionVideoFrame src={videoUrl} />
      </div>
    </section>
  );
}


const INDUSTRIES = [
  { icon: Building2, label: "Construction" },
  { icon: HomeIcon, label: "Real Estate" },
  { icon: ChefHat, label: "Restaurants" },
  { icon: Sparkles, label: "Luxury Brands" },
  { icon: Car, label: "Automotive" },
  { icon: Shirt, label: "Fashion" },
  { icon: Heart, label: "Healthcare" },
  { icon: GraduationCap, label: "Education" },
  { icon: Cpu, label: "Technology" },
  { icon: Rocket, label: "Startups" },
  { icon: Store, label: "Retail" },
  { icon: Film, label: "Entertainment" },
];

function Industries() {
  return (
    <section className="relative py-32 border-y border-border">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionLabel>Industries</SectionLabel>
        <SectionHeading>
          Trusted by teams
          <br />
          across every sector.
        </SectionHeading>

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
  {
    n: "03",
    title: "Production",
    desc: "Generative pipelines, CGI polish, sound design in parallel.",
  },
  { n: "04", title: "Review", desc: "Frame-accurate revisions with a single point of contact." },
  {
    n: "05",
    title: "Delivery",
    desc: "Master files, cutdowns, and platform-tuned exports shipped.",
  },
];

function Process() {
  return (
    <section id="process" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Our Process</SectionLabel>
        <SectionHeading>
          Five acts. One
          <br />
          unforgettable delivery.
        </SectionHeading>

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
  {
    quote:
      "Movixa transformed our product launch into something that looked far beyond our budget. Communication was excellent and every revision was handled quickly.",
    author: "Sarah Khan",
    role: "Founder",
    company: "SK Cosmetics",
  },
  {
    quote:
      "Our static product photos became cinematic advertisements that dramatically improved engagement on social media.",
    author: "Ahmed Raza",
    role: "Marketing Manager",
    company: "Nova Interiors",
  },
  {
    quote:
      "Fast delivery, creative ideas and incredibly realistic AI visuals. We'll definitely work together again.",
    author: "Daniel Brooks",
    role: "Creative Consultant",
    company: "Independent Brand",
  },
];

function Testimonials() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Testimonials</SectionLabel>
        <SectionHeading>
          What our
          <br />
          clients say.
        </SectionHeading>

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
                  <div className="text-xs text-muted-foreground">{t.company}</div>
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
  {
    q: "How long does a project take?",
    a: "Short-form videos under one minute typically take around 3-4 days depending on complexity, references and revision requirements. Larger productions or videos over one minute can take around a week or longer.",
  },
  {
    q: "What can Movixa create?",
    a: "We create cinematic AI commercials, CGI product advertisements, digital experiences, interactive websites, brand visuals, social campaigns and custom visual projects.",
  },
  {
    q: "Can you create a website for my brand?",
    a: "Yes. We design and develop premium websites ranging from editorial brand sites to interactive 3D and scroll-driven digital experiences.",
  },
  {
    q: "Can you create an advertisement for my product?",
    a: "Yes. Send us your product, references and objective. We can develop the concept, visual direction, AI/CGI production and final advertisement.",
  },
  {
    q: "How does the process work?",
    a: "Brief -> Concept -> Production -> Review -> Delivery.",
  },
  {
    q: "Can you work with an existing brand identity?",
    a: "Yes. We can work within an existing identity or develop a new visual direction.",
  },
  {
    q: "How do revisions work?",
    a: "Revision scope is agreed before production. We focus on structured feedback so each round moves the project closer to the intended result.",
  },
  {
    q: "Do you sign NDAs?",
    a: "Yes. NDA arrangements can be discussed when confidentiality is required.",
  },
];

function FAQ() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionLabel>FAQ</SectionLabel>
        <SectionHeading>
          Answers, before
          <br />
          you ask.
        </SectionHeading>

        <Accordion type="single" collapsible className="mt-16">
          {FAQS.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
              <AccordionTrigger className="text-left text-lg py-6 hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {f.a}
              </AccordionContent>
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
              Let's build
              <br />
              <span className="gradient-text">something unforgettable.</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg mx-auto">
              Tell us about your project. We'll reply within one business day with the next steps.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 justify-center">
              <MagneticButton href="/contact">
                Start your project <ArrowRight className="h-4 w-4" />
              </MagneticButton>
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
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground"
    >
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
