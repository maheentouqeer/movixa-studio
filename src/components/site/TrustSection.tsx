import { motion } from "framer-motion";

const SIGNALS = [
  { value: "AI-POWERED", label: "Creative production" },
  { value: "01", label: "Digital experiences" },
  { value: "02", label: "AI film + CGI" },
  { value: "03", label: "Brand visuals" },
  { value: "GLOBAL", label: "Remote delivery" },
  { value: "24H", label: "Project response" },
];

export function TrustSection() {
  return (
    <section className="relative border-y border-border py-32">
      <div className="absolute inset-0 grid-bg opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" /> Studio Signals
          </div>
          <h2 className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl">
            Built around
            <br />
            <span className="gradient-text">three creative disciplines.</span>
          </h2>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-px bg-border md:grid-cols-3">
          {SIGNALS.map((signal, i) => (
            <motion.div
              key={signal.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06 }}
              className="bg-background p-8 text-center"
            >
              <div className="text-display text-4xl gradient-text md:text-5xl">{signal.value}</div>
              <div className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">
                {signal.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
