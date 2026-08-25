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
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Play,
  Sparkles,
  Film,
  Building2,
  Package,
  PenTool,
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
import { Link } from "@tanstack/react-router";
import { MagneticButton } from "@/components/site/MagneticButton";
import { Particles } from "@/components/site/Particles";
import { TiltCard } from "@/components/site/TiltCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BehindProcess } from "@/components/site/BehindProcess";
import { TechStack } from "@/components/site/TechStack";
import { TrustSection } from "@/components/site/TrustSection";
import { Showreel } from "@/components/site/Showreel";
import { PillarSequence } from "@/components/site/PillarSequence";
import { ScrollSequence } from "@/components/site/ScrollSequence";
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
import { supabase } from "@/integrations/supabase/client";

const Hero3D = lazy(() => import("@/components/site/Hero3D").then((m) => ({ default: m.Hero3D })));

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
      <Portfolio />
      <HorizontalShowcase />
      <AIFilmSection />
      <ScrollSequence
        label="Frame Sequence System"
        title="Scroll becomes direction."
        description="A reusable high-DPI canvas sequence is ready for Movixa video frames, with batched preloading, scrubbed playback, reduced-motion fallback and responsive contain rendering."
      />
      <BrandVisualsSection />
      <DigitalExperiences />
      <IdeaToFrame />

      <BehindProcess />
      <Capabilities />
      <TechStack />
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, delay: 1.8 }}
          className="relative h-[400px] md:h-[560px]"
        >
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <Suspense
              fallback={
                <div className="h-full w-full bg-gradient-to-br from-[oklch(0.72_0.19_45)]/30 to-[oklch(0.68_0.22_25)]/30 rounded-3xl" />
              }
            >
              <Hero3D />
            </Suspense>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

const MARQUEE = [
  "Cinematic",
  "AI Commercials",
  "CGI",
  "Product Ads",
  "Architectural",
  "Logo Motion",
  "Miniatures",
  "AI Films",
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

interface FeaturedVideo {
  id: string;
  title: string;
  description: string | null;
  category: string;
  storage_path: string;
  video_url: string;
  thumbnail_url: string | null;
}

const EDITORIAL_PROJECTS = [
  {
    title: "CGI Sneaker Launch",
    category: "CGI Product Ads",
    description: "A chrome-and-motion launch film built around product desire.",
  },
  {
    title: "Interactive Product Screen CGI",
    category: "Digital Experiences",
    description: "A tactile screen experience with product motion and depth.",
  },
  {
    title: "Miniature Construction World",
    category: "Miniature Worlds",
    description: "Architectural scale, tiny machines and cinematic worldbuilding.",
  },
  {
    title: "Premium Juice Commercial",
    category: "AI Commercial",
    description: "A polished product spot with liquid, light and freshness cues.",
  },
  {
    title: "Cinematic Embroidery Logo Reveal",
    category: "Logo Motion",
    description: "A brand mark revealed through texture, thread and camera rhythm.",
  },
  {
    title: "BMW M4 Cinematic Transformation",
    category: "Cinematic Films",
    description: "A transformation sequence built for speed, material and attitude.",
  },
];

const VIDEO_BUCKET = "videos";

async function resolveVideoAsset(path: string | null | undefined, fallback?: string | null) {
  if (!path) return fallback ?? null;

  const { data } = await supabase.storage.from(VIDEO_BUCKET).createSignedUrl(path, 60 * 60);
  if (data?.signedUrl) return data.signedUrl;

  const { data: publicUrl } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return publicUrl.publicUrl || fallback || null;
}

function Portfolio() {
  const [videos, setVideos] = useState<FeaturedVideo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("id,title,description,category,storage_path,video_url,thumbnail_url")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) {
        setLoadError(error.message);
        setVideos([]);
        setLoaded(true);
        return;
      }

      const rows = ((data as FeaturedVideo[]) ?? []).filter((video) => video.storage_path);
      const playableVideos = await Promise.all(
        rows.map(async (video) => {
          return {
            ...video,
            video_url:
              (await resolveVideoAsset(video.storage_path, video.video_url)) ?? video.video_url,
            thumbnail_url: video.thumbnail_url,
          };
        }),
      );

      setVideos(playableVideos);
      setLoaded(true);
    })();
  }, []);

  return (
    <section id="work" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Featured Work</SectionLabel>
        <SectionHeading>
          Selected scenes from
          <br />
          the best projects.
        </SectionHeading>

        {!loaded ? (
          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="aspect-[4/5] rounded-3xl glass animate-pulse" />
            ))}
          </div>
        ) : videos.length > 0 ? (
          <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, i) => (
              <FeaturedVideoCard key={video.id} video={video} index={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-20 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {EDITORIAL_PROJECTS.map((project, i) => (
                <EditorialProjectCard key={project.title} project={project} index={i} />
              ))}
            </div>
            {loadError && (
              <p className="mx-auto mt-8 max-w-xl text-center text-xs text-red-300">
                Database message: {loadError}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function EditorialProjectCard({
  project,
  index,
}: {
  project: (typeof EDITORIAL_PROJECTS)[number];
  index: number;
}) {
  return (
    <motion.a
      href="/contact"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 bg-black"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,oklch(0.78_0.17_55_/_0.28),transparent_38%),linear-gradient(150deg,oklch(0.18_0.012_260),oklch(0.08_0.012_260))]" />
      <motion.div
        aria-hidden
        animate={{ rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
        transition={{ duration: 9, repeat: Infinity, delay: index * 0.35, ease: "easeInOut" }}
        className="absolute left-1/2 top-[42%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border border-white/15 bg-white/10 shadow-[0_30px_90px_-30px_oklch(0.78_0.17_55_/_0.7)] backdrop-blur-xl"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
      <div className="absolute left-5 top-5 text-xs uppercase tracking-[0.22em] text-[oklch(0.86_0.12_70)]">
        {project.category}
      </div>
      <div className="absolute bottom-6 left-6 right-6">
        <h3 className="text-display text-3xl transition-transform duration-300 group-hover:-translate-y-2">
          {project.title}
        </h3>
        <p className="mt-3 text-sm text-muted-foreground">{project.description}</p>
        <span className="mt-5 inline-flex text-xs uppercase tracking-[0.22em] text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          View
        </span>
      </div>
    </motion.a>
  );
}

function HorizontalShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

  return (
    <section ref={ref} className="relative hidden h-[260vh] md:block">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden border-y border-border">
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="relative w-full">
          <div className="mx-auto mb-10 max-w-7xl px-6">
            <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">
              Film Reel
            </div>
            <h2 className="mt-4 text-display text-5xl">Built to be watched.</h2>
          </div>
          <motion.div style={{ x }} className="flex gap-6 px-[calc((100vw-80rem)/2+1.5rem)]">
            {EDITORIAL_PROJECTS.map((project) => (
              <motion.a
                href="/contact"
                key={project.title}
                className="group relative h-[58vh] w-[56vw] max-w-[760px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_35%,oklch(0.78_0.17_55_/_0.3),transparent_40%),linear-gradient(135deg,oklch(0.18_0.012_260),black)]" />
                <div className="absolute inset-0 grid-bg opacity-25 transition-opacity group-hover:opacity-45" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="text-xs uppercase tracking-[0.24em] text-[oklch(0.86_0.12_70)]">
                    {project.category}
                  </div>
                  <h3 className="mt-3 max-w-lg text-display text-5xl">{project.title}</h3>
                  <p className="mt-4 max-w-md text-sm text-muted-foreground">
                    {project.description}
                  </p>
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturedVideoCard({ video, index }: { video: FeaturedVideo; index: number }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const togglePlayback = () => {
    const player = ref.current;
    if (!player) return;
    if (player.paused) {
      player.play().catch(() => {});
      setPlaying(true);
    } else {
      player.pause();
      setPlaying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      <TiltCard>
        <div
          className="group relative aspect-[4/5] rounded-3xl overflow-hidden glass cursor-pointer"
          onClick={togglePlayback}
          onMouseEnter={() => {
            ref.current?.play().catch(() => {});
            setPlaying(true);
          }}
          onMouseLeave={() => {
            ref.current?.pause();
            setPlaying(false);
          }}
        >
          <video
            ref={ref}
            src={video.video_url}
            poster={video.thumbnail_url ?? undefined}
            muted
            loop
            playsInline
            preload="metadata"
            controls
            className="absolute inset-0 h-full w-full object-cover bg-black"
          />
          <div
            className={`pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-500 ${playing ? "opacity-35" : "opacity-70"}`}
          />
          <div className="pointer-events-none absolute top-6 left-6">
            <span className="rounded-full glass px-3 py-1 text-xs">{video.category}</span>
          </div>
          <div className="pointer-events-none absolute bottom-6 left-6 right-6">
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h3 className="text-display text-3xl">{video.title}</h3>
                {video.description && (
                  <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                    {video.description}
                  </p>
                )}
              </div>
              <div className="rounded-full bg-foreground text-background p-3 opacity-0 group-hover:opacity-100 transition">
                <Play className="h-4 w-4 fill-current" />
              </div>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

const SERVICES_LIST = [
  {
    icon: Film,
    title: "AI Commercials",
    desc: "Broadcast-grade spots powered by generative pipelines.",
  },
  {
    icon: Package,
    title: "Product Advertising",
    desc: "Hero product frames indistinguishable from real photography.",
  },
  {
    icon: Sparkles,
    title: "CGI Transformations",
    desc: "Turn a photograph into a full cinematic sequence.",
  },
  {
    icon: HomeIcon,
    title: "Real Estate Visualization",
    desc: "Buildings, interiors, and lifestyles brought to life.",
  },
  {
    icon: PenTool,
    title: "Logo Animation",
    desc: "Signature reveals engineered around your brand DNA.",
  },
  {
    icon: Play,
    title: "AI Short Films",
    desc: "Story-first cinematic worlds from concept to color.",
  },
  {
    icon: Rocket,
    title: "Social Media Ads",
    desc: "Scroll-stopping vertical assets tuned per platform.",
  },
  {
    icon: Cpu,
    title: "Custom AI Projects",
    desc: "Bespoke pipelines for brands with unusual ambitions.",
  },
];

function Services() {
  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Capabilities</SectionLabel>
        <SectionHeading>
          Every service, engineered
          <br />
          like a film production.
        </SectionHeading>

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
