import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { MagneticButton } from "@/components/site/MagneticButton";
import { useSectionMedia, SectionImageGrid, SectionVideoFrame } from "@/components/site/SectionMedia";


export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground"
    >
      <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" />
      {children}
    </motion.div>
  );
}

export function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl"
    >
      {children}
    </motion.h2>
  );
}

/* ============================ 01 THREE WAYS ============================ */

const PILLARS = [
  {
    n: "01",
    title: ["DIGITAL", "EXPERIENCES"],
    copy: "Websites and interactive experiences designed to make brands feel tangible.",
    items: [
      "Creative websites",
      "3D websites",
      "Interactive experiences",
      "Scroll-driven storytelling",
      "WebGL experiences",
      "Motion interfaces",
      "Product experiences",
    ],
  },
  {
    n: "02",
    title: ["AI ADS", "+ CGI"],
    copy: "Cinematic advertising built from AI, CGI, VFX and visual storytelling.",
    items: [
      "AI commercials",
      "CGI product advertising",
      "Product films",
      "Architectural transformations",
      "VFX",
      "Experimental advertising",
      "AI short films",
    ],
  },
  {
    n: "03",
    title: ["BRAND", "VISUALS"],
    copy: "Visual identities and content systems that make brands recognizable everywhere.",
    items: [
      "Brand identity",
      "Graphic design",
      "Social media creatives",
      "Carousel design",
      "Campaign visuals",
      "Logo animation",
      "Marketing assets",
    ],
  },
];

export function ThreeWays() {
  return (
    <section id="services" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Capabilities</SectionLabel>
        <SectionHeading>Three ways we build.</SectionHeading>
        <p className="mt-6 max-w-xl text-muted-foreground">
          From the interface to the frame to the identity.
        </p>

        <div className="mt-20 space-y-px bg-border">
          {PILLARS.map((p, i) => (
            <motion.article
              key={p.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="group relative grid gap-10 bg-background px-2 py-14 md:grid-cols-[1fr_1fr] md:px-8"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div>
                <span className="font-mono text-xs tracking-widest text-[oklch(0.78_0.17_55)]">
                  {p.n}
                </span>
                <h3 className="mt-5 text-display text-4xl leading-[0.95] md:text-6xl">
                  {p.title[0]}
                  <br />
                  {p.title[1]}
                </h3>
                <p className="mt-6 max-w-md text-muted-foreground">{p.copy}</p>
              </div>
              <ul className="grid content-start gap-y-3 self-center sm:grid-cols-2">
                {p.items.map((item) => (
                  <li
                    key={item}
                    className="border-b border-border/60 pb-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================ IDEA TO FRAME ============================ */

const STAGES = [
  { n: "01", title: "DISCOVER", desc: "We define the offer, audience, platform and business goal." },
  { n: "02", title: "DIRECT", desc: "Creative direction sets the visual language for website, video or brand." },
  { n: "03", title: "DESIGN", desc: "Interfaces, brand systems, storyboards and campaign frames take shape." },
  { n: "04", title: "BUILD", desc: "We produce the website, AI/CGI sequence, visuals and motion assets." },
  { n: "05", title: "REFINE", desc: "Every screen, frame and graphic is polished against the approved direction." },
  { n: "06", title: "LAUNCH", desc: "Final exports, site handoff and platform-ready assets are delivered." },
];

export function IdeaToFrame() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="process" className="relative py-32">
      <div className="mx-auto max-w-5xl px-6">
        <SectionLabel>Process</SectionLabel>
        <SectionHeading>
          From idea
          <br />
          to launch.
        </SectionHeading>

        <div ref={ref} className="relative mt-20 pl-10 md:pl-16">
          <div className="absolute left-[11px] top-0 h-full w-px bg-border md:left-[19px]" />
          <motion.div
            style={{ height }}
            className="absolute left-[11px] top-0 w-px bg-gradient-to-b from-[oklch(0.78_0.17_55)] to-[oklch(0.68_0.22_25)] shadow-[0_0_16px_oklch(0.78_0.17_55)] md:left-[19px]"
          />
          <div className="space-y-14">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.6, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <span className="absolute -left-10 top-2 h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.17_55)] md:-left-16" />
                <div className="flex flex-wrap items-baseline gap-4">
                  <span className="font-mono text-xs text-muted-foreground">{s.n}</span>
                  <h3 className="text-display text-3xl md:text-4xl">{s.title}</h3>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================ DIGITAL EXPERIENCES ============================ */

export function DigitalExperiences() {
  const { label, title, description, videoUrl } = useSectionMedia("digital_experiences", {
    label: "Digital Experiences",
    title: "We don't just design websites.",
    description: "We build digital experiences.",
  });

  return (
    <section id="digital" className="relative py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
        <div>
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mt-6 text-display text-4xl leading-[0.95] md:text-6xl">{title}</h2>
          {description && <p className="mt-6 text-lg text-muted-foreground">{description}</p>}
          <ul className="mt-8 flex flex-wrap gap-2">
            {["Creative direction", "UI/UX", "3D / WebGL", "Motion", "Development"].map((t) => (
              <li key={t} className="rounded-full glass px-4 py-1.5 text-xs">
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <MagneticButton href="/contact">
              Build my website <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>

        {videoUrl ? (
          <SectionVideoFrame
            src={videoUrl}
            aspect="aspect-video"
            fallbackTitle="Digital experience"
            fallbackDescription="Upload a horizontal video from admin."
          />
        ) : (
          <BrowserMock />
        )}
      </div>
    </section>
  );
}



function BrowserMock() {
  return (
    <motion.div
      initial={{ opacity: 0, rotateY: -18, y: 30 }}
      whileInView={{ opacity: 1, rotateY: -10, y: 0 }}
      whileHover={{ rotateY: -4, rotateX: 2, scale: 1.02 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
      className="relative rounded-2xl border border-white/10 glass p-3 shadow-[0_40px_120px_-40px_oklch(0.72_0.19_45_/_0.5)]"
    >
      <div className="flex items-center gap-1.5 px-2 pb-3">
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-3 h-4 flex-1 rounded-full bg-white/5" />
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-[oklch(0.2_0.02_260)] to-[oklch(0.12_0.01_260)]">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <motion.div
          animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/15 bg-gradient-to-br from-[oklch(0.78_0.17_55)]/40 to-transparent backdrop-blur-xl"
        />
        <div className="absolute bottom-4 left-4 right-4 grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.35, 0.8, 0.35] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.6 }}
              className="h-10 rounded-lg border border-white/10 bg-white/5"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ============================ BRAND VISUALS ============================ */

const BRAND_LAYERS = [
  "Logo",
  "Brand colors",
  "Typography",
  "Social post",
  "Instagram carousel",
  "Advertisement",
  "Packaging",
  "Motion graphic",
];

export function BrandVisualsSection() {
  const { label, title, description, imageUrls } = useSectionMedia("brand_visuals", {
    label: "Brand Visuals",
    title: "Your brand, in motion.",
    description:
      "From identity systems to everyday content, we create the visual language your brand carries everywhere.",
  });

  return (
    <section id="brand" className="relative border-y border-border py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 md:grid-cols-2">
        <SectionImageGrid
          images={imageUrls}
          altPrefix="Brand visual"
          fallback={
          <div className="grid grid-cols-2 gap-3">
            {BRAND_LAYERS.map((layer, i) => (
              <motion.div
                key={layer}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="flex aspect-[4/3] flex-col justify-end rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-4"
              >
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {layer}
                </span>
              </motion.div>
            ))}
          </div>
          }
        />

        <div>
          <SectionLabel>{label}</SectionLabel>
          <h2 className="mt-6 text-display text-4xl leading-[0.95] md:text-6xl">{title}</h2>
          {description && <p className="mt-6 max-w-md text-muted-foreground">{description}</p>}
          <div className="mt-10">
            <MagneticButton href="/contact">
              Build my brand <ArrowRight className="h-4 w-4" />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ============================ WHY MOVIXA ============================ */

const WHY = [
  "Strategy before visuals, so every website, ad and asset has a job.",
  "AI and CGI shaped by art direction, not generic templates.",
  "Brand systems designed to stay consistent across social, web and motion.",
  "Production built for vertical, horizontal and campaign-ready formats.",
];

export function WhyMovixa() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Why Movixa</SectionLabel>
        <SectionHeading>How we build momentum.</SectionHeading>
        <div className="mt-16 grid gap-px bg-border md:grid-cols-2">
          {WHY.map((w, i) => (
            <motion.div
              key={w}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="bg-background p-10"
            >
              <span className="font-mono text-xs text-[oklch(0.78_0.17_55)]">
                0{i + 1}
              </span>
              <p className="mt-4 text-display text-2xl md:text-3xl">{w}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
