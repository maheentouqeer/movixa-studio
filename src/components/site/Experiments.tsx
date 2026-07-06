import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EXPERIMENTS = [
  { title: "Veo 3 Cinematic Test", category: "Google Veo", grad: "from-orange-500/40 via-rose-500/30 to-transparent" },
  { title: "Miniature Manhattan", category: "Miniature Worlds", grad: "from-emerald-500/40 via-teal-500/30 to-transparent" },
  { title: "Perfume Bottle Storm", category: "Product Ads", grad: "from-amber-500/40 via-orange-500/30 to-transparent" },
  { title: "Villa Reimagined", category: "Architecture", grad: "from-slate-400/40 via-indigo-500/30 to-transparent" },
  { title: "Neon City Short", category: "AI Films", grad: "from-fuchsia-500/40 via-purple-500/30 to-transparent" },
  { title: "Portrait to Motion", category: "Transformations", grad: "from-cyan-500/40 via-blue-500/30 to-transparent" },
];

export function Experiments() {
  return (
    <section className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between flex-wrap gap-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-8 bg-[oklch(0.78_0.17_55)]" /> Latest experiments
            </div>
            <h2 className="mt-6 text-display text-4xl md:text-6xl lg:text-7xl">
              The lab is<br /><span className="gradient-text">always on.</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Independent research, prompt engineering, and pipeline exploration published as it happens.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {EXPERIMENTS.map((e, i) => (
            <motion.a
              key={e.title}
              href="/contact"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="group relative block aspect-[5/6] rounded-3xl overflow-hidden glass"
              data-cursor="hover"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${e.grad}`} />
              <div className="absolute inset-0 grid-bg opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />

              {/* animated border sheen */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute inset-0 rounded-3xl [mask-image:linear-gradient(black,black)] before:absolute before:inset-0 before:rounded-3xl before:p-px before:bg-[conic-gradient(from_var(--angle),transparent_40%,oklch(0.78_0.17_55)_50%,transparent_60%)] before:[--angle:0deg] before:animate-[spin_4s_linear_infinite]" />
              </div>

              <div className="absolute top-5 left-5">
                <span className="rounded-full glass px-3 py-1 text-[10px] uppercase tracking-widest">{e.category}</span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <h3 className="text-display text-2xl md:text-3xl">{e.title}</h3>
                <div className="rounded-full glass p-2.5 group-hover:bg-foreground group-hover:text-background transition">
                  <ArrowUpRight className="h-4 w-4" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
