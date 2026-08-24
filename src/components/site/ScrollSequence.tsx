import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ScrollSequenceProps {
  frames?: string[];
  label: string;
  title: string;
  description: string;
}

export function ScrollSequence({ frames = [], label, title, description }: ScrollSequenceProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedFrames = useRef<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(frames.length === 0);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const visualScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.96]);
  const visualX = useTransform(scrollYProgress, [0, 1], ["-2%", "2%"]);

  useEffect(() => {
    if (frames.length === 0 || reduced) return;
    let cancelled = false;
    const batchSize = 12;
    loadedFrames.current = [];

    const loadBatch = async (start: number) => {
      const batch = frames.slice(start, start + batchSize);
      await Promise.all(
        batch.map(
          (src) =>
            new Promise<void>((resolve) => {
              const img = new Image();
              img.decoding = "async";
              img.onload = () => {
                loadedFrames.current.push(img);
                resolve();
              };
              img.onerror = () => resolve();
              img.src = src;
            }),
        ),
      );
      if (cancelled) return;
      if (start === 0) setReady(true);
      if (start + batchSize < frames.length) {
        const idle = window.requestIdleCallback ?? window.setTimeout;
        idle(() => void loadBatch(start + batchSize));
      }
    };

    void loadBatch(0);
    return () => {
      cancelled = true;
    };
  }, [frames, reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced || frames.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (progress: number) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const images = loadedFrames.current;
      const img = images[Math.min(images.length - 1, Math.floor(progress * Math.max(images.length - 1, 0)))];
      if (!img) return;
      const scale = Math.min(rect.width / img.width, rect.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (rect.width - w) / 2, (rect.height - h) / 2, w, h);
    };

    const unsubscribe = scrollYProgress.on("change", draw);
    const onResize = () => draw(scrollYProgress.get());
    draw(scrollYProgress.get());
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      unsubscribe();
      window.removeEventListener("resize", onResize);
    };
  }, [frames.length, reduced, scrollYProgress, ready]);

  return (
    <section ref={sectionRef} className="relative h-[240vh]">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-6 md:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className="text-xs uppercase tracking-[0.26em] text-muted-foreground">{label}</div>
            <h2 className="mt-5 text-display text-4xl leading-[0.95] md:text-6xl">{title}</h2>
            <p className="mt-6 max-w-md text-muted-foreground">{description}</p>
          </div>
          <motion.div
            style={{ scale: reduced ? 1 : visualScale, x: reduced ? 0 : visualX }}
            className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_40px_140px_-50px_oklch(0.78_0.17_55_/_0.45)]"
          >
            {frames.length > 0 && !reduced ? (
              <>
                <canvas ref={canvasRef} aria-label={description} className="h-full w-full" />
                {!ready && (
                  <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    Loading frames
                  </div>
                )}
              </>
            ) : (
              <div className="absolute inset-0">
                <div className="absolute inset-0 grid-bg opacity-30" />
                <motion.div
                  animate={reduced ? undefined : { x: ["-8%", "8%", "-8%"], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute left-[12%] top-[18%] h-[62%] w-[72%] rounded-[1.2rem] border border-white/15 bg-gradient-to-br from-white/10 via-[oklch(0.78_0.17_55)]/20 to-transparent"
                />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between gap-6">
                  <div>
                    <div className="font-mono text-xs tracking-widest text-[oklch(0.86_0.12_70)]">
                      0001 - 0120
                    </div>
                    <div className="mt-2 text-2xl text-display">Prompt to polished frame</div>
                  </div>
                  <div className="hidden h-14 w-40 rounded-full border border-white/10 bg-white/5 md:block" />
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
