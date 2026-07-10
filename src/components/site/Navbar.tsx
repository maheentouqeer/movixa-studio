import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/movixa-new-logo.jpg.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/#work", label: "Work" },
  { to: "/#services", label: "Services" },
  { to: "/#process", label: "Process" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "py-3" : "py-5"}`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className={`flex items-center justify-between rounded-full transition-all duration-500 ${scrolled ? "glass px-5 py-2.5" : "px-2 py-2"}`}>
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logoAsset.url} alt="Movixa logo" className="h-9 w-9 rounded-full object-cover shadow-[0_0_18px_oklch(0.68_0.22_25_/_0.35)]" />
            <span className="text-display text-xl tracking-tight">movixa</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <a key={l.to} href={l.to} className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/contact" className="hidden md:inline-flex items-center rounded-full bg-foreground text-background px-5 py-2 text-sm font-medium hover:opacity-90 transition">
              Start a project
            </Link>
            <button className="md:hidden p-2 rounded-full glass" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mt-3 glass rounded-2xl p-4 flex flex-col gap-1"
            >
              {links.map((l) => (
                <a key={l.to} href={l.to} className="px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5">
                  {l.label}
                </a>
              ))}
              <Link to="/contact" className="mt-2 text-center rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium">Start a project</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
