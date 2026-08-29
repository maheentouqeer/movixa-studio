import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Instagram, Youtube, Facebook } from "lucide-react";
import { MagneticButton } from "@/components/site/MagneticButton";
import { useSectionMedia, SectionImageGrid, SectionVideoFrame } from "@/components/site/SectionMedia";
import { useSiteLinks } from "@/hooks/useSiteLinks";
import labWebgl from "@/assets/lab-webgl.jpg";
import labCgi from "@/assets/lab-cgi.jpg";
import labBrand from "@/assets/lab-brand.jpg";
import labWebsite from "@/assets/lab-website.jpg";


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

/* ============================ CAPABILITIES ============================ */

const CAPABILITIES = [
  "AI COMMERCIALS",
  "CGI PRODUCT ADS",
  "DIGITAL EXPERIENCES",
  "3D WEBSITES",
  "ARCHITECTURAL CGI",
  "PRODUCT FILMS",
  "BRAND VISUALS",
  "SOCIAL CAMPAIGNS",
  "LOGO MOTION",
  "EXPERIMENTAL CGI",
];

const CAP_TINTS = [
  "oklch(0.72 0.19 45)",
  "oklch(0.68 0.22 25)",
  "oklch(0.62 0.12 245)",
  "oklch(0.78 0.17 55)",
  "oklch(0.55 0.1 200)",
];

export function Capabilities() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section className="relative overflow-hidden border-y border-border py-32">
      <motion.div
        aria-hidden
        animate={{ opacity: active === null ? 0 : 0.5 }}
        transition={{ duration: 0.5 }}
        className="pointer-events-none absolute inset-0 blur-[120px]"
        style={{
          background:
            active === null
              ? undefined
              : `radial-gradient(circle at 70% 40%, ${CAP_TINTS[active % CAP_TINTS.length]}, transparent 60%)`,
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionLabel>Services</SectionLabel>
        <SectionHeading>
          Websites, AI video,
          <br />
          and brand systems
          <br />
          built to move.
        </SectionHeading>

        <ul className="mt-16 border-t border-border">
          {CAPABILITIES.map((c, i) => (
            <li key={c}>
              <a
                href="/contact"
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                className="group flex items-baseline justify-between gap-6 border-b border-border py-5 transition-colors"
              >
                <span
                  className={`text-display text-2xl transition-all duration-300 md:text-4xl ${
                    active === i ? "translate-x-3 text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {c}
                </span>
                <ArrowUpRight
                  className={`h-5 w-5 shrink-0 transition-opacity ${active === i ? "opacity-100" : "opacity-0"}`}
                />
              </a>
            </li>
          ))}
        </ul>
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
            fallbackTitle="Digital experience"
            fallbackDescription="Upload any vertical, square or horizontal video from admin."
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


/* ============================ THE LAB ============================ */

const LAB = [
  { title: "Interactive screen break", tag: "WebGL", img: labWebgl },
  { title: "Giant CGI product", tag: "CGI", img: labCgi },
  { title: "Robotic product advertisement", tag: "AI Ads", img: labBrand },
  { title: "Digital environments", tag: "3D", img: labWebsite },
  { title: "Product transformations", tag: "VFX", img: labCgi },
  { title: "AI fashion", tag: "Generative", img: labBrand },
  { title: "Miniature worlds", tag: "CGI", img: labWebgl },
];

export function MovixaLab() {
  return (
    <section id="lab" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Studio System</SectionLabel>
        <SectionHeading>One studio for every digital touchpoint.</SectionHeading>
        <p className="mt-6 max-w-xl text-muted-foreground">
          Movixa connects website design, AI video production and brand visuals into one creative
          system, so your launch feels consistent from the first click to the final frame.
        </p>

        <div className="mt-16 grid auto-rows-[160px] grid-cols-2 gap-3 md:grid-cols-4">
          {LAB.map((l, i) => (
            <motion.div
              key={l.title}
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              whileHover={{ y: -6 }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-black p-5 ${
                i === 0 ? "col-span-2 row-span-2" : i === 3 ? "row-span-2" : ""
              }`}
            >
              <img
                src={l.img}
                alt={l.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

              <div className="relative flex h-full flex-col justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[oklch(0.86_0.12_70)]">
                  {l.tag}
                </span>
                <h3 className="text-display text-xl md:text-2xl">{l.title}</h3>
              </div>
            </motion.div>
          ))}
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

/* ============================ FOLLOW THE WORK ============================ */

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com", Icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", Icon: Youtube },
  { label: "Facebook", href: "https://facebook.com", Icon: Facebook },
];

const COLUMNS = [
  {
    title: "DIGITAL",
    sub: "Digital Experiences",
    items: ["Websites", "3D websites", "Scroll animations", "Interactive interfaces"],
  },
  {
    title: "FILM",
    sub: "AI Ads + CGI",
    items: ["AI commercials", "CGI product ads", "Cinematic experiments", "VFX"],
  },
  {
    title: "BRAND",
    sub: "Brand Visuals",
    items: ["Logos", "Carousels", "Campaign graphics", "Social content"],
  },
];

export function FollowTheWork() {
  const links = useSiteLinks();

  return (
    <section className="relative border-t border-border py-32">
      <div className="mx-auto max-w-7xl px-6">
        <SectionLabel>Social</SectionLabel>
        <SectionHeading>Follow the work.</SectionHeading>

        <div className="mt-16 grid gap-px bg-border md:grid-cols-3">
          {COLUMNS.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="bg-background p-10"
            >
              <h3 className="text-display text-3xl">{c.title}</h3>
              <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                {c.sub}
              </p>
              <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                {c.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {SOCIALS.map(({ label, href, Icon }) => {
            const resolvedHref =
              label === "Instagram"
                ? links.instagram_url
                : label === "YouTube"
                  ? links.youtube_url
                  : label === "Facebook"
                    ? links.facebook_url
                    : href;

            return (
              <a
                key={label}
                href={resolvedHref || href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full glass px-5 py-2.5 text-sm transition hover:bg-white/10"
              >
                <Icon className="h-4 w-4" aria-hidden /> {label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
