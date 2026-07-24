import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { FileText, Palette, Sparkles, Cpu, Scissors, Music, Send } from "lucide-react";

const STAGES = [
  { icon: FileText, title: "Creative Brief", desc: "We interrogate the story, audience, mood, and non-negotiables." },
  { icon: Palette, title: "Concept Art", desc: "Moodboards, style frames, and cinematography direction locked before render." },
  { icon: Sparkles, title: "Prompt Engineering", desc: "Bespoke prompts, LoRAs, and reference conditioning tuned per shot." },
  { icon: Cpu, title: "AI Generation", desc: "Veo, Runway, Kling, Flux and custom pipelines run in parallel." },
  { icon: Scissors, title: "Editing", desc: "Cut, color, VFX polish, and CGI compositing to broadcast-grade finish." },
  { icon: Music, title: "Sound Design", desc: "Score, foley, and mix engineered around the picture — never a preset." },
  { icon: Send, title: "Delivery", desc: "Masters, platform cutdowns, and editable project files shipped clean." },
];

export function BehindProcess() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 20%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" /> Behind the process
        </div>
        <h2 className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl">
          From spark to<br /><span className="gradient-text">final frame.</span>
        </h2>

        <div ref={ref} className="relative mt-24 pl-8 md:pl-24">
          {/* rail */}
          <div className="absolute left-3 md:left-11 top-0 bottom-0 w-px bg-border" />
          <motion.div
            style={{ scaleY: lineScale, transformOrigin: "top" }}
            className="absolute left-3 md:left-11 top-0 bottom-0 w-px bg-gradient-to-b from-[oklch(0.78_0.17_55)] via-[oklch(0.72_0.19_45)] to-[oklch(0.68_0.22_25)] shadow-[0_0_20px_oklch(0.78_0.17_55/0.6)]"
          />

          <div className="space-y-16">
            {STAGES.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="absolute -left-8 md:-left-24 top-1 flex h-6 w-6 items-center justify-center">
                  <div className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.17_55)] shadow-[0_0_16px_oklch(0.78_0.17_55/0.8)]" />
                </div>
                <div className="glass rounded-2xl p-6 md:p-8 flex gap-5 items-start hover:border-[oklch(0.78_0.17_55)]/30 transition">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.78_0.17_55)]/20 to-[oklch(0.68_0.22_25)]/20 border border-[oklch(0.78_0.17_55)]/20 shrink-0">
                    <s.icon className="h-5 w-5 text-[oklch(0.78_0.17_55)]" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      Step {String(i + 1).padStart(2, "0")}
                    </div>
                    <h3 className="mt-1 text-display text-2xl md:text-3xl">{s.title}</h3>
                    <p className="mt-2 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
