import { motion } from "framer-motion";

const TOOLS = [
  "Google Veo",
  "Runway",
  "Kling",
  "Midjourney",
  "Flux",
  "Blender",
  "Unreal Engine",
  "DaVinci Resolve",
  "After Effects",
  "Cinema 4D",
  "Nuke",
  "Pro Tools",
];

export function TechStack() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" /> Technology stack
          </div>
          <h2 className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl">
            The best tools,<br /><span className="gradient-text">wielded with intent.</span>
          </h2>
          <p className="mt-6 text-sm text-muted-foreground max-w-lg mx-auto">
            We're tool-agnostic and pipeline-obsessed. Every project uses whatever combination gets the frame right.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-px bg-border rounded-3xl overflow-hidden">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.04 }}
              className="group relative bg-background aspect-square flex items-center justify-center p-4 hover:bg-card transition-colors"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.17_55)] to-transparent" />
              </div>
              <span className="text-center text-sm font-medium text-muted-foreground group-hover:text-foreground transition">
                {t}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
