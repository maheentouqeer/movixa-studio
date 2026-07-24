import { useEffect, useRef, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import logoAsset from "@/assets/karigar-logo.jpg.asset.json";

/**
 * HeroScrollAnimation
 * Apple-style scroll-scrubbed image sequence for the Karigar AI hero.
 *
 * - Preloads every JPG frame in /public/frames/
 * - Renders to a full-viewport HTML5 Canvas (retina-sharp via devicePixelRatio)
 * - Pins the section with GSAP ScrollTrigger while the sequence scrubs
 * - Overlay marketing text gently fades + translates as scroll progresses
 * - Respects prefers-reduced-motion by showing only the final frame
 */

const FRAME_COUNT = 240;
const FRAME_PATH = (i: number) =>
  `/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

// Horizontal anchor when frame aspect doesn't match viewport (0 = left, 1 = right).
// Keeps the technician on the left visible on tall/narrow viewports.
const H_ANCHOR = 0.35;

export function HeroScrollAnimation() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const [progress, setProgress] = useState(0); // 0..1 preload
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  // Preload all frames
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    let errored = 0;
    const imgs: HTMLImageElement[] = new Array(FRAME_COUNT);

    const loadOne = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = FRAME_PATH(i);
        img.onload = () => {
          imgs[i] = img;
          loaded++;
          if (!cancelled)
            setProgress((loaded + errored) / FRAME_COUNT);
          resolve();
        };
        img.onerror = () => {
          errored++;
          if (!cancelled)
            setProgress((loaded + errored) / FRAME_COUNT);
          resolve();
        };
      });

    // Small concurrency pool to avoid choking the browser
    const CONCURRENCY = 12;
    let idx = 0;
    const workers = Array.from({ length: CONCURRENCY }, async () => {
      while (idx < FRAME_COUNT) {
        const i = idx++;
        await loadOne(i);
      }
    });

    Promise.all(workers).then(() => {
      if (cancelled) return;
      framesRef.current = imgs;
      if (loaded === 0) setFailed(true);
      else setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Draw a frame to the canvas with "cover" scaling anchored to H_ANCHOR
  const drawFrame = (i: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || !frames.length) return;
    const img = frames[Math.max(0, Math.min(FRAME_COUNT - 1, i))];
    if (!img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) * H_ANCHOR;
    const dy = (ch - dh) * 0.5;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Resize canvas for retina
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    drawFrame(currentFrameRef.current);
  };

  // Set up GSAP ScrollTrigger once frames are ready
  useEffect(() => {
    if (!ready) return;
    if (typeof window === "undefined") return;

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      currentFrameRef.current = FRAME_COUNT - 1;
      drawFrame(FRAME_COUNT - 1);
      return () => window.removeEventListener("resize", resizeCanvas);
    }

    let cleanup = () => {
      window.removeEventListener("resize", resizeCanvas);
    };

    (async () => {
      const gsapMod = await import("gsap");
      const stMod = await import("gsap/ScrollTrigger");
      const gsap = gsapMod.gsap ?? gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger ?? stMod.default;
      gsap.registerPlugin(ScrollTrigger);

      const state = { frame: 0 };
      const st = ScrollTrigger.create({
        trigger: sectionRef.current!,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        pin: stickyRef.current!,
        pinSpacing: false,
        onUpdate: (self: { progress: number }) => {
          const target = self.progress * (FRAME_COUNT - 1);
          gsap.to(state, {
            frame: target,
            duration: 0.15,
            ease: "none",
            overwrite: true,
            onUpdate: () => {
              const i = Math.round(state.frame);
              if (i !== currentFrameRef.current) {
                currentFrameRef.current = i;
                if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
                rafRef.current = requestAnimationFrame(() => drawFrame(i));
              }
              // Overlay: fade + rise as sequence advances
              const p = self.progress;
              const overlay = overlayRef.current;
              if (overlay) {
                const opacity = Math.max(0, 1 - p * 1.6);
                const ty = -p * 40;
                overlay.style.opacity = String(opacity);
                overlay.style.transform = `translateY(${ty}px)`;
              }
            },
          });
        },
      });

      cleanup = () => {
        st.kill();
        window.removeEventListener("resize", resizeCanvas);
        if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      };
    })();

    return () => cleanup();
  }, [ready]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative"
      // 400vh gives the sequence room to scrub across ~4 screen-heights
      style={{ height: "400vh" }}
      aria-label="Karigar AI hero animation"
    >
      <div
        ref={stickyRef}
        className="relative left-0 top-0 h-screen w-full overflow-hidden bg-[var(--bg-deep)]"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        />

        {/* Cinematic overlays: vignette + warm glow toward the door on the right */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, transparent 40%, rgba(6,9,18,0.55) 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-1/2 mix-blend-screen opacity-40"
          style={{
            background:
              "radial-gradient(circle at 70% 35%, rgba(245,197,66,0.18), transparent 55%)",
          }}
          aria-hidden="true"
        />

        {/* Marketing overlay text */}
        <div
          ref={overlayRef}
          className="absolute inset-0 flex items-center will-change-transform"
          style={{ transition: "none" }}
        >
          <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 bg-black/30 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--gold)] backdrop-blur">
                Karigar AI · Agentic Marketplace
              </div>
              <h1 className="mt-5 font-display text-5xl font-black leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
                AI-Powered
                <br />
                <span className="text-gradient-teal">Home Services</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80 md:text-xl">
                Pakistan's smartest way to hire trusted professionals. From
                electricians to plumbers, painters, carpenters and AC
                technicians — verified experts in seconds.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_30px_rgba(20,255,236,0.3)] transition hover:scale-[1.03] hover:bg-[var(--primary-dark)] hover:shadow-[0_0_40px_rgba(20,255,236,0.55)]"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-6 py-3.5 text-sm font-black uppercase tracking-wider text-white backdrop-blur transition hover:scale-[1.03] hover:border-[var(--primary-lite)]/50 hover:bg-white/10"
                >
                  <Play className="h-4 w-4 fill-current" />
                  Watch Demo
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
          Scroll to explore
        </div>

        {/* Loading screen */}
        {!ready && !failed && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-deep)]">
            <img
              src={logoAsset.url}
              alt="Karigar AI"
              className="h-24 w-24 rounded-2xl object-cover shadow-[0_0_60px_rgba(20,255,236,0.35)]"
            />
            <div className="mt-6 text-[11px] font-black uppercase tracking-[0.35em] text-white/70">
              Preparing Experience…
            </div>
            <div className="mt-5 h-[3px] w-64 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-lite)] transition-[width] duration-150"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
            <div className="mt-2 text-[10px] tabular-nums text-white/40">
              {Math.round(progress * 100)}%
            </div>
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[var(--bg-deep)] text-center">
            <div className="text-sm text-white/70">
              We couldn't load the hero experience.
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[var(--primary-dark)]"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default HeroScrollAnimation;
