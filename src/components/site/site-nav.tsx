import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Download, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoAsset from "@/assets/karigar-logo.jpg.asset.json";

const links = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Features" },
  { href: "#how", label: "How It Works" },
  { href: "#agents", label: "Agents" },
  { href: "#pricing", label: "Pricing" },
  { href: "#about", label: "About" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top announcement bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] overflow-hidden border-b border-[var(--border-glow)] bg-[var(--primary-dark)]/40 backdrop-blur-xl">
        <div className="flex whitespace-nowrap py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--primary-lite)] animate-marquee">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex shrink-0 items-center gap-8 px-8">
              <span>🏆 AISeekho 2026 National Finalist</span>
              <span className="text-white/40">·</span>
              <span>4th in Pakistan · 7,000+ Teams</span>
              <span className="text-white/40">·</span>
              <span>Currently raising seed round</span>
              <span className="text-white/40">·</span>
              <span>Built on Google ADK + Gemini 2.5</span>
              <span className="text-white/40">·</span>
            </span>
          ))}
        </div>
      </div>

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "top-[34px] py-2" : "top-[34px] py-4"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-[var(--border-glow)] px-4 transition-all duration-300 sm:px-6 ${
            scrolled
              ? "bg-[var(--bg-deep)]/90 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
              : "bg-[var(--bg-deep)]/60 backdrop-blur-xl"
          }`}
          style={{ marginLeft: "1rem", marginRight: "1rem" }}
        >
          <Link to="/" className="flex items-center gap-2 py-2">
            <img
              src={logoAsset.url}
              alt="Karigar AI logo"
              className={`rounded-full ring-1 ring-[var(--primary-lite)]/30 transition-all ${
                scrolled ? "h-9 w-9" : "h-11 w-11"
              }`}
            />
            <span className="hidden text-lg font-black tracking-tight sm:block">
              KARIGAR <span className="text-gradient-teal">AI</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="group relative rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-sub)] transition-colors hover:text-white"
              >
                {l.label}
                <span className="absolute bottom-1 left-3 right-3 h-px origin-left scale-x-0 bg-[var(--primary-lite)] transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#investors"
              className="rounded-lg border border-[var(--border-glow)] px-4 py-2 text-sm font-bold text-white/80 transition hover:border-[var(--gold)]/40 hover:text-[var(--gold)]"
            >
              <FileText className="mr-1 inline h-4 w-4" /> Investor Deck
            </a>
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(20,255,236,0.25)] transition hover:bg-[var(--primary-dark)] hover:shadow-[0_0_30px_rgba(20,255,236,0.45)]"
            >
              <Download className="h-4 w-4" /> Download App
            </a>
          </div>

          <button
            className="rounded-lg p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[var(--bg-deep)]/95 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col items-center gap-6">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-3xl font-black tracking-tight text-white"
                >
                  {l.label}
                </motion.a>
              ))}
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-4 rounded-lg bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white glow-teal"
              >
                Download App
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
